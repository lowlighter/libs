import { encodeCbor as _function_encodeCbor } from "jsr:@std/cbor@0.1.1/encode-cbor"
/**
 * Encodes a {@link CborType} value into a CBOR format represented as a
 * {@link Uint8Array}.
 * [RFC 8949 - Concise Binary Object Representation (CBOR)](https://datatracker.ietf.org/doc/html/rfc8949)
 *
 * @example Usage
 * ```ts
 * import { assert, assertEquals } from "@std/assert";
 * import { decodeCbor, encodeCbor } from "@std/cbor";
 *
 * const rawMessage = [
 *   "Hello World",
 *   35,
 *   0.5,
 *   false,
 *   -1,
 *   null,
 *   Uint8Array.from([0, 1, 2, 3]),
 * ];
 *
 * const encodedMessage = encodeCbor(rawMessage);
 * const decodedMessage = decodeCbor(encodedMessage);
 *
 * assert(decodedMessage instanceof Array);
 * assertEquals(decodedMessage, rawMessage);
 * ```
 *
 * @param value The value to encode of type {@link CborType}.
 * @return A {@link Uint8Array} representing the encoded data.
 */
const encodeCbor = _function_encodeCbor as typeof _function_encodeCbor
export { encodeCbor }
