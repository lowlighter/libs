import { TextDelimiterStream as _class_TextDelimiterStream } from "jsr:@std/streams@1.0.3/text-delimiter-stream"
/**
 * Transform a stream `string` into a stream where each chunk is divided by a
 * given delimiter.
 *
 * If you are working with a stream of `Uint8Array`, consider using {@linkcode DelimiterStream}.
 *
 * If you want to split by a newline, consider using {@linkcode TextLineStream}.
 *
 * @example Comma-separated values
 * ```ts
 * import { TextDelimiterStream } from "@std/streams/text-delimiter-stream";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from([
 *   "alice,20,",
 *   ",US,",
 * ]);
 *
 * const valueStream = stream.pipeThrough(new TextDelimiterStream(","));
 *
 * assertEquals(
 *   await Array.fromAsync(valueStream),
 *   ["alice", "20", "", "US", ""],
 * );
 * ```
 *
 * @example Semicolon-separated values with suffix disposition
 * ```ts
 * import { TextDelimiterStream } from "@std/streams/text-delimiter-stream";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from([
 *   "const a = 42;;let b =",
 *   " true;",
 * ]);
 *
 * const valueStream = stream.pipeThrough(
 *   new TextDelimiterStream(";", { disposition: "suffix" }),
 * );
 *
 * assertEquals(
 *   await Array.fromAsync(valueStream),
 *   ["const a = 42;", ";", "let b = true;", ""],
 * );
 * ```
 */
class TextDelimiterStream extends _class_TextDelimiterStream {}
export { TextDelimiterStream }
