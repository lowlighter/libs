import { readStringDelim as _function_readStringDelim } from "jsr:@std/io@0.224.4/read-string-delim"
/**
 * Read Reader chunk by chunk, splitting based on delimiter.
 *
 * @example ```ts
 * import { readStringDelim } from "@std/io/read-string-delim";
 * import * as path from "@std/path";
 *
 * const filename = path.join(Deno.cwd(), "std/io/README.md");
 * let fileReader = await Deno.open(filename);
 *
 * for await (let line of readStringDelim(fileReader, "\n")) {
 *   console.log(line);
 * }
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readStringDelim = _function_readStringDelim
export { readStringDelim }
