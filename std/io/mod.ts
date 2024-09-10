/**
 * Utilities for working with Deno's readers, writers, and web streams.
 *
 * `Reader` and `Writer` interfaces are deprecated in Deno, and so many of these
 * utilities are also deprecated. Consider using web streams instead.
 *
 * ```ts no-assert
 * import { toReadableStream, toWritableStream } from "@std/io";
 *
 * await toReadableStream(Deno.stdin)
 *   .pipeTo(toWritableStream(Deno.stdout));
 * ```
 *
 * @module
 */
import { BufferFullError as _class_BufferFullError } from "jsr:@std/io@0.224.7"
/**
 * Thrown when a write operation is attempted on a full buffer.
 *
 * @example Usage
 * ```ts
 * import { BufWriter, BufferFullError, Writer } from "@std/io";
 * import { assert, assertEquals } from "@std/assert";
 *
 * const writer: Writer = {
 *   write(p: Uint8Array): Promise<number> {
 *     throw new BufferFullError(p);
 *   }
 * };
 * const bufWriter = new BufWriter(writer);
 * try {
 *   await bufWriter.write(new Uint8Array([1, 2, 3]));
 * } catch (err) {
 *   assert(err instanceof BufferFullError);
 *   assertEquals(err.partial, new Uint8Array([3]));
 * }
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class BufferFullError extends _class_BufferFullError {}
export { BufferFullError }

import { PartialReadError as _class_PartialReadError } from "jsr:@std/io@0.224.7"
/**
 * Thrown when a read from a stream fails to read the
 * requested number of bytes.
 *
 * @example Usage
 * ```ts
 * import { PartialReadError } from "@std/io";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const err = new PartialReadError(new Uint8Array(2));
 * assertEquals(err.name, "PartialReadError");
 *
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class PartialReadError extends _class_PartialReadError {}
export { PartialReadError }

import type { ReadLineResult as _interface_ReadLineResult } from "jsr:@std/io@0.224.7"
/**
 * Result type returned by of {@linkcode BufReader.readLine}.
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
interface ReadLineResult extends _interface_ReadLineResult {}
export type { ReadLineResult }

import { BufReader as _class_BufReader } from "jsr:@std/io@0.224.7"
/**
 * Implements buffering for a {@linkcode Reader} object.
 *
 * @example Usage
 * ```ts
 * import { BufReader, Buffer } from "@std/io";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const encoder = new TextEncoder();
 * const decoder = new TextDecoder();
 *
 * const reader = new BufReader(new Buffer(encoder.encode("hello world")));
 * const buf = new Uint8Array(11);
 * await reader.read(buf);
 * assertEquals(decoder.decode(buf), "hello world");
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class BufReader extends _class_BufReader {}
export { BufReader }

import { AbstractBufBase as _class_AbstractBufBase } from "jsr:@std/io@0.224.7"
/**
 * AbstractBufBase is a base class which other classes can embed to
 * implement the {@inkcode Reader} and {@linkcode Writer} interfaces.
 * It provides basic implementations of those interfaces based on a buffer
 * array.
 *
 * @example Usage
 * ```ts no-assert
 * import { AbstractBufBase } from "@std/io/buf-writer";
 * import { Reader } from "@std/io/types";
 *
 * class MyBufReader extends AbstractBufBase {
 *   constructor(buf: Uint8Array) {
 *     super(buf);
 *   }
 * }
 * ```
 *
 * @internal
 */
abstract class AbstractBufBase extends _class_AbstractBufBase {}
export { AbstractBufBase }

