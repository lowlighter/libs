import { lessThan as _function_lessThan } from "jsr:@std/semver@1.0.2/less-than"
/**
 * Less than comparison for two SemVers.
 *
 * This is equal to `compare(version1, version2) < 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, lessThan } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 *
 * assert(lessThan(version1, version2));
 * assert(!lessThan(version2, version1));
 * assert(!lessThan(version1, version1));
 * ```
 *
 * @param version1 the first version to compare
 * @param version2 the second version to compare
 * @return `true` if `version1` is less than `version2`, `false` otherwise
 */
const lessThan = _function_lessThan as typeof _function_lessThan
export { lessThan }
