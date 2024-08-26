import { FixedChunkStream as _class_FixedChunkStream } from "jsr:@std/streams@1.0.2/fixed-chunk-stream"
/**
 * A transform stream that resize {@linkcode Uint8Array} chunks into perfectly
 * `size` chunks with the exception of the last chunk.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @example Usage
 * ```ts
 * import { FixedChunkStream } from "@std/streams/fixed-chunk-stream";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const readable = ReadableStream.from(function* () {
 *   let count = 0
 *   for (let i = 0; i < 100; ++i) {
 *     const array = new Uint8Array(Math.floor(Math.random() * 1000));
 *     count += array.length;
 *     yield array;
 *   }
 *   yield new Uint8Array(512 - count % 512)
 * }())
 *   .pipeThrough(new FixedChunkStream(512))
 *   .pipeTo(new WritableStream({
 *     write(chunk, _controller) {
 *       assertEquals(chunk.length, 512)
 *     }
 *   }))
 * ```
 */
class FixedChunkStream extends _class_FixedChunkStream {}
export { FixedChunkStream }
