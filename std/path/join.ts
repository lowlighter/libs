import { join as _function_join } from "jsr:@std/path@1.0.6/join"
/**
 * Joins a sequence of paths, then normalizes the resulting path.
 *
 * @example Usage
 * ```ts
 * import { join } from "@std/path/join";
 * import { assertEquals } from "@std/assert";
 *
 * if (Deno.build.os === "windows") {
 *   assertEquals(join("C:\\foo", "bar", "baz\\quux", "garply", ".."), "C:\\foo\\bar\\baz\\quux");
 * } else {
 *   assertEquals(join("/foo", "bar", "baz/quux", "garply", ".."), "/foo/bar/baz/quux");
 * }
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `join` from `@std/path/unstable-join`.
 *
 * @param paths Paths to be joined and normalized.
 * @return The joined and normalized path.
 */
const join = _function_join as typeof _function_join
export { join }
