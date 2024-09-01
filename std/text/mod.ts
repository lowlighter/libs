/**
 * Utility functions for working with text.
 *
 * ```ts
 * import { toCamelCase, compareSimilarity } from "@std/text";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(toCamelCase("snake_case"), "snakeCase");
 *
 * const words = ["hi", "help", "hello"];
 *
 * // Words most similar to "hep" will be at the front
 * assertEquals(words.sort(compareSimilarity("hep")), ["help", "hi", "hello"]);
 * ```
 *
 * @module
 */
import { levenshteinDistance as _function_levenshteinDistance } from "jsr:@std/text@1.0.4"
/**
 * Calculates the
 * {@link https://en.wikipedia.org/wiki/Levenshtein_distance | Levenshtein distance}
 * between two strings.
 *
 * > [!NOTE]
 * > The complexity of this function is O(m * n), where m and n are the lengths
 * > of the two strings. It's recommended to limit the length and validate input
 * > if arbitrarily accepting input.
 *
 * @example Usage
 * ```ts
 * import { levenshteinDistance } from "@std/text/levenshtein-distance";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(levenshteinDistance("aa", "bb"), 2);
 * ```
 * @param str1 The first string.
 * @param str2 The second string.
 * @return The Levenshtein distance between the two strings.
 */
const levenshteinDistance = _function_levenshteinDistance as typeof _function_levenshteinDistance
export { levenshteinDistance }

import type { ClosestStringOptions as _interface_ClosestStringOptions } from "jsr:@std/text@1.0.4"
/**
 * Options for {@linkcode closestString}.
 */
interface ClosestStringOptions extends _interface_ClosestStringOptions {}
export type { ClosestStringOptions }

import { closestString as _function_closestString } from "jsr:@std/text@1.0.4"
/**
 * Finds the most similar string from an array of strings.
 *
 * By default, calculates the distance between words using the
 * {@link https://en.wikipedia.org/wiki/Levenshtein_distance | Levenshtein distance}.
 *
 * @example Usage
 * ```ts
 * import { closestString } from "@std/text/closest-string";
 * import { assertEquals } from "@std/assert";
 *
 * const possibleWords = ["length", "size", "blah", "help"];
 * const suggestion = closestString("hep", possibleWords);
 *
 * assertEquals(suggestion, "help");
 * ```
 *
 * @param givenWord The string to measure distance against
 * @param possibleWords The string-array to pick the closest string from
 * @param options The options for the comparison.
 * @return The closest string
 */
const closestString = _function_closestString as typeof _function_closestString
export { closestString }

import type { CompareSimilarityOptions as _interface_CompareSimilarityOptions } from "jsr:@std/text@1.0.4"
/**
 * Options for {@linkcode compareSimilarity}.
 */
interface CompareSimilarityOptions extends _interface_CompareSimilarityOptions {}
export type { CompareSimilarityOptions }

import { compareSimilarity as _function_compareSimilarity } from "jsr:@std/text@1.0.4"
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

import type { WordSimilaritySortOptions as _interface_WordSimilaritySortOptions } from "jsr:@std/text@1.0.4"
/**
 * Options for {@linkcode wordSimilaritySort}.
 */
interface WordSimilaritySortOptions extends _interface_WordSimilaritySortOptions {}
export type { WordSimilaritySortOptions }

import { wordSimilaritySort as _function_wordSimilaritySort } from "jsr:@std/text@1.0.4"
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

import { toCamelCase as _function_toCamelCase } from "jsr:@std/text@1.0.4"
/**
 * Converts a string into camelCase.
 *
 * @example Usage
 * ```ts
 * import { toCamelCase } from "@std/text/to-camel-case";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(toCamelCase("deno is awesome"),"denoIsAwesome");
 * ```
 *
 * @param input The string that is going to be converted into camelCase
 * @return The string as camelCase
 */
const toCamelCase = _function_toCamelCase as typeof _function_toCamelCase
export { toCamelCase }

import { toConstantCase as _function_toConstantCase } from "jsr:@std/text@1.0.4"
/**
 * Converts a string into CONSTANT_CASE (also known as SCREAMING_SNAKE_CASE).
 *
 * @experimental
 * @example Usage
 * ```ts
 * import { toConstantCase } from "@std/text/to-constant-case";
 * import { assertEquals } from "@std/assert/equals";
 *
 * assertEquals(toConstantCase("deno is awesome"), "DENO_IS_AWESOME");
 * ```
 *
 * @param input The string that is going to be converted into CONSTANT_CASE
 * @return The string as CONSTANT_CASE
 */
const toConstantCase = _function_toConstantCase as typeof _function_toConstantCase
export { toConstantCase }

import { toKebabCase as _function_toKebabCase } from "jsr:@std/text@1.0.4"
/**
 * Converts a string into kebab-case.
 *
 * @example Usage
 * ```ts
 * import { toKebabCase } from "@std/text/to-kebab-case";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(toKebabCase("deno is awesome"), "deno-is-awesome");
 * ```
 *
 * @param input The string that is going to be converted into kebab-case
 * @return The string as kebab-case
 */
const toKebabCase = _function_toKebabCase as typeof _function_toKebabCase
export { toKebabCase }

import { toPascalCase as _function_toPascalCase } from "jsr:@std/text@1.0.4"
/**
 * Converts a string into PascalCase.
 *
 * @example Usage
 * ```ts
 * import { toPascalCase } from "@std/text/to-pascal-case";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(toPascalCase("deno is awesome"), "DenoIsAwesome");
 * ```
 *
 * @param input The string that is going to be converted into PascalCase
 * @return The string as PascalCase
 */
const toPascalCase = _function_toPascalCase as typeof _function_toPascalCase
export { toPascalCase }

import { toSnakeCase as _function_toSnakeCase } from "jsr:@std/text@1.0.4"
/**
 * Converts a string into snake_case.
 *
 * @example Usage
 * ```ts
 * import { toSnakeCase } from "@std/text/to-snake-case";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(toSnakeCase("deno is awesome"), "deno_is_awesome");
 * ```
 *
 * @param input The string that is going to be converted into snake_case
 * @return The string as snake_case
 */
const toSnakeCase = _function_toSnakeCase as typeof _function_toSnakeCase
export { toSnakeCase }

import { slugify as _function_slugify } from "jsr:@std/text@1.0.4"
/**
 * Converts a string into a {@link https://en.wikipedia.org/wiki/Clean_URL#Slug | slug}.
 *
 * @experimental
 * @example Usage
 * ```ts
 * import { slugify } from "@std/text/slugify";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(slugify("hello world"), "hello-world");
 * assertEquals(slugify("déjà vu"), "deja-vu");
 * ```
 *
 * @param input The string that is going to be converted into a slug
 * @return The string as a slug
 */
const slugify = _function_slugify as typeof _function_slugify
export { slugify }
