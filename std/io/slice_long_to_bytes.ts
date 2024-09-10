import { sliceLongToBytes as _function_sliceLongToBytes } from "jsr:@std/io@0.224.7/slice-long-to-bytes"
/**
 * Slice number into 64bit big endian byte array.
 *
 * @example Usage
 * ```ts
 * import { sliceLongToBytes } from "@std/io/slice-long-to-bytes";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const dest = sliceLongToBytes(0x123456789a);
 * assertEquals(dest, [0, 0, 0, 0x12, 0x34, 0x56, 0x78, 0x9a]);
 * ```
 *
 * @param d The number to be sliced
 * @param dest The array to store the sliced bytes
 * @return The sliced bytes
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const sliceLongToBytes = _function_sliceLongToBytes as typeof _function_sliceLongToBytes
export { sliceLongToBytes }
