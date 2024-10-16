import { toByteStream as _function_toByteStream } from "jsr:@std/streams@1.0.7/unstable-to-byte-stream"
/**
 * The function takes a `ReadableStream<Uint8Array>` and wraps it in a BYOB
 * stream if it doesn't already support it.
 *
 * @experimental
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { toByteStream } from "@std/streams/unstable-to-byte-stream";
 *
 * const reader = toByteStream(ReadableStream.from([new Uint8Array(100)]))
 *   .getReader({ mode: "byob" });
 *
 * while (true) {
 *   const { done, value } = await reader.read(new Uint8Array(10), { min: 10 });
 *   if (done) break;
 *   assertEquals(value.length, 10);
 * }
 *
 * reader.releaseLock();
 * ```
 *
 * @param readable The ReadableStream to be wrapped if needed.
 * @return A BYOB ReadableStream.
 */
const toByteStream = _function_toByteStream as typeof _function_toByteStream
export { toByteStream }
