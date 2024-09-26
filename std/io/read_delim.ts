import { readDelim as _function_readDelim } from "jsr:@std/io@0.224.9/read-delim"
/**
 * Read delimited bytes from a {@linkcode Reader} through an
 * {@linkcode AsyncIterableIterator} of {@linkcode Uint8Array}.
 *
 * @example Usage
 * ```ts
 * import { readDelim } from "@std/io/read-delim";
 * import { assert } from "@std/assert/assert"
 *
 * using fileReader = await Deno.open("README.md");
 *
 * for await (const chunk of readDelim(fileReader, new TextEncoder().encode("\n"))) {
 *   assert(chunk instanceof Uint8Array);
 * }
 * ```
 *
 * @param reader The reader to read from
 * @param delim The delimiter to read until
 * @return The {@linkcode AsyncIterableIterator} of {@linkcode Uint8Array}s.
 *
 * @deprecated Use
 * {@linkcode https://jsr.io/@std/streams/doc/byte-slice-stream/~/ByteSliceStream | ByteSliceStream}
 * instead. This will be removed in 0.225.0.
 */
const readDelim = _function_readDelim as typeof _function_readDelim
export { readDelim }
