import { extname as _function_extname } from "jsr:@std/path@1.0.6/posix/extname"
/**
 * Return the extension of the `path` with leading period.
 *
 * @example Usage
 * ```ts
 * import { extname } from "@std/path/posix/extname";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(extname("/home/user/Documents/file.ts"), ".ts");
 * assertEquals(extname("/home/user/Documents/"), "");
 * assertEquals(extname("/home/user/Documents/image.png"), ".png");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `extname` from `@std/path/posix/unstable-extname`.
 *
 * @param path The path to get the extension from.
 * @return The extension (ex. for `file.ts` returns `.ts`).
 */
const extname = _function_extname as typeof _function_extname
export { extname }
