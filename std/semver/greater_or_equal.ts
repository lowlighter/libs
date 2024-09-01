import { greaterOrEqual as _function_greaterOrEqual } from "jsr:@std/semver@1.0.2/greater-or-equal"
/**
 * Greater than or equal to comparison for two SemVers.
 *
 * This is equal to `compare(version1, version2) >= 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, greaterOrEqual } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 *
 * assert(greaterOrEqual(version2, version1));
 * assert(!greaterOrEqual(version1, version2));
 * assert(greaterOrEqual(version1, version1));
 * ```
 *
 * @param version1 The first version to compare
 * @param version2 The second version to compare
 * @return `true` if `version1` is greater than or equal to `version2`, `false` otherwise
 */
const greaterOrEqual = _function_greaterOrEqual as typeof _function_greaterOrEqual
export { greaterOrEqual }
