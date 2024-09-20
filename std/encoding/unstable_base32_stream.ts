import { Base32EncoderStream as _class_Base32EncoderStream } from "jsr:@std/encoding@1.0.5/unstable-base32-stream"
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
 * import { Base32EncoderStream } from "@std/encoding/unstable-base32-stream";
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

import { Base32DecoderStream as _class_Base32DecoderStream } from "jsr:@std/encoding@1.0.5/unstable-base32-stream"
/**
 * Decodes a base32-encoded stream into a Uint8Array stream.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-6}
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { Base32DecoderStream } from "@std/encoding/unstable-base32-stream";
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
