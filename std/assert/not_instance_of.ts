import { assertNotInstanceOf as _function_assertNotInstanceOf } from "jsr:@std/assert@1.0.0/not-instance-of"
/**
 * Make an assertion that `obj` is not an instance of `type`.
 * If so, then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertNotInstanceOf } from "@std/assert";
 *
 * assertNotInstanceOf(new Date(), Number); // Doesn't throw
 * assertNotInstanceOf(new Date(), Date); // Throws
 * ```
 *
 * @template A The type of the object to check.
 * @template T The type of the class to check against.
 * @param actual The object to check.
 * @param unexpectedType The class constructor to check against.
 * @param msg The optional message to display if the assertion fails.
 */
const assertNotInstanceOf = _function_assertNotInstanceOf
export { assertNotInstanceOf }
