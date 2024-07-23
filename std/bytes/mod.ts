/**
 * Helper functions for working with
 * {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array | Uint8Array}
 * byte slices.
 *
 * ```ts
 * import { concat, indexOfNeedle, endsWith } from "@std/bytes";
 * import { assertEquals } from "@std/assert";
 *
 * const a = new Uint8Array([0, 1, 2]);
 * const b = new Uint8Array([3, 4, 5]);
 *
 * const c = concat([a, b]);
 *
 * assertEquals(c, new Uint8Array([0, 1, 2, 3, 4, 5]));
 *
 * assertEquals(indexOfNeedle(c, new Uint8Array([2, 3])), 2);
 *
 * assertEquals(endsWith(c, b), true);
 * ```
 *
 * @module
 */
import { concat as _function_concat } from "jsr:@std/bytes@1.0.2"
/**
 * Concatenate an array of byte slices into a single slice.
 *
 * @param buffers Array of byte slices to concatenate.
 * @return A new byte slice containing all the input slices concatenated.
 *
 * @example Basic usage
 * ```ts
 * import { concat } from "@std/bytes/concat";
 * import { assertEquals } from "@std/assert";
 *
 * const a = new Uint8Array([0, 1, 2]);
 * const b = new Uint8Array([3, 4, 5]);
 *
 * assertEquals(concat([a, b]), new Uint8Array([0, 1, 2, 3, 4, 5]));
 * ```
 */
const concat = _function_concat
export { concat }

import { copy as _function_copy } from "jsr:@std/bytes@1.0.2"
/**
 * Copy bytes from the source array to the destination array and returns the
 * number of bytes copied.
 *
 * If the source array is larger than what the `dst` array can hold, only the
 * amount of bytes that fit in the `dst` array are copied.
 *
 * @param src Source array to copy from.
 * @param dst Destination array to copy to.
 * @param offset Offset in the destination array to start copying to. Defaults
 * to 0.
 * @return Number of bytes copied.
 *
 * @example Basic usage
 * ```ts
 * import { copy } from "@std/bytes/copy";
 * import { assertEquals } from "@std/assert";
 *
 * const src = new Uint8Array([9, 8, 7]);
 * const dst = new Uint8Array([0, 1, 2, 3, 4, 5]);
 *
 * assertEquals(copy(src, dst), 3);
 * assertEquals(dst, new Uint8Array([9, 8, 7, 3, 4, 5]));
 * ```
 *
 * @example Copy with offset
 * ```ts
 * import { copy } from "@std/bytes/copy";
 * import { assertEquals } from "@std/assert";
 *
 * const src = new Uint8Array([1, 1, 1, 1]);
 * const dst = new Uint8Array([0, 0, 0, 0]);
 *
 * assertEquals(copy(src, dst, 1), 3);
 * assertEquals(dst, new Uint8Array([0, 1, 1, 1]));
 * ```
 * Defining an offset will start copying at the specified index in the
 * destination array.
 */
const copy = _function_copy
export { copy }

import { endsWith as _function_endsWith } from "jsr:@std/bytes@1.0.2"
/**
 * Returns `true` if the suffix array appears at the end of the source array,
 * `false` otherwise.
 *
 * The complexity of this function is `O(suffix.length)`.
 *
 * @param source Source array to check.
 * @param suffix Suffix array to check for.
 * @return `true` if the suffix array appears at the end of the source array,
 * `false` otherwise.
 *
 * @example Basic usage
 * ```ts
 * import { endsWith } from "@std/bytes/ends-with";
 * import { assertEquals } from "@std/assert";
 *
 * const source = new Uint8Array([0, 1, 2, 1, 2, 1, 2, 3]);
 * const suffix = new Uint8Array([1, 2, 3]);
 *
 * assertEquals(endsWith(source, suffix), true);
 * ```
 */
const endsWith = _function_endsWith
export { endsWith }

