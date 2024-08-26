import { sample as _function_sample } from "jsr:@std/collections@1.0.5/sample"
/**
 * Returns a random element from the given array.
 *
 * @template T The type of the elements in the array.
 * @template O The type of the accumulator.
 *
 * @param array The array to sample from.
 *
 * @return A random element from the given array, or `undefined` if the array
 * is empty.
 *
 * @example Basic usage
 * ```ts
 * import { sample } from "@std/collections/sample";
 * import { assertArrayIncludes } from "@std/assert";
 *
 * const numbers = [1, 2, 3, 4];
 * const random = sample(numbers);
 *
 * assertArrayIncludes(numbers, [random]);
 * ```
 */
const sample = _function_sample as typeof _function_sample
export { sample }
