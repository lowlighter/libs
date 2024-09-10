/**
 * Utilities for encoding and decoding common formats like hex, base64, and varint.
 *
 * ```ts
 * import { encodeBase64, decodeBase64 } from "@std/encoding";
 * import { assertEquals } from "@std/assert";
 *
 * const foobar = new TextEncoder().encode("foobar");
 * assertEquals(encodeBase64(foobar), "Zm9vYmFy");
 * assertEquals(decodeBase64("Zm9vYmFy"), foobar);
 * ```
 *
 * @module
 */
import type { Ascii85Standard as _typeAlias_Ascii85Standard } from "jsr:@std/encoding@1.0.4"
/**
 * Supported ascii85 standards for {@linkcode EncodeAscii85Options} and
 * {@linkcode DecodeAscii85Options}.
 */
type Ascii85Standard = _typeAlias_Ascii85Standard
export type { Ascii85Standard }

import type { EncodeAscii85Options as _interface_EncodeAscii85Options } from "jsr:@std/encoding@1.0.4"
/**
 * Options for {@linkcode encodeAscii85}.
 */
interface EncodeAscii85Options extends _interface_EncodeAscii85Options {}
export type { EncodeAscii85Options }

import { encodeAscii85 as _function_encodeAscii85 } from "jsr:@std/encoding@1.0.4"
/**
 * Converts data into an ascii85-encoded string.
 *
 * @param data The data to encode.
 * @param options Options for encoding.
 *
 * @return The ascii85-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeAscii85 } from "@std/encoding/ascii85";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeAscii85("Hello world!"), "87cURD]j7BEbo80");
 * ```
 */
const encodeAscii85 = _function_encodeAscii85 as typeof _function_encodeAscii85
export { encodeAscii85 }

import type { DecodeAscii85Options as _typeAlias_DecodeAscii85Options } from "jsr:@std/encoding@1.0.4"
/**
 * Options for {@linkcode decodeAscii85}.
 */
type DecodeAscii85Options = _typeAlias_DecodeAscii85Options
export type { DecodeAscii85Options }

import { decodeAscii85 as _function_decodeAscii85 } from "jsr:@std/encoding@1.0.4"
/**
 * Decodes a ascii85-encoded string.
 *
 * @param ascii85 The ascii85-encoded string to decode.
 * @param options Options for decoding.
 * @return The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeAscii85 } from "@std/encoding/ascii85";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeAscii85("87cURD]j7BEbo80"),
 *   new TextEncoder().encode("Hello world!"),
 * );
 * ```
 */
const decodeAscii85 = _function_decodeAscii85 as typeof _function_decodeAscii85
export { decodeAscii85 }

import { decodeBase32 as _function_decodeBase32 } from "jsr:@std/encoding@1.0.4"
/**
 * Decodes a base32-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-6}
 *
 * @param b32 The base32-encoded string to decode.
 * @return The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeBase32 } from "@std/encoding/base32";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeBase32("GZRTMMDDGA======"),
 *   new TextEncoder().encode("6c60c0"),
 * );
 * ```
 */
const decodeBase32 = _function_decodeBase32 as typeof _function_decodeBase32
export { decodeBase32 }

import { encodeBase32 as _function_encodeBase32 } from "jsr:@std/encoding@1.0.4"
/**
 * Converts data into a base32-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-6}
 *
 * @param data The data to encode.
 * @return The base32-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeBase32 } from "@std/encoding/base32";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeBase32("6c60c0"), "GZRTMMDDGA======");
 * ```
 */
const encodeBase32 = _function_encodeBase32 as typeof _function_encodeBase32
export { encodeBase32 }

import { Base32EncoderStream as _class_Base32EncoderStream } from "jsr:@std/encoding@1.0.4"
/**
 * Converts a Uint8Array stream into a base32-encoded stream.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-6}
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { encodeBase32 } from "@std/encoding/base32";
 * import { Base32EncoderStream } from "@std/encoding/base32-stream";
 * import { toText } from "@std/streams/to-text";
 *
 * const stream = ReadableStream.from(["Hello,", " world!"])
 *   .pipeThrough(new TextEncoderStream())
 *   .pipeThrough(new Base32EncoderStream());
 *
 * assertEquals(await toText(stream), encodeBase32(new TextEncoder().encode("Hello, world!")));
 * ```
 */
