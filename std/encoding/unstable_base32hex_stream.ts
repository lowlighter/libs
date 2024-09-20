import { Base32HexEncoderStream as _class_Base32HexEncoderStream } from "jsr:@std/encoding@1.0.5/unstable-base32hex-stream"
/**
 * Converts a Uint8Array stream into a base32hex-encoded stream.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-6}
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { encodeBase32Hex } from "@std/encoding/unstable-base32hex";
 * import { Base32HexEncoderStream } from "@std/encoding/unstable-base32hex-stream";
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

import { Base32HexDecoderStream as _class_Base32HexDecoderStream } from "jsr:@std/encoding@1.0.5/unstable-base32hex-stream"
/**
 * Decodes a base32hex-encoded stream into a Uint8Array stream.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-6}
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { Base32HexDecoderStream } from "@std/encoding/unstable-base32hex-stream";
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
