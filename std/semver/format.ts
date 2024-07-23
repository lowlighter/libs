import { format as _function_format } from "jsr:@std/semver@0.224.3/format"
/**
 * Format a SemVer object into a string.
 *
 * If any number is NaN then NaN will be printed.
 *
 * If any number is positive or negative infinity then '∞' or '⧞' will be printed instead.
 *
 * @example Usage
 * ```ts
 * import { format } from "@std/semver/format";
 * import { assertEquals } from "@std/assert/assert-equals";
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
