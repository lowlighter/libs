import { filterEntries as _function_filterEntries } from "jsr:@std/collections@1.0.8/filter-entries"
/**
 * Returns a new record with all entries of the given record except the ones
 * that do not match the given predicate.
 *
 * @template T The type of the values in the input record.
 *
 * @param record The record to filter entries from.
 * @param predicate The function to test each entry for a condition.
 *
 * @return A new record with all entries that match the given predicate.
 *
 * @example Basic usage
 * ```ts
 * import { filterEntries } from "@std/collections/filter-entries";
 * import { assertEquals } from "@std/assert";
 *
 * const menu = {
 *   Salad: 11,
 *   Soup: 8,
 *   Pasta: 13,
 * };
 *
 * const myOptions = filterEntries(
 *   menu,
 *   ([item, price]) => item !== "Pasta" && price < 10,
 * );
 *
 * assertEquals(myOptions, { Soup: 8 });
 * ```
 */
const filterEntries = _function_filterEntries as typeof _function_filterEntries
export { filterEntries }
