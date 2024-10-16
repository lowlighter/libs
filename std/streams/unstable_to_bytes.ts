import { toBytes as _function_toBytes } from "jsr:@std/streams@1.0.7/unstable-to-bytes"
/**
 * Converts a {@linkcode ReadableStream} of {@linkcode Uint8Array}s to a
 * {@linkcode Uint8Array}. Works the same as {@linkcode Response.bytes}.
 *
 * @experimental
 * @param stream A `ReadableStream` of `Uint8Array`s to convert into a `Uint8Array`.
 * @return A `Promise` that resolves to the `Uint8Array`.
 *
 * @example Basic usage
 * ```ts
 * import { toBytes } from "@std/streams/unstable-to-bytes";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from([
 *   new Uint8Array([1, 2]),
 *   new Uint8Array([3, 4, 5]),
 * ]);
 * const bytes = await toBytes(stream);
 * assertEquals(bytes, new Uint8Array([1, 2, 3, 4, 5]));
 * ```
 */
const toBytes = _function_toBytes as typeof _function_toBytes
export { toBytes }
