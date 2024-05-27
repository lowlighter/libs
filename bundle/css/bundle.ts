// Imports
import { minify as csso } from "csso"
import stylelint from "stylelint"
import type { ConfigRuleSettings } from "stylelint"
import plugin from "stylelint-order"
import recommended from "stylelint-config-recommended"
import ordering from "stylelint-config-idiomatic-order"

/**
 * Bundle CSS.
 *
 * Minification is supported through {@link https://github.com/css/csso | CSSO}.
 *
 * Linting and formatting is supported through {@link https://github.com/stylelint/stylelint | Stylelint}.
 *
 * A banner option can be provided to prepend a comment to the output, which can be useful for licensing information.
 *
 * @example
 * ```
 * // From file
 * import { bundle } from "./bundle.ts"
 * console.log(await bundle(new URL("testing/test_bundle.css", import.meta.url)))
 * ```
 *
 * @example
 * ```
 * // From string
 * import { bundle } from "./bundle.ts"
 * console.log(await bundle(`body { color: salmon; }`))
 * ```
 */
export async function bundle(input: URL | string, { minify = false, banner = "", rules = {} as Rules } = {}): Promise<string> {
  const code = input instanceof URL ? await fetch(input).then((response) => response.text()) : input
  const { results: [{ warnings }], ...result } = await stylelint.lint({
    config: {
      plugins: [plugin],
      rules: {
        ...recommended.rules,
        ...ordering.rules,
        ...rules,
      },
      cache: false,
      fix: true,
    },
    code,
  })
  result.code ??= ""
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
  return result.code!
}

/** Rules */
// deno-lint-ignore ban-types no-explicit-any
type Rules = ConfigRuleSettings<any, Object>
