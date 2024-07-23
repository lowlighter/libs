import { distinctBy as _function_distinctBy } from "jsr:@std/collections@1.0.5/distinct-by"
/**
 * Returns all elements in the given array that produce a distinct value using
 * the given selector, preserving order by first occurrence.
 *
 * @template T The type of the elements in the input array.
 * @template D The type of the values produced by the selector function.
 *
 * @param array The array to filter for distinct elements.
 * @param selector The function to extract the value to compare for
 * distinctness.
 *
 * @return An array of distinct elements in the input array.
 *
 * @example Basic usage
 * ```ts
 * import { distinctBy } from "@std/collections/distinct-by";
 * import { assertEquals } from "@std/assert";
 *
 * const names = ["Anna", "Kim", "Arnold", "Kate"];
 * const exampleNamesByFirstLetter = distinctBy(names, (name) => name.charAt(0));
 *
 * assertEquals(exampleNamesByFirstLetter, ["Anna", "Kim"]);
 * ```
 */
const distinctBy = _function_distinctBy
export { distinctBy }
