/**
 * Wrapper around https://github.com/stylelint/stylelint to bundle CSS.
 *
 * Significant changes includes:
 * - Support for banner option
 * - Support minification through {@link https://github.com/css/csso | CSSO}
 */

// Imports
import { minify as csso } from "https://esm.sh/csso@4.2.0"
import stylelint from "npm:stylelint"
import plugin from "npm:stylelint-order"
import recommended from "https://esm.sh/stylelint-config-recommended@14.0.0"
import ordering from "https://esm.sh/stylelint-config-idiomatic-order@10.0.0"

/**
 * Bundle CSS
 *
 * @example
 * ```
 * // From file
 * import { bundle } from "./css.ts"
 * console.log(await bundle(new URL(import.meta.url)))
 * ```
 *
 * @example
 * ```
 * // From string
 * import { bundle } from "./css.ts"
 * console.log(await bundle(`body { color: salmon; }`))
 * ```
 */
export async function bundle(input: URL | string, { minify = false, banner = "" } = {}) {
  const code = input instanceof URL ? await fetch(input).then((response) => response.text()) : input
  const { results: [{ warnings }], ...result } = await stylelint.lint({
    config: {
      plugins: [plugin],
      rules: {
        ...recommended.rules,
        ...ordering.rules,
        "declaration-no-important": true,
      },
      fix: true,
    },
    code,
  })
  if (warnings.length) {
    throw new TypeError(`Failed to bundle css:\n${warnings.map(({ severity, rule, text }) => `[${severity.toUpperCase()}] ${rule}: ${text}`).join("\n")}`)
  }
  if (minify) {
    result.code = csso(result.code!, { comments: false }).css
  }
  if (banner) {
    banner = `/**\n${banner.split("\n").map((line) => ` * ${line}`).join("\n")}\n */`
    result.code = `${banner}\n${result.code}`
  }
  return result.code
}
