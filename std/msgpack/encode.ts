import type { ValueType as _typeAlias_ValueType } from "jsr:@std/msgpack@1.0.0/encode"
/**
 * Value types that can be encoded to MessagePack.
 */
type ValueType = _typeAlias_ValueType
export type { ValueType }

import type { ValueMap as _interface_ValueMap } from "jsr:@std/msgpack@1.0.0/encode"
/**
 * Value map that can be encoded to MessagePack.
 */
interface ValueMap extends _interface_ValueMap {}
export type { ValueMap }

import { encode as _function_encode } from "jsr:@std/msgpack@1.0.0/encode"
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
