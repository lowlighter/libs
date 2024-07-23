import { dropWhile as _function_dropWhile } from "jsr:@std/collections@1.0.5/drop-while"
/**
 * Returns a new array that drops all elements in the given collection until the
 * first element that does not match the given predicate.
 *
 * @template T The type of the elements in the input array.
 *
 * @param array The array to drop elements from.
 * @param predicate The function to test each element for a condition.
 *
 * @return A new array that drops all elements until the first element that
 * does not match the given predicate.
 *
 * @example Basic usage
 * ```ts
 * import { dropWhile } from "@std/collections/drop-while";
 * import { assertEquals } from "@std/assert";
 *
 * const numbers = [3, 2, 5, 2, 5];
 * const dropWhileNumbers = dropWhile(numbers, (number) => number !== 2);
 *
 * assertEquals(dropWhileNumbers, [2, 5, 2, 5]);
 * ```
 */
const dropWhile = _function_dropWhile
export { dropWhile }
