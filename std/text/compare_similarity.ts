import type { CompareSimilarityOptions as _interface_CompareSimilarityOptions } from "jsr:@std/text@1.0.7/compare-similarity"
/**
 * Options for {@linkcode compareSimilarity}.
 */
interface CompareSimilarityOptions extends _interface_CompareSimilarityOptions {}
export type { CompareSimilarityOptions }

import { compareSimilarity as _function_compareSimilarity } from "jsr:@std/text@1.0.7/compare-similarity"
/**
 * Takes a string and generates a comparator function to determine which of two
 * strings is more similar to the given one.
 *
 * By default, calculates the distance between words using the
 * {@link https://en.wikipedia.org/wiki/Levenshtein_distance | Levenshtein distance}.
 *
 * @param givenWord The string to measure distance against.
 * @param options Options for the sort.
 * @return The difference in distance. This will be a negative number if `a`
 * is more similar to `givenWord` than `b`, a positive number if `b` is more
 * similar, or `0` if they are equally similar.
 *
 * @example Usage
 *
 * Most-similar words will be at the start of the array.
 *
 * ```ts
 * import { compareSimilarity } from "@std/text/compare-similarity";
 * import { assertEquals } from "@std/assert";
 *
 * const words = ["hi", "hello", "help"];
 * const sortedWords = words.toSorted(compareSimilarity("hep"));
 *
 * assertEquals(sortedWords, ["help", "hi", "hello"]);
 * ```
 */
const compareSimilarity = _function_compareSimilarity as typeof _function_compareSimilarity
export { compareSimilarity }
