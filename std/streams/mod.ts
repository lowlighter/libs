/**
 * Utilities for working with the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Streams API}.
 *
 * Includes buffering and conversion.
 *
 * ```ts
 * import { toText } from "@std/streams";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream = ReadableStream.from("Hello, world!");
 * const text = await toText(stream);
 *
 * assertEquals(text, "Hello, world!");
 * ```
 *
 * @module
 */
import type { BufferBytesOptions as _interface_BufferBytesOptions } from "jsr:@std/streams@0.224.5"
/**
 * Options for {@linkcode Buffer.bytes}.
 */
interface BufferBytesOptions extends _interface_BufferBytesOptions {}
export type { BufferBytesOptions }

import { Buffer as _class_Buffer } from "jsr:@std/streams@0.224.5"
/**
 * A variable-sized buffer of bytes with `readable` and `writable` getters that
 * allows you to work with {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API}.
 *
 * Buffer is almost always used with some I/O like files and sockets. It allows
 * one to buffer up a download from a socket. Buffer grows and shrinks as
 * necessary.
 *
 * Buffer is NOT the same thing as Node's Buffer. Node's Buffer was created in
 * 2009 before JavaScript had the concept of ArrayBuffers. It's simply a
 * non-standard ArrayBuffer.
 *
 * ArrayBuffer is a fixed memory allocation. Buffer is implemented on top of
 * ArrayBuffer.
 *
 * Based on {@link https://golang.org/pkg/bytes/#Buffer | Go Buffer}.
 *
 * @example Buffer input bytes and convert it to a string
 * ```ts
 * import { Buffer } from "@std/streams/buffer";
 * import { toText } from "@std/streams/to-text";
 * import { assert } from "@std/assert/assert";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * // Create a new buffer
 * const buf = new Buffer();
 * assertEquals(buf.capacity, 0);
 * assertEquals(buf.length, 0);
 *
 * // Dummy input stream
 * const inputStream = ReadableStream.from([
 *   "hello, ",
 *   "world",
 *   "!",
 * ]);
 *
 * // Pipe the input stream to the buffer
 * await inputStream.pipeThrough(new TextEncoderStream()).pipeTo(buf.writable);
 * assert(buf.capacity > 0);
 * assert(buf.length > 0);
 *
 * // Convert the buffered bytes to a string
 * const result = await toText(buf.readable);
 * assertEquals(result, "hello, world!");
 * assert(buf.empty());
 * ```
 */
class Buffer extends _class_Buffer {}
export { Buffer }

import { ByteSliceStream as _class_ByteSliceStream } from "jsr:@std/streams@0.224.5"
/**
 * A transform stream that only transforms from the zero-indexed `start` and
 * `end` bytes (both inclusive).
 *
 * @example Basic usage
 * ```ts
 * import { ByteSliceStream } from "@std/streams/byte-slice-stream";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream = ReadableStream.from([
 *   new Uint8Array([0, 1]),
 *   new Uint8Array([2, 3, 4]),
 * ]);
 * const slicedStream = stream.pipeThrough(new ByteSliceStream(1, 3));
 *
 * assertEquals(
 *   await Array.fromAsync(slicedStream),
 *  [new Uint8Array([1]), new Uint8Array([2, 3])]
 * );
 * ```
 *
 * @example Get a range of bytes from a fetch response body
 * ```ts
 * import { ByteSliceStream } from "@std/streams/byte-slice-stream";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const response = await fetch("https://example.com");
 * const rangedStream = response.body!
 *   .pipeThrough(new ByteSliceStream(3, 8));
 * const collected = await Array.fromAsync(rangedStream);
 * assertEquals(collected[0]?.length, 6);
 * ```
 */
class ByteSliceStream extends _class_ByteSliceStream {}
export { ByteSliceStream }

import { concatReadableStreams as _function_concatReadableStreams } from "jsr:@std/streams@0.224.5"
/**
 * Concatenates multiple `ReadableStream`s into a single ordered
 * `ReadableStream`.
 *
 * Cancelling the resulting stream will cancel all the input streams.
 *
 * @template T The type of the chunks in the streams.
 * @param streams An iterable of `ReadableStream`s to concat.
 * @return A `ReadableStream` that will emit the concatenated chunks.
 *
 * @example Usage
 * ```ts
 * import { concatReadableStreams } from "@std/streams/concat-readable-streams";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream1 = ReadableStream.from([1, 2, 3]);
 * const stream2 = ReadableStream.from([4, 5, 6]);
 * const stream3 = ReadableStream.from([7, 8, 9]);
 *
 * assertEquals(
 *   await Array.fromAsync(concatReadableStreams(stream1, stream2, stream3)),
 *   [1, 2, 3, 4, 5, 6, 7, 8, 9],
 * );
 * ```
 */
