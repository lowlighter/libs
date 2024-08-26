import { notEquals as _function_notEquals } from "jsr:@std/semver@1.0.1/not-equals"
/**
 * Not equal comparison for two SemVers.
 *
 * This is equal to `compare(s0, s1) !== 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, notEquals } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const s0 = parse("1.2.3");
 * const s1 = parse("1.2.4");
 *
 * assert(notEquals(s0, s1));
 * assert(!notEquals(s0, s0));
 * ```
 *
 * @param s0 The first version to compare
 * @param s1 The second version to compare
 * @return `true` if `s0` is not equal to `s1`, `false` otherwise
 */
const notEquals = _function_notEquals as typeof _function_notEquals
export { notEquals }
