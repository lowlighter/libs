/**
 * In-memory cache utilities, such as memoization and caches with different
 * expiration policies.
 *
 * ```ts
 * import { memoize, LruCache } from "@std/cache";
 * import { assertEquals } from "@std/assert";
 *
 * const cache = new LruCache<unknown, bigint>(1000);
 *
 * // fibonacci function, which is very slow for n > ~30 if not memoized
 * const fib = memoize((n: bigint): bigint => {
 *   return n <= 2n ? 1n : fib(n - 1n) + fib(n - 2n);
 * }, { cache });
 *
 * assertEquals(fib(100n), 354224848179261915075n);
 * ```
 *
 * @module
 */
import type { MemoizationCache as _typeAlias_MemoizationCache } from "jsr:@std/cache@0.1.1"
/**
 * A cache suitable for use with {@linkcode memoize}.
 *
 * @experimental
 */
type MemoizationCache<K, V> = _typeAlias_MemoizationCache<K, V>
export type { MemoizationCache }

import { LruCache as _class_LruCache } from "jsr:@std/cache@0.1.1"
/**
 * Least-recently-used cache.
 *
 * @experimental
 * @see {@link https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU | Least-recently-used cache}
 *
 * Automatically removes entries above the max size based on when they were
 * last accessed with `get`, `set`, or `has`.
 *
 * @template K The type of the cache keys.
 * @template V The type of the cache values.
 *
 * @example Basic usage
 * ```ts
 * import { LruCache } from "@std/cache";
 * import { assert, assertEquals } from "@std/assert";
 *
 * const MAX_SIZE = 3;
 * const cache = new LruCache<string, number>(MAX_SIZE);
 *
 * cache.set("a", 1);
 * cache.set("b", 2);
 * cache.set("c", 3);
 * cache.set("d", 4);
 *
 * // most recent values are stored up to `MAX_SIZE`
 * assertEquals(cache.get("b"), 2);
 * assertEquals(cache.get("c"), 3);
 * assertEquals(cache.get("d"), 4);
 *
 * // less recent values are removed
 * assert(!cache.has("a"));
 * ```
 */
class LruCache<K, V> extends _class_LruCache<K, V> {}
export { LruCache }

import type { MemoizeOptions as _typeAlias_MemoizeOptions } from "jsr:@std/cache@0.1.1"
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

import { memoize as _function_memoize } from "jsr:@std/cache@0.1.1"
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

import { TtlCache as _class_TtlCache } from "jsr:@std/cache@0.1.1"
/**
 * Time-to-live cache.
 *
 * @experimental
 * @template K The type of the cache keys.
 * @template V The type of the cache values.
 *
 * @example Usage
 * ```ts
 * import { TtlCache } from "@std/cache/ttl-cache";
 * import { assertEquals } from "@std/assert/equals";
 * import { delay } from "@std/async/delay";
 *
 * const cache = new TtlCache<string, number>(1000);
 *
 * cache.set("a", 1);
 * assertEquals(cache.size, 1);
 * await delay(2000);
 * assertEquals(cache.size, 0);
 * ```
 */
class TtlCache<K, V> extends _class_TtlCache<K, V> {}
export { TtlCache }
