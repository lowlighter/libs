import { sample as _function_sample } from "jsr:@std/collections@1.0.7/unstable-sample"
/**
 * Returns a random element from the given iterable.
 *
 * @experimental
 * @template T The type of the elements in the iterable.
 *
 * @param array The iterable to sample from.
 *
 * @return A random element from the given iterable, or `undefined` if the iterable has no elements.
 *
 * @example Basic usage
 * ```ts
 * import { sample } from "@std/collections/unstable-sample";
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
