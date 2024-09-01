import { rangeIntersects as _function_rangeIntersects } from "jsr:@std/semver@1.0.2/range-intersects"
/**
 * The ranges intersect every range of AND comparators intersects with a least
 * one range of OR ranges.
 *
 * @example Usage
 * ```ts
 * import { parseRange, rangeIntersects } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const range1 = parseRange(">=1.0.0 <2.0.0");
 * const range2 = parseRange(">=1.0.0 <1.2.3");
 * const range3 = parseRange(">=1.2.3 <2.0.0");
 *
 * assert(rangeIntersects(range1, range2));
 * assert(rangeIntersects(range1, range3));
 * assert(!rangeIntersects(range2, range3));
 * ```
 *
 * @param range1 range 0
 * @param range2 range 1
 * @return returns true if the given ranges intersect, false otherwise
 */
const rangeIntersects = _function_rangeIntersects as typeof _function_rangeIntersects
export { rangeIntersects }