import { BufWriter as _class_BufWriter } from "jsr:@std/io@0.224.7"
/**
 * `BufWriter` implements buffering for an {@linkcode Writer} object.
 * If an error occurs writing to a Writer, no more data will be
 * accepted and all subsequent writes, and flush(), will return the error.
 * After all data has been written, the client should call the
 * flush() method to guarantee all data has been forwarded to
 * the underlying deno.Writer.
 *
 * @example Usage
 * ```ts
 * import { BufWriter } from "@std/io/buf-writer";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const writer = {
 *   write(p: Uint8Array): Promise<number> {
 *     return Promise.resolve(p.length);
 *   }
 * };
 *
 * const bufWriter = new BufWriter(writer);
 * const data = new Uint8Array(1024);
 *
 * await bufWriter.write(data);
 * await bufWriter.flush();
 *
 * assertEquals(bufWriter.buffered(), 0);
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class BufWriter extends _class_BufWriter {}
export { BufWriter }

import { BufWriterSync as _class_BufWriterSync } from "jsr:@std/io@0.224.7"
/**
 * BufWriterSync implements buffering for a deno.WriterSync object.
 * If an error occurs writing to a WriterSync, no more data will be
 * accepted and all subsequent writes, and flush(), will return the error.
 * After all data has been written, the client should call the
 * flush() method to guarantee all data has been forwarded to
 * the underlying deno.WriterSync.
 *
 * @example Usage
 * ```ts
 * import { BufWriterSync } from "@std/io/buf-writer";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const writer = {
 *   writeSync(p: Uint8Array): number {
 *     return p.length;
 *   }
 * };
 *
 * const bufWriter = new BufWriterSync(writer);
 * const data = new Uint8Array(1024);
 *
 * bufWriter.writeSync(data);
 * bufWriter.flush();
 *
 * assertEquals(bufWriter.buffered(), 0);
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class BufWriterSync extends _class_BufWriterSync {}
export { BufWriterSync }

import { Buffer as _class_Buffer } from "jsr:@std/io@0.224.7"
/**
 * A variable-sized buffer of bytes with `read()` and `write()` methods.
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
 * @example Usage
 * ```ts
 * import { Buffer } from "@std/io/buffer";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const buf = new Buffer();
 * await buf.write(new TextEncoder().encode("Hello, "));
 * await buf.write(new TextEncoder().encode("world!"));
 *
 * const data = new Uint8Array(13);
 * await buf.read(data);
 *
 * assertEquals(new TextDecoder().decode(data), "Hello, world!");
 * ```
 */
class Buffer extends _class_Buffer {}
export { Buffer }

import { copy as _function_copy } from "jsr:@std/io@0.224.7"
/**
 * Copies from `src` to `dst` until either EOF (`null`) is read from `src` or
 * an error occurs. It resolves to the number of bytes copied or rejects with
 * the first error encountered while copying.
 *
 * @example Usage
 * ```ts no-eval
 * import { copy } from "@std/io/copy";
 *
 * const source = await Deno.open("my_file.txt");
 * const bytesCopied1 = await copy(source, Deno.stdout);
 * const destination = await Deno.create("my_file_2.txt");
 * const bytesCopied2 = await copy(source, destination);
 * ```
 *
 * @param src The source to copy from
 * @param dst The destination to copy to
 * @param options Can be used to tune size of the buffer. Default size is 32kB
 * @return Number of bytes copied
 */
const copy = _function_copy as typeof _function_copy
export { copy }

import { copyN as _function_copyN } from "jsr:@std/io@0.224.7"
/**
 * Copy N size at the most. If read size is lesser than N, then returns nread
 *
 * @example Usage
 * ```ts
 * import { copyN } from "@std/io/copy-n";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const source = await Deno.open("README.md");
 *
 * const res = await copyN(source, Deno.stdout, 10);
 * assertEquals(res, 10);
 * ```
 *
 * @param r Reader
 * @param dest Writer
 * @param size Read size
 * @return Number of bytes copied
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const copyN = _function_copyN as typeof _function_copyN
export { copyN }

import type { Reader as _interface_Reader } from "jsr:@std/io@0.224.7"
/**
 * An abstract interface which when implemented provides an interface to read bytes into an array buffer asynchronously.
 */
interface Reader extends _interface_Reader {}
export type { Reader }

