/**
 * Utilities for working with Deno's readers, writers, and web streams.
 *
 * `Reader` and `Writer` interfaces are deprecated in Deno, and so many of these
 * utilities are also deprecated. Consider using web streams instead.
 *
 * @module
 */
import { BufferFullError as _class_BufferFullError } from "jsr:@std/io@0.224.3"
/**
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class BufferFullError extends _class_BufferFullError {}
export { BufferFullError }

import { PartialReadError as _class_PartialReadError } from "jsr:@std/io@0.224.3"
/**
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class PartialReadError extends _class_PartialReadError {}
export { PartialReadError }

import type { ReadLineResult as _interface_ReadLineResult } from "jsr:@std/io@0.224.3"
/**
 * Result type returned by of BufReader.readLine().
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
interface ReadLineResult extends _interface_ReadLineResult {}
export type { ReadLineResult }

import { BufReader as _class_BufReader } from "jsr:@std/io@0.224.3"
/**
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class BufReader extends _class_BufReader {}
export { BufReader }

import { BufWriter as _class_BufWriter } from "jsr:@std/io@0.224.3"
/**
 * BufWriter implements buffering for an deno.Writer object.
 * If an error occurs writing to a Writer, no more data will be
 * accepted and all subsequent writes, and flush(), will return the error.
 * After all data has been written, the client should call the
 * flush() method to guarantee all data has been forwarded to
 * the underlying deno.Writer.
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class BufWriter extends _class_BufWriter {}
export { BufWriter }

import { BufWriterSync as _class_BufWriterSync } from "jsr:@std/io@0.224.3"
/**
 * BufWriterSync implements buffering for a deno.WriterSync object.
 * If an error occurs writing to a WriterSync, no more data will be
 * accepted and all subsequent writes, and flush(), will return the error.
 * After all data has been written, the client should call the
 * flush() method to guarantee all data has been forwarded to
 * the underlying deno.WriterSync.
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class BufWriterSync extends _class_BufWriterSync {}
export { BufWriterSync }

import { Buffer as _class_Buffer } from "jsr:@std/io@0.224.3"
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
 */
class Buffer extends _class_Buffer {}
export { Buffer }

import { copy as _function_copy } from "jsr:@std/io@0.224.3"
/**
 * Copies from `src` to `dst` until either EOF (`null`) is read from `src` or
 * an error occurs. It resolves to the number of bytes copied or rejects with
 * the first error encountered while copying.
 *
 * @example ```ts
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
 */
const copy = _function_copy
export { copy }

import { copyN as _function_copyN } from "jsr:@std/io@0.224.3"
/**
 * Copy N size at the most. If read size is lesser than N, then returns nread
 * @param r Reader
 * @param dest Writer
 * @param size Read size
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const copyN = _function_copyN
export { copyN }

import type { Reader as _interface_Reader } from "jsr:@std/io@0.224.3"
/**
 * An abstract interface which when implemented provides an interface to read bytes into an array buffer asynchronously.
 */
interface Reader extends _interface_Reader {}
export type { Reader }

import type { ReaderSync as _interface_ReaderSync } from "jsr:@std/io@0.224.3"
/**
 * An abstract interface which when implemented provides an interface to read bytes into an array buffer synchronously.
 */
interface ReaderSync extends _interface_ReaderSync {}
export type { ReaderSync }

import { iterateReader as _function_iterateReader } from "jsr:@std/io@0.224.3"
/**
 * Turns a {@linkcode Reader} into an async iterator.
 *
 * @example ```ts
 * import { iterateReader } from "@std/io/iterate-reader";
 *
 * using file = await Deno.open("/etc/passwd");
 * for await (const chunk of iterateReader(file)) {
 *   console.log(chunk);
 * }
 * ```
 *
 * Second argument can be used to tune size of a buffer.
 * Default size of the buffer is 32kB.
 *
 * @example ```ts
 * import { iterateReader } from "@std/io/iterate-reader";
 *
 * using file = await Deno.open("/etc/passwd");
 * const iter = iterateReader(file, {
 *   bufSize: 1024 * 1024
 * });
 * for await (const chunk of iter) {
 *   console.log(chunk);
 * }
 * ```
 */
