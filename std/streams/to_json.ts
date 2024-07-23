import { toJson as _function_toJson } from "jsr:@std/streams@0.224.5/to-json"
/**
 * Converts a JSON-formatted {@linkcode ReadableSteam} of strings or
 * {@linkcode Uint8Array}s to an object. Works the same as
 * {@linkcode Response.json}.
 *
 * @param readableStream A `ReadableStream` whose chunks compose a JSON.
 * @return A promise that resolves to the parsed JSON.
 *
 * @example Basic usage
 * ```ts
 * import { toJson } from "@std/streams/to-json";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream = ReadableStream.from([
 *   "[1, true",
 *   ', [], {}, "hello',
 *   '", null]',
 * ]);
 * const json = await toJson(stream);
 * assertEquals(json, [1, true, [], {}, "hello", null]);
 * ```
 */
const toJson = _function_toJson
export { toJson }
