import { HexEncoderStream as _class_HexEncoderStream } from "jsr:@std/encoding@1.0.4/hex-stream"
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

import { HexDecoderStream as _class_HexDecoderStream } from "jsr:@std/encoding@1.0.4/hex-stream"
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
