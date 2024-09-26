import { filterKeys as _function_filterKeys } from "jsr:@std/collections@1.0.7/filter-keys"
/**
 * Returns a new record with all entries of the given record except the ones that
 * have a key that does not match the given predicate.
 *
 * @template T The type of the values in the input record.
 *
 * @param record The record to filter keys from.
 * @param predicate The function to test each key for a condition.
 *
 * @return A new record with all entries that have a key that matches the given
 * predicate.
 *
 * @example Basic usage
 * ```ts
 * import { filterKeys } from "@std/collections/filter-keys";
 * import { assertEquals } from "@std/assert";
 *
 * const menu = {
 *   Salad: 11,
 *   Soup: 8,
 *   Pasta: 13,
 * };
 *
 * const menuWithoutSalad = filterKeys(menu, (item) => item !== "Salad");
 *
 * assertEquals(
 *   menuWithoutSalad,
 *   {
 *     Soup: 8,
 *     Pasta: 13,
 *   },
 * );
 * ```
 */
const filterKeys = _function_filterKeys as typeof _function_filterKeys
export { filterKeys }