const iterateReader = _function_iterateReader
export { iterateReader }

import { iterateReaderSync as _function_iterateReaderSync } from "jsr:@std/io@0.224.3"
/**
 * Turns a {@linkcode ReaderSync} into an iterator.
 *
 * ```ts
 * import { iterateReaderSync } from "@std/io/iterate-reader";
 *
 * using file = Deno.openSync("/etc/passwd");
 * for (const chunk of iterateReaderSync(file)) {
 *   console.log(chunk);
 * }
 * ```
 *
 * Second argument can be used to tune size of a buffer.
 * Default size of the buffer is 32kB.
 *
 * ```ts
 * import { iterateReaderSync } from "@std/io/iterate-reader";
 *
 * using file = await Deno.open("/etc/passwd");
 * const iter = iterateReaderSync(file, {
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
 */
const iterateReaderSync = _function_iterateReaderSync
export { iterateReaderSync }

import { LimitedReader as _class_LimitedReader } from "jsr:@std/io@0.224.3"
/**
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class LimitedReader extends _class_LimitedReader {}
export { LimitedReader }

import { MultiReader as _class_MultiReader } from "jsr:@std/io@0.224.3"
/**
 * Reader utility for combining multiple readers
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class MultiReader extends _class_MultiReader {}
export { MultiReader }

import { readAll as _function_readAll } from "jsr:@std/io@0.224.3"
/**
 * Read {@linkcode Reader} `r` until EOF (`null`) and resolve to the content as
 * {@linkcode Uint8Array}.
 *
 * @example ```ts
 * import { readAll } from "@std/io/read-all";
 *
 * // Example from stdin
 * const stdinContent = await readAll(Deno.stdin);
 *
 * // Example from file
 * using file = await Deno.open("my_file.txt", {read: true});
 * const myFileContent = await readAll(file);
 * ```
 */
const readAll = _function_readAll
export { readAll }

import { readAllSync as _function_readAllSync } from "jsr:@std/io@0.224.3"
/**
 * Synchronously reads {@linkcode ReaderSync} `r` until EOF (`null`) and returns
 * the content as {@linkcode Uint8Array}.
 *
 * @example ```ts
 * import { readAllSync } from "@std/io/read-all";
 *
 * // Example from stdin
 * const stdinContent = readAllSync(Deno.stdin);
 *
 * // Example from file
 * using file = Deno.openSync("my_file.txt", {read: true});
 * const myFileContent = readAllSync(file);
 * ```
 */
const readAllSync = _function_readAllSync
export { readAllSync }

