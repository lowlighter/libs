import { mapNotNullish as _function_mapNotNullish } from "jsr:@std/collections@1.0.7/map-not-nullish"
/**
 * Returns a new array, containing all elements in the given array transformed
 * using the given transformer, except the ones that were transformed to `null`
 * or `undefined`.
 *
 * @template T The type of the elements in the input array.
 * @template O The type of the elements in the output array.
 *
 * @param array The array to map elements from.
 * @param transformer The function to transform each element.
 *
 * @return A new array with all elements transformed by the given transformer,
 * except the ones that were transformed to `null` or `undefined`.
 *
 * @example Basic usage
 * ```ts
 * import { mapNotNullish } from "@std/collections/map-not-nullish";
 * import { assertEquals } from "@std/assert";
 *
 * const people = [
 *   { middleName: null },
 *   { middleName: "William" },
 *   { middleName: undefined },
 *   { middleName: "Martha" },
 * ];
 * const foundMiddleNames = mapNotNullish(people, (people) => people.middleName);
 *
 * assertEquals(foundMiddleNames, ["William", "Martha"]);
 * ```
 */
const mapNotNullish = _function_mapNotNullish as typeof _function_mapNotNullish
export { mapNotNullish }