const concatReadableStreams = _function_concatReadableStreams
export { concatReadableStreams }

import type { DelimiterDisposition as _typeAlias_DelimiterDisposition } from "jsr:@std/streams@0.224.5"
/**
 * Disposition of the delimiter for {@linkcode DelimiterStreamOptions}.
 */
type DelimiterDisposition = _typeAlias_DelimiterDisposition
export type { DelimiterDisposition }

import type { DelimiterStreamOptions as _interface_DelimiterStreamOptions } from "jsr:@std/streams@0.224.5"
/**
 * Options for {@linkcode DelimiterStream}.
 */
interface DelimiterStreamOptions extends _interface_DelimiterStreamOptions {}
export type { DelimiterStreamOptions }

import { DelimiterStream as _class_DelimiterStream } from "jsr:@std/streams@0.224.5"
/**
 * Divide a stream into chunks delimited by a given byte sequence.
 *
 * If you are working with a stream of `string`, consider using {@linkcode TextDelimiterStream}.
 *
 * @example Divide a CSV stream by commas, discarding the commas:
 * ```ts
 * import { DelimiterStream } from "@std/streams/delimiter-stream";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const inputStream = ReadableStream.from(["foo,bar", ",baz"]);
 *
 * const transformed = inputStream.pipeThrough(new TextEncoderStream())
 *   .pipeThrough(new DelimiterStream(new TextEncoder().encode(",")))
 *   .pipeThrough(new TextDecoderStream());
 *
 * assertEquals(await Array.fromAsync(transformed), ["foo", "bar", "baz"]);
 * ```
 *
 * @example Divide a stream after semi-colons, keeping the semicolons in the output:
 * ```ts
 * import { DelimiterStream } from "@std/streams/delimiter-stream";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const inputStream = ReadableStream.from(["foo;", "bar;baz", ";"]);
 *
 * const transformed = inputStream.pipeThrough(new TextEncoderStream())
 *   .pipeThrough(
 *     new DelimiterStream(new TextEncoder().encode(";"), {
 *       disposition: "suffix",
 *     }),
 *   ).pipeThrough(new TextDecoderStream());
 *
 * assertEquals(await Array.fromAsync(transformed), ["foo;", "bar;", "baz;"]);
 * ```
 */
class DelimiterStream extends _class_DelimiterStream {}
export { DelimiterStream }

