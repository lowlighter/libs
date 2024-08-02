/**
 * Utilities for parsing streaming JSON data.
 *
 * ```ts
 * import { JsonStringifyStream } from "@std/json";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from([{ foo: "bar" }, { baz: 100 }])
 *   .pipeThrough(new JsonStringifyStream());
 *
 * assertEquals(await Array.fromAsync(stream), [
 *   `{"foo":"bar"}\n`,
 *   `{"baz":100}\n`
 * ]);
 * ```
 *
 * @module
 */
import { ConcatenatedJsonParseStream as _class_ConcatenatedJsonParseStream } from "jsr:@std/json@1.0.0"
/**
 * Stream to parse
 * {@link https://en.wikipedia.org/wiki/JSON_streaming#Concatenated_JSON | Concatenated JSON}.
 *
 * @example Usage
 *
 * ```ts
 * import { ConcatenatedJsonParseStream } from "@std/json/concatenated-json-parse-stream";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from([
 *   `{"foo":"bar"}`,
 *   `{"baz":100}`,
 * ]).pipeThrough(new ConcatenatedJsonParseStream());
 *
 * assertEquals(await Array.fromAsync(stream), [
 *   { foo: "bar" },
 *   { baz: 100 },
 * ]);
 * ```
 */
class ConcatenatedJsonParseStream extends _class_ConcatenatedJsonParseStream {}
export { ConcatenatedJsonParseStream }

import type { JsonValue as _typeAlias_JsonValue } from "jsr:@std/json@1.0.0"
/**
 * The type of the result of parsing JSON.
 */
type JsonValue = _typeAlias_JsonValue
export type { JsonValue }

import { JsonParseStream as _class_JsonParseStream } from "jsr:@std/json@1.0.0"
/**
 * Parse each chunk as JSON.
 *
 * This can be used to parse {@link https://jsonlines.org/ | JSON lines},
 * {@link http://ndjson.org/ | NDJSON} and
 * {@link https://www.rfc-editor.org/rfc/rfc7464.html | JSON Text Sequences}.
 * Chunks consisting of spaces, tab characters, or newline characters will be ignored.
 *
 * @example Basic usage
 *
 * ```ts
 * import { JsonParseStream } from "@std/json/parse-stream";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from([
 *   `{"foo":"bar"}\n`,
 *   `{"baz":100}\n`
 * ]).pipeThrough(new JsonParseStream());
 *
 * assertEquals(await Array.fromAsync(stream), [
 *   { foo: "bar" },
 *   { baz: 100 }
 * ]);
 * ```
 *
 * @example parse JSON lines or NDJSON from a file
 * ```ts
 * import { TextLineStream } from "@std/streams/text-line-stream";
 * import { JsonParseStream } from "@std/json/parse-stream";
 * import { assertEquals } from "@std/assert";
 *
 * const file = await Deno.open("json/testdata/test.jsonl");
 *
 * const readable = file.readable
 *   .pipeThrough(new TextDecoderStream())  // convert Uint8Array to string
 *   .pipeThrough(new TextLineStream()) // transform into a stream where each chunk is divided by a newline
 *   .pipeThrough(new JsonParseStream()); // parse each chunk as JSON
 *
 * assertEquals(await Array.fromAsync(readable), [
 *  {"hello": "world"},
 *  ["👋", "👋", "👋"],
 *  {"deno": "🦕"},
 * ]);
 * ```
 */
class JsonParseStream extends _class_JsonParseStream {}
export { JsonParseStream }

import type { StringifyStreamOptions as _interface_StringifyStreamOptions } from "jsr:@std/json@1.0.0"
/**
 * Options for {@linkcode JsonStringifyStream}.
 */
interface StringifyStreamOptions extends _interface_StringifyStreamOptions {}
export type { StringifyStreamOptions }

import { JsonStringifyStream as _class_JsonStringifyStream } from "jsr:@std/json@1.0.0"
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
 * @example Basic usage
 *
 * ```ts
 * import { JsonStringifyStream } from "@std/json/stringify-stream";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from([{ foo: "bar" }, { baz: 100 }])
 *   .pipeThrough(new JsonStringifyStream());
 *
 * assertEquals(await Array.fromAsync(stream), [
 *   `{"foo":"bar"}\n`,
 *   `{"baz":100}\n`
 * ]);
 * ```
 *
 * @example Stringify stream of JSON text sequences
 *
 * Set `options.prefix` to `\x1E` to stringify
 * {@linkcode https://www.rfc-editor.org/rfc/rfc7464.html | JSON Text Sequences}.
 *
 * ```ts
 * import { JsonStringifyStream } from "@std/json/stringify-stream";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from([{ foo: "bar" }, { baz: 100 }])
 *   .pipeThrough(new JsonStringifyStream({ prefix: "\x1E", suffix: "\n" }));
 *
 * assertEquals(await Array.fromAsync(stream), [
 *   `\x1E{"foo":"bar"}\n`,
 *   `\x1E{"baz":100}\n`
 * ]);
 * ```
 *
 * @example Stringify JSON lines from a server
 *
 * ```ts no-eval no-assert
 * import { JsonStringifyStream } from "@std/json/stringify-stream";
 *
 * // A server that streams one line of JSON every second
 * Deno.serve(() => {
 *   let intervalId: number | undefined;
 *   const readable = new ReadableStream({
 *     start(controller) {
 *       // Enqueue data once per second
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
 *     .pipeThrough(new JsonStringifyStream()) // Convert data to JSON lines
 *     .pipeThrough(new TextEncoderStream()); // Convert a string to a Uint8Array
 *
 *   return new Response(body);
 * });
 * ```
 */
class JsonStringifyStream extends _class_JsonStringifyStream {}
export { JsonStringifyStream }
