import type { Closer as _interface_Closer } from "jsr:@std/streams@0.224.5/readable-stream-from-reader"
/**
 * An abstract interface which when implemented provides an interface to close files/resources that were previously opened.
 */
interface Closer extends _interface_Closer {}
export type { Closer }

import type { ReadableStreamFromReaderOptions as _interface_ReadableStreamFromReaderOptions } from "jsr:@std/streams@0.224.5/readable-stream-from-reader"
/**
 * Options for {@linkcode readableStreamFromReader}.
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode https://jsr.io/@std/io/doc/~/toReadableStream | toReadableStream} instead.
 */
interface ReadableStreamFromReaderOptions extends _interface_ReadableStreamFromReaderOptions {}
export type { ReadableStreamFromReaderOptions }

import { readableStreamFromReader as _function_readableStreamFromReader } from "jsr:@std/streams@0.224.5/readable-stream-from-reader"
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
