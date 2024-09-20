import { union as _function_union } from "jsr:@std/collections@1.0.6/union"
/**
 * Returns all distinct elements that appear in any of the given arrays.
 *
 * @template T The type of the array elements.
 *
 * @param arrays The arrays to get the union of.
 *
 * @return A new array containing all distinct elements from the given arrays.
 *
 * @example Basic usage
 * ```ts
 * import { union } from "@std/collections/union";
 * import { assertEquals } from "@std/assert";
 *
 * const soupIngredients = ["Pepper", "Carrots", "Leek"];
 * const saladIngredients = ["Carrots", "Radicchio", "Pepper"];
 *
 * const shoppingList = union(soupIngredients, saladIngredients);
 *
 * assertEquals(shoppingList, ["Pepper", "Carrots", "Leek", "Radicchio"]);
 * ```
 */
const union = _function_union as typeof _function_union
export { union }
