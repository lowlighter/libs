import { dirname as _function_dirname } from "jsr:@std/path@1.0.6/windows/unstable-dirname"
/**
 * Return the directory path of a file URL.
 *
 * @experimental
 * @example Usage
 * ```ts
 * import { dirname } from "@std/path/windows/unstable-dirname";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(dirname("C:\\foo\\bar\\baz.ext"), "C:\\foo\\bar");
 * assertEquals(dirname(new URL("file:///C:/foo/bar/baz.ext")), "C:\\foo\\bar");
 * ```
 *
 * @param path The path to get the directory from.
 * @return The directory path.
 */
const dirname = _function_dirname as typeof _function_dirname
export { dirname }
