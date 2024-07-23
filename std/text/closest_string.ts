import type { ClosestStringOptions as _interface_ClosestStringOptions } from "jsr:@std/text@1.0.0/closest-string"
/**
 * Options for {@linkcode closestString}.
 */
interface ClosestStringOptions extends _interface_ClosestStringOptions {}
export type { ClosestStringOptions }

import { closestString as _function_closestString } from "jsr:@std/text@1.0.0/closest-string"
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
const closestString = _function_closestString
export { closestString }
