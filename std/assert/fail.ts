import { fail as _function_fail } from "jsr:@std/assert@1.0.2/fail"
/**
 * Forcefully throws a failed assertion.
 *
 * @example Usage
 * ```ts no-eval
 * import { fail } from "@std/assert";
 *
 * fail("Deliberately failed!"); // Throws
 * ```
 *
 * @param msg Optional message to include in the error.
 * @return Never returns, always throws.
 */
const fail = _function_fail
export { fail }