import type { ReaderSync as _interface_ReaderSync } from "jsr:@std/io@0.224.7"
/**
 * An abstract interface which when implemented provides an interface to read bytes into an array buffer synchronously.
 */
interface ReaderSync extends _interface_ReaderSync {}
export type { ReaderSync }

import { iterateReader as _function_iterateReader } from "jsr:@std/io@0.224.7"
/**
 * Turns a {@linkcode Reader} into an async iterator.
 *
 * @example Usage
 * ```ts no-assert
 * import { iterateReader } from "@std/io/iterate-reader";
 *
 * using file = await Deno.open("README.md");
 * for await (const chunk of iterateReader(file)) {
 *   console.log(chunk);
 * }
 * ```
 *
 * @example Usage with buffer size
 * ```ts no-assert
 * import { iterateReader } from "@std/io/iterate-reader";
 *
 * using file = await Deno.open("README.md");
 * const iter = iterateReader(file, {
 *   bufSize: 1024 * 1024
 * });
 * for await (const chunk of iter) {
 *   console.log(chunk);
 * }
 * ```
 *
 * @param reader The reader to read from
 * @param options The options
 * @param options.bufSize The size of the buffer to use
 * @return The async iterator of Uint8Array chunks
 */
const iterateReader = _function_iterateReader as typeof _function_iterateReader
export { iterateReader }

import { iterateReaderSync as _function_iterateReaderSync } from "jsr:@std/io@0.224.7"
/**
 * Turns a {@linkcode ReaderSync} into an iterator.
 *
 * @example Usage
 * ```ts
 * import { iterateReaderSync } from "@std/io/iterate-reader";
 * import { assert } from "@std/assert/assert"
 *
 * using file = Deno.openSync("README.md");
 * for (const chunk of iterateReaderSync(file)) {
 *   assert(chunk instanceof Uint8Array);
 * }
 * ```
 *
 * Second argument can be used to tune size of a buffer.
 * Default size of the buffer is 32kB.
 *
 * @example Usage with buffer size
 * ```ts
 * import { iterateReaderSync } from "@std/io/iterate-reader";
 * import { assert } from "@std/assert/assert"
 *
 * using file = await Deno.open("README.md");
 * const iter = iterateReaderSync(file, {
 *   bufSize: 1024 * 1024
 * });
 * for (const chunk of iter) {
 *   assert(chunk instanceof Uint8Array);
 * }
 * ```
 *
 * Iterator uses an internal buffer of fixed size for efficiency; it returns
 * a view on that buffer on each iteration. It is therefore caller's
 * responsibility to copy contents of the buffer if needed; otherwise the
 * next iteration will overwrite contents of previously returned chunk.
 *
 * @param reader The reader to read from
 * @param options The options
 * @return The iterator of Uint8Array chunks
 */
const iterateReaderSync = _function_iterateReaderSync as typeof _function_iterateReaderSync
export { iterateReaderSync }

import { LimitedReader as _class_LimitedReader } from "jsr:@std/io@0.224.7"
/**
 * Reads from `reader` but limits the amount of data returned to just `limit` bytes.
 * Each call to `read` updates `limit` to reflect the new amount remaining.
 * `read` returns `null` when `limit` <= `0` or
 * when the underlying `reader` returns `null`.
 *
 * @example Usage
 * ```ts
 * import { StringReader } from "@std/io/string-reader";
 * import { LimitedReader } from "@std/io/limited-reader";
 * import { readAll } from "@std/io/read-all";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const r = new StringReader("hello world");
 * const lr = new LimitedReader(r, 5);
 * const res = await readAll(lr);
 *
 * assertEquals(new TextDecoder().decode(res), "hello");
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class LimitedReader extends _class_LimitedReader {}
export { LimitedReader }

import { MultiReader as _class_MultiReader } from "jsr:@std/io@0.224.7"
/**
 * Reader utility for combining multiple readers.
 *
 * @example Usage
 * ```ts
 * import { MultiReader } from "@std/io/multi-reader";
 * import { StringReader } from "@std/io/string-reader";
 * import { readAll } from "@std/io/read-all";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const r1 = new StringReader("hello");
 * const r2 = new StringReader("world");
 * const mr = new MultiReader([r1, r2]);
 *
 * const res = await readAll(mr);
 *
 * assertEquals(new TextDecoder().decode(res), "helloworld");
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class MultiReader extends _class_MultiReader {}
export { MultiReader }

import { readAll as _function_readAll } from "jsr:@std/io@0.224.7"
/**
 * Read {@linkcode Reader} `r` until EOF (`null`) and resolve to the content as
 * {@linkcode Uint8Array}.
 *
 * @example Usage
 * ```ts no-eval
 * import { readAll } from "@std/io/read-all";
 *
 * // Example from stdin
 * const stdinContent = await readAll(Deno.stdin);
 *
 * // Example from file
 * using file = await Deno.open("my_file.txt", {read: true});
 * const myFileContent = await readAll(file);
 * ```
 *
 * @param reader The reader to read from
 * @return The content as Uint8Array
 */
