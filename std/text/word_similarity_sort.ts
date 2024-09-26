import type { WordSimilaritySortOptions as _interface_WordSimilaritySortOptions } from "jsr:@std/text@1.0.7/word-similarity-sort"
/**
 * Options for {@linkcode wordSimilaritySort}.
 */
interface WordSimilaritySortOptions extends _interface_WordSimilaritySortOptions {}
export type { WordSimilaritySortOptions }

import { wordSimilaritySort as _function_wordSimilaritySort } from "jsr:@std/text@1.0.7/word-similarity-sort"
/**
 * Sorts a string-array by similarity to a given string.
 *
 * By default, calculates the distance between words using the
 * {@link https://en.wikipedia.org/wiki/Levenshtein_distance | Levenshtein distance}.
 *
 * @example Basic usage
 *
 * ```ts
 * import { wordSimilaritySort } from "@std/text/word-similarity-sort";
 * import { assertEquals } from "@std/assert";
 *
 * const possibleWords = ["length", "size", "blah", "help"];
 * const suggestions = wordSimilaritySort("hep", possibleWords);
 *
 * assertEquals(suggestions, ["help", "size", "blah", "length"]);
 * ```
 *
 * @example Case-sensitive sorting
 *
 * ```ts
 * import { wordSimilaritySort } from "@std/text/word-similarity-sort";
 * import { assertEquals } from "@std/assert";
 *
 * const possibleWords = ["length", "Size", "blah", "HELP"];
 * const suggestions = wordSimilaritySort("hep", possibleWords, { caseSensitive: true });
 *
 * assertEquals(suggestions, ["Size", "blah", "HELP", "length"]);
 * ```
 *
 * @param givenWord The string to measure distance against.
 * @param possibleWords The string-array that will be sorted. This array will
 * not be mutated, but the sorted copy will be returned.
 * @param options Options for the sort.
 * @return A sorted copy of `possibleWords`.
 */
const wordSimilaritySort = _function_wordSimilaritySort as typeof _function_wordSimilaritySort
export { wordSimilaritySort }
