import { ConcatenatedJsonParseStream as _class_ConcatenatedJsonParseStream } from "jsr:@std/json@1.0.0/concatenated-json-parse-stream"
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