const readAll = _function_readAll as typeof _function_readAll
export { readAll }

import { readAllSync as _function_readAllSync } from "jsr:@std/io@0.224.7"
/**
 * Synchronously reads {@linkcode ReaderSync} `r` until EOF (`null`) and returns
 * the content as {@linkcode Uint8Array}.
 *
 * @example Usage
 * ```ts no-eval
 * import { readAllSync } from "@std/io/read-all";
 *
 * // Example from stdin
 * const stdinContent = readAllSync(Deno.stdin);
 *
 * // Example from file
 * using file = Deno.openSync("my_file.txt", {read: true});
 * const myFileContent = readAllSync(file);
 * ```
 *
 * @param reader The reader to read from
 * @return The content as Uint8Array
 */
const readAllSync = _function_readAllSync as typeof _function_readAllSync
export { readAllSync }

import { readDelim as _function_readDelim } from "jsr:@std/io@0.224.7"
/**
 * Read delimited bytes from a {@linkcode Reader} through an
 * {@linkcode AsyncIterableIterator} of {@linkcode Uint8Array}.
 *
 * @example Usage
 * ```ts
 * import { readDelim } from "@std/io/read-delim";
 * import { assert } from "@std/assert/assert"
 *
 * const fileReader = await Deno.open("README.md");
 * for await (const chunk of readDelim(fileReader, new TextEncoder().encode("\n"))) {
 *   assert(chunk instanceof Uint8Array);
 * }
 * ```
 *
 * @param reader The reader to read from
 * @param delim The delimiter to read until
 * @return The {@linkcode AsyncIterableIterator} of {@linkcode Uint8Array}s.
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readDelim = _function_readDelim as typeof _function_readDelim
export { readDelim }

import { readInt as _function_readInt } from "jsr:@std/io@0.224.7"
/**
 * Read big endian 32bit integer from a {@linkcode BufReader}.
 *
 * @example Usage
 * ```ts
 * import { Buffer } from "@std/io/buffer"
 * import { BufReader } from "@std/io/buf-reader";
 * import { readInt } from "@std/io/read-int";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const buf = new BufReader(new Buffer(new Uint8Array([0x12, 0x34, 0x56, 0x78])));
 * const int = await readInt(buf);
 * assertEquals(int, 0x12345678);
 * ```
 *
 * @param buf The buffer reader to read from
 * @return The 32bit integer
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readInt = _function_readInt as typeof _function_readInt
export { readInt }

import { readLines as _function_readLines } from "jsr:@std/io@0.224.7"
/**
 * Read strings line-by-line from a {@linkcode Reader}.
 *
 * @example Usage
 * ```ts
 * import { readLines } from "@std/io/read-lines";
 * import { assert } from "@std/assert/assert"
 *
 * let fileReader = await Deno.open("README.md");
 *
 * for await (let line of readLines(fileReader)) {
 *   assert(typeof line === "string");
 * }
 * ```
 *
 * @param reader The reader to read from
 * @param decoderOpts The options
 * @return The async iterator of strings
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readLines = _function_readLines as typeof _function_readLines
export { readLines }

import { readLong as _function_readLong } from "jsr:@std/io@0.224.7"
/**
 * Read big endian 64bit long from a {@linkcode BufReader}.
 *
 * @example Usage
 * ```ts
 * import { Buffer } from "@std/io/buffer"
 * import { BufReader } from "@std/io/buf-reader";
 * import { readLong } from "@std/io/read-long";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const buf = new BufReader(new Buffer(new Uint8Array([0, 0, 0, 0x12, 0x34, 0x56, 0x78, 0x9a])));
 * const long = await readLong(buf);
 * assertEquals(long, 0x123456789a);
 * ```
 *
 * @param buf The BufReader to read from
 * @return The 64bit long
 * @throws If the reader returns unexpected EOF
 * @throws If the long value is too big to be represented as a JavaScript number
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readLong = _function_readLong as typeof _function_readLong
export { readLong }

import type { ByteRange as _interface_ByteRange } from "jsr:@std/io@0.224.7"
/**
 * The range of bytes to read from a file or other resource that is readable.
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
interface ByteRange extends _interface_ByteRange {}
export type { ByteRange }

import { readRange as _function_readRange } from "jsr:@std/io@0.224.7"
/**
 * Read a range of bytes from a file or other resource that is readable and
 * seekable.  The range start and end are inclusive of the bytes within that
 * range.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertEquals } from "@std/assert";
 * import { readRange } from "@std/io/read-range";
 *
 * // Read the first 10 bytes of a file
 * const file = await Deno.open("example.txt", { read: true });
 * const bytes = await readRange(file, { start: 0, end: 9 });
 * assertEquals(bytes.length, 10);
 * ```
 *
 * @param r The reader to read from
 * @param range The range of bytes to read
 * @return The bytes read
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readRange = _function_readRange as typeof _function_readRange
export { readRange }

import { readRangeSync as _function_readRangeSync } from "jsr:@std/io@0.224.7"
/**
 * Read a range of bytes synchronously from a file or other resource that is
 * readable and seekable.  The range start and end are inclusive of the bytes
 * within that range.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertEquals } from "@std/assert";
 * import { readRangeSync } from "@std/io/read-range";
 *
 * // Read the first 10 bytes of a file
 * const file = Deno.openSync("example.txt", { read: true });
 * const bytes = readRangeSync(file, { start: 0, end: 9 });
 * assertEquals(bytes.length, 10);
 * ```
 *
 * @param r The reader to read from
 * @param range The range of bytes to read
 * @return The bytes read
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readRangeSync = _function_readRangeSync as typeof _function_readRangeSync
export { readRangeSync }

import { readShort as _function_readShort } from "jsr:@std/io@0.224.7"
/**
 * Read big endian 16bit short from a {@linkcode BufReader}.
 *
 * @example Usage
 * ```ts
 * import { Buffer } from "@std/io/buffer"
 * import { BufReader } from "@std/io/buf-reader";
 * import { readShort } from "@std/io/read-short";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const buf = new BufReader(new Buffer(new Uint8Array([0x12, 0x34])));
 * const short = await readShort(buf);
 * assertEquals(short, 0x1234);
 * ```
 *
 * @param buf The reader to read from
 * @return The 16bit short
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readShort = _function_readShort as typeof _function_readShort
export { readShort }

import { readStringDelim as _function_readStringDelim } from "jsr:@std/io@0.224.7"
/**
 * Read {@linkcode Reader} chunk by chunk, splitting based on delimiter.
 *
 * @example Usage
 * ```ts
 * import { readStringDelim } from "@std/io/read-string-delim";
 * import { assert } from "@std/assert/assert"
 *
 * let fileReader = await Deno.open("README.md");
 *
 * for await (let line of readStringDelim(fileReader, "\n")) {
 *   assert(typeof line === "string");
 * }
 * ```
 *
 * @param reader The reader to read from
 * @param delim The delimiter to split the reader by
 * @param decoderOpts The options
 * @return The async iterator of strings
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readStringDelim = _function_readStringDelim as typeof _function_readStringDelim
export { readStringDelim }

import { readerFromStreamReader as _function_readerFromStreamReader } from "jsr:@std/io@0.224.7"
/**
 * Create a {@linkcode Reader} from a {@linkcode ReadableStreamDefaultReader}.
 *
 * @example Usage
 * ```ts no-assert
 * import { copy } from "@std/io/copy";
 * import { readerFromStreamReader } from "@std/io/reader-from-stream-reader";
 *
 * const res = await fetch("https://deno.land");
 *
 * const reader = readerFromStreamReader(res.body!.getReader());
 * await copy(reader, Deno.stdout);
 * ```
 *
 * @param streamReader The stream reader to read from
 * @return The reader
 */
