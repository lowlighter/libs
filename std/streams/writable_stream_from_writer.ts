import type { WritableStreamFromWriterOptions as _interface_WritableStreamFromWriterOptions } from "jsr:@std/streams@0.224.5/writable-stream-from-writer"
/**
 * Options for {@linkcode writableStreamFromWriter}.
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode https://jsr.io/@std/io/doc/~/toWritableStream | toWritableStream} instead.
 */
interface WritableStreamFromWriterOptions extends _interface_WritableStreamFromWriterOptions {}
export type { WritableStreamFromWriterOptions }

import { writableStreamFromWriter as _function_writableStreamFromWriter } from "jsr:@std/streams@0.224.5/writable-stream-from-writer"
/**
 * Create a {@linkcode WritableStream} from a {@linkcode https://jsr.io/@std/io/doc/types/~/Writer | Writer}.
 *
 * @param writer A `Writer` to convert into a `WritableStream`.
 * @param options Options for the `writableStreamFromWriter` function.
 * @return A `WritableStream` of `Uint8Array`s.
 *
 * @example Convert `Deno.stdout` into a writable stream
 * ```ts no-eval no-assert
 * // Note that you can directly get the writer from `Deno.stdout` by
 * // `Deno.stdout.writable`. This example is just for demonstration purposes;
 * // definitely not a recommended way.
 *
 * import { writableStreamFromWriter } from "@std/streams/writable-stream-from-writer";
 *
 * const stdoutStream = writableStreamFromWriter(Deno.stdout);
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode https://jsr.io/@std/io/doc/~/toWritableStream | toWritableStream} instead.
 */
const writableStreamFromWriter = _function_writableStreamFromWriter
export { writableStreamFromWriter }
