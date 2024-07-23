import { StringWriter as _class_StringWriter } from "jsr:@std/io@0.224.3/string-writer"
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
