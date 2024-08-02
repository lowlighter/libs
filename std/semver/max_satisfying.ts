import { maxSatisfying as _function_maxSatisfying } from "jsr:@std/semver@1.0.0/max-satisfying"
/**
 * Returns the highest SemVer in the list that satisfies the range, or `undefined`
 * if none of them do.
 *
 * @example Usage
 * ```ts
 * import { parse, parseRange, maxSatisfying } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * const versions = ["1.2.3", "1.2.4", "1.3.0", "2.0.0", "2.1.0"].map(parse);
 * const range = parseRange(">=1.0.0 <2.0.0");
 *
 * assertEquals(maxSatisfying(versions, range), parse("1.3.0"));
 * ```
 *
 * @param versions The versions to check.
 * @param range The range of possible versions to compare to.
 * @return The highest version in versions that satisfies the range.
 */
const maxSatisfying = _function_maxSatisfying
export { maxSatisfying }
