import { dirname as _function_dirname } from "jsr:@std/path@1.0.1/posix/dirname"
/**
 * Return the directory path of a `path`.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@std/path/posix/dirname";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(dirname("/home/user/Documents/"), "/home/user");
 * assertEquals(dirname("/home/user/Documents/image.png"), "/home/user/Documents");
 * ```
 *
 * @param path The path to get the directory from.
 * @return The directory path.
 */
const dirname = _function_dirname
export { dirname }
