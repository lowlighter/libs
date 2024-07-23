import { StringReader as _class_StringReader } from "jsr:@std/io@0.224.3/string-reader"
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
