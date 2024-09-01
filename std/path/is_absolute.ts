import { isAbsolute as _function_isAbsolute } from "jsr:@std/path@1.0.3/is-absolute"
/**
 * Verifies whether provided path is absolute.
 *
 * @example Usage
 * ```ts
 * import { isAbsolute } from "@std/path/is-absolute";
 * import { assert, assertFalse } from "@std/assert";
 *
 * if (Deno.build.os === "windows") {
 *   assert(isAbsolute("C:\\home\\foo"));
 *   assertFalse(isAbsolute("home\\foo"));
 * } else {
 *   assert(isAbsolute("/home/foo"));
 *   assertFalse(isAbsolute("home/foo"));
 * }
 * ```
 *
 * @param path Path to be verified as absolute.
 * @return `true` if path is absolute, `false` otherwise
 */
const isAbsolute = _function_isAbsolute as typeof _function_isAbsolute
export { isAbsolute }
