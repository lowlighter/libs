import { toText as _function_toText } from "jsr:@std/streams@1.0.2/to-text"
/**
 * Converts a {@linkcode ReadableSteam} of strings or {@linkcode Uint8Array}s
 * to a single string. Works the same as {@linkcode Response.text} and
 * {@linkcode Request.text}, but also extends to support streams of strings.
 *
 * @param stream A `ReadableStream` to convert into a `string`.
 * @return A `Promise` that resolves to the `string`.
 *
 * @example Basic usage with a stream of strings
 * ```ts
 * import { toText } from "@std/streams/to-text";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from(["Hello, ", "world!"]);
 * assertEquals(await toText(stream), "Hello, world!");
 * ```
 *
 * @example Basic usage with a stream of `Uint8Array`s
 * ```ts
 * import { toText } from "@std/streams/to-text";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from(["Hello, ", "world!"])
 *   .pipeThrough(new TextEncoderStream());
 * assertEquals(await toText(stream), "Hello, world!");
 * ```
 */
const toText = _function_toText as typeof _function_toText
export { toText }
