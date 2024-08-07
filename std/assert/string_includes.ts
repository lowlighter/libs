import { assertStringIncludes as _function_assertStringIncludes } from "jsr:@std/assert@1.0.2/string-includes"
/**
 * Make an assertion that actual includes expected. If not
 * then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertStringIncludes } from "@std/assert";
 *
 * assertStringIncludes("Hello", "ello"); // Doesn't throw
 * assertStringIncludes("Hello", "world"); // Throws
 * ```
 *
 * @param actual The actual string to check for inclusion.
 * @param expected The expected string to check for inclusion.
 * @param msg The optional message to display if the assertion fails.
 */
const assertStringIncludes = _function_assertStringIncludes
export { assertStringIncludes }
