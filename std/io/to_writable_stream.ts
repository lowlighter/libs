import type { toWritableStreamOptions as _interface_toWritableStreamOptions } from "jsr:@std/io@0.224.4/to-writable-stream"
/**
 * Options for {@linkcode toWritableStream}.
 */
interface toWritableStreamOptions extends _interface_toWritableStreamOptions {}
export type { toWritableStreamOptions }

import { toWritableStream as _function_toWritableStream } from "jsr:@std/io@0.224.4/to-writable-stream"
/**
 * Create a {@linkcode WritableStream} from a {@linkcode Writer}.
 *
 * @example ```ts
 * import { toWritableStream } from "@std/io/to-writable-stream";
 *
 * const file = await Deno.open("./file.txt", { create: true, write: true });
 * await ReadableStream.from("Hello World")
 *   .pipeThrough(new TextEncoderStream())
 *   .pipeTo(toWritableStream(file));
 * ```
 */
const toWritableStream = _function_toWritableStream
export { toWritableStream }
