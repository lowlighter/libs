import { assertGreaterOrEqual as _function_assertGreaterOrEqual } from "jsr:@std/assert@1.0.6/greater-or-equal"
/**
 * Make an assertion that `actual` is greater than or equal to `expected`.
 * If not then throw.
 *
 * @example Usage
 * ```ts ignore
 * import { assertGreaterOrEqual } from "@std/assert";
 *
 * assertGreaterOrEqual(2, 1); // Doesn't throw
 * assertGreaterOrEqual(1, 1); // Doesn't throw
 * assertGreaterOrEqual(0, 1); // Throws
 * ```
 *
 * @template T The type of the values to compare.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
const assertGreaterOrEqual = _function_assertGreaterOrEqual as typeof _function_assertGreaterOrEqual
export { assertGreaterOrEqual }