class Base32EncoderStream extends _class_Base32EncoderStream {}
export { Base32EncoderStream }

import { Base32DecoderStream as _class_Base32DecoderStream } from "jsr:@std/encoding@1.0.4"
/**
 * Decodes a base32-encoded stream into a Uint8Array stream.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-6}
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { Base32DecoderStream } from "@std/encoding/base32-stream";
 * import { toText } from "@std/streams/to-text";
 *
 * const stream = ReadableStream.from(["JBSWY3DPEBLW64TMMQQQ===="])
 *   .pipeThrough(new Base32DecoderStream())
 *   .pipeThrough(new TextDecoderStream());
 *
 * assertEquals(await toText(stream), "Hello World!");
 * ```
 */
class Base32DecoderStream extends _class_Base32DecoderStream {}
export { Base32DecoderStream }

import { decodeBase32Hex as _function_decodeBase32Hex } from "jsr:@std/encoding@1.0.4"
/**
 * Decodes a base32hex-encoded string.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-7}
 *
 * @param b32 The base32hex-encoded string to decode.
 * @return The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeBase32Hex } from "@std/encoding/base32hex";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeBase32Hex("6PHJCC3360======"),
 *   new TextEncoder().encode("6c60c0"),
 * );
 * ```
 */
const decodeBase32Hex = _function_decodeBase32Hex as typeof _function_decodeBase32Hex
export { decodeBase32Hex }

import { encodeBase32Hex as _function_encodeBase32Hex } from "jsr:@std/encoding@1.0.4"
/**
 * Converts data into a base32hex-encoded string.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-7}
 *
 * @param data The data to encode.
 * @return The base32hex-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeBase32Hex } from "@std/encoding/base32hex";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeBase32Hex("6c60c0"), "6PHJCC3360======");
 * ```
 */
const encodeBase32Hex = _function_encodeBase32Hex as typeof _function_encodeBase32Hex
export { encodeBase32Hex }

import { Base32HexEncoderStream as _class_Base32HexEncoderStream } from "jsr:@std/encoding@1.0.4"
/**
 * Converts a Uint8Array stream into a base32hex-encoded stream.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-6}
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { encodeBase32Hex } from "@std/encoding/base32hex";
 * import { Base32HexEncoderStream } from "@std/encoding/base32hex-stream";
 * import { toText } from "@std/streams/to-text";
 *
 * const stream = ReadableStream.from(["Hello,", " world!"])
 *   .pipeThrough(new TextEncoderStream())
 *   .pipeThrough(new Base32HexEncoderStream());
 *
 * assertEquals(await toText(stream), encodeBase32Hex(new TextEncoder().encode("Hello, world!")));
 * ```
 */
class Base32HexEncoderStream extends _class_Base32HexEncoderStream {}
export { Base32HexEncoderStream }

import { Base32HexDecoderStream as _class_Base32HexDecoderStream } from "jsr:@std/encoding@1.0.4"
/**
 * Decodes a base32hex-encoded stream into a Uint8Array stream.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-6}
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { Base32HexDecoderStream } from "@std/encoding/base32hex-stream";
 * import { toText } from "@std/streams/to-text";
 *
 * const stream = ReadableStream.from(["91IMOR3F5GG7ERRI", "DHI22==="])
 *   .pipeThrough(new Base32HexDecoderStream())
 *   .pipeThrough(new TextDecoderStream());
 *
 * assertEquals(await toText(stream), "Hello, world!");
 * ```
 */
class Base32HexDecoderStream extends _class_Base32HexDecoderStream {}
export { Base32HexDecoderStream }

import { encodeBase58 as _function_encodeBase58 } from "jsr:@std/encoding@1.0.4"
/**
 * Converts data into a base58-encoded string.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/draft-msporny-base58-03#section-3}
 *
 * @param data The data to encode.
 * @return The base58-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeBase58 } from "@std/encoding/base58";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeBase58("Hello World!"), "2NEpo7TZRRrLZSi2U");
 * ```
 */
const encodeBase58 = _function_encodeBase58 as typeof _function_encodeBase58
export { encodeBase58 }

