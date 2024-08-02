import { greaterThanRange as _function_greaterThanRange } from "jsr:@std/semver@1.0.0/greater-than-range"
/**
 * Check if the SemVer is greater than the range.
 *
 * @example Usage
 * ```ts
 * import { parse, parseRange, greaterThanRange } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const v0 = parse("1.2.3");
 * const v1 = parse("1.2.4");
 * const range = parseRange(">=1.2.3 <1.2.4");
 *
 * assert(!greaterThanRange(v0, range));
 * assert(greaterThanRange(v1, range));
 * ```
 *
 * @param semver The version to check.
 * @param range The range to check against.
 * @return `true` if the semver is greater than the range, `false` otherwise.
 */
const greaterThanRange = _function_greaterThanRange
export { greaterThanRange }
