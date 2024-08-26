import { includesNeedle as _function_includesNeedle } from "jsr:@std/bytes@1.0.2/includes-needle"
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
const includesNeedle = _function_includesNeedle as typeof _function_includesNeedle
export { includesNeedle }
