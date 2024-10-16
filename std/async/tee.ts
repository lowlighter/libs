import type { Tuple as _typeAlias_Tuple } from "jsr:@std/async@1.0.6/tee"
/**
 * Utility for representing n-tuple. Used in {@linkcode tee}.
 *
 * @internal
 */
type Tuple<T, N extends number> = _typeAlias_Tuple<T, N>
export type { Tuple }

import type { TupleOf as _typeAlias_TupleOf } from "jsr:@std/async@1.0.6/tee"
/**
 * Utility for representing n-tuple of. Used in {@linkcode Tuple}.
 *
 * @internal
 */
type TupleOf<T, N extends number, R extends unknown[]> = _typeAlias_TupleOf<T, N, R>
export type { TupleOf }

import { tee as _function_tee } from "jsr:@std/async@1.0.6/tee"
/**
 * Branches the given async iterable into the `n` branches.
 *
 * @example Usage
 * ```ts
 * import { tee } from "@std/async/tee";
 * import { assertEquals } from "@std/assert";
 *
 * const gen = async function* gen() {
 *   yield 1;
 *   yield 2;
 *   yield 3;
 * };
 *
 * const [branch1, branch2] = tee(gen());
 *
 * const result1 = await Array.fromAsync(branch1);
 * assertEquals(result1, [1, 2, 3]);
 *
 * const result2 = await Array.fromAsync(branch2);
 * assertEquals(result2, [1, 2, 3]);
 * ```
 *
 * @template T The type of the provided async iterable and the returned async iterables.
 * @template N The amount of branches to tee into.
 * @param iterable The iterable to tee.
 * @param n The amount of branches to tee into.
 * @return The tuple where each element is an async iterable.
 */
const tee = _function_tee as typeof _function_tee
export { tee }
