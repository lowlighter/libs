import { readShort as _function_readShort } from "jsr:@std/io@0.224.9/read-short"
/**
 * Read big endian 16bit short from a {@linkcode BufReader}.
 *
 * @example Usage
 * ```ts
 * import { Buffer } from "@std/io/buffer"
 * import { BufReader } from "@std/io/buf-reader";
 * import { readShort } from "@std/io/read-short";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const buf = new BufReader(new Buffer(new Uint8Array([0x12, 0x34])));
 * const short = await readShort(buf);
 * assertEquals(short, 0x1234);
 * ```
 *
 * @param buf The reader to read from
 * @return The 16bit short
 *
 * @deprecated This will be removed in 0.225.0.
 */
const readShort = _function_readShort as typeof _function_readShort
export { readShort }
