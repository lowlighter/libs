/**
 * Wrapper around https://github.com/denoland/deno_emit to bundle and transpile TypeScript to JavaScript.
 *
 * Significant changes includes:
 * - Support for raw TypeScript string input
 * - Default options changed (minification enabled by default)
 * - Support for banner option
 * - Support advanced minification through {@link https://terser.org | Terser}
 * @module
 */

// Imports
import { bundle as emit, type BundleOptions } from "jsr:@deno/emit@0.40"
import { encodeBase64 } from "jsr:@std/encoding@0.224.0/base64"
import { minify as terser } from "npm:terser@5"

/**
 * Bundle and transpile TypeScript to JavaScript
 *
 * @example
 * ```
 * // From file
 * import { bundle } from "./bundle.ts"
 * console.log(await bundle(new URL(import.meta.url)))
 * ```
 *
 * @example
 * ```
 * // From string
 * import { bundle } from "./bundle.ts"
 * console.log(await bundle(`console.log("Hello world")`))
 * ```
 */
export async function bundle(input: URL | string, { minify = "terser" as false | "basic" | "terser", debug = false, map = undefined as URL | undefined, banner = "" } = {}): Promise<string> {
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
  return result.code
}
