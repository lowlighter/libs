import { toJson as _function_toJson } from "jsr:@std/streams@1.0.4/to-json"
/**
 * Converts a
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON}-formatted
 * {@linkcode ReadableSteam} of strings or {@linkcode Uint8Array}s to an object.
 * Works the same as {@linkcode Response.json} and {@linkcode Request.json}, but
 * also extends to support streams of strings.
 *
 * @param stream A `ReadableStream` whose chunks compose a JSON.
 * @return A promise that resolves to the parsed JSON.
 *
 * @example Usage with a stream of strings
 * ```ts
 * import { toJson } from "@std/streams/to-json";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from([
 *   "[1, true",
 *   ', [], {}, "hello',
 *   '", null]',
 * ]);
 * assertEquals(await toJson(stream), [1, true, [], {}, "hello", null]);
 * ```
 *
 * @example Usage with a stream of `Uint8Array`s
 * ```ts
 * import { toJson } from "@std/streams/to-json";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from([
 *   "[1, true",
 *   ', [], {}, "hello',
 *   '", null]',
 * ]).pipeThrough(new TextEncoderStream());
 * assertEquals(await toJson(stream), [1, true, [], {}, "hello", null]);
 * ```
 */
const toJson = _function_toJson as typeof _function_toJson
export { toJson }
