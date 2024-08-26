import { difference as _function_difference } from "jsr:@std/semver@1.0.1/difference"
/**
 * Returns difference between two SemVers by the release type,
 * or `undefined` if the SemVers are the same.
 *
 * @example Usage
 * ```ts
 * import { parse, difference } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * const s0 = parse("1.2.3");
 * const s1 = parse("1.2.4");
 * const s2 = parse("1.3.0");
 * const s3 = parse("2.0.0");
 *
 * assertEquals(difference(s0, s1), "patch");
 * assertEquals(difference(s0, s2), "minor");
 * assertEquals(difference(s0, s3), "major");
 * assertEquals(difference(s0, s0), undefined);
 * ```
 *
 * @param s0 The first SemVer to compare
 * @param s1 The second SemVer to compare
 * @return The release type difference or `undefined` if the versions are the same
 */
const difference = _function_difference as typeof _function_difference
export { difference }
