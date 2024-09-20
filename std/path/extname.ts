import { extname as _function_extname } from "jsr:@std/path@1.0.6/extname"
/**
 * Return the extension of the path with leading period (".").
 *
 * @example Usage
 * ```ts
 * import { extname } from "@std/path/extname";
 * import { assertEquals } from "@std/assert";
 *
 * if (Deno.build.os === "windows") {
 *   assertEquals(extname("C:\\home\\user\\Documents\\image.png"), ".png");
 * } else {
 *   assertEquals(extname("/home/user/Documents/image.png"), ".png");
 * }
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `extname` from `@std/path/unstable-extname`.
 *
 * @param path Path with extension.
 * @return The file extension. E.g. returns `.ts` for `file.ts`.
 */
const extname = _function_extname as typeof _function_extname
export { extname }
