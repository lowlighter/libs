import { intersect as _function_intersect } from "jsr:@std/collections@1.0.8/unstable-intersect"
/**
 * Returns all distinct elements that appear at least once in each of the given
 * iterables.
 *
 * @experimental
 * @template T The type of the elements in the input iterables.
 *
 * @param iterables The iterables to intersect.
 *
 * @return An array of distinct elements that appear at least once in each of
 * the given iterables.
 *
 * @example Basic usage
 * ```ts
 * import { intersect } from "@std/collections/unstable-intersect";
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
