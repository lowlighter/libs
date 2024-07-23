import { toText as _function_toText } from "jsr:@std/streams@0.224.5/to-text"
/**
 * Converts a {@linkcode ReadableSteam} of strings or {@linkcode Uint8Array}s
 * to a single string. Works the same as {@linkcode Response.text}.
 *
 * @param readableStream A `ReadableStream` to convert into a `string`.
 * @return A `Promise` that resolves to the `string`.
 *
 * @example Basic usage
 * ```ts
 * import { toText } from "@std/streams/to-text";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream = ReadableStream.from(["Hello, ", "world!"]);
 * assertEquals(await toText(stream), "Hello, world!");
 * ```
 */
const toText = _function_toText
export { toText }
