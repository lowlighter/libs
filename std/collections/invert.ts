import type { InvertResult as _typeAlias_InvertResult } from "jsr:@std/collections@1.0.5/invert"
/**
 * Return type for {@linkcode invert}.
 */
type InvertResult<T extends Record<PropertyKey, PropertyKey>> = _typeAlias_InvertResult<T>
export type { InvertResult }

import { invert as _function_invert } from "jsr:@std/collections@1.0.5/invert"
/**
 * Composes a new record with all keys and values inverted.
 *
 * If the record contains duplicate values, subsequent values overwrite property
 * assignments of previous values. If the record contains values which aren't
 * {@linkcode PropertyKey}s their string representation is used as the key.
 *
 * @template T The type of the input record.
 *
 * @param record The record to invert.
 *
 * @return A new record with all keys and values inverted.
 *
 * @example Basic usage
 * ```ts
 * import { invert } from "@std/collections/invert";
 * import { assertEquals } from "@std/assert";
 *
 * const record = { a: "x", b: "y", c: "z" };
 *
 * assertEquals(invert(record), { x: "a", y: "b", z: "c" });
 * ```
 */
const invert = _function_invert as typeof _function_invert
export { invert }
