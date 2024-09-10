import { assertMatch as _function_assertMatch } from "jsr:@std/assert@1.0.4/match"
/**
 * Make an assertion that `actual` match RegExp `expected`. If not
 * then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertMatch } from "@std/assert";
 *
 * assertMatch("Raptor", /Raptor/); // Doesn't throw
 * assertMatch("Denosaurus", /Raptor/); // Throws
 * ```
 *
 * @param actual The actual value to be matched.
 * @param expected The expected pattern to match.
 * @param msg The optional message to display if the assertion fails.
 */
const assertMatch = _function_assertMatch as typeof _function_assertMatch
export { assertMatch }