import { earlyZipReadableStreams as _function_earlyZipReadableStreams } from "jsr:@std/streams@0.224.5"
/**
 * Merge multiple streams into a single one, taking order into account, and each
 * stream will wait for a chunk to enqueue before the next stream can append
 * another chunk.
 *
 * If a stream ends before other ones, the others will be cancelled after the
 * last chunk of said stream is read. See the examples below for more
 * comprehensible information. If you want to continue reading the other streams
 * even after one of them ends, use {@linkcode zipReadableStreams}.
 *
 * @template T The type of the chunks in the input streams.
 * @return A `ReadableStream` that will emit the zipped chunks
 *
 * @example Zip 2 streams with the same length
 * ```ts
 * import { earlyZipReadableStreams } from "@std/streams/early-zip-readable-streams";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream1 = ReadableStream.from(["1", "2", "3"]);
 * const stream2 = ReadableStream.from(["a", "b", "c"]);
 * const zippedStream = earlyZipReadableStreams(stream1, stream2);
 *
 * assertEquals(
 *   await Array.fromAsync(zippedStream),
 *   ["1", "a", "2", "b", "3", "c"],
 * );
 * ```
 *
 * @example Zip 2 streams with different length (first one is shorter)
 * ```ts
 * import { earlyZipReadableStreams } from "@std/streams/early-zip-readable-streams";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream1 = ReadableStream.from(["1", "2"]);
 * const stream2 = ReadableStream.from(["a", "b", "c", "d"]);
 * const zippedStream = earlyZipReadableStreams(stream1, stream2);
 *
 * // The first stream ends before the second one. When the first stream ends,
 * // the second one is cancelled and no more data is read or added to the
 * // zipped stream.
 * assertEquals(
 *   await Array.fromAsync(zippedStream),
 *   ["1", "a", "2", "b"],
 * );
 * ```
 *
 * @example Zip 2 streams with different length (first one is longer)
 * ```ts
 * import { earlyZipReadableStreams } from "@std/streams/early-zip-readable-streams";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream1 = ReadableStream.from(["1", "2", "3", "4"]);
 * const stream2 = ReadableStream.from(["a", "b"]);
 * const zippedStream = earlyZipReadableStreams(stream1, stream2);
 *
 * // The second stream ends before the first one. When the second stream ends,
 * // the first one is cancelled, but the chunk of "3" is already read so it
 * // is added to the zipped stream.
 * assertEquals(
 *   await Array.fromAsync(zippedStream),
 *   ["1", "a", "2", "b", "3"],
 * );
 * ```
 *
 * @example Zip 3 streams
 * ```ts
 * import { earlyZipReadableStreams } from "@std/streams/early-zip-readable-streams";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream1 = ReadableStream.from(["1"]);
 * const stream2 = ReadableStream.from(["a", "b"]);
 * const stream3 = ReadableStream.from(["A", "B", "C"]);
 * const zippedStream = earlyZipReadableStreams(stream1, stream2, stream3);
 *
 * assertEquals(
 *   await Array.fromAsync(zippedStream),
 *   ["1", "a", "A"],
 * );
 * ```
 */
const earlyZipReadableStreams = _function_earlyZipReadableStreams
export { earlyZipReadableStreams }

import type { Reader as _interface_Reader } from "jsr:@std/streams@0.224.5"
/**
 * An abstract interface which when implemented provides an interface to read bytes into an array buffer asynchronously.
 */
interface Reader extends _interface_Reader {}
export type { Reader }

import type { ReaderSync as _interface_ReaderSync } from "jsr:@std/streams@0.224.5"
/**
 * An abstract interface which when implemented provides an interface to read bytes into an array buffer synchronously.
 */
interface ReaderSync extends _interface_ReaderSync {}
export type { ReaderSync }

import { iterateReader as _function_iterateReader } from "jsr:@std/streams@0.224.5"
/**
 * Turns a {@linkcode https://jsr.io/@std/io/doc/types/~/Reader | Reader}, `r`, into an async iterator.
 *
 * @param r A reader to turn into an async iterator.
 * @param options Options for the iterateReader function.
 * @return An async iterator that yields Uint8Array.
 *
 * @example Convert a `Deno.FsFile` into an async iterator and iterate over it
 * ```ts no-assert no-eval
 * import { iterateReader } from "@std/streams/iterate-reader";
 *
 * using f = await Deno.open("./README.md");
 * for await (const chunk of iterateReader(f)) {
 *   console.log(chunk);
 * }
 * ```
 *
 * @example Specify a buffer size of 1MiB
 * ```ts no-assert no-eval
 * import { iterateReader } from "@std/streams/iterate-reader";
 *
 * using f = await Deno.open("./README.md");
 * const it = iterateReader(f, {
 *   bufSize: 1024 * 1024
 * });
 * for await (const chunk of it) {
 *   console.log(chunk);
 * }
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/io | @std/io} instead.
 */
const iterateReader = _function_iterateReader
export { iterateReader }

import { iterateReaderSync as _function_iterateReaderSync } from "jsr:@std/streams@0.224.5"
/**
 * Turns a {@linkcode https://jsr.io/@std/io/doc/types/~/ReaderSync | ReaderSync}, `r`, into an iterator.
 *
 * @param r A reader to turn into an iterator.
 * @param options Options for the iterateReaderSync function.
 * @return An iterator that yields Uint8Array.
 *
 * @example Convert a `Deno.FsFile` into an iterator and iterate over it
 * ```ts no-eval no-assert
 * import { iterateReaderSync } from "@std/streams/iterate-reader";
 *
 * using f = Deno.openSync("./README.md");
 * for (const chunk of iterateReaderSync(f)) {
 *   console.log(chunk);
 * }
 * ```
 *
 * @example Specify a buffer size of 1MiB
 * ```ts no-eval no-assert
 * import { iterateReaderSync } from "@std/streams/iterate-reader";
 *
 * using f = await Deno.open("./README.md");
 * const iter = iterateReaderSync(f, {
 *   bufSize: 1024 * 1024
 * });
 * for (const chunk of iter) {
 *   console.log(chunk);
 * }
 * ```
 *
 * Iterator uses an internal buffer of fixed size for efficiency; it returns
 * a view on that buffer on each iteration. It is therefore caller's
 * responsibility to copy contents of the buffer if needed; otherwise the
 * next iteration will overwrite contents of previously returned chunk.
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/io | @std/io} instead.
 */
