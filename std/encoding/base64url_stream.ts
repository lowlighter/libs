import { Base64UrlEncoderStream as _class_Base64UrlEncoderStream } from "jsr:@std/encoding@1.0.4/base64url-stream"
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

import { Base64UrlDecoderStream as _class_Base64UrlDecoderStream } from "jsr:@std/encoding@1.0.4/base64url-stream"
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
