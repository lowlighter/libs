import { formatRange as _function_formatRange } from "jsr:@std/semver@0.224.3/format-range"
/**
 * Formats the range into a string
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
 * @return A string representation of the range
 */
const formatRange = _function_formatRange
export { formatRange }
