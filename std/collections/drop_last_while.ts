import { dropLastWhile as _function_dropLastWhile } from "jsr:@std/collections@1.0.8/drop-last-while"
/**
 * Returns a new array that drops all elements in the given collection until the
 * last element that does not match the given predicate.
 *
 * @template T The type of the elements in the input array.
 *
 * @param array The array to drop elements from.
 * @param predicate The function to test each element for a condition.
 *
 * @return A new array that drops all elements until the last element that does
 * not match the given predicate.
 *
 * @example Basic usage
 * ```ts
 * import { dropLastWhile } from "@std/collections/drop-last-while";
 * import { assertEquals } from "@std/assert";
 *
 * const numbers = [11, 42, 55, 20, 33, 44];
 *
 * const notFortyFour = dropLastWhile(numbers, (number) => number > 30);
 *
 * assertEquals(notFortyFour, [11, 42, 55, 20]);
 * ```
 */
const dropLastWhile = _function_dropLastWhile as typeof _function_dropLastWhile
export { dropLastWhile }
