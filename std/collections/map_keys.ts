import { mapKeys as _function_mapKeys } from "jsr:@std/collections@1.0.5/map-keys"
/**
 * Applies the given transformer to all keys in the given record's entries and
 * returns a new record containing the transformed entries.
 *
 * If the transformed entries contain the same key multiple times, only the last
 * one will appear in the returned record.
 *
 * @template T The type of the values in the input record.
 *
 * @param record The record to map keys from.
 * @param transformer The function to transform each key.
 *
 * @return A new record with all keys transformed by the given transformer.
 *
 * @example Basic usage
 * ```ts
 * import { mapKeys } from "@std/collections/map-keys";
 * import { assertEquals } from "@std/assert";
 *
 * const counts = { a: 5, b: 3, c: 8 };
 *
 * assertEquals(
 *   mapKeys(counts, (key) => key.toUpperCase()),
 *   {
 *     A: 5,
 *     B: 3,
 *     C: 8,
 *   },
 * );
 * ```
 */
const mapKeys = _function_mapKeys as typeof _function_mapKeys
export { mapKeys }
