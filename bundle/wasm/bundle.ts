// Imports
import { encodeBase64 } from "@std/encoding/base64"
import { bgCyan, yellow } from "@std/fmt/colors"
import { bundle as bundle_ts } from "../ts/bundle.ts"
import { assert } from "@std/assert"
import { Untar } from "@std/archive/untar"
import { copy, readerFromStreamReader } from "@std/io"
import { ensureFile } from "@std/fs"
import { basename, dirname, resolve, toFileUrl } from "@std/path"

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
export async function bundle(project: string, { bin = "wasm-pack", autoinstall = false, banner }: { bin?: string; autoinstall?: boolean; banner?: string }): Promise<void> {
  // Autoinstall wasm-pack if needed
  if (autoinstall) {
    try {
      await new Deno.Command(bin, { args: ["--version"], stdin: "inherit", stdout: "inherit", stderr: "inherit" }).output()
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        console.warn(yellow("wasm-pack not found, installing..."))
        bin = await install({ path: dirname(bin) })
      }
    }
  }

  // Build wasm
  console.log(bgCyan("wasm build".padEnd(48)))
  const command = new Deno.Command(bin, { args: ["build", "--release", "--target", "web"], cwd: project, stdin: "inherit", stdout: "inherit", stderr: "inherit" })
  const { success } = await command.output()
  assert(success, "wasm build failed")

  // Inject wasm so it can be loaded without permissions, and export a source function so it can be loaded synchronously using `initSync()`
  console.log(bgCyan("inject base64 wasm to js".padEnd(48)))
  const name = basename(project)
  const wasm = await fetch(toFileUrl(resolve(project, `pkg/${name}_bg.wasm`))).then((response) => response.arrayBuffer())
  let js = await fetch(toFileUrl(resolve(project, `pkg/${name}.js`))).then((response) => response.text())
  js = js.replace(/(["'])(?<scheme>file:\/\/).*?\/(?<name>[A-Za-z0-9_]+\.js)\1/, "$<scheme>/shadow/$<name>")
  js = js.replace(`'${name}_bg.wasm'`, "`data:application/wasm;base64,${source('base64')}`")
  js += `export function source(format) {
    const b64 = '${encodeBase64(wasm)}'
    return format === 'base64' ? b64 : new Uint8Array(Array.from(atob(b64), c => c.charCodeAt(0))).buffer
  }`
  await Deno.writeTextFile(resolve(project, `./${name}.js`), js)
  console.log("ok")

  // Minify output
  console.log(bgCyan("minify js".padEnd(48)))
  const minified = await bundle_ts(new URL(toFileUrl(resolve(project, `./${name}.js`))), { minify: "terser", banner })
  await Deno.writeTextFile(resolve(project, `./${name}.js`), minified)
  console.log(`size: ${new Blob([minified]).size}b`)
}

/**
 * Install wasm-pack.
 */
async function install({ path = "." } = {}) {
  // List releases and select asset for current platform
  console.log(bgCyan("wasm-pack install".padEnd(48)))
  const { tag_name, assets: assets } = await fetch("https://api.github.com/repos/rustwasm/wasm-pack/releases/latest").then((response) => response.json())
  console.log(`found ${tag_name}`)
  const packaged = assets
    .map(({ name, browser_download_url: url }: { name: string; browser_download_url: string }) => ({ name, url }))
    .find(({ name }: { name: string }) => name.includes(Deno.build.os) && name.includes(Deno.build.arch))
  assert(packaged, `cannot find suitable release for ${Deno.build.os}-${Deno.build.arch}`)
  console.log(`found ${packaged.name} for ${Deno.build.os}-${Deno.build.arch}`)
  // Download archive
  console.log(bgCyan("downloading release".padEnd(48)))
  const reader = readerFromStreamReader(await fetch(packaged.url).then((response) => response.body!.pipeThrough(new DecompressionStream("gzip")).getReader()))
  console.log("ok")
  // Extract archive
  console.log(bgCyan("extracting release".padEnd(48)))
  if (path === ".") {
    path = await Deno.makeTempDir()
    console.log(`temp: ${path}`)
  }
  const untar = new Untar(reader)
  for await (const entry of untar) {
    const filename = basename(entry.fileName)
    if (!filename.startsWith("wasm-pack")) {
      continue
    }
    if (entry.type !== "file") {
      continue
    }
    path = resolve(path, filename)
    console.log(`write: ${path}`)
    await ensureFile(path)
    using file = await Deno.open(path, { write: true, truncate: true })
    await copy(entry, file)
    await Deno.chmod(path, 0o755)
    break
  }
  console.log("ok")
  // Check installation
  console.log(bgCyan("checking installation".padEnd(48)))
  const command = new Deno.Command(path, { args: ["--version"], stdin: "inherit", stdout: "inherit", stderr: "inherit" })
  const { success } = await command.output()
  assert(success, "wasm-pack could not be executed")
  return path
}
