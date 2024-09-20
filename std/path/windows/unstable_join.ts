import { join as _function_join } from "jsr:@std/path@1.0.6/windows/unstable-join"
/**
 * Join all given a sequence of `paths`, then normalizes the resulting path.
 *
 * @experimental
 * @example Usage
 * ```ts
 * import { join } from "@std/path/windows/unstable-join";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(join("C:\\foo", "bar", "baz\\.."), "C:\\foo\\bar");
 * assertEquals(join(new URL("file:///C:/foo"), "bar", "baz\\.."), "C:\\foo\\bar");
 * ```
 *
 * @param path The path to join. This can be string or file URL.
 * @param paths The paths to join.
 * @return The joined path.
 */
const join = _function_join as typeof _function_join
export { join }
