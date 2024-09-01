import { weekOfYear as _function_weekOfYear } from "jsr:@std/datetime@0.225.1/week-of-year"
/**
 * Returns the ISO week number of the provided date (1-53).
 *
 * @param date Date to get the week number of.
 * @return The week number of the provided date.
 *
 * @example Basic usage
 * ```ts
 * import { weekOfYear } from "@std/datetime/week-of-year";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(weekOfYear(new Date("2020-12-28T03:24:00")), 53);
 *
 * assertEquals(weekOfYear(new Date("2020-07-10T03:24:00")), 28);
 * ```
 */
const weekOfYear = _function_weekOfYear as typeof _function_weekOfYear
export { weekOfYear }
