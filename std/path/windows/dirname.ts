import { dirname as _function_dirname } from "jsr:@std/path@1.0.6/windows/dirname"
/**
 * Return the directory path of a `path`.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@std/path/windows/dirname";
 * import { assertEquals } from "@std/assert";
 *
 * const dir = dirname("C:\\foo\\bar\\baz.ext");
 * assertEquals(dir, "C:\\foo\\bar");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `dirname` from `@std/path/windows/unstable-dirname`.
 *
 * @param path The path to get the directory from.
 * @return The directory path.
 */
const dirname = _function_dirname as typeof _function_dirname
export { dirname }
