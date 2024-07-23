import type { Writer as _interface_Writer } from "jsr:@std/streams@0.224.5/writer-from-stream-writer"
/**
 * An abstract interface which when implemented provides an interface to write bytes from an array buffer to a file/resource asynchronously.
 */
interface Writer extends _interface_Writer {}
export type { Writer }

import { writerFromStreamWriter as _function_writerFromStreamWriter } from "jsr:@std/streams@0.224.5/writer-from-stream-writer"
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
