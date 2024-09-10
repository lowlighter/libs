import { compare as _function_compare } from "jsr:@std/semver@1.0.3/compare"
/**
 * Compare two SemVers.
 *
 * Returns `0` if `version1` equals `version2`, or `1` if `version1` is greater, or `-1` if `version2` is
 * greater.
 *
 * Sorts in ascending order if passed to {@linkcode Array.sort}.
 *
 * @example Usage
 * ```ts
 * import { parse, compare } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 *
 * assertEquals(compare(version1, version2), -1);
 * assertEquals(compare(version2, version1), 1);
 * assertEquals(compare(version1, version1), 0);
 * ```
 *
 * @param version1 The first SemVer to compare
 * @param version2 The second SemVer to compare
 * @return `1` if `version1` is greater, `0` if equal, or `-1` if `version2` is greater
 */
const compare = _function_compare as typeof _function_compare
export { compare }
