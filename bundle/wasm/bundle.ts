// Imports
import { encodeBase64 } from "@std/encoding/base64"
import { bundle as bundle_ts } from "../ts/bundle.ts"
import { assert } from "@std/assert"
import { UntarStream } from "@std/tar/untar-stream"
import { ensureFile } from "@std/fs"
import { basename, dirname, resolve, toFileUrl } from "jsr:@std/path@^1.1.2"
import { Logger } from "@libs/logger"
import { command } from "@libs/run/command"

/**
 * Build WASM, bundle and minify JavaScript.
 *
 * The resulting WASM file is injected as a base64 string in the JavaScript output to avoid the need of `--allow-read` permission.
 *
 * ```ts ignore
 * import { bundle } from "./bundle.ts"
 * await bundle("path/to/rust/project")
 * ```
 *
 * @module
 */
export async function bundle(project: string, { bin = "wasm-pack", autoinstall = false, banner, logger: log = new Logger(), env = {} } = {} as { bin?: string; autoinstall?: boolean; banner?: string; logger?: Logger; env?: Record<PropertyKey, string> }): Promise<void> {
  log = log.with({ project })
  env = { ...Deno.env.toObject(), ...env }

  // Check that cargo is installed
  try {
    await command("cargo", ["--version"], { logger: log, env, throw: true })
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
    log.trace(`checking if ${bin} is installed`)
    try {
      await command(bin, ["--version"], { logger: log, env, throw: true })
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        log.wdebug(`${bin} not found, installing`)
        bin = await install({ log, path: dirname(bin) })
      }
    }
  }

  // Build wasm
  log.debug("building wasm")
  const { success, stderr } = await command(bin, ["build", "--release", "--target", "web"], { logger: log, cwd: project, env })
  assert(success, `wasm build failed: ${stderr}`)
  log.ok("built wasm")

  // Inject wasm so it can be loaded without permissions, and export a source function so it can be loaded synchronously using `initSync()`
  log.debug("injecting base64 wasm to js")
  const name = basename(project)
  const wasm = await fetch(toFileUrl(resolve(project, `pkg/${name}_bg.wasm`))).then((response) => response.arrayBuffer())
  let js = await fetch(toFileUrl(resolve(project, `pkg/${name}.js`))).then((response) => response.text())
  js = js.replace(`'${name}_bg.wasm'`, "`data:application/wasm;base64,${source('base64')}`")
  js += `export function source(format) {
    const b64 = '${encodeBase64(wasm)}'
    return format === 'base64' ? b64 : new Uint8Array(Array.from(atob(b64), c => c.charCodeAt(0))).buffer
  }`
  await Deno.writeTextFile(resolve(project, `./${name}.js`), js)
  log.ok("injecting base64 wasm to js")

  // Minify output
  log.debug("minifying js")
  const minified = await bundle_ts(new URL(toFileUrl(resolve(project, `./${name}.js`))), { minify: "terser", banner })
  await Deno.writeTextFile(resolve(project, `./${name}.js`), minified)
  log.with({ size: `${new Blob([minified]).size}b` }).log()
  log.ok("minified js")
}

/**
 * Install wasm-pack.
 */
async function install({ log, path }: { log: Logger; path: string }) {
  // List releases and select asset for current platform
  log.debug("looking for latest release of wasm-pack")
  const { tag_name, assets: assets } = await fetch("https://api.github.com/repos/rustwasm/wasm-pack/releases/latest").then((response) => response.json())
  log.info(`found version ${tag_name}`)
  const packaged = assets
    .map(({ name, browser_download_url: url }: { name: string; browser_download_url: string }) => ({ name, url }))
    .find(({ name }: { name: string }) => name.includes(Deno.build.os) && name.includes(Deno.build.arch))
  assert(packaged, `cannot find suitable release for ${Deno.build.os}-${Deno.build.arch}`)
  log.info(`found binary ${packaged.name} for ${Deno.build.os}-${Deno.build.arch}`)
  // Download archive
  log.debug("downloading release")
  const response = await fetch(packaged.url)
  log.ok("downloaded release")
  // Extract archive
  log.debug("extracting release")
  const entries = response.body!
    .pipeThrough(new DecompressionStream("gzip"))
    .pipeThrough(new UntarStream())
  let found = false
  for await (const entry of entries) {
    const filename = basename(entry.path)
    if (!filename.startsWith("wasm-pack")) {
      await entry.readable?.cancel()
      continue
    }
    if (entry.readable === undefined) {
      continue
    }
    found = true
    path = resolve(path, filename)
    log.trace(`extracted ${path}`)
    await ensureFile(path)
    using file = await Deno.open(path, { write: true, truncate: true })
    await Deno.chmod(path, 0o755).catch(() => null)
    await entry.readable.pipeTo(file.writable)
    break
  }
  assert(found, "wasm-pack binary not found in archive")
  log.ok("extracted release")
  // Check installation
  log.debug("checking installation")
  const { success } = await command(path, ["--version"], { logger: log })
  assert(success, "wasm-pack could not be executed")
  return path
}
