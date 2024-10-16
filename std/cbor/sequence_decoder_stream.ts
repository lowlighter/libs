import { CborArrayDecodedStream as _class_CborArrayDecodedStream } from "jsr:@std/cbor@0.1.1/sequence-decoder-stream"
/**
 * A {@link ReadableStream} that wraps the decoded CBOR "Array".
 * [RFC 8949 - Concise Binary Object Representation (CBOR)](https://datatracker.ietf.org/doc/html/rfc8949)
 *
 * Instances of this class is created from {@link CborSequenceDecoderStream}.
 * This class is not designed for you to create instances of it yourself. It is
 * merely a way for you to validate the type being returned.
 *
 * @example Usage
 * ```ts
 * import { assert, assertEquals } from "@std/assert";
 * import {
 *   CborArrayDecodedStream,
 *   CborArrayEncoderStream,
 *   CborSequenceDecoderStream,
 * } from "@std/cbor";
 *
 * const rawMessage = ["a".repeat(100), "b".repeat(100), "c".repeat(100)];
 *
 * for await (
 *   const value of ReadableStream.from(rawMessage)
 *     .pipeThrough(new CborArrayEncoderStream())
 *     .pipeThrough(new CborSequenceDecoderStream())
 * ) {
 *   assert(value instanceof CborArrayDecodedStream);
 *   let i = 0;
 *   for await (const text of value) {
 *     assert(typeof text === "string");
 *     assertEquals(text, rawMessage[i++]);
 *   }
 * }
 * ```
 */
class CborArrayDecodedStream extends _class_CborArrayDecodedStream {}
export { CborArrayDecodedStream }

import { CborByteDecodedStream as _class_CborByteDecodedStream } from "jsr:@std/cbor@0.1.1/sequence-decoder-stream"
/**
 * A {@link ReadableStream} that wraps the decoded CBOR "Byte String".
 * [RFC 8949 - Concise Binary Object Representation (CBOR)](https://datatracker.ietf.org/doc/html/rfc8949)
 *
 * Instances of this class is created from {@link CborSequenceDecoderStream}.
 * This class is not designed for you to create instances of it yourself. It is
 * merely a way for you to validate the type being returned.
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
class CborByteDecodedStream extends _class_CborByteDecodedStream {}
export { CborByteDecodedStream }

import { CborMapDecodedStream as _class_CborMapDecodedStream } from "jsr:@std/cbor@0.1.1/sequence-decoder-stream"
/**
 * A {@link ReadableStream} that wraps the decoded CBOR "Map".
 * [RFC 8949 - Concise Binary Object Representation (CBOR)](https://datatracker.ietf.org/doc/html/rfc8949)
 *
 * Instances of this class is created from {@link CborSequenceDecoderStream}.
 * This class is not designed for you to create instances of it yourself. It is
 * merely a way for you to validate the type being returned.
 *
 * @example Usage
 * ```ts
 * import { assert, assertEquals } from "@std/assert";
 * import {
 *   CborMapDecodedStream,
 *   CborMapEncoderStream,
 *   CborSequenceDecoderStream,
 * } from "@std/cbor";
 *
 * const rawMessage: Record<string, number> = {
 *   a: 0,
 *   b: 1,
 *   c: 2,
 *   d: 3,
 * };
 *
 * for await (
 *   const value of ReadableStream.from(Object.entries(rawMessage))
 *     .pipeThrough(new CborMapEncoderStream)
 *     .pipeThrough(new CborSequenceDecoderStream())
 * ) {
 *   assert(value instanceof CborMapDecodedStream);
 *   for await (const [k, v] of value) {
 *     assertEquals(rawMessage[k], v);
 *   }
 * }
 * ```
 */
class CborMapDecodedStream extends _class_CborMapDecodedStream {}
export { CborMapDecodedStream }

import { CborTextDecodedStream as _class_CborTextDecodedStream } from "jsr:@std/cbor@0.1.1/sequence-decoder-stream"
/**
 * A {@link ReadableStream} that wraps the decoded CBOR "Text String".
 * [RFC 8949 - Concise Binary Object Representation (CBOR)](https://datatracker.ietf.org/doc/html/rfc8949)
 *
 * Instances of this class is created from {@link CborSequenceDecoderStream}.
 * This class is not designed for you to create instances of it yourself. It is
 * merely a way for you to validate the type being returned.
 *
 * @example Usage
 * ```ts
 * import { assert, assertEquals } from "@std/assert";
 * import {
 *   CborSequenceDecoderStream,
 *   CborTextDecodedStream,
 *   CborTextEncoderStream,
 * } from "@std/cbor";
 *
 * const rawMessage = "a".repeat(100);
 *
 * for await (
 *   const value of ReadableStream.from([rawMessage])
 *     .pipeThrough(new CborTextEncoderStream())
 *     .pipeThrough(new CborSequenceDecoderStream())
 * ) {
 *   assert(typeof value === "string" || value instanceof CborTextDecodedStream);
 *   if (value instanceof CborTextDecodedStream) {
 *     assertEquals((await Array.fromAsync(value)).join(""), rawMessage);
 *   } else assertEquals(value, rawMessage);
 * }
 * ```
 */
