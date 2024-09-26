import { readLong as _function_readLong } from "jsr:@std/io@0.224.9/read-long"
/**
 * Read big endian 64bit long from a {@linkcode BufReader}.
 *
 * @example Usage
 * ```ts
 * import { Buffer } from "@std/io/buffer"
 * import { BufReader } from "@std/io/buf-reader";
 * import { readLong } from "@std/io/read-long";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const buf = new BufReader(new Buffer(new Uint8Array([0, 0, 0, 0x12, 0x34, 0x56, 0x78, 0x9a])));
 * const long = await readLong(buf);
 * assertEquals(long, 0x123456789a);
 * ```
 *
 * @param buf The BufReader to read from
 * @return The 64bit long
 * @throws If the reader returns unexpected EOF
 * @throws If the long value is too big to be represented as a JavaScript number
 *
 * @deprecated This will be removed in 0.225.0.
 */
const readLong = _function_readLong as typeof _function_readLong
export { readLong }
