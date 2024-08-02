import type { ToReadableStreamOptions as _interface_ToReadableStreamOptions } from "jsr:@std/io@0.224.4/to-readable-stream"
/**
 * Options for {@linkcode toReadableStream}.
 */
interface ToReadableStreamOptions extends _interface_ToReadableStreamOptions {}
export type { ToReadableStreamOptions }

import { toReadableStream as _function_toReadableStream } from "jsr:@std/io@0.224.4/to-readable-stream"
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
