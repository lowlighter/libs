import { copyN as _function_copyN } from "jsr:@std/io@0.224.9/copy-n"
/**
 * Copy N size at the most. If read size is lesser than N, then returns nread
 *
 * @example Usage
 * ```ts
 * import { copyN } from "@std/io/copy-n";
 * import { assertEquals } from "@std/assert/equals";
 *
 * using source = await Deno.open("README.md");
 *
 * const res = await copyN(source, Deno.stdout, 10);
 * assertEquals(res, 10);
 * ```
 *
 * @param r Reader
 * @param dest Writer
 * @param size Read size
 * @return Number of bytes copied
 *
 * @deprecated Pipe the readable stream through a new
 * {@linkcode https://jsr.io/@std/streams/doc/~/ByteSliceStream | ByteSliceStream}
 * instead. This will be removed in 0.225.0.
 */
const copyN = _function_copyN as typeof _function_copyN
export { copyN }