const readerFromStreamReader = _function_readerFromStreamReader as typeof _function_readerFromStreamReader
export { readerFromStreamReader }

import { sliceLongToBytes as _function_sliceLongToBytes } from "jsr:@std/io@0.224.7"
/**
 * Slice number into 64bit big endian byte array.
 *
 * @example Usage
 * ```ts
 * import { sliceLongToBytes } from "@std/io/slice-long-to-bytes";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const dest = sliceLongToBytes(0x123456789a);
 * assertEquals(dest, [0, 0, 0, 0x12, 0x34, 0x56, 0x78, 0x9a]);
 * ```
 *
 * @param d The number to be sliced
 * @param dest The array to store the sliced bytes
 * @return The sliced bytes
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const sliceLongToBytes = _function_sliceLongToBytes as typeof _function_sliceLongToBytes
export { sliceLongToBytes }

import { StringReader as _class_StringReader } from "jsr:@std/io@0.224.7"
/**
 * Reader utility for strings.
 *
 * @example Usage
 * ```ts
 * import { StringReader } from "@std/io/string-reader";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = new Uint8Array(6);
 * const r = new StringReader("abcdef");
 * const res0 = await r.read(data);
 * const res1 = await r.read(new Uint8Array(6));
 *
 * assertEquals(res0, 6);
 * assertEquals(res1, null);
 * assertEquals(new TextDecoder().decode(data), "abcdef");
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class StringReader extends _class_StringReader {}
export { StringReader }

import { StringWriter as _class_StringWriter } from "jsr:@std/io@0.224.7"
/**
 * Writer utility for buffering string chunks.
 *
 * @example Usage
 * ```ts
 * import {
 *   copyN,
 *   StringReader,
 *   StringWriter,
 * } from "@std/io";
 * import { copy } from "@std/io/copy";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const w = new StringWriter("base");
 * const r = new StringReader("0123456789");
 * await copyN(r, w, 4); // copy 4 bytes
 *
 * assertEquals(w.toString(), "base0123");
 *
 * await copy(r, w); // copy all
 * assertEquals(w.toString(), "base0123456789");
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class StringWriter extends _class_StringWriter {}
export { StringWriter }

import type { ToReadableStreamOptions as _interface_ToReadableStreamOptions } from "jsr:@std/io@0.224.7"
/**
 * Options for {@linkcode toReadableStream}.
 */
