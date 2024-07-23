import { ByteSliceStream as _class_ByteSliceStream } from "jsr:@std/streams@0.224.5/byte-slice-stream"
/**
 * A transform stream that only transforms from the zero-indexed `start` and
 * `end` bytes (both inclusive).
 *
 * @example Basic usage
 * ```ts
 * import { ByteSliceStream } from "@std/streams/byte-slice-stream";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const stream = ReadableStream.from([
 *   new Uint8Array([0, 1]),
 *   new Uint8Array([2, 3, 4]),
 * ]);
 * const slicedStream = stream.pipeThrough(new ByteSliceStream(1, 3));
 *
 * assertEquals(
 *   await Array.fromAsync(slicedStream),
 *  [new Uint8Array([1]), new Uint8Array([2, 3])]
 * );
 * ```
 *
 * @example Get a range of bytes from a fetch response body
 * ```ts
 * import { ByteSliceStream } from "@std/streams/byte-slice-stream";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * const response = await fetch("https://example.com");
 * const rangedStream = response.body!
 *   .pipeThrough(new ByteSliceStream(3, 8));
 * const collected = await Array.fromAsync(rangedStream);
 * assertEquals(collected[0]?.length, 6);
 * ```
 */
class ByteSliceStream extends _class_ByteSliceStream {}
export { ByteSliceStream }
