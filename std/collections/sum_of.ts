import { sumOf as _function_sumOf } from "jsr:@std/collections@1.0.7/sum-of"
/**
 * Applies the given selector to all elements in the given collection and
 * calculates the sum of the results.
 *
 * @template T The type of the array elements.
 *
 * @param array The array to calculate the sum of.
 * @param selector The selector function to get the value to sum.
 *
 * @return The sum of all elements in the collection.
 *
 * @example Basic usage
 * ```ts
 * import { sumOf } from "@std/collections/sum-of";
 * import { assertEquals } from "@std/assert";
 *
 * const people = [
 *   { name: "Anna", age: 34 },
 *   { name: "Kim", age: 42 },
 *   { name: "John", age: 23 },
 * ];
 *
 * const totalAge = sumOf(people, (person) => person.age);
 *
 * assertEquals(totalAge, 99);
 * ```
 */
const sumOf = _function_sumOf as typeof _function_sumOf
export { sumOf }
