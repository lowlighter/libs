import { AbstractBufBase as _class_AbstractBufBase } from "jsr:@std/io@0.224.7/buf-writer"
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

import { BufWriter as _class_BufWriter } from "jsr:@std/io@0.224.7/buf-writer"
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

import { BufWriterSync as _class_BufWriterSync } from "jsr:@std/io@0.224.7/buf-writer"
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
