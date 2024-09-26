import { readLines as _function_readLines } from "jsr:@std/io@0.224.9/read-lines"
/**
 * Read strings line-by-line from a {@linkcode Reader}.
 *
 * @example Usage
 * ```ts
 * import { readLines } from "@std/io/read-lines";
 * import { assert } from "@std/assert/assert"
 *
 * using fileReader = await Deno.open("README.md");
 *
 * for await (let line of readLines(fileReader)) {
 *   assert(typeof line === "string");
 * }
 * ```
 *
 * @param reader The reader to read from
 * @param decoderOpts The options
 * @return The async iterator of strings
 *
 * @deprecated Use
 * {@linkcode https://jsr.io/@std/streams/doc/unstable-to-lines/~/toLines | toLines}
 * on the readable stream instead. This will be removed in 0.225.0.
 */
const readLines = _function_readLines as typeof _function_readLines
export { readLines }
