/**
 * Utilities for dealing with {@linkcode Date} objects.
 *
 * ```ts
 * import { dayOfYear, isLeap, difference, HOUR, MINUTE, SECOND } from "@std/datetime";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(dayOfYear(new Date("2019-03-11T03:24:00")), 70);
 * assertEquals(isLeap(1970), false);
 *
 * const date0 = new Date("2018-05-14");
 * const date1 = new Date("2020-05-13");
 * assertEquals(difference(date0, date1).years, 1);
 *
 * assertEquals(HOUR / MINUTE, 60);
 * assertEquals(MINUTE / SECOND, 60);
 * ```
 *
 * @module
 */
import { SECOND as _variable_SECOND } from "jsr:@std/datetime@0.225.1"
/**
 * The number of milliseconds in a second.
 *
 * @example ```ts
 * import { SECOND } from "@std/datetime/constants";
 *
 * SECOND; // 1_000
 * ```
 */
const SECOND = _variable_SECOND as typeof _variable_SECOND
export { SECOND }

import { MINUTE as _variable_MINUTE } from "jsr:@std/datetime@0.225.1"
/**
 * The number of milliseconds in a minute.
 *
 * @example ```ts
 * import { MINUTE } from "@std/datetime/constants";
 *
 * MINUTE; // 60_000
 * ```
 */
const MINUTE = _variable_MINUTE as typeof _variable_MINUTE
export { MINUTE }

import { HOUR as _variable_HOUR } from "jsr:@std/datetime@0.225.1"
/**
 * The number of milliseconds in an hour.
 *
 * @example ```ts
 * import { HOUR } from "@std/datetime/constants";
 *
 * HOUR; // 3_600_000
 * ```
 */
const HOUR = _variable_HOUR as typeof _variable_HOUR
export { HOUR }

import { DAY as _variable_DAY } from "jsr:@std/datetime@0.225.1"
/**
 * The number of milliseconds in a day.
 *
 * @example ```ts
 * import { DAY } from "@std/datetime/constants";
 *
 * DAY; // 86_400_000
 * ```
 */
const DAY = _variable_DAY as typeof _variable_DAY
export { DAY }

import { WEEK as _variable_WEEK } from "jsr:@std/datetime@0.225.1"
/**
 * The number of milliseconds in a week.
 *
 * @example ```ts
 * import { WEEK } from "@std/datetime/constants";
 *
 * WEEK; // 604_800_000
 * ```
 */
const WEEK = _variable_WEEK as typeof _variable_WEEK
export { WEEK }

import { dayOfYear as _function_dayOfYear } from "jsr:@std/datetime@0.225.1"
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

import { dayOfYearUtc as _function_dayOfYearUtc } from "jsr:@std/datetime@0.225.1"
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

import type { Unit as _typeAlias_Unit } from "jsr:@std/datetime@0.225.1"
/**
 * Duration units for {@linkcode DifferenceFormat} and
 * {@linkcode DifferenceOptions}.
 */
type Unit = _typeAlias_Unit
export type { Unit }

import type { DifferenceFormat as _typeAlias_DifferenceFormat } from "jsr:@std/datetime@0.225.1"
/**
 * Return type for {@linkcode difference}.
 */
type DifferenceFormat = _typeAlias_DifferenceFormat
export type { DifferenceFormat }

import type { DifferenceOptions as _typeAlias_DifferenceOptions } from "jsr:@std/datetime@0.225.1"
/**
 * Options for {@linkcode difference}.
 */
type DifferenceOptions = _typeAlias_DifferenceOptions
export type { DifferenceOptions }

