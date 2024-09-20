import { basename as _function_basename } from "jsr:@std/path@1.0.6/unstable-basename"
/**
 * Return the last portion of a path.
 *
 * @experimental
 * @example Usage
 * ```ts
 * import { basename } from "@std/path/unstable-basename";
 * import { assertEquals } from "@std/assert";
 *
 * if (Deno.build.os === "windows") {
 *   assertEquals(basename("C:\\user\\Documents\\image.png"), "image.png");
 *   assertEquals(basename(new URL("file:///C:/user/Documents/image.png")), "image.png");
 * } else {
 *   assertEquals(basename("/home/user/Documents/image.png"), "image.png");
 *   assertEquals(basename(new URL("file:///home/user/Documents/image.png")), "image.png");
 * }
 * ```
 *
 * @param path Path to extract the name from.
 * @param suffix Suffix to remove from extracted name.
 *
 * @return The basename of the path.
 */
const basename = _function_basename as typeof _function_basename
export { basename }