import { decodeBase58 as _function_decodeBase58 } from "jsr:@std/encoding@1.0.4"
/**
 * Decodes a base58-encoded string.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/draft-msporny-base58-03#section-4}
 *
 * @param b58 The base58-encoded string to decode.
 * @return The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeBase58 } from "@std/encoding/base58";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeBase58("2NEpo7TZRRrLZSi2U"),
 *   new TextEncoder().encode("Hello World!")
 * );
 * ```
 */
const decodeBase58 = _function_decodeBase58 as typeof _function_decodeBase58
export { decodeBase58 }

import { encodeBase64 as _function_encodeBase64 } from "jsr:@std/encoding@1.0.4"
/**
 * Converts data into a base64-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-4}
 *
 * @param data The data to encode.
 * @return The base64-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeBase64 } from "@std/encoding/base64";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeBase64("foobar"), "Zm9vYmFy");
 * ```
 */
const encodeBase64 = _function_encodeBase64 as typeof _function_encodeBase64
export { encodeBase64 }

import { decodeBase64 as _function_decodeBase64 } from "jsr:@std/encoding@1.0.4"
/**
 * Decodes a base64-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-4}
 *
 * @param b64 The base64-encoded string to decode.
 * @return The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeBase64 } from "@std/encoding/base64";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeBase64("Zm9vYmFy"),
 *   new TextEncoder().encode("foobar")
 * );
 * ```
 */
const decodeBase64 = _function_decodeBase64 as typeof _function_decodeBase64
export { decodeBase64 }

import { Base64EncoderStream as _class_Base64EncoderStream } from "jsr:@std/encoding@1.0.4"
/**
 * Converts a Uint8Array stream into a base64-encoded stream.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-4}
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { encodeBase64 } from "@std/encoding/base64";
 * import { Base64EncoderStream } from "@std/encoding/base64-stream";
 * import { toText } from "@std/streams/to-text";
 *
 * const stream = ReadableStream.from(["Hello,", " world!"])
 *   .pipeThrough(new TextEncoderStream())
 *   .pipeThrough(new Base64EncoderStream());
 *
 * assertEquals(await toText(stream), encodeBase64(new TextEncoder().encode("Hello, world!")));
 * ```
 */
class Base64EncoderStream extends _class_Base64EncoderStream {}
export { Base64EncoderStream }

import { Base64DecoderStream as _class_Base64DecoderStream } from "jsr:@std/encoding@1.0.4"
/**
 * Decodes a base64-encoded stream into a Uint8Array stream.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-4}
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { Base64DecoderStream } from "@std/encoding/base64-stream";
 * import { toText } from "@std/streams/to-text";
 *
 * const stream = ReadableStream.from(["SGVsbG8s", "IHdvcmxkIQ=="])
 *   .pipeThrough(new Base64DecoderStream())
 *   .pipeThrough(new TextDecoderStream());
 *
 * assertEquals(await toText(stream), "Hello, world!");
 * ```
 */
class Base64DecoderStream extends _class_Base64DecoderStream {}
export { Base64DecoderStream }

import { encodeBase64Url as _function_encodeBase64Url } from "jsr:@std/encoding@1.0.4"
/**
 * Convert data into a base64url-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-5}
 *
 * @param data The data to encode.
 * @return The base64url-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeBase64Url } from "@std/encoding/base64url";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeBase64Url("foobar"), "Zm9vYmFy");
 * ```
 */
const encodeBase64Url = _function_encodeBase64Url as typeof _function_encodeBase64Url
export { encodeBase64Url }

import { decodeBase64Url as _function_decodeBase64Url } from "jsr:@std/encoding@1.0.4"
/**
 * Decodes a given base64url-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-5}
 *
 * @param b64url The base64url-encoded string to decode.
 * @return The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeBase64Url } from "@std/encoding/base64url";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeBase64Url("Zm9vYmFy"),
 *   new TextEncoder().encode("foobar")
 * );
 * ```
 */
const decodeBase64Url = _function_decodeBase64Url as typeof _function_decodeBase64Url
export { decodeBase64Url }

import { Base64UrlEncoderStream as _class_Base64UrlEncoderStream } from "jsr:@std/encoding@1.0.4"
/**
 * Converts a Uint8Array stream into a base64url-encoded stream.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-5}
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { encodeBase64Url } from "@std/encoding/base64url";
 * import { Base64UrlEncoderStream } from "@std/encoding/base64url-stream";
 * import { toText } from "@std/streams/to-text";
 *
 * const stream = ReadableStream.from(["Hello,", " world!"])
 *   .pipeThrough(new TextEncoderStream())
 *   .pipeThrough(new Base64UrlEncoderStream());
 *
 * assertEquals(await toText(stream), encodeBase64Url(new TextEncoder().encode("Hello, world!")));
 * ```
 */