class CborTextDecodedStream extends _class_CborTextDecodedStream {}
export { CborTextDecodedStream }

import { CborSequenceDecoderStream as _class_CborSequenceDecoderStream } from "jsr:@std/cbor@0.1.1/sequence-decoder-stream"
/**
 * A {@link TransformStream} that decodes a CBOR-sequence-encoded
 * {@link ReadableStream<Uint8Array>} into the JavaScript equivalent values
 * represented as {@link ReadableStream<CborStreamOutput>}.
 * [RFC 8949 - Concise Binary Object Representation (CBOR)](https://datatracker.ietf.org/doc/html/rfc8949)
 *
 * **Limitations:**
 * - While CBOR does support map keys of any type, this implementation only
 * supports map keys being of type {@link string}, and will throw if detected
 * decoding otherwise.
 * - This decoder does not validate that the encoded data is free of duplicate
 * map keys, and will serve them all. This behaviour differentiates from
 * {@link decodeCbor} and {@link decodeCborSequence}.
 * - Arrays and Maps will always be decoded as a {@link CborArrayDecodedStream}
 * and {@link CborMapDecodedStream}, respectively.
 * - "Byte Strings" and "Text Strings" will be decoded as a
 * {@link CborByteDecodedStream} and {@link CborTextDecodedStream},
 * respectively, if they are encoded as an "Indefinite Length String" or their
 * "Definite Length" is 2 ** 32 and 2 ** 16, respectively, or greater.
 *
 * **Notice:**
 * - This decoder handles the tag numbers 0, and 1 automatically, all
 * others returned are wrapped in a {@link CborTag<CborStreamOutput>} instance.
 * - If a parent stream yields {@link CborByteDecodedStream},
 * {@link CborTextDecodedStream}, {@link CborArrayDecodedStream},
 * {@link CborMapDecodedStream}, or {@link CborTag} (with any of these types as
 * content), it will not resolve the next chunk until the yielded stream is
 * fully consumed or canceled.
 *
 * @example Usage
 * ```ts no-assert
 * import { encodeBase64Url } from "@std/encoding";
 * import {
 *   CborArrayDecodedStream,
 *   CborArrayEncoderStream,
 *   CborByteDecodedStream,
 *   CborByteEncoderStream,
 *   CborMapDecodedStream,
 *   CborMapEncoderStream,
 *   type CborStreamOutput,
 *   CborSequenceDecoderStream,
 *   CborSequenceEncoderStream,
 *   CborTag,
 *   CborTextDecodedStream,
 *   CborTextEncoderStream,
 * } from "@std/cbor";
 *
 * const rawMessage = [
 *   undefined,
 *   null,
 *   true,
 *   false,
 *   3.14,
 *   5,
 *   2n ** 32n,
 *   "Hello World",
 *   new Uint8Array(25),
 *   new Date(),
 *   new CborTag(33, encodeBase64Url(new Uint8Array(7))),
 *   ["cake", "carrot"],
 *   { a: 3, b: "d" },
 *   CborByteEncoderStream.from([new Uint8Array(7)]),
 *   CborTextEncoderStream.from(["Bye!"]),
 *   CborArrayEncoderStream.from([
 *     "Hey!",
 *     CborByteEncoderStream.from([new Uint8Array(18)]),
 *   ]),
 *   CborMapEncoderStream.from([
 *     ["a", 0],
 *     ["b", "potato"],
 *   ]),
 * ];
 *
 * async function logValue(value: CborStreamOutput) {
 *   if (
 *     value instanceof CborByteDecodedStream ||
 *     value instanceof CborTextDecodedStream
 *   ) {
 *     for await (const x of value) console.log(x);
 *   } else if (value instanceof CborArrayDecodedStream) {
 *     for await (const x of value) logValue(x);
 *   } else if (value instanceof CborMapDecodedStream) {
 *     for await (const [k, v] of value) {
 *       console.log(k);
 *       logValue(v);
 *     }
 *   } else if (value instanceof CborTag) {
 *     console.log(value);
 *     logValue(value.tagContent);
 *   } else console.log(value);
 * }
 *
 * for await (
 *   const value of ReadableStream.from(rawMessage)
 *     .pipeThrough(new CborSequenceEncoderStream())
 *     .pipeThrough(new CborSequenceDecoderStream())
 * ) {
 *   logValue(value);
 * }
 * ```
 */
class CborSequenceDecoderStream extends _class_CborSequenceDecoderStream {}
export { CborSequenceDecoderStream }
