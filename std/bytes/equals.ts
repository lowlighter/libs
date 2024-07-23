import { equals as _function_equals } from "jsr:@std/bytes@1.0.2/equals"
/**
 * Check whether byte slices are equal to each other.
 *
 * @param a First array to check equality.
 * @param b Second array to check equality.
 * @return `true` if the arrays are equal, `false` otherwise.
 *
 * @example Basic usage
 * ```ts
 * import { equals } from "@std/bytes/equals";
 * import { assertEquals } from "@std/assert";
 *
 * const a = new Uint8Array([1, 2, 3]);
 * const b = new Uint8Array([1, 2, 3]);
 * const c = new Uint8Array([4, 5, 6]);
 *
 * assertEquals(equals(a, b), true);
 * assertEquals(equals(a, c), false);
 * ```
 */
const equals = _function_equals
export { equals }
