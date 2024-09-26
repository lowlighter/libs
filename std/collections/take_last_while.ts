import { takeLastWhile as _function_takeLastWhile } from "jsr:@std/collections@1.0.7/take-last-while"
/**
 * Returns all elements in the given array after the last element that does not
 * match the given predicate.
 *
 * @template T The type of the array elements.
 *
 * @param array The array to take elements from.
 * @param predicate The predicate function to determine if an element should be
 * included.
 *
 * @return A new array containing all elements after the last element that does
 * not match the predicate.
 *
 * @example Basic usage
 * ```ts
 * import { takeLastWhile } from "@std/collections/take-last-while";
 * import { assertEquals } from "@std/assert";
 *
 * const numbers = [1, 2, 3, 4, 5, 6];
 *
 * const result = takeLastWhile(numbers, (number) => number > 4);
 *
 * assertEquals(result, [5, 6]);
 * ```
 */
const takeLastWhile = _function_takeLastWhile as typeof _function_takeLastWhile
export { takeLastWhile }
