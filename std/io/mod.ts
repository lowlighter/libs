/**
 * Utilities for working with Deno's readers, writers, and web streams.
 *
 * `Reader` and `Writer` interfaces are deprecated in Deno, and so many of these
 * utilities are also deprecated. Consider using web streams instead.
 *
 * ```ts ignore
 * import { toReadableStream, toWritableStream } from "@std/io";
 *
 * await toReadableStream(Deno.stdin)
 *   .pipeTo(toWritableStream(Deno.stdout));
 * ```
 *
 * @module
 */
import { Buffer as _class_Buffer } from "jsr:@std/io@0.225.0"
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

import { copy as _function_copy } from "jsr:@std/io@0.225.0"
/**
 * Copies from `src` to `dst` until either EOF (`null`) is read from `src` or
 * an error occurs. It resolves to the number of bytes copied or rejects with
 * the first error encountered while copying.
 *
 * @example Usage
 * ```ts ignore
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

import type { Reader as _interface_Reader } from "jsr:@std/io@0.225.0"
/**
 * An abstract interface which when implemented provides an interface to read
 * bytes into an array buffer asynchronously.
 */
interface Reader extends _interface_Reader {}
export type { Reader }

import type { ReaderSync as _interface_ReaderSync } from "jsr:@std/io@0.225.0"
/**
 * An abstract interface which when implemented provides an interface to read
 * bytes into an array buffer synchronously.
 */
interface ReaderSync extends _interface_ReaderSync {}
export type { ReaderSync }

import { iterateReader as _function_iterateReader } from "jsr:@std/io@0.225.0"
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

import { iterateReaderSync as _function_iterateReaderSync } from "jsr:@std/io@0.225.0"
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

import { readAll as _function_readAll } from "jsr:@std/io@0.225.0"
/**
 * Read {@linkcode Reader} `r` until EOF (`null`) and resolve to the content as
 * {@linkcode Uint8Array}.
 *
 * @example Usage
 * ```ts ignore
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

import { readAllSync as _function_readAllSync } from "jsr:@std/io@0.225.0"
/**
 * Synchronously reads {@linkcode ReaderSync} `r` until EOF (`null`) and returns
 * the content as {@linkcode Uint8Array}.
 *
 * @example Usage
 * ```ts ignore
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

import { readerFromStreamReader as _function_readerFromStreamReader } from "jsr:@std/io@0.225.0"
/**
 * Create a {@linkcode Reader} from a {@linkcode ReadableStreamDefaultReader}.
 *
 * @example Usage
 * ```ts ignore
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

import type { ToReadableStreamOptions as _interface_ToReadableStreamOptions } from "jsr:@std/io@0.225.0"
/**
 * Options for {@linkcode toReadableStream}.
 */
interface ToReadableStreamOptions extends _interface_ToReadableStreamOptions {}
export type { ToReadableStreamOptions }

import { toReadableStream as _function_toReadableStream } from "jsr:@std/io@0.225.0"
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
 * using file = await Deno.open("./README.md", { read: true });
 * const fileStream = toReadableStream(file);
 * ```
 *
 * @param reader The reader to read from
 * @param options The options
 * @return The readable stream
 */
const toReadableStream = _function_toReadableStream as typeof _function_toReadableStream
export { toReadableStream }

import type { toWritableStreamOptions as _interface_toWritableStreamOptions } from "jsr:@std/io@0.225.0"
/**
 * Options for {@linkcode toWritableStream}.
 */
interface toWritableStreamOptions extends _interface_toWritableStreamOptions {}
export type { toWritableStreamOptions }

import { toWritableStream as _function_toWritableStream } from "jsr:@std/io@0.225.0"
/**
 * Create a {@linkcode WritableStream} from a {@linkcode Writer}.
 *
 * @example Usage
 * ```ts no-assert
 * import { toWritableStream } from "@std/io/to-writable-stream";
 *
 * const a = toWritableStream(Deno.stdout); // Same as `Deno.stdout.writable`
 * ```
 *
 * @param writer The writer to write to
 * @param options The options
 * @return The writable stream
 */
const toWritableStream = _function_toWritableStream as typeof _function_toWritableStream
export { toWritableStream }

import type { Writer as _interface_Writer } from "jsr:@std/io@0.225.0"
/**
 * An abstract interface which when implemented provides an interface to write
 * bytes from an array buffer to a file/resource asynchronously.
 */
interface Writer extends _interface_Writer {}
export type { Writer }

import type { WriterSync as _interface_WriterSync } from "jsr:@std/io@0.225.0"
/**
 * An abstract interface which when implemented provides an interface to write
 * bytes from an array buffer to a file/resource synchronously.
 */
interface WriterSync extends _interface_WriterSync {}
export type { WriterSync }

import type { Closer as _interface_Closer } from "jsr:@std/io@0.225.0"
/**
 * An abstract interface which when implemented provides an interface to close
 * files/resources that were previously opened.
 */
interface Closer extends _interface_Closer {}
export type { Closer }

import { SeekMode as _enum_SeekMode } from "jsr:@std/io@0.225.0"
/**
 * A enum which defines the seek mode for IO related APIs that support
 * seeking.
 */
const SeekMode = _enum_SeekMode as typeof _enum_SeekMode
export { SeekMode }

import type { Seeker as _interface_Seeker } from "jsr:@std/io@0.225.0"
/**
 * An abstract interface which when implemented provides an interface to seek
 * within an open file/resource asynchronously.
 */
interface Seeker extends _interface_Seeker {}
export type { Seeker }

import type { SeekerSync as _interface_SeekerSync } from "jsr:@std/io@0.225.0"
/**
 * An abstract interface which when implemented provides an interface to seek
 * within an open file/resource synchronously.
 */
interface SeekerSync extends _interface_SeekerSync {}
export type { SeekerSync }

import { writeAll as _function_writeAll } from "jsr:@std/io@0.225.0"
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
 * ```ts ignore no-assert
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

import { writeAllSync as _function_writeAllSync } from "jsr:@std/io@0.225.0"
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
 * ```ts ignore no-assert
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
