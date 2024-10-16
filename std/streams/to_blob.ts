import { toBlob as _function_toBlob } from "jsr:@std/streams@1.0.7/to-blob"
/**
 * Converts a {@linkcode ReadableStream} of {@linkcode Uint8Array}s to a
 * {@linkcode Blob}. Works the same as {@linkcode Response.blob}.
 *
 * @param stream A `ReadableStream` of `Uint8Array`s to convert into a `Blob`.
 * @return A `Promise` that resolves to the `Blob`.
 *
 * @example Basic usage
 * ```ts
 * import { toBlob } from "@std/streams/to-blob";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from([
 *   new Uint8Array([1, 2]),
 *   new Uint8Array([3, 4, 5]),
 * ]);
 * const blob = await toBlob(stream);
 * assertEquals(blob.size, 5);
 * ```
 */
const toBlob = _function_toBlob as typeof _function_toBlob
export { toBlob }
