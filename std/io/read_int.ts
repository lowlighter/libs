import { readInt as _function_readInt } from "jsr:@std/io@0.224.9/read-int"
/**
 * Read big endian 32bit integer from a {@linkcode BufReader}.
 *
 * @example Usage
 * ```ts
 * import { Buffer } from "@std/io/buffer"
 * import { BufReader } from "@std/io/buf-reader";
 * import { readInt } from "@std/io/read-int";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const buf = new BufReader(new Buffer(new Uint8Array([0x12, 0x34, 0x56, 0x78])));
 * const int = await readInt(buf);
 * assertEquals(int, 0x12345678);
 * ```
 *
 * @param buf The buffer reader to read from
 * @return The 32bit integer
 *
 * @deprecated This will be removed in 0.225.0.
 */
const readInt = _function_readInt as typeof _function_readInt
export { readInt }
