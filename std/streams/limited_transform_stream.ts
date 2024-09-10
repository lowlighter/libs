import type { LimitedTransformStreamOptions as _interface_LimitedTransformStreamOptions } from "jsr:@std/streams@1.0.4/limited-transform-stream"
/**
 * Options for {@linkcode LimitedTransformStream}
 */
interface LimitedTransformStreamOptions extends _interface_LimitedTransformStreamOptions {}
export type { LimitedTransformStreamOptions }

import { LimitedTransformStream as _class_LimitedTransformStream } from "jsr:@std/streams@1.0.4/limited-transform-stream"
/**
 * A {@linkcode TransformStream} that will only read & enqueue `size` amount of
 * chunks.
 *
 * If `options.error` is set, then instead of terminating the stream,
 * a {@linkcode RangeError} will be thrown when the total number of enqueued
 * chunks is about to exceed the specified size.
 *
 * @template T The type the chunks in the stream.
 *
 * @example `size` is equal to the total number of chunks
 * ```ts
 * import { LimitedTransformStream } from "@std/streams/limited-transform-stream";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from(["1234", "5678"]);
 * const transformed = stream.pipeThrough(
 *   new LimitedTransformStream(2),
 * );
 *
 * // All chunks were read
 * assertEquals(
 *   await Array.fromAsync(transformed),
 *   ["1234", "5678"],
 * );
 * ```
 *
 * @example `size` is less than the total number of chunks
 * ```ts
 * import { LimitedTransformStream } from "@std/streams/limited-transform-stream";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from(["1234", "5678"]);
 * const transformed = stream.pipeThrough(
 *   new LimitedTransformStream(1),
 * );
 *
 * // Only the first chunk was read
 * assertEquals(
 *   await Array.fromAsync(transformed),
 *   ["1234"],
 * );
 * ```
 *
 * @example Throw a {@linkcode RangeError} when the total number of chunks is
 * about to exceed the specified limit
 *
 * Do this by setting `options.error` to `true`.
 *
 * ```ts
 * import { LimitedTransformStream } from "@std/streams/limited-transform-stream";
 * import { assertRejects } from "@std/assert";
 *
 * const stream = ReadableStream.from(["1234", "5678"]);
 * const transformed = stream.pipeThrough(
 *   new LimitedTransformStream(1, { error: true }),
 * );
 *
 * await assertRejects(async () => {
 *   await Array.fromAsync(transformed);
 * }, RangeError);
 * ```
 */
class LimitedTransformStream<T> extends _class_LimitedTransformStream<T> {}
export { LimitedTransformStream }
