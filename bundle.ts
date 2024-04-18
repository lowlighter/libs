/**
 * Wrapper around https://github.com/denoland/deno_emit to bundle and transpile TypeScript to JavaScript.
 *
 * Significant changes includes:
 * - Support for raw TypeScript string input
 * - Default options changed (minification enabled by default)
 * - Support for banner option
 * - Support advanced minification through {@link https://terser.org | Terser}
 */

// Imports
import { bundle as emit, type BundleOptions } from "https://deno.land/x/emit@0.39.0/mod.ts"
import { encodeBase64 } from "https://deno.land/std@0.222.1/encoding/base64.ts"
import { minify as terser } from "https://esm.sh/terser@5.30.3"

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
export async function bundle(input: URL | string, { minify = "terser" as false | "basic" | "terser", debug = false, map = undefined as URL | undefined, banner = "" } = {}) {
  const url = input instanceof URL ? input : new URL(`data:application/typescript;base64,${encodeBase64(input)}`)
  const options = { type: "module", minify: !!minify, importMap: map } as BundleOptions
  if (debug) {
    options.compilerOptions = { inlineSourceMap: true, inlineSources: true }
  }
  const result = await emit(url, options)
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
