import { rangeIntersects as _function_rangeIntersects } from "jsr:@std/semver@0.224.3/range-intersects"
/**
 * The ranges intersect every range of AND comparators intersects with a least one range of OR ranges.
 *
 * @example Usage
 * ```ts
 * import { parseRange, rangeIntersects } from "@std/semver";
 * import { assert, assertFalse } from "@std/assert";
 *
 * const r0 = parseRange(">=1.0.0 <2.0.0");
 * const r1 = parseRange(">=1.0.0 <1.2.3");
 * const r2 = parseRange(">=1.2.3 <2.0.0");
 *
 * assert(rangeIntersects(r0, r1));
 * assert(rangeIntersects(r0, r2));
 * assertFalse(rangeIntersects(r1, r2));
 * ```
 *
 * @param r0 range 0
 * @param r1 range 1
 * @return returns true if the given ranges intersect, false otherwise
 */
const rangeIntersects = _function_rangeIntersects
export { rangeIntersects }
