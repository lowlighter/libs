import { join as _function_join } from "jsr:@std/path@1.0.2/windows/join"
/**
 * Join all given a sequence of `paths`,then normalizes the resulting path.
 *
 * @example Usage
 * ```ts
 * import { join } from "@std/path/windows/join";
 * import { assertEquals } from "@std/assert";
 *
 * const joined = join("C:\\foo", "bar", "baz\\..");
 * assertEquals(joined, "C:\\foo\\bar");
 * ```
 *
 * @param paths The paths to join.
 * @return The joined path.
 */
const join = _function_join
export { join }
