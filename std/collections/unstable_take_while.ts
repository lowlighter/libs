import { takeWhile as _function_takeWhile } from "jsr:@std/collections@1.0.8/unstable-take-while"
/**
 * Returns all elements in the given collection until the first element that
 * does not match the given predicate.
 *
 * @experimental
 * @template T The type of the elements in the iterable.
 *
 * @param iterable The iterable to take elements from.
 * @param predicate The predicate function to determine if an element should be
 * included.
 *
 * @return An array containing all elements until the first element that
 * does not match the predicate.
 *
 * @example Basic usage
 * ```ts
 * import { takeWhile } from "@std/collections/take-while";
 * import { assertEquals } from "@std/assert";
 *
 * const numbers = [1, 2, 3, 4, 5, 6];
 *
 * const result = takeWhile(numbers, (number) => number < 4);
 *
 * assertEquals(result, [1, 2, 3]);
 * ```
 */
const takeWhile = _function_takeWhile as typeof _function_takeWhile
export { takeWhile }
