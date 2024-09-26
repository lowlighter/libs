import { StringReader as _class_StringReader } from "jsr:@std/io@0.224.9/string-reader"
/**
 * Reader utility for strings.
 *
 * @example Usage
 * ```ts
 * import { StringReader } from "@std/io/string-reader";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = new Uint8Array(6);
 * const r = new StringReader("abcdef");
 * const res0 = await r.read(data);
 * const res1 = await r.read(new Uint8Array(6));
 *
 * assertEquals(res0, 6);
 * assertEquals(res1, null);
 * assertEquals(new TextDecoder().decode(data), "abcdef");
 * ```
 *
 * @deprecated Pass an encoded string to a new
 * {@linkcode https://jsr.io/@std/streams/doc/buffer/~/Buffer | Buffer} instance
 * instead. This will be removed in 0.225.0.
 */
class StringReader extends _class_StringReader {}
export { StringReader }
