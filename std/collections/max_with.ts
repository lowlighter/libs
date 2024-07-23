import { maxWith as _function_maxWith } from "jsr:@std/collections@1.0.5/max-with"
/**
 * Returns the first element having the largest value according to the provided
 * comparator or undefined if there are no elements.
 *
 * The comparator is expected to work exactly like one passed to `Array.sort`,
 * which means that `comparator(a, b)` should return a negative number if
 * `a < b`, a positive number if `a > b` and `0` if `a === b`.
 *
 * @template T The type of the elements in the array.
 *
 * @param array The array to find the maximum element in.
 * @param comparator The function to compare elements.
 *
 * @return The first element that is the largest value of the given function or
 * undefined if there are no elements.
 *
 * @example Basic usage
 * ```ts
 * import { maxWith } from "@std/collections/max-with";
 * import { assertEquals } from "@std/assert";
 *
 * const people = ["Kim", "Anna", "John", "Arthur"];
 * const largestName = maxWith(people, (a, b) => a.length - b.length);
 *
 * assertEquals(largestName, "Arthur");
 * ```
 */
const maxWith = _function_maxWith
export { maxWith }
