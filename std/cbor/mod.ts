/**
 * ## Overview
 * Concise Binary Object Representation (CBOR) is a binary data serialisation
 * format optimised for compactness and efficiency. It is designed to encode a
 * wide range of data types, including integers, strings, arrays, and maps, in a
 * space-efficient manner.
 * [RFC 8949 - Concise Binary Object Representation (CBOR)](https://datatracker.ietf.org/doc/html/rfc8949)
 * spec.
 *
 * ## Limitations
 * - This implementation only supports the encoding and decoding of
 * "Text String" keys.
 * - This implementation encodes decimal numbers with 64 bits. It takes no
 * effort to figure out if the decimal can be encoded with 32 or 16 bits.
 * - When decoding, integers with a value below 2 ** 32 will be of type
 * {@link number}, with all larger integers being of type {@link bigint}.
 *
 * Functions and classes may have more specific limitations listed.
 *
 * ```ts
 * import { assert, assertEquals } from "@std/assert";
 * import { decodeCbor, encodeCbor } from "@std/cbor";
 *
 * const rawMessage = "I am a raw Message!";
 *
 * const encodedMessage = encodeCbor(rawMessage);
 * const decodedMessage = decodeCbor(encodedMessage);
 *
 * assert(typeof decodedMessage === "string");
 * assertEquals(decodedMessage, rawMessage);
 * ```
 *
 * @module
 */
import { CborArrayEncoderStream as _class_CborArrayEncoderStream } from "jsr:@std/cbor@0.1.1"
/**
 * A {@link TransformStream} that encodes a
 * {@link ReadableStream<CborStreamInput>} into CBOR "Indefinite Length Array".
 * [RFC 8949 - Concise Binary Object Representation (CBOR)](https://datatracker.ietf.org/doc/html/rfc8949)
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
class CborArrayEncoderStream extends _class_CborArrayEncoderStream {}
export { CborArrayEncoderStream }

import { CborByteEncoderStream as _class_CborByteEncoderStream } from "jsr:@std/cbor@0.1.1"
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

import { decodeCborSequence as _function_decodeCborSequence } from "jsr:@std/cbor@0.1.1"
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

import { decodeCbor as _function_decodeCbor } from "jsr:@std/cbor@0.1.1"
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

import { encodeCborSequence as _function_encodeCborSequence } from "jsr:@std/cbor@0.1.1"
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

import { encodeCbor as _function_encodeCbor } from "jsr:@std/cbor@0.1.1"
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

import { CborMapEncoderStream as _class_CborMapEncoderStream } from "jsr:@std/cbor@0.1.1"
/**
 * A {@link TransformStream} that encodes a
 * {@link ReadableStream<CborMapStreamInput>} into CBOR "Indefinite Length Map".
 * [RFC 8949 - Concise Binary Object Representation (CBOR)](https://datatracker.ietf.org/doc/html/rfc8949)
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
class CborMapEncoderStream extends _class_CborMapEncoderStream {}
export { CborMapEncoderStream }

import { CborArrayDecodedStream as _class_CborArrayDecodedStream } from "jsr:@std/cbor@0.1.1"
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

import { CborByteDecodedStream as _class_CborByteDecodedStream } from "jsr:@std/cbor@0.1.1"
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

import { CborMapDecodedStream as _class_CborMapDecodedStream } from "jsr:@std/cbor@0.1.1"
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

import { CborTextDecodedStream as _class_CborTextDecodedStream } from "jsr:@std/cbor@0.1.1"
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

import { CborSequenceDecoderStream as _class_CborSequenceDecoderStream } from "jsr:@std/cbor@0.1.1"
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

import { CborSequenceEncoderStream as _class_CborSequenceEncoderStream } from "jsr:@std/cbor@0.1.1"
/**
 * A {@link TransformStream} that encodes a
 * {@link ReadableStream<CborStreamInput>} into CBOR format sequence.
 * [RFC 8949 - Concise Binary Object Representation (CBOR)](https://datatracker.ietf.org/doc/html/rfc8949)
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
class CborSequenceEncoderStream extends _class_CborSequenceEncoderStream {}
export { CborSequenceEncoderStream }

import { CborTag as _class_CborTag } from "jsr:@std/cbor@0.1.1"
/**
 * Represents a CBOR tag, which pairs a tag number with content, used to convey
 * additional semantic information in CBOR-encoded data.
 * [CBOR Tags](https://www.iana.org/assignments/cbor-tags/cbor-tags.xhtml).
 *
 * @example Usage
 * ```ts
 * import { assert, assertEquals } from "@std/assert";
 * import { CborTag, decodeCbor, encodeCbor } from "@std/cbor";
 * import { decodeBase64Url, encodeBase64Url } from "@std/encoding";
 *
 * const rawMessage = new TextEncoder().encode("Hello World");
 *
 * const encodedMessage = encodeCbor(
 *   new CborTag(
 *     33, // TagNumber 33 specifies the tagContent must be a valid "base64url" "string".
 *     encodeBase64Url(rawMessage),
 *   ),
 * );
 *
 * const decodedMessage = decodeCbor(encodedMessage);
 *
 * assert(decodedMessage instanceof CborTag);
 * assert(typeof decodedMessage.tagContent === "string");
 * assertEquals(decodeBase64Url(decodedMessage.tagContent), rawMessage);
 * ```
 *
 * @template T The type of the tag's content, which can be a
 * {@link CborType}, {@link CborStreamInput}, or {@link CborStreamOutput}.
 */
