import { BufferFullError as _class_BufferFullError } from "jsr:@std/io@0.224.9/buf-reader"
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
 * @deprecated Use
 * {@linkcode https://jsr.io/@std/streams/doc/buffer/~/Buffer | Buffer} instead.
 * This will be removed in 0.225.0.
 */
class BufferFullError extends _class_BufferFullError {}
export { BufferFullError }

import { PartialReadError as _class_PartialReadError } from "jsr:@std/io@0.224.9/buf-reader"
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
 * @deprecated Use
 * {@linkcode https://jsr.io/@std/streams/doc/buffer/~/Buffer | Buffer} instead.
 * This will be removed in 0.225.0.
 */
class PartialReadError extends _class_PartialReadError {}
export { PartialReadError }

import type { ReadLineResult as _interface_ReadLineResult } from "jsr:@std/io@0.224.9/buf-reader"
/**
 * Result type returned by of {@linkcode BufReader.readLine}.
 *
 * @deprecated Use
 * {@linkcode https://jsr.io/@std/streams/doc/buffer/~/Buffer | Buffer} instead.
 * This will be removed in 0.225.0.
 */
interface ReadLineResult extends _interface_ReadLineResult {}
export type { ReadLineResult }

import { BufReader as _class_BufReader } from "jsr:@std/io@0.224.9/buf-reader"
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
 * @deprecated Use
 * {@linkcode https://jsr.io/@std/streams/doc/buffer/~/Buffer | Buffer} instead.
 * This will be removed in 0.225.0.
 */
class BufReader extends _class_BufReader {}
export { BufReader }
