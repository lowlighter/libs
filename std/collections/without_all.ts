import { withoutAll as _function_withoutAll } from "jsr:@std/collections@1.0.8/without-all"
/**
 * Returns an array excluding all given values.
 *
 * @template T The type of the array elements.
 *
 * @param array The array to exclude values from.
 * @param values The values to exclude from the array.
 *
 * @return A new array containing all elements from the given array except the
 * ones that are in the values array.
 *
 * @example Basic usage
 * ```ts
 * import { withoutAll } from "@std/collections/without-all";
 * import { assertEquals } from "@std/assert";
 *
 * const withoutList = withoutAll([2, 1, 2, 3], [1, 2]);
 *
 * assertEquals(withoutList, [3]);
 * ```
 */
const withoutAll = _function_withoutAll as typeof _function_withoutAll
export { withoutAll }
