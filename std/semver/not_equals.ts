import { notEquals as _function_notEquals } from "jsr:@std/semver@1.0.2/not-equals"
/**
 * Not equal comparison for two SemVers.
 *
 * This is equal to `compare(version1, version2) !== 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, notEquals } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 *
 * assert(notEquals(version1, version2));
 * assert(!notEquals(version1, version1));
 * ```
 *
 * @param version1 The first version to compare
 * @param version2 The second version to compare
 * @return `true` if `version1` is not equal to `version2`, `false` otherwise
 */
const notEquals = _function_notEquals as typeof _function_notEquals
export { notEquals }
