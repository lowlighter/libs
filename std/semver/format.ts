import { format as _function_format } from "jsr:@std/semver@1.0.0/format"
/**
 * Format a SemVer object into a string.
 *
 * @example Usage
 * ```ts
 * import { format } from "@std/semver/format";
 * import { assertEquals } from "@std/assert";
 *
 * const semver = {
 *   major: 1,
 *   minor: 2,
 *   patch: 3,
 * };
 * assertEquals(format(semver), "1.2.3");
 * ```
 *
 * @param semver The SemVer to format
 * @return The string representation of a semantic version.
 */
const format = _function_format
export { format }
