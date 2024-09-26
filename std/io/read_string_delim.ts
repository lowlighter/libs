import { readStringDelim as _function_readStringDelim } from "jsr:@std/io@0.224.9/read-string-delim"
/**
 * Read {@linkcode Reader} chunk by chunk, splitting based on delimiter.
 *
 * @example Usage
 * ```ts
 * import { readStringDelim } from "@std/io/read-string-delim";
 * import { assert } from "@std/assert/assert"
 *
 * using fileReader = await Deno.open("README.md");
 *
 * for await (let line of readStringDelim(fileReader, "\n")) {
 *   assert(typeof line === "string");
 * }
 * ```
 *
 * @param reader The reader to read from
 * @param delim The delimiter to split the reader by
 * @param decoderOpts The options
 * @return The async iterator of strings
 *
 * @deprecated Pipe the readable stream through a
 * {@linkcode https://jsr.io/@std/streams/doc/~/TextDelimiterStream | TextDelimiterStream}
 * instead. This will be removed in 0.225.0.
 */
const readStringDelim = _function_readStringDelim as typeof _function_readStringDelim
export { readStringDelim }
