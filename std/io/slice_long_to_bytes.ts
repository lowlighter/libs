import { sliceLongToBytes as _function_sliceLongToBytes } from "jsr:@std/io@0.224.3/slice-long-to-bytes"
/**
 * Slice number into 64bit big endian byte array
 * @param d The number to be sliced
 * @param dest The sliced array
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const sliceLongToBytes = _function_sliceLongToBytes
export { sliceLongToBytes }
