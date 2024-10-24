/**
 * Bundle and transpile TypeScript to JavaScript.
 * @module
 */

// Imports
import * as esbuild from "esbuild"
import { denoPlugins as plugins } from "@luca/esbuild-deno-loader"
import { encodeBase64 } from "@std/encoding/base64"
import { minify as terser } from "terser"
import { fromFileUrl } from "@std/path/from-file-url"
import { delay } from "@std/async/delay"

/**
 * Bundle and transpile TypeScript to JavaScript.
 *
 * Minification can be either:
 * - `terser` for advanced minification through {@link https://terser.org | Terser}
 * - `basic` for basic minification through {@link https://github.com/evanw/esbuild | esbuild}
 *
 * A banner option can be provided to prepend a comment to the output, which can be useful for licensing information.
 *
 * Use the `shadow` option to replace the local URLs (using `file://` scheme) with a shadow url to avoid exposing real paths.
 *
 * @example
 * ```ts
 * // From file
 * import { bundle } from "./bundle.ts"
 * console.log(await bundle(new URL(import.meta.url)))
 * ```
 * @example
 * ```ts
 * // From string
 * import { bundle } from "./bundle.ts"
 * console.log(await bundle(new URL(import.meta.url), { config: new URL("deno.jsonc", import.meta.url) }))
 * ```
 *
 * @example
 * ```ts
 * // From string
 * import { bundle } from "./bundle.ts"
 * console.log(await bundle(`console.log("Hello world")`))
 * ```
 */
export async function bundle(input: URL | string, { minify = "terser", format = "esm", debug = false, banner = "", shadow = true, config, exports, raw } = {} as options): Promise<string> {
  const url = input instanceof URL ? input : new URL(`data:application/typescript;base64,${encodeBase64(input)}`)
  let code = ""
  try {
    const { outputFiles: [{ text: output }] } = await esbuild.build({
      plugins: [...plugins({ configPath: config ? fromFileUrl(config) : undefined })],
      entryPoints: [url.href],
      format,
      globalName: exports,
      write: false,
      minify: minify === "basic",
      target: "esnext",
      treeShaking: true,
      sourcemap: debug ? "inline" : false,
      sourcesContent: debug,
      bundle: true,
      logLevel: "silent",
      ...raw,
    })
    code = output
    if (minify) {
      code = code.trim()
    }
  } catch (error) {
    throw new TypeError(`Failed to bundle ts:\n${(error as Error).message}`)
  } finally {
    await esbuild.stop()
    // TODO(@lowlighter): remove after https://github.com/evanw/esbuild/pull/3701
    await delay(500)
  }
  if (minify === "terser") {
    code = await terser(code, { format: { comments: false }, module: true, sourceMap: debug ? { url: "inline" } : false }).then((response) => response.code!)
  }
  if (banner) {
    if (banner.includes("\n")) {
      banner = `/**\n${banner.split("\n").map((line) => ` * ${line}`).join("\n")}\n */`
    } else {
      banner = `// ${banner}`
    }
    code = `${banner}\n${code}`
  }
  if (shadow) {
    code = code.replaceAll(/(["'])(?<scheme>file:\/\/).*?\/(?<name>[A-Za-z0-9_]+\.(?:ts|js|mjs))\1/g, "'$<scheme>/shadow/$<name>'")
  }
  return code
}

/** Bundle options. */
export type options = {
  minify?: false | "basic" | "terser"
  format?: "esm" | "iife"
  exports?: string
  debug?: boolean
  config?: URL
  banner?: string
  shadow?: boolean
  raw?: Record<PropertyKey, unknown>
}
