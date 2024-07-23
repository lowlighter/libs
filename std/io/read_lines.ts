import { readLines as _function_readLines } from "jsr:@std/io@0.224.3/read-lines"
/**
 * Read strings line-by-line from a Reader.
 *
 * @example ```ts
 * import { readLines } from "@std/io/read-lines";
 * import * as path from "@std/path";
 *
 * const filename = path.join(Deno.cwd(), "std/io/README.md");
 * let fileReader = await Deno.open(filename);
 *
 * for await (let line of readLines(fileReader)) {
 *   console.log(line);
 * }
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readLines = _function_readLines
export { readLines }
