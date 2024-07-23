import { ConcatenatedJsonParseStream as _class_ConcatenatedJsonParseStream } from "jsr:@std/json@0.224.1/concatenated-json-parse-stream"
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
