import { distinct as _function_distinct } from "jsr:@std/collections@1.0.6/distinct"
/**
 * Returns all distinct elements in the given array, preserving order by first
 * occurrence.
 *
 * @template T The type of the elements in the input array.
 *
 * @param array The array to filter for distinct elements.
 *
 * @return An array of distinct elements in the input array.
 *
 * @example Basic usage
 * ```ts
 * import { distinct } from "@std/collections/distinct";
 * import { assertEquals } from "@std/assert";
 *
 * const numbers = [3, 2, 5, 2, 5];
 * const distinctNumbers = distinct(numbers);
 *
 * assertEquals(distinctNumbers, [3, 2, 5]);
 * ```
 */
const distinct = _function_distinct as typeof _function_distinct
export { distinct }
