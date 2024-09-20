import { basename as _function_basename } from "jsr:@std/path@1.0.6/windows/unstable-basename"
/**
 * Return the last portion of a `path`.
 * Trailing directory separators are ignored, and optional suffix is removed.
 *
 * @experimental
 * @example Usage
 * ```ts
 * import { basename } from "@std/path/windows/unstable-basename";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(basename("C:\\user\\Documents\\"), "Documents");
 * assertEquals(basename("C:\\user\\Documents\\image.png"), "image.png");
 * assertEquals(basename("C:\\user\\Documents\\image.png", ".png"), "image");
 * assertEquals(basename(new URL("file:///C:/user/Documents/image.png")), "image.png");
 * assertEquals(basename(new URL("file:///C:/user/Documents/image.png"), ".png"), "image");
 * ```
 *
 * @param path The path to extract the name from.
 * @param suffix The suffix to remove from extracted name.
 * @return The extracted name.
 */
const basename = _function_basename as typeof _function_basename
export { basename }
