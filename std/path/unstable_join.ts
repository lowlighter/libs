import { join as _function_join } from "jsr:@std/path@1.0.6/unstable-join"
/**
 * Join all given a sequence of `paths`, then normalizes the resulting path.
 *
 * @experimental
 * @example Usage
 * ```ts
 * import { join } from "@std/path/unstable-join";
 * import { assertEquals } from "@std/assert";
 *
 * if (Deno.build.os === "windows") {
 *   const path = join(new URL("file:///C:/foo"), "bar", "baz/asdf", "quux", "..");
 *   assertEquals(path, "C:\\foo\\bar\\baz\\asdf");
 * } else {
 *   const path = join(new URL("file:///foo"), "bar", "baz/asdf", "quux", "..");
 *   assertEquals(path, "/foo/bar/baz/asdf");
 * }
 * ```
 *
 * @param path The path to join. This can be string or file URL.
 * @param paths The paths to join.
 * @return The joined path.
 */
const join = _function_join as typeof _function_join
export { join }
