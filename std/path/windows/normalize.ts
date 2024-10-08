import { normalize as _function_normalize } from "jsr:@std/path@1.0.6/windows/normalize"
/**
 * Normalize the `path`, resolving `'..'` and `'.'` segments.
 * Note that resolving these segments does not necessarily mean that all will be eliminated.
 * A `'..'` at the top-level will be preserved, and an empty path is canonically `'.'`.
 *
 * @example Usage
 * ```ts
 * import { normalize } from "@std/path/windows/normalize";
 * import { assertEquals } from "@std/assert";
 *
 * const normalized = normalize("C:\\foo\\..\\bar");
 * assertEquals(normalized, "C:\\bar");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `normalize` from `@std/path/windows/unstable-normalize`.
 *
 * @param path The path to normalize
 * @return The normalized path
 */
const normalize = _function_normalize as typeof _function_normalize
export { normalize }
