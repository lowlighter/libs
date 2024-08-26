import type { ByteRange as _interface_ByteRange } from "jsr:@std/io@0.224.5/read-range"
/**
 * The range of bytes to read from a file or other resource that is readable.
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
interface ByteRange extends _interface_ByteRange {}
export type { ByteRange }

import { readRange as _function_readRange } from "jsr:@std/io@0.224.5/read-range"
/**
 * Read a range of bytes from a file or other resource that is readable and
 * seekable.  The range start and end are inclusive of the bytes within that
 * range.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertEquals } from "@std/assert";
 * import { readRange } from "@std/io/read-range";
 *
 * // Read the first 10 bytes of a file
 * const file = await Deno.open("example.txt", { read: true });
 * const bytes = await readRange(file, { start: 0, end: 9 });
 * assertEquals(bytes.length, 10);
 * ```
 *
 * @param r The reader to read from
 * @param range The range of bytes to read
 * @return The bytes read
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readRange = _function_readRange as typeof _function_readRange
export { readRange }

import { readRangeSync as _function_readRangeSync } from "jsr:@std/io@0.224.5/read-range"
/**
 * Read a range of bytes synchronously from a file or other resource that is
 * readable and seekable.  The range start and end are inclusive of the bytes
 * within that range.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertEquals } from "@std/assert";
 * import { readRangeSync } from "@std/io/read-range";
 *
 * // Read the first 10 bytes of a file
 * const file = Deno.openSync("example.txt", { read: true });
 * const bytes = readRangeSync(file, { start: 0, end: 9 });
 * assertEquals(bytes.length, 10);
 * ```
 *
 * @param r The reader to read from
 * @param range The range of bytes to read
 * @return The bytes read
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
const readRangeSync = _function_readRangeSync as typeof _function_readRangeSync
export { readRangeSync }
