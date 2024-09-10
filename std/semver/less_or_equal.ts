import { lessOrEqual as _function_lessOrEqual } from "jsr:@std/semver@1.0.3/less-or-equal"
/**
 * Less than or equal to comparison for two SemVers.
 *
 * This is equal to `compare(version1, version2) <= 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, lessOrEqual } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 *
 * assert(lessOrEqual(version1, version2));
 * assert(!lessOrEqual(version2, version1));
 * assert(lessOrEqual(version1, version1));
 * ```
 *
 * @param version1 the first version to compare
 * @param version2 the second version to compare
 * @return `true` if `version1` is less than or equal to `version2`, `false` otherwise
 */
const lessOrEqual = _function_lessOrEqual as typeof _function_lessOrEqual
export { lessOrEqual }
