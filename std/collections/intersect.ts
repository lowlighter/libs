import { intersect as _function_intersect } from "jsr:@std/collections@1.0.7/intersect"
/**
 * Returns all distinct elements that appear at least once in each of the given
 * arrays.
 *
 * @template T The type of the elements in the input arrays.
 *
 * @param arrays The arrays to intersect.
 *
 * @return An array of distinct elements that appear at least once in each of
 * the given arrays.
 *
 * @example Basic usage
 * ```ts
 * import { intersect } from "@std/collections/intersect";
 * import { assertEquals } from "@std/assert";
 *
 * const lisaInterests = ["Cooking", "Music", "Hiking"];
 * const kimInterests = ["Music", "Tennis", "Cooking"];
 * const commonInterests = intersect(lisaInterests, kimInterests);
 *
 * assertEquals(commonInterests, ["Cooking", "Music"]);
 * ```
 */
const intersect = _function_intersect as typeof _function_intersect
export { intersect }
