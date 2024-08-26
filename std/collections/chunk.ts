import { chunk as _function_chunk } from "jsr:@std/collections@1.0.5/chunk"
/**
 * Splits the given array into chunks of the given size and returns them.
 *
 * @template T Type of the elements in the input array.
 *
 * @param array The array to split into chunks.
 * @param size The size of the chunks. This must be a positive integer.
 *
 * @return An array of chunks of the given size.
 *
 * @example Basic usage
 * ```ts
 * import { chunk } from "@std/collections/chunk";
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
