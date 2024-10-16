import { CborByteEncoderStream as _class_CborByteEncoderStream } from "jsr:@std/cbor@0.1.1/byte-encoder-stream"
/**
 * A {@link TransformStream} that encodes a {@link ReadableStream<Uint8Array>}
 * into CBOR "Indefinite Length Byte String".
 * [RFC 8949 - Concise Binary Object Representation (CBOR)](https://datatracker.ietf.org/doc/html/rfc8949)
 *
 * **Notice:** Each chunk of the {@link ReadableStream<Uint8Array>} is encoded
 * as its own "Definite Length Byte String" meaning space can be saved if large
 * chunks are pipped through instead of small chunks.
 *
 * @example Usage
 * ```ts
 * import { assert, assertEquals } from "@std/assert";
 * import { concat } from "@std/bytes";
 * import {
 *   CborByteDecodedStream,
 *   CborByteEncoderStream,
 *   CborSequenceDecoderStream,
 * } from "@std/cbor";
 *
 * const rawMessage = new Uint8Array(100);
 *
 * for await (
 *   const value of ReadableStream.from([rawMessage])
 *     .pipeThrough(new CborByteEncoderStream())
 *     .pipeThrough(new CborSequenceDecoderStream())
 * ) {
 *   assert(value instanceof Uint8Array || value instanceof CborByteDecodedStream);
 *   if (value instanceof CborByteDecodedStream) {
 *     assertEquals(concat(await Array.fromAsync(value)), new Uint8Array(100));
 *   } else assertEquals(value, new Uint8Array(100));
 * }
 * ```
 */
class CborByteEncoderStream extends _class_CborByteEncoderStream {}
export { CborByteEncoderStream }