import { difference as _function_difference } from "jsr:@std/datetime@0.225.1"
/**
 * Calculates the difference of the 2 given dates in various units. If the units
 * are omitted, it returns the difference in the all available units.
 *
 * @param from Year to calculate difference from.
 * @param to Year to calculate difference to.
 * @param options Options such as units to calculate difference in.
 * @return The difference of the 2 given dates in various units.
 *
 * @example Basic usage
 * ```ts
 * import { difference } from "@std/datetime/difference";
 * import { assertEquals } from "@std/assert";
 *
 * const date0 = new Date("2018-05-14");
 * const date1 = new Date("2020-05-13");
 *
 * assertEquals(difference(date0, date1), {
 *   milliseconds: 63072000000,
 *   seconds: 63072000,
 *   minutes: 1051200,
 *   hours: 17520,
 *   days: 730,
 *   weeks: 104,
 *   months: 23,
 *   quarters: 7,
 *   years: 1
 * });
 * ```
 *
 * @example Calculate difference in specific units
 *
 * The `units` option defines which units to calculate the difference in.
 *
 * ```ts
 * import { difference } from "@std/datetime/difference";
 * import { assertEquals } from "@std/assert";
 *
 * const date0 = new Date("2018-05-14");
 * const date1 = new Date("2020-05-13");
 *
 * const result = difference(date0, date1, { units: ["days", "months", "years"] });
 *
 * assertEquals(result, {
 *   days: 730,
 *   months: 23,
 *   years: 1
 * });
 * ```
 */
const difference = _function_difference as typeof _function_difference
export { difference }

import type { FormatOptions as _interface_FormatOptions } from "jsr:@std/datetime@0.225.1"
/**
 * Options for {@linkcode format}.
 */
interface FormatOptions extends _interface_FormatOptions {}
export type { FormatOptions }

import { format as _function_format } from "jsr:@std/datetime@0.225.1"
/**
 * Formats a date to a string with the specified format.
 *
 * The following symbols from
 * {@link https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table | unicode LDML}
 * are supported:
 * - `yyyy` - numeric year
 * - `yy` - 2-digit year
 * - `M` - numeric month
 * - `MM` - 2-digit month
 * - `d` - numeric day
 * - `dd` - 2-digit day
 * - `H` - numeric hour (0-23 hours)
 * - `HH` - 2-digit hour (00-23 hours)
 * - `h` - numeric hour (1-12 hours)
 * - `hh` - 2-digit hour (01-12 hours)
 * - `m` - numeric minute
 * - `mm` - 2-digit minute
 * - `s` - numeric second
 * - `ss` - 2-digit second
 * - `S` - 1-digit fractional second
 * - `SS` - 2-digit fractional second
 * - `SSS` - 3-digit fractional second
 * - `a` - dayPeriod, either `AM` or `PM`
 * - `'foo'` - quoted literal
 * - `./-` - unquoted literal
 *
 * @param date The date to be formatted.
 * @param formatString The date time string format.
 * @param options The options to customize the formatting of the date.
 * @return The formatted date string.
 *
 * @example Basic usage
 * ```ts no-eval
 * import { format } from "@std/datetime/format";
 * import { assertEquals } from "@std/assert";
 *
 * const date = new Date(2019, 0, 20, 16, 34, 23, 123);
 *
 * assertEquals(format(date, "dd-MM-yyyy"), "20-01-2019");
 *
 * assertEquals(format(date, "MM-dd-yyyy HH:mm:ss.SSS"), "01-20-2019 16:34:23.123");
 *
 * assertEquals(format(date, "'today:' yyyy-MM-dd"), "today: 2019-01-20");
 * ```
 *
 * @example UTC formatting
 *
 * Enable UTC formatting by setting the `utc` option to `true`.
 *
 * ```ts no-eval
 * import { format } from "@std/datetime/format";
 * import { assertEquals } from "@std/assert";
 *
 * const date = new Date(2019, 0, 20, 16, 34, 23, 123);
 *
 * assertEquals(format(date, "yyyy-MM-dd HH:mm:ss", { timeZone: "UTC" }), "2019-01-20 05:34:23");
 * ```
 */
const format = _function_format as typeof _function_format
export { format }