class CborTag<T extends CborType | CborStreamInput | CborStreamOutput> extends _class_CborTag<T> {}
export { CborTag }

import { CborTextEncoderStream as _class_CborTextEncoderStream } from "jsr:@std/cbor@0.1.1"
/**
 * A {@link TransformStream} that encodes a {@link ReadableStream<string>} into
 * CBOR "Indefinite Length Text String".
 * [RFC 8949 - Concise Binary Object Representation (CBOR)](https://datatracker.ietf.org/doc/html/rfc8949)
 *
 * **Notice:** Each chunk of the {@link ReadableStream<string>} is encoded as
 * its own "Definite Length Text String" meaning space can be saved if large
 * chunks are pipped through instead of small chunks.
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
class CborTextEncoderStream extends _class_CborTextEncoderStream {}
export { CborTextEncoderStream }

import type { CborPrimitiveType as _typeAlias_CborPrimitiveType } from "jsr:@std/cbor@0.1.1"
/**
 * This type specifies the primitive types that the implementation can
 * encode/decode into/from.
 */
type CborPrimitiveType = _typeAlias_CborPrimitiveType
export type { CborPrimitiveType }

import type { CborType as _typeAlias_CborType } from "jsr:@std/cbor@0.1.1"
/**
 * This type specifies the encodable and decodable values for
 * {@link encodeCbor}, {@link decodeCbor}, {@link encodeCborSequence}, and
 * {@link decodeCborSequence}.
 */
type CborType = _typeAlias_CborType
export type { CborType }

import type { CborStreamInput as _typeAlias_CborStreamInput } from "jsr:@std/cbor@0.1.1"
/**
 * Specifies the encodable value types for the {@link CborSequenceEncoderStream}
 * and {@link CborArrayEncoderStream}.
 */
type CborStreamInput = _typeAlias_CborStreamInput
export type { CborStreamInput }

import type { CborMapStreamInput as _typeAlias_CborMapStreamInput } from "jsr:@std/cbor@0.1.1"
/**
 * Specifies the structure of input for the {@link CborMapEncoderStream}.
 */
type CborMapStreamInput = _typeAlias_CborMapStreamInput
export type { CborMapStreamInput }

import type { CborStreamOutput as _typeAlias_CborStreamOutput } from "jsr:@std/cbor@0.1.1"
/**
 * Specifies the decodable value types for the {@link CborSequenceDecoderStream}
 * and {@link CborMapDecodedStream}.
 */
type CborStreamOutput = _typeAlias_CborStreamOutput
export type { CborStreamOutput }

import type { CborMapStreamOutput as _typeAlias_CborMapStreamOutput } from "jsr:@std/cbor@0.1.1"
/**
 * Specifies the structure of the output for the {@link CborMapDecodedStream}.
 */
type CborMapStreamOutput = _typeAlias_CborMapStreamOutput
export type { CborMapStreamOutput }
