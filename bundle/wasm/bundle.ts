/**
 * Build WASM, bundle and minify JavaScript.
 *
 * @module
 */

// Imports
import { encodeBase64 } from "@std/encoding/base64"
import { bundle as bundle_ts } from "../ts/bundle.ts"
import { assert } from "@std/assert"
import { Untar } from "@std/archive/untar"
import { copy, readerFromStreamReader } from "@std/io"
import { ensureFile } from "@std/fs"
import { basename, dirname, resolve, toFileUrl } from "@std/path"
import { type level as loglevel, Logger } from "@libs/logger"
import type { record } from "@libs/typing"
import { command } from "@libs/run/command"
export type { loglevel, record }

/**
 * Build WASM, bundle and minify JavaScript.
 *
 * The resulting WASM file is injected as a base64 string in the JavaScript output to avoid the need of `--allow-read` permission.
 *
 * @example
 * ```ts
 * import { bundle } from "./bundle.ts"
 * await bundle("path/to/rust/project")
 * ```
 */
export async function bundle(project: string, { bin = "wasm-pack", autoinstall = false, banner, loglevel, env = {} } = {} as { bin?: string; autoinstall?: boolean; banner?: string; loglevel?: loglevel; env?: record<string> }): Promise<void> {
  const log = new Logger({ level: loglevel, tags: { project } })

  // Check that cargo is installed
  try {
    await command("cargo", ["--version"], { log, env, throw: true })
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      log.error("cargo binary not found in PATH, is it installed?")
      log.error("note that even with `autoinstall` option enabled, cargo must be installed manually")
      log.error("https://doc.rust-lang.org/cargo/getting-started/installation.html")
      throw error
    }
  }

  // Autoinstall wasm-pack if needed
  if (autoinstall) {
    log.debug(`checking if ${bin} is installed`)
    try {
      await command(bin, ["--version"], { log, env, throw: true })
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        log.warn(`${bin} not found, installing`)
        bin = await install({ log, path: dirname(bin) })
      }
    }
  }

  // Build wasm
  log.info("building wasm")
  const { success } = await command(bin, ["build", "--release", "--target", "web"], { log, cwd: project, env })
  assert(success, "wasm build failed")

  // Inject wasm so it can be loaded without permissions, and export a source function so it can be loaded synchronously using `initSync()`
  log.info("injecting base64 wasm to js")
  const name = basename(project)
  const wasm = await fetch(toFileUrl(resolve(project, `pkg/${name}_bg.wasm`))).then((response) => response.arrayBuffer())
  let js = await fetch(toFileUrl(resolve(project, `pkg/${name}.js`))).then((response) => response.text())
  js = js.replace(`'${name}_bg.wasm'`, "`data:application/wasm;base64,${source('base64')}`")
  js += `export function source(format) {
    const b64 = '${encodeBase64(wasm)}'
    return format === 'base64' ? b64 : new Uint8Array(Array.from(atob(b64), c => c.charCodeAt(0))).buffer
  }`
  await Deno.writeTextFile(resolve(project, `./${name}.js`), js)
  log.debug("ok")

  // Minify output
  log.info("minifying js")
  const minified = await bundle_ts(new URL(toFileUrl(resolve(project, `./${name}.js`))), { minify: "terser", banner })
  await Deno.writeTextFile(resolve(project, `./${name}.js`), minified)
  log.with({ size: `${new Blob([minified]).size}b` }).log()
}

/**
 * Install wasm-pack.
 */
async function install({ log, path }: { log: Logger; path: string }) {
  // List releases and select asset for current platform
  log.info("looking for latest release of wasm-pack")
  const { tag_name, assets: assets } = await fetch("https://api.github.com/repos/rustwasm/wasm-pack/releases/latest").then((response) => response.json())
  log.log(`found version ${tag_name}`)
  const packaged = assets
    .map(({ name, browser_download_url: url }: { name: string; browser_download_url: string }) => ({ name, url }))
    .find(({ name }: { name: string }) => name.includes(Deno.build.os) && name.includes(Deno.build.arch))
  assert(packaged, `cannot find suitable release for ${Deno.build.os}-${Deno.build.arch}`)
  log.log(`found binary ${packaged.name} for ${Deno.build.os}-${Deno.build.arch}`)
  // Download archive
  log.info("downloading release")
  const reader = readerFromStreamReader(await fetch(packaged.url).then((response) => response.body!.pipeThrough(new DecompressionStream("gzip")).getReader()))
  log.debug("ok")
  // Extract archive
  log.info("extracting release")
  const untar = new Untar(reader)
  let found = false
  for await (const entry of untar) {
    const filename = basename(entry.fileName)
    if (!filename.startsWith("wasm-pack")) {
      continue
    }
    if (entry.type !== "file") {
      continue
    }
    found = true
    path = resolve(path, filename)
    log.log(`extracted ${path}`)
    await ensureFile(path)
    using file = await Deno.open(path, { write: true, truncate: true })
    await Deno.chmod(path, 0o755).catch(() => null)
    await copy(entry, file)
    break
  }
  assert(found, "wasm-pack binary not found in archive")
  log.debug("ok")
  // Check installation
  log.info("checking installation")
  const { success } = await command(path, ["--version"], { log })
  assert(success, "wasm-pack could not be executed")
  return path
}
