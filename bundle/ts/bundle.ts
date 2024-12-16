/**
 * Bundle and transpile TypeScript to JavaScript.
 * @module
 */

// Imports
import type { Nullable } from "@libs/typing"
import { denoLoaderPlugin, denoResolverPlugin } from "@luca/esbuild-deno-loader"
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
 * ```ts ignore
 * // From file
 * import { bundle } from "./bundle.ts"
 * console.log(await bundle(new URL(import.meta.url)))
 * ```
 * ```ts ignore
 * // From file and config
 * import { bundle } from "./bundle.ts"
 * console.log(await bundle(new URL(import.meta.url), { config: new URL("deno.jsonc", import.meta.url) }))
 * ```
 * ```ts
 * // From string
 * import { bundle } from "./bundle.ts"
 * console.log(await bundle(`console.log("Hello world")`))
 * ```
 */
export async function bundle(input: URL | string, { builder = "binary", minify = "terser", format = "esm", debug = false, banner = "", shadow = true, config, exports, raw, overrides } = {} as options): Promise<string> {
  const esbuild = builder === "wasm" ? await import("../vendored/esbuild/wasm.js") : await import("esbuild")
  const url = input instanceof URL ? input : new URL(`data:application/typescript;base64,${encodeBase64(input)}`)
  let code = ""
  try {
    const { outputFiles: [{ text: output }] } = await esbuild.build({
      plugins: [
        overrides?.imports ? overridesImports({ imports: overrides.imports }) : null,
        denoResolverPlugin({ configPath: config ? fromFileUrl(config) : undefined }),
        denoLoaderPlugin({ configPath: config ? fromFileUrl(config) : undefined }),
      ].filter((plugin): plugin is Plugin => Boolean(plugin)),
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
  /**
   * The builder version to use.
   *
   * It can be either:
   * - `binary` to use the binary runtime (faster but requires permissions to run)
   * - `wasm` to use the WASM runtime (slower but more portable)
   */
  builder?: "binary" | "wasm"
  /**
   * Minify the output.
   *
   * It can be either:
   * - `false` to disable minification
   * - `basic` for basic minification using {@link https://esbuild.github.io | esbuild}
   * - `terser` for advanced minification through {@link https://terser.org | Terser}
   */
  minify?: false | "basic" | "terser"
  /** Output format. */
  format?: "esm" | "iife"
  /** Global exports. */
  exports?: string
  /** Enable debug and source map. */
  debug?: boolean
  /**
   * Path to the config file.
   *
   * It is advised to leave this option empty as the deno plugin now resolves the configuration automatically.
   */
  config?: URL
  /**
   * Banner to prepend to the output, useful for licensing information.
   *
   * It is automatically formatted as a comment.
   */
  banner?: string
  /** Replace local URLs with shadow URLs. */
  shadow?: boolean
  /**
   * Raw options to esbuild.
   *
   * These options can also be used to override the default behavior of the bundler.
   * Note that these options are excluded from the breaking changes policy.
   *
   * @see {@link https://esbuild.github.io/api/#build-api | esbuild} for more information.
   */
  raw?: Record<PropertyKey, unknown>
  /** Overrides. */
  overrides?: {
    /**
     * Override imports.
     *
     * Can be used to replace imports with custom values before deno resolution.
     * The key is the matching import path (as it appears in the source code) and the value is what it should be replaced with.
     */
    imports?: Record<string, string>
  }
}

/** Esbuild plugin. */
type Plugin = {
  name: string
  setup: (build: { onResolve: (options: { filter: RegExp }, callback: (args: { path: string }) => Nullable<{ path: string; namespace: string }>) => void }) => void
}

/** Override imports. */
function overridesImports(options: { imports: NonNullable<NonNullable<options["overrides"]>["imports"]> }): Plugin {
  return ({
    name: "libs-bundler-overrides-imports",
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (!(args.path in options.imports)) {
          return null
        }
        const url = new URL(options.imports[args.path])
        if (url.protocol === "file:") {
          return { path: fromFileUrl(url), namespace: "file" }
        }
        const namespace = url.protocol.slice(0, -1)
        const path = url.href.slice(namespace.length + 1)
        return { path, namespace }
      })
    },
  }) as Plugin
}
