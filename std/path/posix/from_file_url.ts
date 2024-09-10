import { fromFileUrl as _function_fromFileUrl } from "jsr:@std/path@1.0.4/posix/from-file-url"
/**
 * Converts a file URL to a path string.
 *
 * @example Usage
 * ```ts
 * import { fromFileUrl } from "@std/path/posix/from-file-url";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(fromFileUrl(new URL("file:///home/foo")), "/home/foo");
 * ```
 *
 * @param url The file URL to convert.
 * @return The path string.
 */
const fromFileUrl = _function_fromFileUrl as typeof _function_fromFileUrl
export { fromFileUrl }