const iterateReaderSync = _function_iterateReaderSync
export { iterateReaderSync }

import type { LimitedBytesTransformStreamOptions as _interface_LimitedBytesTransformStreamOptions } from "jsr:@std/streams@0.224.5"
/**
 * Options for {@linkcode LimitedBytesTransformStream}.
 */
interface LimitedBytesTransformStreamOptions extends _interface_LimitedBytesTransformStreamOptions {}
export type { LimitedBytesTransformStreamOptions }

import { LimitedBytesTransformStream as _class_LimitedBytesTransformStream } from "jsr:@std/streams@0.224.5"
/**
 * A {@linkcode TransformStream} that will only read & enqueue chunks until the
 * total amount of enqueued data exceeds `size`. The last chunk that would
 * exceed the limit will NOT be enqueued, in which case a {@linkcode RangeError}
 * is thrown when `options.error` is set to true, otherwise the stream is just
 * terminated.
 *
 * @example `size` is equal to the total byte length of the chunks
 * ```ts
 * import { LimitedBytesTransformStream } from "@std/streams/limited-bytes-transform-stream";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream = ReadableStream.from(["1234", "5678"]);
 * const transformed = stream.pipeThrough(new TextEncoderStream()).pipeThrough(
 *   new LimitedBytesTransformStream(8),
 * ).pipeThrough(new TextDecoderStream());
 *
 * assertEquals(
 *   await Array.fromAsync(transformed),
 *   ["1234", "5678"],
 * );
 * ```
 *
 * @example `size` is less than the total byte length of the chunks, and at the
 * boundary of the chunks
 * ```ts
 * import { LimitedBytesTransformStream } from "@std/streams/limited-bytes-transform-stream";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream = ReadableStream.from(["1234", "5678"]);
 * const transformed = stream.pipeThrough(new TextEncoderStream()).pipeThrough(
 *   // `4` is the boundary of the chunks
 *   new LimitedBytesTransformStream(4),
 * ).pipeThrough(new TextDecoderStream());
 *
 * assertEquals(
 *   await Array.fromAsync(transformed),
 *   // The first chunk was read, but the second chunk was not
 *   ["1234"],
 * );
 * ```
 *
 * @example `size` is less than the total byte length of the chunks, and not at
 * the boundary of the chunks
 * ```ts
 * import { LimitedBytesTransformStream } from "@std/streams/limited-bytes-transform-stream";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream = ReadableStream.from(["1234", "5678"]);
 * const transformed = stream.pipeThrough(new TextEncoderStream()).pipeThrough(
 *   // `5` is not the boundary of the chunks
 *   new LimitedBytesTransformStream(5),
 * ).pipeThrough(new TextDecoderStream());
 *
 * assertEquals(
 *   await Array.fromAsync(transformed),
 *   // The second chunk was not read because it would exceed the specified size
 *   ["1234"],
 * );
 * ```
 *
 * @example error: true
 * ```ts
 * import { LimitedBytesTransformStream } from "@std/streams/limited-bytes-transform-stream";
 * import { assertRejects } from "@std/assert/assert-rejects";
 *
 * const stream = ReadableStream.from(["1234", "5678"]);
 * const transformed = stream.pipeThrough(new TextEncoderStream()).pipeThrough(
 *   new LimitedBytesTransformStream(5, { error: true }),
 * ).pipeThrough(new TextDecoderStream());
 *
 * await assertRejects(async () => {
 *   await Array.fromAsync(transformed);
 * }, RangeError);
 * ```
 */
class LimitedBytesTransformStream extends _class_LimitedBytesTransformStream {}
export { LimitedBytesTransformStream }