class Base64UrlEncoderStream extends _class_Base64UrlEncoderStream {}
export { Base64UrlEncoderStream }

import { Base64UrlDecoderStream as _class_Base64UrlDecoderStream } from "jsr:@std/encoding@1.0.4"
/**
 * Decodes a base64url-encoded stream into a Uint8Array stream.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-5}
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { encodeBase64Url } from "@std/encoding/base64url";
 * import { Base64UrlDecoderStream } from "@std/encoding/base64url-stream";
 * import { toText } from "@std/streams/to-text";
 *
 * const stream = ReadableStream.from(["SGVsbG8s", "IHdvcmxkIQ"])
 *   .pipeThrough(new Base64UrlDecoderStream())
 *   .pipeThrough(new TextDecoderStream());
 *
 * assertEquals(await toText(stream), "Hello, world!");
 * ```
 */
class Base64UrlDecoderStream extends _class_Base64UrlDecoderStream {}
export { Base64UrlDecoderStream }

import { encodeHex as _function_encodeHex } from "jsr:@std/encoding@1.0.4"
/**
 * Converts data into a hex-encoded string.
 *
 * @param src The data to encode.
 *
 * @return The hex-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeHex } from "@std/encoding/hex";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeHex("abc"), "616263");
 * ```
 */
const encodeHex = _function_encodeHex as typeof _function_encodeHex
export { encodeHex }

import { decodeHex as _function_decodeHex } from "jsr:@std/encoding@1.0.4"
/**
 * Decodes the given hex-encoded string. If the input is malformed, an error is
 * thrown.
 *
 * @param src The hex-encoded string to decode.
 *
 * @return The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeHex } from "@std/encoding/hex";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeHex("616263"),
 *   new TextEncoder().encode("abc"),
 * );
 * ```
 */
const decodeHex = _function_decodeHex as typeof _function_decodeHex
export { decodeHex }

import { HexEncoderStream as _class_HexEncoderStream } from "jsr:@std/encoding@1.0.4"
/**
 * Converts a Uint8Array stream into a hex-encoded stream.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-8}
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { encodeHex } from "@std/encoding/hex";
 * import { HexEncoderStream } from "@std/encoding/hex-stream";
 * import { toText } from "@std/streams/to-text";
 *
 * const stream = ReadableStream.from(["Hello,", " world!"])
 *   .pipeThrough(new TextEncoderStream())
 *   .pipeThrough(new HexEncoderStream());
 *
 * assertEquals(await toText(stream), encodeHex(new TextEncoder().encode("Hello, world!")));
 * ```
 */
class HexEncoderStream extends _class_HexEncoderStream {}
export { HexEncoderStream }

import { HexDecoderStream as _class_HexDecoderStream } from "jsr:@std/encoding@1.0.4"
/**
 * Decodes a hex-encoded stream into a Uint8Array stream.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-8}
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { HexDecoderStream } from "@std/encoding/hex-stream";
 * import { toText } from "@std/streams/to-text";
 *
 * const stream = ReadableStream.from(["48656c6c6f2c", "20776f726c6421"])
 *   .pipeThrough(new HexDecoderStream())
 *   .pipeThrough(new TextDecoderStream());
 *
 * assertEquals(await toText(stream), "Hello, world!");
 * ```
 */
class HexDecoderStream extends _class_HexDecoderStream {}
export { HexDecoderStream }

import { MaxUint64 as _variable_MaxUint64 } from "jsr:@std/encoding@1.0.4"
/**
 * The maximum value of an unsigned 64-bit integer.
 * Equivalent to `2n**64n - 1n`
 */
const MaxUint64 = _variable_MaxUint64 as typeof _variable_MaxUint64
export { MaxUint64 }

import { MaxVarintLen64 as _variable_MaxVarintLen64 } from "jsr:@std/encoding@1.0.4"
/**
 * The maximum length, in bytes, of a Varint encoded 64-bit integer.
 */
