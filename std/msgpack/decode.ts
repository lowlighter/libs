import { decode as _function_decode } from "jsr:@std/msgpack@1.0.0/decode"
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
const decode = _function_decode
export { decode }
