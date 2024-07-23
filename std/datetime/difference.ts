import type { Unit as _typeAlias_Unit } from "jsr:@std/datetime@0.224.3/difference"
/**
 * Duration units for {@linkcode DifferenceFormat} and
 * {@linkcode DifferenceOptions}.
 */
type Unit = _typeAlias_Unit
export type { Unit }

import type { DifferenceFormat as _typeAlias_DifferenceFormat } from "jsr:@std/datetime@0.224.3/difference"
/**
 * Return type for {@linkcode difference}.
 */
type DifferenceFormat = _typeAlias_DifferenceFormat
export type { DifferenceFormat }

import type { DifferenceOptions as _typeAlias_DifferenceOptions } from "jsr:@std/datetime@0.224.3/difference"
/**
 * Options for {@linkcode difference}.
 */
type DifferenceOptions = _typeAlias_DifferenceOptions
export type { DifferenceOptions }

import { difference as _function_difference } from "jsr:@std/datetime@0.224.3/difference"
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
const difference = _function_difference
export { difference }
