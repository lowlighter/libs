// Imports
import { toFileUrl } from "@std/path/to-file-url"
import { encodeBase64 } from "@std/encoding/base64"
import { bgCyan } from "@std/fmt/colors"
import { bundle as bundle_ts } from "../ts/bundle.ts"
import { assert } from "@std/assert"
import { resolve } from "@std/path/resolve"

/**
 * Build WASM, bundle and minify JavaScript.
 *
 * The resulting WASM file is injected as a base64 string in the JavaScript output to avoid the need of `--allow-read` permission.
 *
 * @example
 * ```ts
 * import { bundle } from "./bundle.ts"
 * await bundle("my_wasm_module", { cwd: "path/to/rust/project" })
 * ```
 */
export async function bundle(name: string, { cwd, banner }: { cwd: string; banner?: string }): Promise<void> {
  // Build wasm
  console.log(bgCyan("wasm build".padEnd(48)))
  const command = new Deno.Command("wasm-pack", { args: ["build", "--release", "--target", "web"], cwd, stdin: "inherit", stdout: "inherit", stderr: "inherit" })
  const { success } = await command.output()
  assert(success, "wasm build failed")

  // Inject wasm
  console.log(bgCyan("inject base64 wasm to js".padEnd(48)))
  const wasm = await fetch(toFileUrl(resolve(cwd, `pkg/${name}_bg.wasm`))).then((response) => response.arrayBuffer())
  const js = await fetch(toFileUrl(resolve(cwd, `pkg/${name}.js`))).then((response) => response.text())
  assert(js.includes(`'${name}_bg.wasm'`), "failed to find injection location")
  await Deno.writeTextFile(resolve(cwd, `./${name}.js`), js.replace(`'${name}_bg.wasm'`, `'data:application/wasm;base64,${encodeBase64(wasm)}'`))
  console.log("ok")

  // Minify output
  console.log(bgCyan("minify js".padEnd(48)))
  const minified = await bundle_ts(new URL(toFileUrl(resolve(cwd, `./${name}.js`))), { minify: "terser", banner })
  await Deno.writeTextFile(resolve(cwd, `./${name}.js`), minified)
  console.log(`size: ${new Blob([minified]).size}b`)
}