import type { LimitedTransformStreamOptions as _interface_LimitedTransformStreamOptions } from "jsr:@std/streams@0.224.5"
/**
 * Options for {@linkcode LimitedTransformStream}
 */
interface LimitedTransformStreamOptions extends _interface_LimitedTransformStreamOptions {}
export type { LimitedTransformStreamOptions }

import { LimitedTransformStream as _class_LimitedTransformStream } from "jsr:@std/streams@0.224.5"
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
 * import { assertEquals } from "@std/assert/assert-equals";
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
 * import { assertEquals } from "@std/assert/assert-equals";
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
 * @example error: true
 * ```ts
 * import { LimitedTransformStream } from "@std/streams/limited-transform-stream";
 * import { assertRejects } from "@std/assert/assert-rejects";
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

import { mergeReadableStreams as _function_mergeReadableStreams } from "jsr:@std/streams@0.224.5"
/**
 * Merge multiple streams into a single one, not taking order into account.
 * If a stream ends before other ones, the other will continue adding data,
 * and the finished one will not add any more data.
 *
 * @template T The type of the chunks in the input/output streams.
 * @param streams An iterable of `ReadableStream`s to merge.
 * @return A `ReadableStream` that will emit the merged chunks.
 *
 * @example Merge 2 streams
 * ```ts
 * import { mergeReadableStreams } from "@std/streams/merge-readable-streams";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream1 = ReadableStream.from([1, 2]);
 * const stream2 = ReadableStream.from([3, 4, 5]);
 *
 * const mergedStream = mergeReadableStreams(stream1, stream2);
 * const merged = await Array.fromAsync(mergedStream);
 * assertEquals(merged.toSorted(), [1, 2, 3, 4, 5]);
 * ```
 *
 * @example Merge 3 streams
 * ```ts
 * import { mergeReadableStreams } from "@std/streams/merge-readable-streams";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream1 = ReadableStream.from([1, 2]);
 * const stream2 = ReadableStream.from([3, 4, 5]);
 * const stream3 = ReadableStream.from([6]);
 *
 * const mergedStream = mergeReadableStreams(stream1, stream2, stream3);
 * const merged = await Array.fromAsync(mergedStream);
 * assertEquals(merged.toSorted(), [1, 2, 3, 4, 5, 6]);
 * ```
 */
const mergeReadableStreams = _function_mergeReadableStreams
export { mergeReadableStreams }

import type { Closer as _interface_Closer } from "jsr:@std/streams@0.224.5"
/**
 * An abstract interface which when implemented provides an interface to close files/resources that were previously opened.
 */
interface Closer extends _interface_Closer {}
export type { Closer }

import type { ReadableStreamFromReaderOptions as _interface_ReadableStreamFromReaderOptions } from "jsr:@std/streams@0.224.5"
/**
 * Options for {@linkcode readableStreamFromReader}.
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode https://jsr.io/@std/io/doc/~/toReadableStream | toReadableStream} instead.
 */
interface ReadableStreamFromReaderOptions extends _interface_ReadableStreamFromReaderOptions {}
export type { ReadableStreamFromReaderOptions }

import { readableStreamFromReader as _function_readableStreamFromReader } from "jsr:@std/streams@0.224.5"
/**
 * Create a {@linkcode ReadableStream} of {@linkcode Uint8Array}s from a
 * {@linkcode https://jsr.io/@std/io/doc/types/~/Reader | Reader}.
 *
 * When the pull algorithm is called on the stream, a chunk from the reader
 * will be read.  When `null` is returned from the reader, the stream will be
 * closed along with the reader (if it is also a {@linkcode https://jsr.io/@std/io/doc/types/~/Closer | Closer}).
 *
 * @param reader A reader to convert into a `ReadableStream`.
 * @param options Options for the `readableStreamFromReader` function.
 * @return A `ReadableStream` of `Uint8Array`s.
 *
 * @example Convert a `Deno.FsFile` into a readable stream:
 * ```ts no-eval no-assert
 * import { readableStreamFromReader } from "@std/streams/readable-stream-from-reader";
 *
 * using file = await Deno.open("./README.md", { read: true });
 * const fileStream = readableStreamFromReader(file);
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode https://jsr.io/@std/io/doc/~/toReadableStream | toReadableStream} instead.
 */
const readableStreamFromReader = _function_readableStreamFromReader
export { readableStreamFromReader }

