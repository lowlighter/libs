import { readStringDelim as _function_readStringDelim } from "jsr:@std/io@0.224.7/read-string-delim"
/**
 * Read {@linkcode Reader} chunk by chunk, splitting based on delimiter.
 *
 * @example Usage
 * ```ts
 * import { readStringDelim } from "@std/io/read-string-delim";
 * import { assert } from "@std/assert/assert"
 *
 * let fileReader = await Deno.open("README.md");
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
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readStringDelim = _function_readStringDelim as typeof _function_readStringDelim
export { readStringDelim }
