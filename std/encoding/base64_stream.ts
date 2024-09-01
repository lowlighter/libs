import { Base64EncoderStream as _class_Base64EncoderStream } from "jsr:@std/encoding@1.0.3/base64-stream"
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

import { Base64DecoderStream as _class_Base64DecoderStream } from "jsr:@std/encoding@1.0.3/base64-stream"
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