import { readerFromIterable as _function_readerFromIterable } from "jsr:@std/streams@0.224.5"
/**
 * Create a {@linkcode https://jsr.io/@std/io/doc/types/~/Reader | Reader} from an iterable of {@linkcode Uint8Array}s.
 *
 * @param iterable An iterable or async iterable of `Uint8Array`s to convert into a `Reader`.
 * @return A `Reader` that reads from the iterable.
 *
 * @example Write `Deno.build` information to the blackhole 3 times every second
 * ```ts no-eval no-assert
 * import { readerFromIterable } from "@std/streams/reader-from-iterable";
 * import { copy } from "@std/io/copy";
 * import { delay } from "@std/async/delay";
 * import { devNull } from "node:os";
 *
 * const reader = readerFromIterable((async function* () {
 *   for (let i = 0; i < 3; i++) {
 *     await delay(1000);
 *     const message = `data: ${JSON.stringify(Deno.build)}\n\n`;
 *     yield new TextEncoder().encode(message);
 *   }
 * })());
 *
 * using blackhole = await Deno.open(devNull, { write: true });
 * await copy(reader, blackhole);
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode ReadableStream.from} instead.
 */
const readerFromIterable = _function_readerFromIterable
export { readerFromIterable }

import { readerFromStreamReader as _function_readerFromStreamReader } from "jsr:@std/streams@0.224.5"
/**
 * Create a {@linkcode https://jsr.io/@std/io/doc/types/~/Reader | Reader} from a {@linkcode ReadableStreamDefaultReader}.
 *
 * @param streamReader A `ReadableStreamDefaultReader` to convert into a `Reader`.
 * @return A `Reader` that reads from the `streamReader`.
 *
 * @example Copy the response body of a fetch request to the blackhole
 * ```ts no-eval no-assert
 * import { copy } from "@std/io/copy";
 * import { readerFromStreamReader } from "@std/streams/reader-from-stream-reader";
 * import { devNull } from "node:os";
 *
 * const res = await fetch("https://deno.land");
 * using blackhole = await Deno.open(devNull, { write: true });
 *
 * const reader = readerFromStreamReader(res.body!.getReader());
 * await copy(reader, blackhole);
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/io | @std/io} instead.
 */
const readerFromStreamReader = _function_readerFromStreamReader
export { readerFromStreamReader }

import { TextDelimiterStream as _class_TextDelimiterStream } from "jsr:@std/streams@0.224.5"
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
 * import { assertEquals } from "@std/assert/assert-equals";
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
 * import { assertEquals } from "@std/assert/assert-equals";
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

import type { TextLineStreamOptions as _interface_TextLineStreamOptions } from "jsr:@std/streams@0.224.5"
/**
 * Options for {@linkcode TextLineStream}.
 */
interface TextLineStreamOptions extends _interface_TextLineStreamOptions {}
export type { TextLineStreamOptions }

import { TextLineStream as _class_TextLineStream } from "jsr:@std/streams@0.224.5"
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

import { toArrayBuffer as _function_toArrayBuffer } from "jsr:@std/streams@0.224.5"
/**
 * Converts a {@linkcode ReadableStream} of {@linkcode Uint8Array}s to an
 * {@linkcode ArrayBuffer}. Works the same as {@linkcode Response.arrayBuffer}.
 *
 * @param readableStream A `ReadableStream` of `Uint8Array`s to convert into an `ArrayBuffer`.
 * @return A promise that resolves with the `ArrayBuffer` containing all the data from the stream.
 *
 * @example Basic usage
 * ```ts
 * import { toArrayBuffer } from "@std/streams/to-array-buffer";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream = ReadableStream.from([
 *   new Uint8Array([1, 2]),
 *   new Uint8Array([3, 4, 5]),
 * ]);
 * const buf = await toArrayBuffer(stream);
 * assertEquals(buf.byteLength, 5);
 * ```
 */
const toArrayBuffer = _function_toArrayBuffer
export { toArrayBuffer }

import { toBlob as _function_toBlob } from "jsr:@std/streams@0.224.5"
/**
 * Converts a {@linkcode ReadableStream} of {@linkcode Uint8Array}s to a
 * {@linkcode Blob}. Works the same as {@linkcode Response.blob}.
 *
 * @param stream A `ReadableStream` of `Uint8Array`s to convert into a `Blob`.
 * @return A `Promise` that resolves to the `Blob`.
 *
 * @example Basic usage
 * ```ts
 * import { toBlob } from "@std/streams/to-blob";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream = ReadableStream.from([
 *   new Uint8Array([1, 2]),
 *   new Uint8Array([3, 4, 5]),
 * ]);
 * const blob = await toBlob(stream);
 * assertEquals(blob.size, 5);
 * ```
 */
