import type { MemoizationCache as _typeAlias_MemoizationCache } from "jsr:@std/cache@0.1.2/lru-cache"
/**
 * A cache suitable for use with {@linkcode memoize}.
 *
 * @experimental
 */
type MemoizationCache<K, V> = _typeAlias_MemoizationCache<K, V>
export type { MemoizationCache }

import { LruCache as _class_LruCache } from "jsr:@std/cache@0.1.2/lru-cache"
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
