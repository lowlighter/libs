import { LimitedReader as _class_LimitedReader } from "jsr:@std/io@0.224.9/limited-reader"
/**
 * Reads from `reader` but limits the amount of data returned to just `limit` bytes.
 * Each call to `read` updates `limit` to reflect the new amount remaining.
 * `read` returns `null` when `limit` <= `0` or
 * when the underlying `reader` returns `null`.
 *
 * @example Usage
 * ```ts
 * import { StringReader } from "@std/io/string-reader";
 * import { LimitedReader } from "@std/io/limited-reader";
 * import { readAll } from "@std/io/read-all";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const r = new StringReader("hello world");
 * const lr = new LimitedReader(r, 5);
 * const res = await readAll(lr);
 *
 * assertEquals(new TextDecoder().decode(res), "hello");
 * ```
 *
 * @deprecated Pipe the readable through a
 * {@linkcode https://jsr.io/@std/streams/doc/limited-bytes-transform-stream/~/LimitedBytesTransformStream | LimitedBytesTransformStream}
 * instead. This will be removed in 0.225.0.
 */
class LimitedReader extends _class_LimitedReader {}
export { LimitedReader }
