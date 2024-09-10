import { dayOfYear as _function_dayOfYear } from "jsr:@std/datetime@0.225.2/day-of-year"
/**
 * Returns the number of the day in the year in the local time zone.
 *
 * @param date Date to get the day of the year of.
 * @return Number of the day in the year in the local time zone.
 *
 * @example Basic usage
 * ```ts
 * import { dayOfYear } from "@std/datetime/day-of-year";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(dayOfYear(new Date("2019-03-11T03:24:00")), 70);
 * ```
 */
const dayOfYear = _function_dayOfYear as typeof _function_dayOfYear
export { dayOfYear }

import { dayOfYearUtc as _function_dayOfYearUtc } from "jsr:@std/datetime@0.225.2/day-of-year"
/**
 * Returns the number of the day in the year in UTC time.
 *
 * @param date Date to get the day of the year of.
 * @return Number of the day in the year in UTC time.
 *
 * @example Usage
 * ```ts
 * import { dayOfYearUtc } from "@std/datetime/day-of-year";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(dayOfYearUtc(new Date("2019-03-11T03:24:00.000Z")), 70);
 * ```
 */
const dayOfYearUtc = _function_dayOfYearUtc as typeof _function_dayOfYearUtc
export { dayOfYearUtc }
