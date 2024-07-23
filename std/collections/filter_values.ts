import { filterValues as _function_filterValues } from "jsr:@std/collections@1.0.5/filter-values"
/**
 * Returns a new record with all entries of the given record except the ones
 * that have a value that does not match the given predicate.
 *
 * @template T The type of the values in the input record.
 *
 * @param record The record to filter values from.
 * @param predicate The function to test each value for a condition.
 *
 * @return A new record with all entries that have a value that matches the
 * given predicate.
 *
 * @example Basic usage
 * ```ts
 * import { filterValues } from "@std/collections/filter-values";
 * import { assertEquals } from "@std/assert";
 *
 * const people = {
 *   Arnold: 37,
 *   Sarah: 7,
 *   Kim: 23,
 * };
 * const adults = filterValues(people, (person) => person >= 18);
 *
 * assertEquals(
 *   adults,
 *   {
 *     Arnold: 37,
 *     Kim: 23,
 *   },
 * );
 * ```
 */
const filterValues = _function_filterValues
export { filterValues }