import { equals as _function_equals } from "jsr:@std/bytes@1.0.2"
/**
 * Check whether byte slices are equal to each other.
 *
 * @param a First array to check equality.
 * @param b Second array to check equality.
 * @return `true` if the arrays are equal, `false` otherwise.
 *
 * @example Basic usage
 * ```ts
 * import { equals } from "@std/bytes/equals";
 * import { assertEquals } from "@std/assert";
 *
 * const a = new Uint8Array([1, 2, 3]);
 * const b = new Uint8Array([1, 2, 3]);
 * const c = new Uint8Array([4, 5, 6]);
 *
 * assertEquals(equals(a, b), true);
 * assertEquals(equals(a, c), false);
 * ```
 */
const equals = _function_equals
export { equals }

import { includesNeedle as _function_includesNeedle } from "jsr:@std/bytes@1.0.2"
/**
 * Determines whether the source array contains the needle array.
 *
 * The complexity of this function is `O(source.length * needle.length)`.
 *
 * @param source Source array to check.
 * @param needle Needle array to check for.
 * @param start Start index in the source array to begin the search. Defaults to
 * 0.
 * @return `true` if the source array contains the needle array, `false`
 * otherwise.
 *
 * @example Basic usage
 * ```ts
 * import { includesNeedle } from "@std/bytes/includes-needle";
 * import { assertEquals } from "@std/assert";
 *
 * const source = new Uint8Array([0, 1, 2, 1, 2, 1, 2, 3]);
 * const needle = new Uint8Array([1, 2]);
 *
 * assertEquals(includesNeedle(source, needle), true);
 * ```
 *
 * @example Start index
 * ```ts
 * import { includesNeedle } from "@std/bytes/includes-needle";
 * import { assertEquals } from "@std/assert";
 *
 * const source = new Uint8Array([0, 1, 2, 1, 2, 1, 2, 3]);
 * const needle = new Uint8Array([1, 2]);
 *
 * assertEquals(includesNeedle(source, needle, 3), true);
 * assertEquals(includesNeedle(source, needle, 6), false);
 * ```
 * The search will start at the specified index in the source array.
 */
const includesNeedle = _function_includesNeedle
export { includesNeedle }

import { indexOfNeedle as _function_indexOfNeedle } from "jsr:@std/bytes@1.0.2"
/**
 * Returns the index of the first occurrence of the needle array in the source
 * array, or -1 if it is not present.
 *
 * A start index can be specified as the third argument that begins the search
 * at that given index. The start index defaults to the start of the array.
 *
 * The complexity of this function is `O(source.length * needle.length)`.
 *
 * @param source Source array to check.
 * @param needle Needle array to check for.
 * @param start Start index in the source array to begin the search. Defaults to
 * 0.
 * @return Index of the first occurrence of the needle array in the source
 * array, or -1 if it is not present.
 *
 * @example Basic usage
 * ```ts
 * import { indexOfNeedle } from "@std/bytes/index-of-needle";
 * import { assertEquals } from "@std/assert";
 *
 * const source = new Uint8Array([0, 1, 2, 1, 2, 1, 2, 3]);
 * const needle = new Uint8Array([1, 2]);
 * const notNeedle = new Uint8Array([5, 0]);
 *
 * assertEquals(indexOfNeedle(source, needle), 1);
 * assertEquals(indexOfNeedle(source, notNeedle), -1);
 * ```
 *
 * @example Start index
 * ```ts
 * import { indexOfNeedle } from "@std/bytes/index-of-needle";
 * import { assertEquals } from "@std/assert";
 *
 * const source = new Uint8Array([0, 1, 2, 1, 2, 1, 2, 3]);
 * const needle = new Uint8Array([1, 2]);
 *
 * assertEquals(indexOfNeedle(source, needle, 2), 3);
 * assertEquals(indexOfNeedle(source, needle, 6), -1);
 * ```
 * Defining a start index will begin the search at the specified index in the
 * source array.
 */
