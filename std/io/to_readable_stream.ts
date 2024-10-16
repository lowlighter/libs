import type { ToReadableStreamOptions as _interface_ToReadableStreamOptions } from "jsr:@std/io@0.225.0/to-readable-stream"
/**
 * Options for {@linkcode toReadableStream}.
 */
interface ToReadableStreamOptions extends _interface_ToReadableStreamOptions {}
export type { ToReadableStreamOptions }

import { toReadableStream as _function_toReadableStream } from "jsr:@std/io@0.225.0/to-readable-stream"
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
