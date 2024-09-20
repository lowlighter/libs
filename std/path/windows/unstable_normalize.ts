import { normalize as _function_normalize } from "jsr:@std/path@1.0.6/windows/unstable-normalize"
/**
 * Normalize the `path`, resolving `'..'` and `'.'` segments.
 * Note that resolving these segments does not necessarily mean that all will be eliminated.
 * A `'..'` at the top-level will be preserved, and an empty path is canonically `'.'`.
 *
 * @experimental
 * @example Usage
 * ```ts
 * import { normalize } from "@std/path/windows/unstable-normalize";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(normalize("C:\\foo\\..\\bar"), "C:\\bar");
 * assertEquals(normalize(new URL("file:///C:/foo/../bar")), "C:\\bar");
 * ```
 *
 * @param path The path to normalize. Path can be a string or a file URL object.
 * @return The normalized path
 */
const normalize = _function_normalize as typeof _function_normalize
export { normalize }
