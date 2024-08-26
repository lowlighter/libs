/**
 * This module provides functions to encode and decode MessagePack.
 *
 * MessagePack is an efficient binary serialization format that is language
 * agnostic. It is like JSON, but generally produces much smaller payloads.
 * {@link https://msgpack.org/ | Learn more about MessagePack}.
 *
 * ```ts
 * import { decode, encode } from "@std/msgpack";
 * import { assertEquals } from "@std/assert";
 *
 * const obj = {
 *   str: "deno",
 *   arr: [1, 2, 3],
 *   bool: true,
 *   nil: null,
 *   map: {
 *     foo: "bar"
 *   }
 * };
 *
 * const encoded = encode(obj);
 * assertEquals(encoded.length, 42);
 *
 * const decoded = decode(encoded);
 * assertEquals(decoded, obj);
 * ```
 *
 * MessagePack supports encoding and decoding the following types:
 *
 * - `number`
 * - `bigint`
 * - `string`
 * - `boolean`
 * - `null`
 * - `Uint8Array`
 * - arrays of values of these types
 * - objects with string or number keys, and values of these types
 *
 * @module
 */
import { decode as _function_decode } from "jsr:@std/msgpack@1.0.0"
/**
 * Decode a value from the {@link https://msgpack.org/ | MessagePack} binary format.
 *
 * If the input is not in valid message pack format, an error will be thrown.
 *
 * @example Usage
 * ```ts
 * import { decode } from "@std/msgpack/decode";
 * import { assertEquals } from "@std/assert";
 *
 * const encoded = new Uint8Array([163, 72, 105, 33]);
 *
 * assertEquals(decode(encoded), "Hi!");
 * ```
 *
 * @param data MessagePack binary data.
 * @return Decoded value from the MessagePack binary data.
 */
const decode = _function_decode as typeof _function_decode
export { decode }

import type { ValueType as _typeAlias_ValueType } from "jsr:@std/msgpack@1.0.0"
/**
 * Value types that can be encoded to MessagePack.
 */
type ValueType = _typeAlias_ValueType
export type { ValueType }

import type { ValueMap as _interface_ValueMap } from "jsr:@std/msgpack@1.0.0"
/**
 * Value map that can be encoded to MessagePack.
 */
interface ValueMap extends _interface_ValueMap {}
export type { ValueMap }

import { encode as _function_encode } from "jsr:@std/msgpack@1.0.0"
/**
 * Encode a value to {@link https://msgpack.org/ | MessagePack} binary format.
 *
 * @example Usage
 * ```ts
 * import { encode } from "@std/msgpack/encode";
 * import { assertEquals } from "@std/assert";
 *
 * const obj = {
 *   str: "deno",
 *   arr: [1, 2, 3],
 *   map: {
 *     foo: "bar"
 *   }
 * }
 *
 * const encoded = encode(obj);
 *
 * assertEquals(encoded.length, 31);
 * ```
 *
 * @param object Value to encode to MessagePack binary format.
 * @return Encoded MessagePack binary data.
 */
const encode = _function_encode as typeof _function_encode
export { encode }
