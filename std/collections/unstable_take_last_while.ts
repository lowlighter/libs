import { takeLastWhile as _function_takeLastWhile } from "jsr:@std/collections@1.0.8/unstable-take-last-while"
/**
 * Returns all elements in the given iterable after the last element that does not
 * match the given predicate.
 *
 * @experimental
 * @template T The type of the iterable elements.
 *
 * @param iterable The iterable to take elements from.
 * @param predicate The predicate function to determine if an element should be
 * included.
 *
 * @return An array containing all elements after the last element that does
 * not match the predicate.
 *
 * @example Basic usage
 * ```ts
 * import { takeLastWhile } from "@std/collections/unstable-take-last-while";
 * import { assertEquals } from "@std/assert";
 *
 * const numbers = [1, 2, 3, 4, 5, 6];
 * const result = takeLastWhile(numbers, (number) => number > 4);
 * assertEquals(result, [5, 6]);
 * ```
 */
const takeLastWhile = _function_takeLastWhile as typeof _function_takeLastWhile
export { takeLastWhile }
