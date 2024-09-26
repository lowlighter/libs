import type { InvertByResult as _typeAlias_InvertByResult } from "jsr:@std/collections@1.0.7/invert-by"
/**
 * Return type for {@linkcode invertBy}.
 */
type InvertByResult<T extends Record<PropertyKey, PropertyKey>, K extends keyof T> = _typeAlias_InvertByResult<T, K>
export type { InvertByResult }

import { invertBy as _function_invertBy } from "jsr:@std/collections@1.0.7/invert-by"
/**
 * Composes a new record with all keys and values inverted.
 *
 * The new record is generated from the result of running each element of the
 * input record through the given transformer function.
 *
 * The corresponding inverted value of each inverted key is an array of keys
 * responsible for generating the inverted value.
 *
 * @template R The type of the input record.
 * @template T The type of the iterator function.
 *
 * @param record The record to invert.
 * @param transformer The function to transform keys.
 *
 * @return A new record with all keys and values inverted.
 *
 * @example Basic usage
 * ```ts
 * import { invertBy } from "@std/collections/invert-by";
 * import { assertEquals } from "@std/assert";
 *
 * const record = { a: "x", b: "y", c: "z" };
 *
 * assertEquals(
 *   invertBy(record, (key) => String(key).toUpperCase()),
 *   { X: ["a"], Y: ["b"], Z: ["c"] }
 * );
 * ```
 */
const invertBy = _function_invertBy as typeof _function_invertBy
export { invertBy }