import { isLeap as _function_isLeap } from "jsr:@std/datetime@0.225.1"
/**
 * Returns whether the given year is a leap year. Passing in a
 * {@linkcode Date} object will return the leap year status of the year of that
 * object and take the current timezone into account. Passing in a number will
 * return the leap year status of that number.
 *
 * This is based on
 * {@link https://docs.microsoft.com/en-us/office/troubleshoot/excel/determine-a-leap-year}.
 *
 * @param year The year in number or `Date` format.
 * @return `true` if the given year is a leap year; `false` otherwise.
 *
 * @example Basic usage
 * ```ts
 * import { isLeap } from "@std/datetime/is-leap";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(isLeap(new Date("1970-01-02")), false);
 *
 * assertEquals(isLeap(1970), false);
 *
 * assertEquals(isLeap(new Date("1972-01-02")), true);
 *
 * assertEquals(isLeap(1972), true);
 * ```
 *
 * @example Accounting for timezones
 * ```ts no-assert
 * import { isLeap } from "@std/datetime/is-leap";
 *
 *  // True if the local timezone is GMT+0; false if the local timezone is GMT-1
 * isLeap(new Date("2000-01-01"));
 *
 * // True regardless of the local timezone
 * isLeap(2000);
 *
 * ```
 */
const isLeap = _function_isLeap as typeof _function_isLeap
export { isLeap }

import { isUtcLeap as _function_isUtcLeap } from "jsr:@std/datetime@0.225.1"
/**
 * Returns whether the given year is a leap year in UTC time. This always
 * returns the same value regardless of the local timezone.
 *
 * This is based on
 * {@link https://docs.microsoft.com/en-us/office/troubleshoot/excel/determine-a-leap-year}.
 *
 * @param year The year in number or `Date` format.
 * @return `true` if the given year is a leap year; `false` otherwise.
 *
 * @example Basic usage
 * ```ts
 * import { isUtcLeap } from "@std/datetime/is-leap";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(isUtcLeap(new Date("2000-01-01")), true);
 *
 * assertEquals(isUtcLeap(new Date("December 31, 1999 23:59:59 GMT-01:00")), true);
 *
 * assertEquals(isUtcLeap(2000), true);
 *
 * assertEquals(isUtcLeap(1999), false);
 * ```
 */
const isUtcLeap = _function_isUtcLeap as typeof _function_isUtcLeap
export { isUtcLeap }

import { parse as _function_parse } from "jsr:@std/datetime@0.225.1"
/**
 * Parses a date string using the specified format string.
 *
 * The following symbols from
 * {@link https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table | unicode LDML}
 * are supported:
 * - `yyyy` - numeric year
 * - `yy` - 2-digit year
 * - `M` - numeric month
 * - `MM` - 2-digit month
 * - `d` - numeric day
 * - `dd` - 2-digit day
 * - `H` - numeric hour (0-23 hours)
 * - `HH` - 2-digit hour (00-23 hours)
 * - `h` - numeric hour (1-12 hours)
 * - `hh` - 2-digit hour (01-12 hours)
 * - `m` - numeric minute
 * - `mm` - 2-digit minute
 * - `s` - numeric second
 * - `ss` - 2-digit second
 * - `S` - 1-digit fractional second
 * - `SS` - 2-digit fractional second
 * - `SSS` - 3-digit fractional second
 * - `a` - dayPeriod, either `AM` or `PM`
 * - `'foo'` - quoted literal
 * - `./-` - unquoted literal
 *
 * @param dateString The date string to parse.
 * @param formatString The date time string format.
 * @return The parsed date.
 *
 * @example Basic usage
 * ```ts
 * import { parse } from "@std/datetime/parse";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(parse("01-03-2019 16:30", "MM-dd-yyyy HH:mm"), new Date(2019, 0, 3, 16, 30));
 *
 * assertEquals(parse("01-03-2019 16:33:23.123", "MM-dd-yyyy HH:mm:ss.SSS"), new Date(2019, 0, 3, 16, 33, 23, 123));
 * ```
 */
const parse = _function_parse as typeof _function_parse
export { parse }

import { weekOfYear as _function_weekOfYear } from "jsr:@std/datetime@0.225.1"
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
