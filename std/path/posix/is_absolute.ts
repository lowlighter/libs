import { isAbsolute as _function_isAbsolute } from "jsr:@std/path@1.0.2/posix/is-absolute"
/**
 * Verifies whether provided path is absolute.
 *
 * @example Usage
 * ```ts
 * import { isAbsolute } from "@std/path/posix/is-absolute";
 * import { assert, assertFalse } from "@std/assert";
 *
 * assert(isAbsolute("/home/user/Documents/"));
 * assertFalse(isAbsolute("home/user/Documents/"));
 * ```
 *
 * @param path The path to verify.
 * @return Whether the path is absolute.
 */
const isAbsolute = _function_isAbsolute
export { isAbsolute }
