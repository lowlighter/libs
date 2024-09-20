import { unzip as _function_unzip } from "jsr:@std/collections@1.0.6/unzip"
/**
 * Builds two separate arrays from the given array of 2-tuples, with the first
 * returned array holding all first tuple elements and the second one holding
 * all the second elements.
 *
 * @template T The type of the first tuple elements.
 * @template U The type of the second tuple elements.
 *
 * @param pairs The array of 2-tuples to unzip.
 *
 * @return A tuple containing two arrays, the first one holding all first tuple
 * elements and the second one holding all second elements.
 *
 * @example Basic usage
 * ```ts
 * import { unzip } from "@std/collections/unzip";
 * import { assertEquals } from "@std/assert";
 *
 * const parents = [
 *   ["Maria", "Jeff"],
 *   ["Anna", "Kim"],
 *   ["John", "Leroy"],
 * ] as [string, string][];
 *
 * const [moms, dads] = unzip(parents);
 *
 * assertEquals(moms, ["Maria", "Anna", "John"]);
 * assertEquals(dads, ["Jeff", "Kim", "Leroy"]);
 * ```
 */
const unzip = _function_unzip as typeof _function_unzip
export { unzip }
