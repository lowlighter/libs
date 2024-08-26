import { compare as _function_compare } from "jsr:@std/semver@1.0.1/compare"
/**
 * Compare two SemVers.
 *
 * Returns `0` if `s0` equals `s1`, or `1` if `s0` is greater, or `-1` if `s1` is
 * greater.
 *
 * Sorts in ascending order if passed to {@linkcode Array.sort}.
 *
 * @example Usage
 * ```ts
 * import { parse, compare } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * const s0 = parse("1.2.3");
 * const s1 = parse("1.2.4");
 *
 * assertEquals(compare(s0, s1), -1);
 * assertEquals(compare(s1, s0), 1);
 * assertEquals(compare(s0, s0), 0);
 * ```
 *
 * @param s0 The first SemVer to compare
 * @param s1 The second SemVer to compare
 * @return `1` if `s0` is greater, `0` if equal, or `-1` if `s1` is greater
 */
const compare = _function_compare as typeof _function_compare
export { compare }
