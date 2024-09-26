import { StringWriter as _class_StringWriter } from "jsr:@std/io@0.224.9/string-writer"
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
 * @deprecated Write to a
 * {@linkcode https://jsr.io/@std/streams/doc/buffer/~/Buffer | Buffer}'s
 * `writable` property instead. This will be removed in 0.225.0.
 */
class StringWriter extends _class_StringWriter {}
export { StringWriter }
