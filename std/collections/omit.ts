import { omit as _function_omit } from "jsr:@std/collections@1.0.7/omit"
/**
 * Creates a new object by excluding the specified keys from the provided object.
 *
 * @template T The type of the object.
 * @template K The type of the keys to omit.
 *
 * @param obj The object to omit keys from.
 * @param keys The keys to omit from the object.
 *
 * @return A new object with the specified keys omitted.
 *
 * @example Basic usage
 * ```ts
 * import { omit } from "@std/collections/omit";
 * import { assertEquals } from "@std/assert";
 *
 * const obj = { a: 5, b: 6, c: 7, d: 8 };
 * const omitted = omit(obj, ["a", "c"]);
 *
 * assertEquals(omitted, { b: 6, d: 8 });
 * ```
 */
const omit = _function_omit as typeof _function_omit
export { omit }