const toBlob = _function_toBlob
export { toBlob }

import { toJson as _function_toJson } from "jsr:@std/streams@0.224.5"
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

import { toText as _function_toText } from "jsr:@std/streams@0.224.5"
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

import { toTransformStream as _function_toTransformStream } from "jsr:@std/streams@0.224.5"
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
 * import { assertEquals } from "@std/assert/assert-equals";
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
 */
const toTransformStream = _function_toTransformStream
export { toTransformStream }

import type { WritableStreamFromWriterOptions as _interface_WritableStreamFromWriterOptions } from "jsr:@std/streams@0.224.5"
/**
 * Options for {@linkcode writableStreamFromWriter}.
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode https://jsr.io/@std/io/doc/~/toWritableStream | toWritableStream} instead.
 */
interface WritableStreamFromWriterOptions extends _interface_WritableStreamFromWriterOptions {}
export type { WritableStreamFromWriterOptions }

import { writableStreamFromWriter as _function_writableStreamFromWriter } from "jsr:@std/streams@0.224.5"
/**
 * Create a {@linkcode WritableStream} from a {@linkcode https://jsr.io/@std/io/doc/types/~/Writer | Writer}.
 *
 * @param writer A `Writer` to convert into a `WritableStream`.
 * @param options Options for the `writableStreamFromWriter` function.
 * @return A `WritableStream` of `Uint8Array`s.
 *
 * @example Convert `Deno.stdout` into a writable stream
 * ```ts no-eval no-assert
 * // Note that you can directly get the writer from `Deno.stdout` by
 * // `Deno.stdout.writable`. This example is just for demonstration purposes;
 * // definitely not a recommended way.
 *
 * import { writableStreamFromWriter } from "@std/streams/writable-stream-from-writer";
 *
 * const stdoutStream = writableStreamFromWriter(Deno.stdout);
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode https://jsr.io/@std/io/doc/~/toWritableStream | toWritableStream} instead.
 */
const writableStreamFromWriter = _function_writableStreamFromWriter
export { writableStreamFromWriter }

import type { Writer as _interface_Writer } from "jsr:@std/streams@0.224.5"
/**
 * An abstract interface which when implemented provides an interface to write bytes from an array buffer to a file/resource asynchronously.
 */
interface Writer extends _interface_Writer {}
export type { Writer }

import { writerFromStreamWriter as _function_writerFromStreamWriter } from "jsr:@std/streams@0.224.5"
/**
 * Create a {@linkcode https://jsr.io/@std/io/doc/types/~/Writer | Writer} from a {@linkcode WritableStreamDefaultWriter}.
 *
 * @param streamWriter A `WritableStreamDefaultWriter` to convert into a `Writer`.
 * @return A `Writer` that writes to the `WritableStreamDefaultWriter`.
 *
 * @example Read from a file and write to stdout using a writable stream
 * ```ts no-eval no-assert
 * import { copy } from "@std/io/copy";
 * import { writerFromStreamWriter } from "@std/streams/writer-from-stream-writer";
 *
 * using file = await Deno.open("./README.md", { read: true });
 *
 * const writableStream = new WritableStream({
 *   write(chunk): void {
 *     console.log(chunk);
 *   },
 * });
 * const writer = writerFromStreamWriter(writableStream.getWriter());
 * await copy(file, writer);
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode WritableStreamDefaultWriter} directly.
 */
const writerFromStreamWriter = _function_writerFromStreamWriter
export { writerFromStreamWriter }

import { zipReadableStreams as _function_zipReadableStreams } from "jsr:@std/streams@0.224.5"
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
 * import { assertEquals } from "@std/assert/assert-equals";
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
 * import { assertEquals } from "@std/assert/assert-equals";
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
 * import { assertEquals } from "@std/assert/assert-equals";
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
 * import { assertEquals } from "@std/assert/assert-equals";
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
const zipReadableStreams = _function_zipReadableStreams
export { zipReadableStreams }
