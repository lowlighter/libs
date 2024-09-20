import { toLines as _function_toLines } from "jsr:@std/streams@1.0.5/unstable-to-lines"
/**
 * Converts a {@linkcode ReadableStream} of {@linkcode Uint8Array}s into one of
 * lines delimited by `\n` or `\r\n`. Trims the last line if empty.
 *
 * @experimental
 * @param readable A stream of {@linkcode Uint8Array}s.
 * @param options Stream options.
 * @return A stream of lines delimited by `\n` or `\r\n`.
 *
 * @example Usage
 * ```ts
 * import { toLines } from "@std/streams/unstable-to-lines";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const readable = ReadableStream.from([
 *   "qwertzu",
 *   "iopasd\r\nmnbvc",
 *   "xylk\rjhgfds\napoiuzt\r",
 *   "qwr\r09ei\rqwrjiowqr\r",
 * ]).pipeThrough(new TextEncoderStream());
 *
 * assertEquals(await Array.fromAsync(toLines(readable)), [
 *   "qwertzuiopasd",
 *   "mnbvcxylk\rjhgfds",
 *   "apoiuzt\rqwr\r09ei\rqwrjiowqr\r",
 * ]);
 * ```
 */
const toLines = _function_toLines as typeof _function_toLines
export { toLines }
