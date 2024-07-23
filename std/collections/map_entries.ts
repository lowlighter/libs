import { mapEntries as _function_mapEntries } from "jsr:@std/collections@1.0.5/map-entries"
/**
 * Applies the given transformer to all entries in the given record and returns
 * a new record containing the results.
 *
 * @template T The type of the values in the input record.
 * @template O The type of the values in the output record.
 *
 * @param record The record to map entries from.
 * @param transformer The function to transform each entry.
 *
 * @return A new record with all entries transformed by the given transformer.
 *
 * @example Basic usage
 * ```ts
 * import { mapEntries } from "@std/collections/map-entries";
 * import { assertEquals } from "@std/assert";
 *
 * const usersById = {
 *   "a2e": { name: "Kim", age: 22 },
 *   "dfe": { name: "Anna", age: 31 },
 *   "34b": { name: "Tim", age: 58 },
 * };
 *
 * const agesByNames = mapEntries(usersById, ([id, { name, age }]) => [name, age]);
 *
 * assertEquals(
 *   agesByNames,
 *   {
 *     Kim: 22,
 *     Anna: 31,
 *     Tim: 58,
 *   },
 * );
 * ```
 */
const mapEntries = _function_mapEntries
export { mapEntries }
