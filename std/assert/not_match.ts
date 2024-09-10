import { assertNotMatch as _function_assertNotMatch } from "jsr:@std/assert@1.0.4/not-match"
/**
 * Make an assertion that `actual` not match RegExp `expected`. If match
 * then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertNotMatch } from "@std/assert";
 *
 * assertNotMatch("Denosaurus", /Raptor/); // Doesn't throw
 * assertNotMatch("Raptor", /Raptor/); // Throws
 * ```
 *
 * @param actual The actual value to match.
 * @param expected The expected value to not match.
 * @param msg The optional message to display if the assertion fails.
 */
const assertNotMatch = _function_assertNotMatch as typeof _function_assertNotMatch
export { assertNotMatch }
