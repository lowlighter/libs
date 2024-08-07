import { greaterOrEqual as _function_greaterOrEqual } from "jsr:@std/semver@1.0.0/greater-or-equal"
/**
 * Greater than or equal to comparison for two SemVers.
 *
 * This is equal to `compare(s0, s1) >= 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, greaterOrEqual } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const s0 = parse("1.2.3");
 * const s1 = parse("1.2.4");
 *
 * assert(greaterOrEqual(s1, s0));
 * assert(!greaterOrEqual(s0, s1));
 * assert(greaterOrEqual(s0, s0));
 * ```
 *
 * @param s0 The first version to compare
 * @param s1 The second version to compare
 * @return `true` if `s0` is greater than or equal to `s1`, `false` otherwise
 */
const greaterOrEqual = _function_greaterOrEqual
export { greaterOrEqual }
