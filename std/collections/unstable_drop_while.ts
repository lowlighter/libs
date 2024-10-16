import { dropWhile as _function_dropWhile } from "jsr:@std/collections@1.0.8/unstable-drop-while"
/**
 * Returns an array that drops all elements in the given iterable until the
 * first element that does not match the given predicate.
 *
 * @experimental
 * @template T The type of the elements in the input array.
 *
 * @param array The iterable to drop elements from.
 * @param predicate The function to test each element for a condition.
 *
 * @return An array that drops all elements until the first element that
 * does not match the given predicate.
 *
 * @example Basic usage
 * ```ts
 * import { dropWhile } from "@std/collections/unstable-drop-while";
 * import { assertEquals } from "@std/assert";
 *
 * const numbers = [3, 2, 5, 2, 5];
 * const dropWhileNumbers = dropWhile(numbers, (number) => number !== 2);
 *
 * assertEquals(dropWhileNumbers, [2, 5, 2, 5]);
 * ```
 */
const dropWhile = _function_dropWhile as typeof _function_dropWhile
export { dropWhile }
