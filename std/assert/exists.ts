import { assertExists as _function_assertExists } from "jsr:@std/assert@1.0.0/exists"
/**
 * Make an assertion that actual is not null or undefined.
 * If not then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertExists } from "@std/assert";
 *
 * assertExists("something"); // Doesn't throw
 * assertExists(undefined); // Throws
 * ```
 *
 * @template T The type of the actual value.
 * @param actual The actual value to check.
 * @param msg The optional message to include in the error if the assertion fails.
 */
const assertExists = _function_assertExists
export { assertExists }
