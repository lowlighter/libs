import { permutations as _function_permutations } from "jsr:@std/collections@1.0.7/permutations"
/**
 * Builds all possible orders of all elements in the given array
 * Ignores equality of elements, meaning this will always return the same
 * number of permutations for a given length of input.
 *
 * @template T The type of the elements in the array.
 *
 * @param inputArray The array to build permutations from.
 *
 * @return An array of all possible permutations of the given array.
 *
 * @example Basic usage
 * ```ts
 * import { permutations } from "@std/collections/permutations";
 * import { assertEquals } from "@std/assert";
 *
 * const numbers = [ 1, 2 ];
 * const windows = permutations(numbers);
 *
 * assertEquals(windows, [
 *   [ 1, 2 ],
 *   [ 2, 1 ],
 * ]);
 * ```
 */
const permutations = _function_permutations as typeof _function_permutations
export { permutations }
