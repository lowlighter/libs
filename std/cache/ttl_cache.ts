import { TtlCache as _class_TtlCache } from "jsr:@std/cache@0.1.3/ttl-cache"
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
