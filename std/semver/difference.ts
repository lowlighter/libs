import { difference as _function_difference } from "jsr:@std/semver@1.0.2/difference"
/**
 * Returns difference between two SemVers by the release type,
 * or `undefined` if the SemVers are the same.
 *
 * @example Usage
 * ```ts
 * import { parse, difference } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 * const version3 = parse("1.3.0");
 * const version4 = parse("2.0.0");
 *
 * assertEquals(difference(version1, version2), "patch");
 * assertEquals(difference(version1, version3), "minor");
 * assertEquals(difference(version1, version4), "major");
 * assertEquals(difference(version1, version1), undefined);
 * ```
 *
 * @param version1 The first SemVer to compare
 * @param version2 The second SemVer to compare
 * @return The release type difference or `undefined` if the versions are the same
 */
const difference = _function_difference as typeof _function_difference
export { difference }
