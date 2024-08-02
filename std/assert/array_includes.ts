import type { ArrayLikeArg as _typeAlias_ArrayLikeArg } from "jsr:@std/assert@1.0.2/array-includes"
/**
 * An array-like object (`Array`, `Uint8Array`, `NodeList`, etc.) that is not a string
 */
type ArrayLikeArg<T> = _typeAlias_ArrayLikeArg<T>
export type { ArrayLikeArg }

import { assertArrayIncludes as _function_assertArrayIncludes } from "jsr:@std/assert@1.0.2/array-includes"
/**
 * Make an assertion that `actual` includes the `expected` values. If not then
 * an error will be thrown.
 *
 * Type parameter can be specified to ensure values under comparison have the
 * same type.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertArrayIncludes } from "@std/assert";
 *
 * assertArrayIncludes([1, 2], [2]); // Doesn't throw
 * assertArrayIncludes([1, 2], [3]); // Throws
 * ```
 *
 * @template T The type of the elements in the array to compare.
 * @param actual The array-like object to check for.
 * @param expected The array-like object to check for.
 * @param msg The optional message to display if the assertion fails.
 */
const assertArrayIncludes = _function_assertArrayIncludes
export { assertArrayIncludes }
