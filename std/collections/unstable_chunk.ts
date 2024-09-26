import { chunk as _function_chunk } from "jsr:@std/collections@1.0.7/unstable-chunk"
/**
 * Splits the given array into an array of chunks of the given size and returns them.
 *
 * @experimental
 * @template T The type of the elements in the iterable.
 *
 * @param iterable The iterable to take elements from.
 * @param predicate The size of the chunks. This must be a positive integer.
 *
 * @return An array of chunks of the given size.
 *
 * @example Basic usage
 * ```ts
 * import { chunk } from "@std/collections/unstable-chunk";
 * import { assertEquals } from "@std/assert";
 *
 * const words = [
 *   "lorem",
 *   "ipsum",
 *   "dolor",
 *   "sit",
 *   "amet",
 *   "consetetur",
 *   "sadipscing",
 * ];
 * const chunks = chunk(words, 3);
 *
 * assertEquals(
 *   chunks,
 *   [
 *     ["lorem", "ipsum", "dolor"],
 *     ["sit", "amet", "consetetur"],
 *     ["sadipscing"],
 *   ],
 * );
 * ```
 */
const chunk = _function_chunk as typeof _function_chunk
export { chunk }
