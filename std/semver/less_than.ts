import { lessThan as _function_lessThan } from "jsr:@std/semver@0.224.3/less-than"
/**
 * Less than comparison
 *
 * This is equal to `compare(s0, s1) < 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, lessThan } from "@std/semver";
 * import { assert, assertFalse } from "@std/assert";
 *
 * const s0 = parse("1.2.3");
 * const s1 = parse("1.2.4");
 * assert(lessThan(s0, s1));
 * assertFalse(lessThan(s1, s0));
 * assertFalse(lessThan(s0, s0));
 * ```
 *
 * @param s0 the first version to compare
 * @param s1 the second version to compare
 * @return `true` if `s0` is less than `s1`, `false` otherwise
 */
const lessThan = _function_lessThan
export { lessThan }