interface ToReadableStreamOptions extends _interface_ToReadableStreamOptions {}
export type { ToReadableStreamOptions }

import { toReadableStream as _function_toReadableStream } from "jsr:@std/io@0.224.7"
/**
 * Create a {@linkcode ReadableStream} of {@linkcode Uint8Array}s from a
 * {@linkcode Reader}.
 *
 * When the pull algorithm is called on the stream, a chunk from the reader
 * will be read.  When `null` is returned from the reader, the stream will be
 * closed along with the reader (if it is also a `Closer`).
 *
 * @example Usage
 * ```ts no-assert
 * import { toReadableStream } from "@std/io/to-readable-stream";
 *
 * const file = await Deno.open("./README.md", { read: true });
 * const fileStream = toReadableStream(file);
 * ```
 *
 * @param reader The reader to read from
 * @param options The options
 * @return The readable stream
 */
const toReadableStream = _function_toReadableStream as typeof _function_toReadableStream
export { toReadableStream }

import type { toWritableStreamOptions as _interface_toWritableStreamOptions } from "jsr:@std/io@0.224.7"
/**
 * Options for {@linkcode toWritableStream}.
 */
interface toWritableStreamOptions extends _interface_toWritableStreamOptions {}
export type { toWritableStreamOptions }

import { toWritableStream as _function_toWritableStream } from "jsr:@std/io@0.224.7"
/**
 * Create a {@linkcode WritableStream} from a {@linkcode Writer}.
 *
 * @example Usage
 * ```ts no-assert
 * import { toWritableStream } from "@std/io/to-writable-stream";
 *
 * await ReadableStream.from(["Hello World"])
 *   .pipeThrough(new TextEncoderStream())
 *   .pipeTo(toWritableStream(Deno.stdout));
 * ```
 *
 * @param writer The writer to write to
 * @param options The options
 * @return The writable stream
 */
