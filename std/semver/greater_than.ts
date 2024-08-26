import { greaterThan as _function_greaterThan } from "jsr:@std/semver@1.0.1/greater-than"
/**
 * Greater than comparison for two SemVers.
 *
 * This is equal to `compare(s0, s1) > 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, greaterThan } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const s0 = parse("1.2.3");
 * const s1 = parse("1.2.4");
 *
 * assert(greaterThan(s1, s0));
 * assert(!greaterThan(s0, s1));
 * assert(!greaterThan(s0, s0));
 * ```
 *
 * @param s0 The first version to compare
 * @param s1 The second version to compare
 * @return `true` if `s0` is greater than `s1`, `false` otherwise
 */
const greaterThan = _function_greaterThan as typeof _function_greaterThan
export { greaterThan }
