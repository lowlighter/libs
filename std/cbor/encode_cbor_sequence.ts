import { encodeCborSequence as _function_encodeCborSequence } from "jsr:@std/cbor@0.1.1/encode-cbor-sequence"
/**
 * Encodes an array of {@link CborType} values into a CBOR format sequence
 * represented as a {@link Uint8Array}.
 * [RFC 8949 - Concise Binary Object Representation (CBOR)](https://datatracker.ietf.org/doc/html/rfc8949)
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { decodeCborSequence, encodeCborSequence } from "@std/cbor";
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
 * const encodedMessage = encodeCborSequence(rawMessage);
 * const decodedMessage = decodeCborSequence(encodedMessage);
 *
 * assertEquals(decodedMessage, rawMessage);
 * ```
 *
 * @param values An array of values to encode of type {@link CborType}
 * @return A {@link Uint8Array} representing the encoded data.
 */
const encodeCborSequence = _function_encodeCborSequence as typeof _function_encodeCborSequence
export { encodeCborSequence }
