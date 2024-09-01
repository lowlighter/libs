import type { MemoizationCache as _typeAlias_MemoizationCache } from "jsr:@std/cache@0.1.1/memoize"
/**
 * A cache suitable for use with {@linkcode memoize}.
 *
 * @experimental
 */
type MemoizationCache<K, V> = _typeAlias_MemoizationCache<K, V>
export type { MemoizationCache }

import type { MemoizeOptions as _typeAlias_MemoizeOptions } from "jsr:@std/cache@0.1.1/memoize"
/**
 * Options for {@linkcode memoize}.
 *
 * @experimental
 * @template Fn The type of the function to memoize.
 * @template Key The type of the cache key.
 * @template Cache The type of the cache.
 */
type MemoizeOptions<Fn extends (...args: never[]) => unknown, Key, Cache extends MemoizationCache<Key, ReturnType<Fn>>> = _typeAlias_MemoizeOptions<Fn, Key, Cache>
export type { MemoizeOptions }

import { memoize as _function_memoize } from "jsr:@std/cache@0.1.1/memoize"
/**
 * Cache the results of a function based on its arguments.
 *
 * @experimental
 * @template Fn The type of the function to memoize.
 * @template Key The type of the cache key.
 * @template Cache The type of the cache.
 * @param fn The function to memoize
 * @param options Options for memoization
 *
 * @return The memoized function.
 *
 * @example Basic usage
 * ```ts
 * import { memoize } from "@std/cache";
 * import { assertEquals } from "@std/assert";
 *
 * // fibonacci function, which is very slow for n > ~30 if not memoized
 * const fib = memoize((n: bigint): bigint => {
 *   return n <= 2n ? 1n : fib(n - 1n) + fib(n - 2n);
 * });
 *
 * assertEquals(fib(100n), 354224848179261915075n);
 * ```
 *
 * > [!NOTE]
 * > * By default, memoization is on the basis of all arguments passed to the
 * >   function, with equality determined by reference. This means that, for
 * >   example, passing a memoized function as `arr.map(func)` will not use the
 * >   cached results, as the index is implicitly passed as an argument. To
 * >   avoid this, you can pass a custom `getKey` option or use the memoized
 * >   function inside an anonymous callback like `arr.map((x) => func(x))`.
 * > * Memoization will not cache thrown errors and will eject promises from
 * >   the cache upon rejection. If you want to retain errors or rejected
 * >   promises in the cache, you will need to catch and return them.
 */
const memoize = _function_memoize as typeof _function_memoize
export { memoize }
