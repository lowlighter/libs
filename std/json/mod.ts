/**
 * Utilities for parsing streaming JSON data.
 *
 * @module
 */
import { ConcatenatedJsonParseStream as _class_ConcatenatedJsonParseStream } from "jsr:@std/json@0.224.1"
/**
 * Stream to parse {@link https://en.wikipedia.org/wiki/JSON_streaming#Concatenated_JSON|Concatenated JSON}.
 *
 * @example ```ts
 * import { ConcatenatedJsonParseStream } from "@std/json/concatenated-json-parse-stream";
 *
 * const url = "@std/json/testdata/test.concatenated-json";
 * const { body } = await fetch(url);
 *
 * const readable = body!
 *   .pipeThrough(new TextDecoderStream()) // convert Uint8Array to string
 *   .pipeThrough(new ConcatenatedJsonParseStream()); // parse Concatenated JSON
 *
 * for await (const data of readable) {
 *   console.log(data);
 * }
 * ```
 */
class ConcatenatedJsonParseStream extends _class_ConcatenatedJsonParseStream {}
export { ConcatenatedJsonParseStream }

import type { JsonValue as _typeAlias_JsonValue } from "jsr:@std/json@0.224.1"
/**
 * The type of the result of parsing JSON.
 */
type JsonValue = _typeAlias_JsonValue
export type { JsonValue }

import type { ParseStreamOptions as _interface_ParseStreamOptions } from "jsr:@std/json@0.224.1"
/**
 * Options for {@linkcode JsonParseStream} and
 * {@linkcode ConcatenatedJsonParseStream}.
 */
interface ParseStreamOptions extends _interface_ParseStreamOptions {}
export type { ParseStreamOptions }

import { JsonParseStream as _class_JsonParseStream } from "jsr:@std/json@0.224.1"
/**
 * Parse each chunk as JSON.
 *
 * This can be used to parse {@link https://jsonlines.org/ | JSON lines},
 * {@link http://ndjson.org/ | NDJSON} and
 * {@link https://www.rfc-editor.org/rfc/rfc7464.html | JSON Text Sequences}.
 * Chunks consisting of spaces, tab characters, or newline characters will be ignored.
 *
 * @example parse JSON lines or NDJSON
 * ```ts
 * import { TextLineStream } from "@std/streams/text-line-stream";
 * import { JsonParseStream } from "@std/json/json-parse-stream";
 *
 * const url = "@std/json/testdata/test.jsonl";
 * const { body } = await fetch(url);
 *
 * const readable = body!
 *   .pipeThrough(new TextDecoderStream())  // convert Uint8Array to string
 *   .pipeThrough(new TextLineStream()) // transform into a stream where each chunk is divided by a newline
 *   .pipeThrough(new JsonParseStream()); // parse each chunk as JSON
 *
 * for await (const data of readable) {
 *   console.log(data);
 * }
 * ```
 *
 * @example parse JSON Text Sequences
 * ```ts
 * import { TextDelimiterStream } from "@std/streams/text-delimiter-stream";
 * import { JsonParseStream } from "@std/json/json-parse-stream";
 *
 * const url =
 *   "@std/json/testdata/test.json-seq";
 * const { body } = await fetch(url);
 *
 * const delimiter = "\x1E";
 * const readable = body!
 *   .pipeThrough(new TextDecoderStream())
 *   .pipeThrough(new TextDelimiterStream(delimiter)) // transform into a stream where each chunk is divided by a delimiter
 *   .pipeThrough(new JsonParseStream());
 *
 * for await (const data of readable) {
 *   console.log(data);
 * }
 * ```
 */
class JsonParseStream extends _class_JsonParseStream {}
export { JsonParseStream }

import type { StringifyStreamOptions as _interface_StringifyStreamOptions } from "jsr:@std/json@0.224.1"
/**
 * Options for {@linkcode JsonStringifyStream}.
 */
interface StringifyStreamOptions extends _interface_StringifyStreamOptions {}
export type { StringifyStreamOptions }

import { JsonStringifyStream as _class_JsonStringifyStream } from "jsr:@std/json@0.224.1"
/**
 * Convert each chunk to JSON string.
 *
 * This can be used to stringify {@link https://jsonlines.org/ | JSON lines},
 * {@link https://ndjson.org/ | NDJSON},
 * {@link https://www.rfc-editor.org/rfc/rfc7464.html | JSON Text Sequences},
 * and {@link https://en.wikipedia.org/wiki/JSON_streaming#Concatenated_JSON | Concatenated JSON}.
 *
 * You can optionally specify a prefix and suffix for each chunk. The default prefix is `""` and the default suffix is `"\n"`.
 *
 * @example ```ts
 * import { JsonStringifyStream } from "@std/json/json-stringify-stream";
 *
 * const file = await Deno.open("./tmp.jsonl", { create: true, write: true });
 *
 * ReadableStream.from([{ foo: "bar" }, { baz: 100 }])
 *   .pipeThrough(new JsonStringifyStream()) // convert to JSON lines (ndjson)
 *   .pipeThrough(new TextEncoderStream()) // convert a string to a Uint8Array
 *   .pipeTo(file.writable)
 *   .then(() => console.log("write success"));
 * ```
 *
 * @example To convert to [JSON Text Sequences](https://www.rfc-editor.org/rfc/rfc7464.html), set the
 * prefix to the delimiter "\x1E" as options.
 * ```ts
 * import { JsonStringifyStream } from "@std/json/json-stringify-stream";
 *
 * const file = await Deno.open("./tmp.jsonl", { create: true, write: true });
 *
 * ReadableStream.from([{ foo: "bar" }, { baz: 100 }])
 *   .pipeThrough(new JsonStringifyStream({ prefix: "\x1E", suffix: "\n" })) // convert to JSON Text Sequences
 *   .pipeThrough(new TextEncoderStream())
 *   .pipeTo(file.writable)
 *   .then(() => console.log("write success"));
 * ```
 *
 * @example If you want to stream [JSON lines](https://jsonlines.org/) from the server:
 * ```ts
 * import { JsonStringifyStream } from "@std/json/json-stringify-stream";
 *
 * // A server that streams one line of JSON every second
 * Deno.serve(() => {
 *   let intervalId: number | undefined;
 *   const readable = new ReadableStream({
 *     start(controller) {
 *       // enqueue data once per second
 *       intervalId = setInterval(() => {
 *         controller.enqueue({ now: new Date() });
 *       }, 1000);
 *     },
 *     cancel() {
 *       clearInterval(intervalId);
 *     },
 *   });
 *
 *   const body = readable
 *     .pipeThrough(new JsonStringifyStream()) // convert data to JSON lines
 *     .pipeThrough(new TextEncoderStream()); // convert a string to a Uint8Array
 *
 *   return new Response(body);
 * });
 * ```
 */
class JsonStringifyStream extends _class_JsonStringifyStream {}
export { JsonStringifyStream }
