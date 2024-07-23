import { lessOrEqual as _function_lessOrEqual } from "jsr:@std/semver@0.224.3/less-or-equal"
/**
 * Less than or equal to comparison
 *
 * This is equal to `compare(s0, s1) <= 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, lessOrEqual } from "@std/semver";
 * import { assert, assertFalse } from "@std/assert";
 *
 * const s0 = parse("1.2.3");
 * const s1 = parse("1.2.4");
 * assert(lessOrEqual(s0, s1));
 * assertFalse(lessOrEqual(s1, s0));
 * assert(lessOrEqual(s0, s0));
 * ```
 *
 * @param s0 the first version to compare
 * @param s1 the second version to compare
 * @return `true` if `s0` is less than or equal to `s1`, `false` otherwise
 */
const lessOrEqual = _function_lessOrEqual
export { lessOrEqual }
