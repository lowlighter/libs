import { extname as _function_extname } from "jsr:@std/path@1.0.6/windows/extname"
/**
 * Return the extension of the `path` with leading period.
 *
 * @example Usage
 * ```ts
 * import { extname } from "@std/path/windows/extname";
 * import { assertEquals } from "@std/assert";
 *
 * const ext = extname("file.ts");
 * assertEquals(ext, ".ts");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `extname` from `@std/path/windows/unstable-extname`.
 *
 * @param path The path to get the extension from.
 * @return The extension of the `path`.
 */
const extname = _function_extname as typeof _function_extname
export { extname }
