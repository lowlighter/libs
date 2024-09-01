import { greaterThan as _function_greaterThan } from "jsr:@std/semver@1.0.2/greater-than"
/**
 * Greater than comparison for two SemVers.
 *
 * This is equal to `compare(version1, version2) > 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, greaterThan } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 *
 * assert(greaterThan(version2, version1));
 * assert(!greaterThan(version1, version2));
 * assert(!greaterThan(version1, version1));
 * ```
 *
 * @param version1 The first version to compare
 * @param version2 The second version to compare
 * @return `true` if `version1` is greater than `version2`, `false` otherwise
 */
const greaterThan = _function_greaterThan as typeof _function_greaterThan
export { greaterThan }
