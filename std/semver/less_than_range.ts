import { lessThanRange as _function_lessThanRange } from "jsr:@std/semver@1.0.3/less-than-range"
/**
 * Check if the SemVer is less than the range.
 *
 * @example Usage
 * ```ts
 * import { parse, parseRange, lessThanRange } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.0.0");
 * const range = parseRange(">=1.2.3 <1.2.4");
 *
 * assert(!lessThanRange(version1, range));
 * assert(lessThanRange(version2, range));
 * ```
 *
 * @param version The version to check.
 * @param range The range to check against.
 * @return `true` if the SemVer is less than the range, `false` otherwise.
 */
const lessThanRange = _function_lessThanRange as typeof _function_lessThanRange
export { lessThanRange }
