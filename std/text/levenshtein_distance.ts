import { levenshteinDistance as _function_levenshteinDistance } from "jsr:@std/text@1.0.3/levenshtein-distance"
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
