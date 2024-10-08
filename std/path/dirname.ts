import { dirname as _function_dirname } from "jsr:@std/path@1.0.6/dirname"
/**
 * Return the directory path of a path.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@std/path/dirname";
 * import { assertEquals } from "@std/assert";
 *
 * if (Deno.build.os === "windows") {
 *   assertEquals(dirname("C:\\home\\user\\Documents\\image.png"), "C:\\home\\user\\Documents");
 * } else {
 *   assertEquals(dirname("/home/user/Documents/image.png"), "/home/user/Documents");
 * }
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `dirname` from `@std/path/unstable-dirname`.
 *
 * @param path Path to extract the directory from.
 * @return The directory path.
 */
const dirname = _function_dirname as typeof _function_dirname
export { dirname }