import { readDelim as _function_readDelim } from "jsr:@std/io@0.224.3"
/**
 * Read delimited bytes from a Reader.
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readDelim = _function_readDelim
export { readDelim }

import { readInt as _function_readInt } from "jsr:@std/io@0.224.3"
/**
 * Read big endian 32bit integer from BufReader
 * @param buf
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readInt = _function_readInt
export { readInt }

import { readLines as _function_readLines } from "jsr:@std/io@0.224.3"
/**
 * Read strings line-by-line from a Reader.
 *
 * @example ```ts
 * import { readLines } from "@std/io/read-lines";
 * import * as path from "@std/path";
 *
 * const filename = path.join(Deno.cwd(), "std/io/README.md");
 * let fileReader = await Deno.open(filename);
 *
 * for await (let line of readLines(fileReader)) {
 *   console.log(line);
 * }
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readLines = _function_readLines
export { readLines }

import { readLong as _function_readLong } from "jsr:@std/io@0.224.3"
/**
 * Read big endian 64bit long from BufReader
 * @param buf
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readLong = _function_readLong
export { readLong }

import type { ByteRange as _interface_ByteRange } from "jsr:@std/io@0.224.3"
/**
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
interface ByteRange extends _interface_ByteRange {}
export type { ByteRange }

import { readRange as _function_readRange } from "jsr:@std/io@0.224.3"
/**
 * Read a range of bytes from a file or other resource that is readable and
 * seekable.  The range start and end are inclusive of the bytes within that
 * range.
 *
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { readRange } from "@std/io/read-range";
 *
 * // Read the first 10 bytes of a file
 * const file = await Deno.open("example.txt", { read: true });
 * const bytes = await readRange(file, { start: 0, end: 9 });
 * assertEquals(bytes.length, 10);
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readRange = _function_readRange
export { readRange }

import { readRangeSync as _function_readRangeSync } from "jsr:@std/io@0.224.3"
/**
 * Read a range of bytes synchronously from a file or other resource that is
 * readable and seekable.  The range start and end are inclusive of the bytes
 * within that range.
 *
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { readRangeSync } from "@std/io/read-range";
 *
 * // Read the first 10 bytes of a file
 * const file = Deno.openSync("example.txt", { read: true });
 * const bytes = readRangeSync(file, { start: 0, end: 9 });
 * assertEquals(bytes.length, 10);
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readRangeSync = _function_readRangeSync
export { readRangeSync }

import { readShort as _function_readShort } from "jsr:@std/io@0.224.3"
/**
 * Read big endian 16bit short from BufReader
 * @param buf
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readShort = _function_readShort
export { readShort }

import { readStringDelim as _function_readStringDelim } from "jsr:@std/io@0.224.3"
/**
 * Read Reader chunk by chunk, splitting based on delimiter.
 *
 * @example ```ts
 * import { readStringDelim } from "@std/io/read-string-delim";
 * import * as path from "@std/path";
 *
 * const filename = path.join(Deno.cwd(), "std/io/README.md");
 * let fileReader = await Deno.open(filename);
 *
 * for await (let line of readStringDelim(fileReader, "\n")) {
 *   console.log(line);
 * }
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readStringDelim = _function_readStringDelim
export { readStringDelim }

import { readerFromStreamReader as _function_readerFromStreamReader } from "jsr:@std/io@0.224.3"
/**
 * Create a {@linkcode Reader} from a {@linkcode ReadableStreamDefaultReader}.
 *
 * @example ```ts
 * import { copy } from "@std/io/copy";
 * import { readerFromStreamReader } from "@std/io/reader-from-stream-reader";
 *
 * const res = await fetch("https://deno.land");
 * using file = await Deno.open("./deno.land.html", { create: true, write: true });
 *
 * const reader = readerFromStreamReader(res.body!.getReader());
 * await copy(reader, file);
 * ```
 */
const readerFromStreamReader = _function_readerFromStreamReader
export { readerFromStreamReader }

import { sliceLongToBytes as _function_sliceLongToBytes } from "jsr:@std/io@0.224.3"
/**
 * Slice number into 64bit big endian byte array
 * @param d The number to be sliced
 * @param dest The sliced array
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const sliceLongToBytes = _function_sliceLongToBytes
export { sliceLongToBytes }

import { StringReader as _class_StringReader } from "jsr:@std/io@0.224.3"
/**
 * Reader utility for strings.
 *
 * @example ```ts
 * import { StringReader } from "@std/io/string-reader";
 *
 * const data = new Uint8Array(6);
 * const r = new StringReader("abcdef");
 * const res0 = await r.read(data);
 * const res1 = await r.read(new Uint8Array(6));
 *
 * // Number of bytes read
 * console.log(res0); // 6
 * console.log(res1); // null, no byte left to read. EOL
 *
 * // text
 *
 * console.log(new TextDecoder().decode(data)); // abcdef
 * ```
 *
 * **Output:**
 *
 * ```text
 * 6
 * null
 * abcdef
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class StringReader extends _class_StringReader {}
export { StringReader }

import { StringWriter as _class_StringWriter } from "jsr:@std/io@0.224.3"
/**
 * Writer utility for buffering string chunks.
 *
 * @example ```ts
 * import {
 *   copyN,
 *   StringReader,
 *   StringWriter,
 * } from "@std/io";
 * import { copy } from "@std/io/copy";
 *
 * const w = new StringWriter("base");
 * const r = new StringReader("0123456789");
 * await copyN(r, w, 4); // copy 4 bytes
 *
 * // Number of bytes read
 * console.log(w.toString()); //base0123
 *
 * await copy(r, w); // copy all
 * console.log(w.toString()); // base0123456789
 * ```
 *
 * **Output:**
 *
 * ```text
 * base0123
 * base0123456789
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class StringWriter extends _class_StringWriter {}
export { StringWriter }

import type { ToReadableStreamOptions as _interface_ToReadableStreamOptions } from "jsr:@std/io@0.224.3"
/**
 * Options for {@linkcode toReadableStream}.
 */
