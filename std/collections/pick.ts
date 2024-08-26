import { pick as _function_pick } from "jsr:@std/collections@1.0.5/pick"
/**
 * Creates a new object by including the specified keys from the provided
 * object.
 *
 * @template T The type of the object.
 * @template K The type of the keys.
 *
 * @param obj The object to pick keys from.
 * @param keys The keys to include in the new object.
 *
 * @return A new object with the specified keys from the provided object.
 *
 * @example Basic usage
 * ```ts
 * import { pick } from "@std/collections/pick";
 * import { assertEquals } from "@std/assert";
 *
 * const obj = { a: 5, b: 6, c: 7, d: 8 };
 * const picked = pick(obj, ["a", "c"]);
 *
 * assertEquals(picked, { a: 5, c: 7 });
 * ```
 */
const pick = _function_pick as typeof _function_pick
export { pick }
