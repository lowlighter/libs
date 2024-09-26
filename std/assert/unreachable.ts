import { unreachable as _function_unreachable } from "jsr:@std/assert@1.0.6/unreachable"
/**
 * Use this to assert unreachable code.
 *
 * @example Usage
 * ```ts ignore
 * import { unreachable } from "@std/assert";
 *
 * unreachable(); // Throws
 * ```
 *
 * @param msg Optional message to include in the error.
 * @return Never returns, always throws.
 */
const unreachable = _function_unreachable as typeof _function_unreachable
export { unreachable }
