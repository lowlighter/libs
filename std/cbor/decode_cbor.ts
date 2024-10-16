import { decodeCbor as _function_decodeCbor } from "jsr:@std/cbor@0.1.1/decode-cbor"
/**
 * Decodes a CBOR-encoded {@link Uint8Array} into the JavaScript equivalent
 * values represented as a {@link CborType}.
 * [RFC 8949 - Concise Binary Object Representation (CBOR)](https://datatracker.ietf.org/doc/html/rfc8949)
 *
 * **Limitations:**
 * - While CBOR does support map keys of any type, this
 * implementation only supports map keys being of type {@link string}, and will
 * throw if detected decoding otherwise.
 * - This decoder will throw if duplicate map keys are detected. This behaviour
 * differentiates from {@link CborSequenceDecoderStream}.
 *
 * **Notice:** This decoder handles the tag numbers 0, and 1 automatically, all
 * others returned are wrapped in a {@link CborTag<CborType>} instance.
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
 * @param value The value to decode of type CBOR-encoded {@link Uint8Array}.
 * @return A {@link CborType} representing the decoded data.
 */
const decodeCbor = _function_decodeCbor as typeof _function_decodeCbor
export { decodeCbor }
