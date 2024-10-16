import { decodeCborSequence as _function_decodeCborSequence } from "jsr:@std/cbor@0.1.1/decode-cbor-sequence"
/**
 * Decodes a CBOR-sequence-encoded {@link Uint8Array} into the JavaScript
 * equivalent values represented as a {@link CBorType} array.
 * [RFC 8949 - Concise Binary Object Representation (CBOR)](https://datatracker.ietf.org/doc/html/rfc8949)
 *
 * **Limitations:**
 * - While CBOR does support map keys of any type, this implementation only
 * supports map keys being of type {@link string}, and will throw if detected
 * decoding otherwise.
 * - This decoder will throw an error if duplicate keys are detected.
 *
 * **Notice:** This decoder handles the tag numbers 0, and 1 automatically, all
 * others returned are wrapped in a {@link CborTag<CborType>} instance.
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
 * @param value The value to decode of type CBOR-sequence-encoded
 * {@link Uint8Array}.
 * @return A {@link CborType} array representing the decoded data.
 */
const decodeCborSequence = _function_decodeCborSequence as typeof _function_decodeCborSequence
export { decodeCborSequence }
