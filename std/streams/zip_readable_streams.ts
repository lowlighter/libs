import { zipReadableStreams as _function_zipReadableStreams } from "jsr:@std/streams@1.0.4/zip-readable-streams"
/**
 * Merge multiple streams into a single one, taking order into account, and
 * each stream will wait for a chunk to enqueue before the next stream can
 * append another chunk.
 *
 * If a stream ends before other ones, the others will continue adding data in
 * order, and the finished one will not add any more data. If you want to cancel
 * the other streams when one of them ends, use {@linkcode earlyZipReadableStreams}.
 *
 * @template T The type of the chunks in the input/output streams.
 * @return A `ReadableStream` that will emit the zipped chunks.
 *
 * @example Zip 2 streams with the same length
 * ```ts
 * import { zipReadableStreams } from "@std/streams/zip-readable-streams";
 * import { assertEquals } from "@std/assert";
 *
 * const stream1 = ReadableStream.from(["1", "2", "3"]);
 * const stream2 = ReadableStream.from(["a", "b", "c"]);
 * const zippedStream = zipReadableStreams(stream1, stream2);
 *
 * assertEquals(
 *   await Array.fromAsync(zippedStream),
 *   ["1", "a", "2", "b", "3", "c"],
 * );
 * ```
 *
 * @example Zip 2 streams with different length (first one is shorter)
 * ```ts
 * import { zipReadableStreams } from "@std/streams/zip-readable-streams";
 * import { assertEquals } from "@std/assert";
 *
 * const stream1 = ReadableStream.from(["1", "2"]);
 * const stream2 = ReadableStream.from(["a", "b", "c", "d"]);
 * const zippedStream = zipReadableStreams(stream1, stream2);
 *
 * assertEquals(
 *   await Array.fromAsync(zippedStream),
 *   ["1", "a", "2", "b", "c", "d"],
 * );
 * ```
 *
 * @example Zip 2 streams with different length (first one is longer)
 * ```ts
 * import { zipReadableStreams } from "@std/streams/zip-readable-streams";
 * import { assertEquals } from "@std/assert";
 *
 * const stream1 = ReadableStream.from(["1", "2", "3", "4"]);
 * const stream2 = ReadableStream.from(["a", "b"]);
 * const zippedStream = zipReadableStreams(stream1, stream2);
 *
 * assertEquals(
 *   await Array.fromAsync(zippedStream),
 *   ["1", "a", "2", "b", "3", "4"],
 * );
 * ```
 *
 * @example Zip 3 streams
 * ```ts
 * import { zipReadableStreams } from "@std/streams/zip-readable-streams";
 * import { assertEquals } from "@std/assert";
 *
 * const stream1 = ReadableStream.from(["1"]);
 * const stream2 = ReadableStream.from(["a", "b"]);
 * const stream3 = ReadableStream.from(["A", "B", "C"]);
 * const zippedStream = zipReadableStreams(stream1, stream2, stream3);
 *
 * assertEquals(
 *   await Array.fromAsync(zippedStream),
 *   ["1", "a", "A", "b", "B", "C"],
 * );
 * ```
 */
const zipReadableStreams = _function_zipReadableStreams as typeof _function_zipReadableStreams
export { zipReadableStreams }
