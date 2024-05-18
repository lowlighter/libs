// Imports
import { bundle as emit, type BundleOptions } from "@deno/emit"
import { encodeBase64 } from "@std/encoding/base64"
import { minify as terser } from "terser"

/**
 * Bundle and transpile TypeScript to JavaScript.
 *
 * Minification can be either:
 * - `terser` for advanced minification through {@link https://terser.org | Terser}
 * - `basic` for basic minification through {@link https://github.com/denoland/deno_emit | deno_emit}
 *
 * A banner option can be provided to prepend a comment to the output, which can be useful for licensing information.
 *
 * Use the `shadow` option to replace the local URLs (using `file://` scheme) with a shadow url to avoid exposing the real path.
 *
 * @example
 * ```
 * // From file
 * import { bundle } from "./bundle.ts"
 * console.log(await bundle(new URL(import.meta.url)))
 * ```
 * @example
 * ```
 * // From string
 * import { bundle } from "./bundle.ts"
 * console.log(await bundle(new URL(import.meta.url), { map: new URL("deno.jsonc", import.meta.url) }))
 * ```
 *
 * @example
 * ```
 * // From string
 * import { bundle } from "./bundle.ts"
 * console.log(await bundle(`console.log("Hello world")`))
 * ```
 */
export async function bundle(input: URL | string, { minify = "terser" as false | "basic" | "terser", debug = false, map = undefined as URL | undefined, banner = "", shadow = true } = {}): Promise<string> {
  const url = input instanceof URL ? input : new URL(`data:application/typescript;base64,${encodeBase64(input)}`)
  const options = { type: "module", minify: !!minify, importMap: map } as BundleOptions
  if (debug) {
    options.compilerOptions = { inlineSourceMap: true, inlineSources: true }
  }
  const result = await emit(url, options).catch((error) => error)
  if (result instanceof Error) {
    throw new TypeError(`Failed to bundle ts:\n${result.message}`)
  }
  if (minify === "terser") {
    result.code = await terser(result.code, { module: true, sourceMap: debug ? { url: "inline" } : false }).then((response) => response.code!)
  }
  if (banner) {
    if (banner.includes("\n")) {
      banner = `/**\n${banner.split("\n").map((line) => ` * ${line}`).join("\n")}\n */`
    } else {
      banner = `// ${banner}`
    }
    result.code = `${banner}\n${result.code}`
  }
  if (shadow) {
    result.code = result.code.replaceAll(/(["'])(?<scheme>file:\/\/).*?\/(?<name>[A-Za-z0-9_]+\.(?:ts|js|mjs))\1/g, "'$<scheme>/shadow/$<name>'")
  }
  return result.code
}
