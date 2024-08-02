import { formatRange as _function_formatRange } from "jsr:@std/semver@1.0.0/format-range"
/**
 * Formats the SemVerrange into a string.
 *
 * @example Usage
 * ```ts
 * import { formatRange, parseRange } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * const range = parseRange(">=1.2.3 <1.2.4");
 * assertEquals(formatRange(range), ">=1.2.3 <1.2.4");
 * ```
 *
 * @param range The range to format
 * @return A string representation of the SemVer range
 */
const formatRange = _function_formatRange
export { formatRange }
