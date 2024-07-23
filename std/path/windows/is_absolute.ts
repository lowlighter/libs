import { isAbsolute as _function_isAbsolute } from "jsr:@std/path@1.0.1/windows/is-absolute"
/**
 * Verifies whether provided path is absolute.
 *
 * @example Usage
 * ```ts
 * import { isAbsolute } from "@std/path/windows/is-absolute";
 * import { assert, assertFalse } from "@std/assert";
 *
 * assert(isAbsolute("C:\\foo\\bar"));
 * assertFalse(isAbsolute("..\\baz"));
 * ```
 *
 * @param path The path to verify.
 * @return `true` if the path is absolute, `false` otherwise.
 */
const isAbsolute = _function_isAbsolute
export { isAbsolute }
