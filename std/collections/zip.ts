import { zip as _function_zip } from "jsr:@std/collections@1.0.5/zip"
/**
 * Builds N-tuples of elements from the given N arrays with matching indices,
 * stopping when the smallest array's end is reached.
 *
 * @template T the type of the tuples produced by this function.
 *
 * @param arrays The arrays to zip.
 *
 * @return A new array containing N-tuples of elements from the given arrays.
 *
 * @example Basic usage
 * ```ts
 * import { zip } from "@std/collections/zip";
 * import { assertEquals } from "@std/assert";
 *
 * const numbers = [1, 2, 3, 4];
 * const letters = ["a", "b", "c", "d"];
 * const pairs = zip(numbers, letters);
 *
 * assertEquals(
 *   pairs,
 *   [
 *     [1, "a"],
 *     [2, "b"],
 *     [3, "c"],
 *     [4, "d"],
 *   ],
 * );
 * ```
 */
const zip = _function_zip as typeof _function_zip
export { zip }
