import { repeat as _function_repeat } from "jsr:@std/bytes@1.0.2/repeat"
/**
 * Returns a new byte slice composed of `count` repetitions of the `source`
 * array.
 *
 * @param source Source array to repeat.
 * @param count Number of times to repeat the source array.
 * @return A new byte slice composed of `count` repetitions of the `source`
 * array.
 *
 * @example Basic usage
 * ```ts
 * import { repeat } from "@std/bytes/repeat";
 * import { assertEquals } from "@std/assert";
 *
 * const source = new Uint8Array([0, 1, 2]);
 *
 * assertEquals(repeat(source, 3), new Uint8Array([0, 1, 2, 0, 1, 2, 0, 1, 2]));
 * ```
 *
 * @example Zero count
 * ```ts
 * import { repeat } from "@std/bytes/repeat";
 * import { assertEquals } from "@std/assert";
 *
 * const source = new Uint8Array([0, 1, 2]);
 *
 * assertEquals(repeat(source, 0), new Uint8Array());
 * ```
 */
const repeat = _function_repeat
export { repeat }
