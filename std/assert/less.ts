import { assertLess as _function_assertLess } from "jsr:@std/assert@1.0.0/less"
/**
 * Make an assertion that `actual` is less than `expected`.
 * If not then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertLess } from "@std/assert";
 *
 * assertLess(1, 2); // Doesn't throw
 * assertLess(2, 1); // Throws
 * ```
 *
 * @template T The type of the values to compare.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
const assertLess = _function_assertLess
export { assertLess }
