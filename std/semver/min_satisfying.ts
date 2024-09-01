import { minSatisfying as _function_minSatisfying } from "jsr:@std/semver@1.0.2/min-satisfying"
/**
 * Returns the lowest SemVer in the list that satisfies the range, or `undefined` if
 * none of them do.
 *
 * @example Usage
 * ```ts
 * import { parse, parseRange, minSatisfying } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * const versions = ["0.2.0", "1.2.3", "1.3.0", "2.0.0", "2.1.0"].map(parse);
 * const range = parseRange(">=1.0.0 <2.0.0");
 *
 * assertEquals(minSatisfying(versions, range), parse("1.2.3"));
 * ```
 *
 * @param versions The versions to check.
 * @param range The range of possible versions to compare to.
 * @return The lowest version in versions that satisfies the range.
 */
const minSatisfying = _function_minSatisfying as typeof _function_minSatisfying
export { minSatisfying }
