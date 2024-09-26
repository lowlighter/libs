import type { DelimiterDisposition as _typeAlias_DelimiterDisposition } from "jsr:@std/streams@1.0.6/delimiter-stream"
/**
 * Disposition of the delimiter for {@linkcode DelimiterStreamOptions}.
 */
type DelimiterDisposition = _typeAlias_DelimiterDisposition
export type { DelimiterDisposition }

import type { DelimiterStreamOptions as _interface_DelimiterStreamOptions } from "jsr:@std/streams@1.0.6/delimiter-stream"
/**
 * Options for {@linkcode DelimiterStream}.
 */
interface DelimiterStreamOptions extends _interface_DelimiterStreamOptions {}
export type { DelimiterStreamOptions }

import { DelimiterStream as _class_DelimiterStream } from "jsr:@std/streams@1.0.6/delimiter-stream"
/**
 * Divide a stream into chunks delimited by a given byte sequence.
 *
 * If you are working with a stream of `string`, consider using {@linkcode TextDelimiterStream}.
 *
 * @example Divide a CSV stream by commas, discarding the commas:
 * ```ts
 * import { DelimiterStream } from "@std/streams/delimiter-stream";
 * import { assertEquals } from "@std/assert";
 *
 * const inputStream = ReadableStream.from(["foo,bar", ",baz"]);
 *
 * const transformed = inputStream.pipeThrough(new TextEncoderStream())
 *   .pipeThrough(new DelimiterStream(new TextEncoder().encode(",")))
 *   .pipeThrough(new TextDecoderStream());
 *
 * assertEquals(await Array.fromAsync(transformed), ["foo", "bar", "baz"]);
 * ```
 *
 * @example Divide a stream after semi-colons, keeping the semicolons in the output:
 * ```ts
 * import { DelimiterStream } from "@std/streams/delimiter-stream";
 * import { assertEquals } from "@std/assert";
 *
 * const inputStream = ReadableStream.from(["foo;", "bar;baz", ";"]);
 *
 * const transformed = inputStream.pipeThrough(new TextEncoderStream())
 *   .pipeThrough(
 *     new DelimiterStream(new TextEncoder().encode(";"), {
 *       disposition: "suffix",
 *     }),
 *   ).pipeThrough(new TextDecoderStream());
 *
 * assertEquals(await Array.fromAsync(transformed), ["foo;", "bar;", "baz;"]);
 * ```
 */
class DelimiterStream extends _class_DelimiterStream {}
export { DelimiterStream }
