import { withoutAll as _function_withoutAll } from "jsr:@std/collections@1.0.8/unstable-without-all"
/**
 * Returns an array excluding all given values from an iterable.
 *
 * @experimental
 * @template T The type of the elements in the iterable.
 *
 * @param iterable The iterable to exclude values from.
 * @param values The values to exclude from the iterable.
 *
 * @return An array containing all elements from iterables except the
 * ones that are in the values iterable.
 *
 * @unsupported
 * @example Basic usage
 * ```ts
 * import { withoutAll } from "@std/collections/unstable-without-all";
 * import { assertEquals } from "@std/assert";
 *
 * const withoutList = withoutAll([2, 1, 2, 3], [1, 2]);
 *
 * assertEquals(withoutList, [3]);
 * ```
 */
const withoutAll = _function_withoutAll as typeof _function_withoutAll
export { withoutAll }
