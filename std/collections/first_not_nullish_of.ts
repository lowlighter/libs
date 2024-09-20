import { firstNotNullishOf as _function_firstNotNullishOf } from "jsr:@std/collections@1.0.6/first-not-nullish-of"
/**
 * Applies the given selector to elements in the given array until a value is
 * produced that is neither `null` nor `undefined` and returns that value.
 * Returns `undefined` if no such value is produced.
 *
 * @template T The type of the elements in the input array.
 * @template O The type of the value produced by the selector function.
 *
 * @param array The array to select a value from.
 * @param selector The function to extract a value from an element.
 *
 * @return The first non-`null` and non-`undefined` value produced by the
 * selector function, or `undefined` if no such value is produced.
 *
 * @example Basic usage
 * ```ts
 * import { firstNotNullishOf } from "@std/collections/first-not-nullish-of";
 * import { assertEquals } from "@std/assert";
 *
 * const tables = [
 *   { number: 11, order: null },
 *   { number: 12, order: "Soup" },
 *   { number: 13, order: "Salad" },
 * ];
 *
 * const nextOrder = firstNotNullishOf(tables, (table) => table.order);
 *
 * assertEquals(nextOrder, "Soup");
 * ```
 */
const firstNotNullishOf = _function_firstNotNullishOf as typeof _function_firstNotNullishOf
export { firstNotNullishOf }
