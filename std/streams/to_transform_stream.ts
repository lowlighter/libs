import { toTransformStream as _function_toTransformStream } from "jsr:@std/streams@1.0.4/to-transform-stream"
/**
 * Convert the generator function into a {@linkcode TransformStream}.
 *
 * @template I The type of the chunks in the source stream.
 * @template O The type of the chunks in the transformed stream.
 * @param transformer A function to transform.
 * @param writableStrategy An object that optionally defines a queuing strategy for the stream.
 * @param readableStrategy An object that optionally defines a queuing strategy for the stream.
 * @return A {@linkcode TransformStream} that transforms the source stream as defined by the provided transformer.
 *
 * @example Build a transform stream that multiplies each value by 100
 * ```ts
 * import { toTransformStream } from "@std/streams/to-transform-stream";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from([0, 1, 2])
 *   .pipeThrough(toTransformStream(async function* (src) {
 *     for await (const chunk of src) {
 *       yield chunk * 100;
 *     }
 *   }));
 *
 * assertEquals(
 *   await Array.fromAsync(stream),
 *   [0, 100, 200],
 * );
 * ```
 *
 * @example JSON Lines
 * ```ts
 * import { TextLineStream } from "@std/streams/text-line-stream";
 * import { toTransformStream } from "@std/streams/to-transform-stream";
 * import { assertEquals } from "@std/assert";
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
 */
const toTransformStream = _function_toTransformStream as typeof _function_toTransformStream
export { toTransformStream }
