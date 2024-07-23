import type { TextLineStreamOptions as _interface_TextLineStreamOptions } from "jsr:@std/streams@0.224.5/text-line-stream"
/**
 * Options for {@linkcode TextLineStream}.
 */
interface TextLineStreamOptions extends _interface_TextLineStreamOptions {}
export type { TextLineStreamOptions }

import { TextLineStream as _class_TextLineStream } from "jsr:@std/streams@0.224.5/text-line-stream"
/**
 * Transform a stream into a stream where each chunk is divided by a newline,
 * be it `\n` or `\r\n`. `\r` can be enabled via the `allowCR` option.
 *
 * If you want to split by a custom delimiter, consider using {@linkcode TextDelimiterStream}.
 *
 * @example JSON Lines
 * ```ts
 * import { TextLineStream } from "@std/streams/text-line-stream";
 * import { toTransformStream } from "@std/streams/to-transform-stream";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream = ReadableStream.from([
 *   '{"name": "Alice", "age": ',
 *   '30}\n{"name": "Bob", "age"',
 *   ": 25}\n",
 * ]);
 *
 * type Person = { name: string; age: number };
 *
 * // Split the stream by newline and parse each line as a JSON object
 * const jsonStream = stream.pipeThrough(new TextLineStream())
 *   .pipeThrough(toTransformStream(async function* (src) {
 *     for await (const chunk of src) {
 *       if (chunk.trim().length === 0) {
 *         continue;
 *       }
 *       yield JSON.parse(chunk) as Person;
 *     }
 *   }));
 *
 * assertEquals(
 *   await Array.fromAsync(jsonStream),
 *   [{ "name": "Alice", "age": 30 }, { "name": "Bob", "age": 25 }],
 * );
 * ```
 *
 * @example Allow splitting by `\r`
 *
 * ```ts
 * import { TextLineStream } from "@std/streams/text-line-stream";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream = ReadableStream.from([
 *  "CR\rLF",
 *  "\nCRLF\r\ndone",
 * ]).pipeThrough(new TextLineStream({ allowCR: true }));
 *
 * const lines = await Array.fromAsync(stream);
 *
 * assertEquals(lines, ["CR", "LF", "CRLF", "done"]);
 * ```
 */
class TextLineStream extends _class_TextLineStream {}
export { TextLineStream }
