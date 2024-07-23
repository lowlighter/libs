import type { StringifyStreamOptions as _interface_StringifyStreamOptions } from "jsr:@std/json@0.224.1/json-stringify-stream"
/**
 * Options for {@linkcode JsonStringifyStream}.
 */
interface StringifyStreamOptions extends _interface_StringifyStreamOptions {}
export type { StringifyStreamOptions }

import { JsonStringifyStream as _class_JsonStringifyStream } from "jsr:@std/json@0.224.1/json-stringify-stream"
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
