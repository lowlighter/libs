import { partitionEntries as _function_partitionEntries } from "jsr:@std/collections@1.0.8/partition-entries"
/**
 * Returns a tuple of two records with the first one containing all entries of
 * the given record that match the given predicate and the second one containing
 * all that do not.
 *
 * @template T The type of the values in the record.
 *
 * @param record The record to partition.
 * @param predicate The predicate function to determine which entries go where.
 *
 * @return A tuple containing two records, the first one containing all entries
 * that match the predicate and the second one containing all that do not.
 *
 * @example Basic usage
 * ```ts
 * import { partitionEntries } from "@std/collections/partition-entries";
 * import { assertEquals } from "@std/assert";
 *
 * const menu = {
 *   Salad: 11,
 *   Soup: 8,
 *   Pasta: 13,
 * };
 * const myOptions = partitionEntries(
 *   menu,
 *   ([item, price]) => item !== "Pasta" && price < 10,
 * );
 *
 * assertEquals(
 *   myOptions,
 *   [
 *     { Soup: 8 },
 *     { Salad: 11, Pasta: 13 },
 *   ],
 * );
 * ```
 */
const partitionEntries = _function_partitionEntries as typeof _function_partitionEntries
export { partitionEntries }
