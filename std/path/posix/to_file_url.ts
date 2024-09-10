import { toFileUrl as _function_toFileUrl } from "jsr:@std/path@1.0.4/posix/to-file-url"
/**
 * Converts a path string to a file URL.
 *
 * @example Usage
 * ```ts
 * import { toFileUrl } from "@std/path/posix/to-file-url";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(toFileUrl("/home/foo"), new URL("file:///home/foo"));
 * assertEquals(toFileUrl("/home/foo bar"), new URL("file:///home/foo%20bar"));
 * ```
 *
 * @param path The path to convert.
 * @return The file URL.
 */
const toFileUrl = _function_toFileUrl as typeof _function_toFileUrl
export { toFileUrl }
