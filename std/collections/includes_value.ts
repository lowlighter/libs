import { includesValue as _function_includesValue } from "jsr:@std/collections@1.0.7/includes-value"
/**
 * Returns true if the given value is part of the given object, otherwise it
 * returns false.
 *
 * Note: this doesn't work with non-primitive values. For example,
 * `includesValue({x: {}}, {})` returns false.
 *
 * @template T The type of the values in the input record.
 *
 * @param record The record to check for the given value.
 * @param value The value to check for in the record.
 *
 * @return `true` if the value is part of the record, otherwise `false`.
 *
 * @example Basic usage
 * ```ts
 * import { includesValue } from "@std/collections/includes-value";
 * import { assertEquals } from "@std/assert";
 *
 * const input = {
 *   first: 33,
 *   second: 34,
 * };
 *
 * assertEquals(includesValue(input, 34), true);
 * ```
 */
const includesValue = _function_includesValue as typeof _function_includesValue
export { includesValue }