const toWritableStream = _function_toWritableStream as typeof _function_toWritableStream
export { toWritableStream }

import type { Writer as _interface_Writer } from "jsr:@std/io@0.224.7"
/**
 * An abstract interface which when implemented provides an interface to write bytes from an array buffer to a file/resource asynchronously.
 */
interface Writer extends _interface_Writer {}
export type { Writer }

import type { WriterSync as _interface_WriterSync } from "jsr:@std/io@0.224.7"
/**
 * An abstract interface which when implemented provides an interface to write bytes from an array buffer to a file/resource synchronously.
 */
interface WriterSync extends _interface_WriterSync {}
export type { WriterSync }

import type { Closer as _interface_Closer } from "jsr:@std/io@0.224.7"
/**
 * An abstract interface which when implemented provides an interface to close files/resources that were previously opened.
 */
interface Closer extends _interface_Closer {}
export type { Closer }

import { writeAll as _function_writeAll } from "jsr:@std/io@0.224.7"
/**
 * Write all the content of the array buffer (`arr`) to the writer (`w`).
 *
 * @example Writing to stdout
 * ```ts no-assert
 * import { writeAll } from "@std/io/write-all";
 *
 * const contentBytes = new TextEncoder().encode("Hello World");
 * await writeAll(Deno.stdout, contentBytes);
 * ```
 *
 * @example Writing to file
 * ```ts no-eval no-assert
 * import { writeAll } from "@std/io/write-all";
 *
 * const contentBytes = new TextEncoder().encode("Hello World");
 * using file = await Deno.open('test.file', { write: true });
 * await writeAll(file, contentBytes);
 * ```
 *
 * @param writer The writer to write to
 * @param data The data to write
 */
const writeAll = _function_writeAll as typeof _function_writeAll
export { writeAll }

import { writeAllSync as _function_writeAllSync } from "jsr:@std/io@0.224.7"
/**
 * Synchronously write all the content of the array buffer (`arr`) to the
 * writer (`w`).
 *
 * @example "riting to stdout
 * ```ts no-assert
 * import { writeAllSync } from "@std/io/write-all";
 *
 * const contentBytes = new TextEncoder().encode("Hello World");
 * writeAllSync(Deno.stdout, contentBytes);
 * ```
 *
 * @example Writing to file
 * ```ts no-eval no-assert
 * import { writeAllSync } from "@std/io/write-all";
 *
 * const contentBytes = new TextEncoder().encode("Hello World");
 * using file = Deno.openSync("test.file", { write: true });
 * writeAllSync(file, contentBytes);
 * ```
 *
 * @param writer The writer to write to
 * @param data The data to write
 */
const writeAllSync = _function_writeAllSync as typeof _function_writeAllSync
export { writeAllSync }
