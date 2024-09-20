import { dirname as _function_dirname } from "jsr:@std/path@1.0.6/posix/unstable-dirname"
/**
 * Return the directory path of a file URL.
 *
 * @experimental
 * @example Usage
 * ```ts
 * import { dirname } from "@std/path/posix/unstable-dirname";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(dirname("/home/user/Documents/"), "/home/user");
 * assertEquals(dirname("/home/user/Documents/image.png"), "/home/user/Documents");
 * assertEquals(dirname(new URL("file:///home/user/Documents/image.png")), "/home/user/Documents");
 * ```
 *
 * @param path The file url to get the directory from.
 * @return The directory path.
 */
const dirname = _function_dirname as typeof _function_dirname
export { dirname }