interface ToReadableStreamOptions extends _interface_ToReadableStreamOptions {}
export type { ToReadableStreamOptions }

import { toReadableStream as _function_toReadableStream } from "jsr:@std/io@0.224.3"
/**
 * Create a {@linkcode ReadableStream} of {@linkcode Uint8Array}s from a
 * {@linkcode Reader}.
 *
 * When the pull algorithm is called on the stream, a chunk from the reader
 * will be read.  When `null` is returned from the reader, the stream will be
 * closed along with the reader (if it is also a `Closer`).
 *
 * @example ```ts
 * import { toReadableStream } from "@std/io/to-readable-stream";
 *
 * const file = await Deno.open("./file.txt", { read: true });
 * const fileStream = toReadableStream(file);
 * ```
 */
const toReadableStream = _function_toReadableStream
export { toReadableStream }

import type { toWritableStreamOptions as _interface_toWritableStreamOptions } from "jsr:@std/io@0.224.3"
/**
 * Options for {@linkcode toWritableStream}.
 */
interface toWritableStreamOptions extends _interface_toWritableStreamOptions {}
export type { toWritableStreamOptions }

import { toWritableStream as _function_toWritableStream } from "jsr:@std/io@0.224.3"
/**
 * Create a {@linkcode WritableStream} from a {@linkcode Writer}.
 *
 * @example ```ts
 * import { toWritableStream } from "@std/io/to-writable-stream";
 *
 * const file = await Deno.open("./file.txt", { create: true, write: true });
 * await ReadableStream.from("Hello World")
 *   .pipeThrough(new TextEncoderStream())
 *   .pipeTo(toWritableStream(file));
 * ```
 */
const toWritableStream = _function_toWritableStream
export { toWritableStream }

import type { Writer as _interface_Writer } from "jsr:@std/io@0.224.3"
/**
 * An abstract interface which when implemented provides an interface to write bytes from an array buffer to a file/resource asynchronously.
 */
interface Writer extends _interface_Writer {}
export type { Writer }

import type { WriterSync as _interface_WriterSync } from "jsr:@std/io@0.224.3"
/**
 * An abstract interface which when implemented provides an interface to write bytes from an array buffer to a file/resource synchronously.
 */
interface WriterSync extends _interface_WriterSync {}
export type { WriterSync }

import type { Closer as _interface_Closer } from "jsr:@std/io@0.224.3"
/**
 * An abstract interface which when implemented provides an interface to close files/resources that were previously opened.
 */
interface Closer extends _interface_Closer {}
export type { Closer }

import { writeAll as _function_writeAll } from "jsr:@std/io@0.224.3"
/**
 * Write all the content of the array buffer (`arr`) to the writer (`w`).
 *
 * @example ```ts
 * import { writeAll } from "@std/io/write-all";
 *
 * // Example writing to stdout
 * let contentBytes = new TextEncoder().encode("Hello World");
 * await writeAll(Deno.stdout, contentBytes);
 *
 * // Example writing to file
 * contentBytes = new TextEncoder().encode("Hello World");
 * using file = await Deno.open('test.file', {write: true});
 * await writeAll(file, contentBytes);
 * ```
 */
const writeAll = _function_writeAll
export { writeAll }

import { writeAllSync as _function_writeAllSync } from "jsr:@std/io@0.224.3"
/**
 * Synchronously write all the content of the array buffer (`arr`) to the
 * writer (`w`).
 *
 * @example ```ts
 * import { writeAllSync } from "@std/io/write-all";
 *
 * // Example writing to stdout
 * let contentBytes = new TextEncoder().encode("Hello World");
 * writeAllSync(Deno.stdout, contentBytes);
 *
 * // Example writing to file
 * contentBytes = new TextEncoder().encode("Hello World");
 * using file = Deno.openSync('test.file', {write: true});
 * writeAllSync(file, contentBytes);
 * ```
 */
const writeAllSync = _function_writeAllSync
export { writeAllSync }
