import { copy as _function_copy } from "jsr:@std/bytes@1.0.2/copy"
/**
 * Copy bytes from the source array to the destination array and returns the
 * number of bytes copied.
 *
 * If the source array is larger than what the `dst` array can hold, only the
 * amount of bytes that fit in the `dst` array are copied.
 *
 * @param src Source array to copy from.
 * @param dst Destination array to copy to.
 * @param offset Offset in the destination array to start copying to. Defaults
 * to 0.
 * @return Number of bytes copied.
 *
 * @example Basic usage
 * ```ts
 * import { copy } from "@std/bytes/copy";
 * import { assertEquals } from "@std/assert";
 *
 * const src = new Uint8Array([9, 8, 7]);
 * const dst = new Uint8Array([0, 1, 2, 3, 4, 5]);
 *
 * assertEquals(copy(src, dst), 3);
 * assertEquals(dst, new Uint8Array([9, 8, 7, 3, 4, 5]));
 * ```
 *
 * @example Copy with offset
 * ```ts
 * import { copy } from "@std/bytes/copy";
 * import { assertEquals } from "@std/assert";
 *
 * const src = new Uint8Array([1, 1, 1, 1]);
 * const dst = new Uint8Array([0, 0, 0, 0]);
 *
 * assertEquals(copy(src, dst, 1), 3);
 * assertEquals(dst, new Uint8Array([0, 1, 1, 1]));
 * ```
 * Defining an offset will start copying at the specified index in the
 * destination array.
 */
const copy = _function_copy
export { copy }
