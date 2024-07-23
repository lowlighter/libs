import { startsWith as _function_startsWith } from "jsr:@std/bytes@1.0.2/starts-with"
/**
 * Returns `true` if the prefix array appears at the start of the source array,
 * `false` otherwise.
 *
 * The complexity of this function is `O(prefix.length)`.
 *
 * @param source Source array to check.
 * @param prefix Prefix array to check for.
 * @return `true` if the prefix array appears at the start of the source array,
 * `false` otherwise.
 *
 * @example Basic usage
 * ```ts
 * import { startsWith } from "@std/bytes/starts-with";
 * import { assertEquals } from "@std/assert";
 *
 * const source = new Uint8Array([0, 1, 2, 1, 2, 1, 2, 3]);
 * const prefix = new Uint8Array([0, 1, 2]);
 *
 * assertEquals(startsWith(source, prefix), true);
 * ```
 */
const startsWith = _function_startsWith
export { startsWith }
