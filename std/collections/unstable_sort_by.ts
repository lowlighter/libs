import type { Order as _typeAlias_Order } from "jsr:@std/collections@1.0.8/unstable-sort-by"
/**
 * Order option for {@linkcode SortByOptions}.
 */
type Order = _typeAlias_Order
export type { Order }

import type { SortByOptions as _typeAlias_SortByOptions } from "jsr:@std/collections@1.0.8/unstable-sort-by"
/**
 * Options for {@linkcode sortBy}.
 */
type SortByOptions = _typeAlias_SortByOptions
export type { SortByOptions }

import type { Comparable as _typeAlias_Comparable } from "jsr:@std/collections@1.0.8/unstable-sort-by"
/**
 * Types that can be compared with other values of the same type
 * using comparison operators.
 */
type Comparable = _typeAlias_Comparable
export type { Comparable }

import { sortBy as _function_sortBy } from "jsr:@std/collections@1.0.8/unstable-sort-by"
/**
 * Returns all elements in the given collection, sorted by their result using
 * the given selector. The selector function is called only once for each
 * element. Ascending or descending order can be specified through the `order`
 * option. By default, the elements are sorted in ascending order.
 *
 * @experimental
 * @template T The type of the iterator elements.
 * @template U The type of the selected values.
 *
 * @param iterator The iterator to sort.
 * @param selector The selector function to get the value to sort by.
 * @param options The options for sorting.
 *
 * @return A new array containing all elements sorted by the selector.
 *
 * @example Usage with numbers
 * ```ts
 * import { sortBy } from "@std/collections/sort-by";
 * import { assertEquals } from "@std/assert";
 *
 * const people = [
 *   { name: "Anna", age: 34 },
 *   { name: "Kim", age: 42 },
 *   { name: "John", age: 23 },
 * ];
 * const sortedByAge = sortBy(people, (person) => person.age);
 *
 * assertEquals(sortedByAge, [
 *   { name: "John", age: 23 },
 *   { name: "Anna", age: 34 },
 *   { name: "Kim", age: 42 },
 * ]);
 *
 * const sortedByAgeDesc = sortBy(people, (person) => person.age, { order: "desc" });
 *
 * assertEquals(sortedByAgeDesc, [
 *   { name: "Kim", age: 42 },
 *   { name: "Anna", age: 34 },
 *   { name: "John", age: 23 },
 * ]);
 * ```
 *
 * @example Usage with strings
 * ```ts
 * import { sortBy } from "@std/collections/sort-by";
 * import { assertEquals } from "@std/assert";
 *
 * const people = [
 *   { name: "Anna" },
 *   { name: "Kim" },
 *   { name: "John" },
 * ];
 * const sortedByName = sortBy(people, (it) => it.name);
 *
 * assertEquals(sortedByName, [
 *   { name: "Anna" },
 *   { name: "John" },
 *   { name: "Kim" },
 * ]);
 * ```
 *
 * @example Usage with bigints
 * ```ts
 * import { sortBy } from "@std/collections/sort-by";
 * import { assertEquals } from "@std/assert";
 *
 * const people = [
 *   { name: "Anna", age: 34n },
 *   { name: "Kim", age: 42n },
 *   { name: "John", age: 23n },
 * ];
 *
 * const sortedByAge = sortBy(people, (person) => person.age);
 *
 * assertEquals(sortedByAge, [
 *   { name: "John", age: 23n },
 *   { name: "Anna", age: 34n },
 *   { name: "Kim", age: 42n },
 * ]);
 * ```
 *
 * @example Usage with Date objects
 * ```ts
 * import { sortBy } from "@std/collections/sort-by";
 * import { assertEquals } from "@std/assert";
 *
 * const people = [
 *   { name: "Anna", startedAt: new Date("2020-01-01") },
 *   { name: "Kim", startedAt: new Date("2020-03-01") },
 *   { name: "John", startedAt: new Date("2020-06-01") },
 * ];
 *
 * const sortedByStartedAt = sortBy(people, (people) => people.startedAt);
 *
 * assertEquals(sortedByStartedAt, [
 *   { name: "Anna", startedAt: new Date("2020-01-01") },
 *   { name: "Kim", startedAt: new Date("2020-03-01") },
 *   { name: "John", startedAt: new Date("2020-06-01") },
 * ]);
 * ```
 */
const sortBy = _function_sortBy as typeof _function_sortBy
export { sortBy }
