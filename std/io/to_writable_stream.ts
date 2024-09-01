import type { toWritableStreamOptions as _interface_toWritableStreamOptions } from "jsr:@std/io@0.224.6/to-writable-stream"
/**
 * Options for {@linkcode toWritableStream}.
 */
interface toWritableStreamOptions extends _interface_toWritableStreamOptions {}
export type { toWritableStreamOptions }

import { toWritableStream as _function_toWritableStream } from "jsr:@std/io@0.224.6/to-writable-stream"
/**
 * Create a {@linkcode WritableStream} from a {@linkcode Writer}.
 *
 * @example Usage
 * ```ts no-assert
 * import { toWritableStream } from "@std/io/to-writable-stream";
 *
 * await ReadableStream.from(["Hello World"])
 *   .pipeThrough(new TextEncoderStream())
 *   .pipeTo(toWritableStream(Deno.stdout));
 * ```
 *
 * @param writer The writer to write to
 * @param options The options
 * @return The writable stream
 */
const toWritableStream = _function_toWritableStream as typeof _function_toWritableStream
export { toWritableStream }
