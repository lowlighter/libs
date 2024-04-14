/**
 * Wrapper around https://github.com/denoland/deno_emit to bundle and transpile TypeScript to JavaScript.
 *
 * Significant changes includes:
 * - Support for raw TypeScript string input
 * - Default options changed (minification enabled by default)
 * - Support for banner option
 */

// Imports
import { bundle as emit, type BundleOptions } from "https://deno.land/x/emit@0.39.0/mod.ts"
import { encodeBase64 } from "https://deno.land/std@0.222.1/encoding/base64.ts"

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
export async function bundle(input: URL | string, { minify = true, debug = false, map = undefined as URL | undefined, banner = "" } = {}) {
  const url = input instanceof URL ? input : new URL(`data:application/typescript;base64,${encodeBase64(input)}`)
  const options = { type: "module", minify, importMap: map } as BundleOptions
  if (debug) {
    options.compilerOptions = { inlineSourceMap: true, inlineSources: true }
  }
  const result = await emit(url, options)
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
