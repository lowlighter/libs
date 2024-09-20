import { minWith as _function_minWith } from "jsr:@std/collections@1.0.6/min-with"
/**
 * Returns the first element having the smallest value according to the provided
 * comparator or undefined if there are no elements.
 *
 * @template T The type of the elements in the array.
 *
 * @param array The array to find the minimum element in.
 * @param comparator The function to compare elements.
 *
 * @return The first element that is the smallest value of the given function
 * or undefined if there are no elements.
 *
 * @example Basic usage
 * ```ts
 * import { minWith } from "@std/collections/min-with";
 * import { assertEquals } from "@std/assert";
 *
 * const people = ["Kim", "Anna", "John"];
 * const smallestName = minWith(people, (a, b) => a.length - b.length);
 *
 * assertEquals(smallestName, "Kim");
 * ```
 */
const minWith = _function_minWith as typeof _function_minWith
export { minWith }