const indexOfNeedle = _function_indexOfNeedle
export { indexOfNeedle }

import { lastIndexOfNeedle as _function_lastIndexOfNeedle } from "jsr:@std/bytes@1.0.2"
/**
 * Returns the index of the last occurrence of the needle array in the source
 * array, or -1 if it is not present.
 *
 * The complexity of this function is `O(source.length * needle.length)`.
 *
 * @param source Source array to check.
 * @param needle Needle array to check for.
 * @param start Start index in the source array to begin the search. Defaults to
 * `source.length - 1`.
 * @return Index of the last occurrence of the needle array in the source
 * array, or -1 if it is not present.
 *
 * @example Basic usage
 * ```ts
 * import { lastIndexOfNeedle } from "@std/bytes/last-index-of-needle";
 * import { assertEquals } from "@std/assert";
 *
 * const source = new Uint8Array([0, 1, 2, 1, 2, 1, 2, 3]);
 * const needle = new Uint8Array([1, 2]);
 * const notNeedle = new Uint8Array([5, 0]);
 *
 * assertEquals(lastIndexOfNeedle(source, needle), 5);
 * assertEquals(lastIndexOfNeedle(source, notNeedle), -1);
 * ```
 *
 * @example Start index
 * ```ts
 * import { lastIndexOfNeedle } from "@std/bytes/last-index-of-needle";
 * import { assertEquals } from "@std/assert";
 *
 * const source = new Uint8Array([0, 1, 2, 1, 2, 1, 2, 3]);
 * const needle = new Uint8Array([1, 2]);
 *
 * assertEquals(lastIndexOfNeedle(source, needle, 2), 1);
 * assertEquals(lastIndexOfNeedle(source, needle, 6), 5);
 * ```
 * Defining a start index will begin the search at the specified index in the
 * source array.
 */
const lastIndexOfNeedle = _function_lastIndexOfNeedle
export { lastIndexOfNeedle }

import { repeat as _function_repeat } from "jsr:@std/bytes@1.0.2"
/**
 * Returns a new byte slice composed of `count` repetitions of the `source`
 * array.
 *
 * @param source Source array to repeat.
 * @param count Number of times to repeat the source array.
 * @return A new byte slice composed of `count` repetitions of the `source`
 * array.
 *
 * @example Basic usage
 * ```ts
 * import { repeat } from "@std/bytes/repeat";
 * import { assertEquals } from "@std/assert";
 *
 * const source = new Uint8Array([0, 1, 2]);
 *
 * assertEquals(repeat(source, 3), new Uint8Array([0, 1, 2, 0, 1, 2, 0, 1, 2]));
 * ```
 *
 * @example Zero count
 * ```ts
 * import { repeat } from "@std/bytes/repeat";
 * import { assertEquals } from "@std/assert";
 *
 * const source = new Uint8Array([0, 1, 2]);
 *
 * assertEquals(repeat(source, 0), new Uint8Array());
 * ```
 */
const repeat = _function_repeat
export { repeat }

import { startsWith as _function_startsWith } from "jsr:@std/bytes@1.0.2"
/**
 * Returns `true` if the prefix array appears at the start of the source array,
 * `false` otherwise.
 *
 * The complexity of this function is `O(prefix.length)`.
 *
 * @param source Source array to check.
 * @param prefix Prefix array to check for.
 * @return `true` if the prefix array appears at the start of the source array,
 * `false` otherwise.
 *
 * @example Basic usage
 * ```ts
 * import { startsWith } from "@std/bytes/starts-with";
 * import { assertEquals } from "@std/assert";
 *
 * const source = new Uint8Array([0, 1, 2, 1, 2, 1, 2, 3]);
 * const prefix = new Uint8Array([0, 1, 2]);
 *
 * assertEquals(startsWith(source, prefix), true);
 * ```
 */
const startsWith = _function_startsWith
export { startsWith }