const MaxVarintLen64 = _variable_MaxVarintLen64 as typeof _variable_MaxVarintLen64
export { MaxVarintLen64 }

import { MaxVarintLen32 as _variable_MaxVarintLen32 } from "jsr:@std/encoding@1.0.4"
/**
 * The maximum length, in bytes, of a Varint encoded 32-bit integer.
 */
const MaxVarintLen32 = _variable_MaxVarintLen32 as typeof _variable_MaxVarintLen32
export { MaxVarintLen32 }

import { decodeVarint as _function_decodeVarint } from "jsr:@std/encoding@1.0.4"
/**
 * Given a non empty `buf`, starting at `offset` (default: 0), begin decoding bytes as
 * Varint encoded bytes, for a maximum of 10 bytes (offset + 10). The returned
 * tuple is of the decoded varint 32-bit number, and the new offset with which
 * to continue decoding other data.
 *
 * If a `bigint` in return is undesired, the `decode32` function will return a
 * `number`, but this should only be used in cases where the varint is
 * _assured_ to be 32-bits. If in doubt, use `decode()`.
 *
 * To know how many bytes the Varint took to encode, simply negate `offset`
 * from the returned new `offset`.
 *
 * @param buf The buffer to decode from.
 * @param offset The offset to start decoding from.
 * @return A tuple of the decoded varint 64-bit number, and the new offset.
 *
 * @example Usage
 * ```ts
 * import { decodeVarint } from "@std/encoding/varint";
 * import { assertEquals } from "@std/assert";
 *
 * const buf = new Uint8Array([0x8E, 0x02]);
 * assertEquals(decodeVarint(buf), [270n, 2]);
 * ```
 */
const decodeVarint = _function_decodeVarint as typeof _function_decodeVarint
export { decodeVarint }

import { decodeVarint32 as _function_decodeVarint32 } from "jsr:@std/encoding@1.0.4"
/**
 * Given a `buf`, starting at `offset` (default: 0), begin decoding bytes as
 * Varint encoded bytes, for a maximum of 5 bytes (offset + 5). The returned
 * tuple is of the decoded varint 32-bit number, and the new offset with which
 * to continue decoding other data.
 *
 * Varints are _not 32-bit by default_ so this should only be used in cases
 * where the varint is _assured_ to be 32-bits. If in doubt, use `decode()`.
 *
 * To know how many bytes the Varint took to encode, simply negate `offset`
 * from the returned new `offset`.
 *
 * @param buf The buffer to decode from.
 * @param offset The offset to start decoding from.
 * @return A tuple of the decoded varint 32-bit number, and the new offset.
 *
 * @example Usage
 * ```ts
 * import { decodeVarint32 } from "@std/encoding/varint";
 * import { assertEquals } from "@std/assert";
 *
 * const buf = new Uint8Array([0x8E, 0x02]);
 * assertEquals(decodeVarint32(buf), [270, 2]);
 * ```
 */
const decodeVarint32 = _function_decodeVarint32 as typeof _function_decodeVarint32
export { decodeVarint32 }

import { encodeVarint as _function_encodeVarint } from "jsr:@std/encoding@1.0.4"
/**
 * Takes unsigned number `num` and converts it into a Varint encoded
 * `Uint8Array`, returning a tuple consisting of a `Uint8Array` slice of the
 * encoded Varint, and an offset where the Varint encoded bytes end within the
 * `Uint8Array`.
 *
 * If `buf` is not given then a Uint8Array will be created.
 * `offset` defaults to `0`.
 *
 * If passed `buf` then that will be written into, starting at `offset`. The
 * resulting returned `Uint8Array` will be a slice of `buf`. The resulting
 * returned number is effectively `offset + bytesWritten`.
 *
 * @param num The number to encode.
 * @param buf The buffer to write into.
 * @param offset The offset to start writing at.
 * @return A tuple of the encoded Varint `Uint8Array` and the new offset.
 *
 * @example Usage
 * ```ts
 * import { encodeVarint } from "@std/encoding/varint";
 * import { assertEquals } from "@std/assert";
 *
 * const buf = new Uint8Array(10);
 * assertEquals(encodeVarint(42n, buf), [new Uint8Array([42]), 1]);
 * ```
 */
const encodeVarint = _function_encodeVarint as typeof _function_encodeVarint
export { encodeVarint }
