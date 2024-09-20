import { BidirectionalMap as _class_BidirectionalMap } from "jsr:@std/data-structures@1.0.4/unstable-bidirectional-map"
/**
 * An extension of {@linkcode Map} that allows lookup by both key and value.
 *
 * Keys and values must be unique. Setting an existing key updates its value.
 * Setting an existing value updates its key.
 *
 * @experimental
 * @template K The type of the keys in the map.
 * @template V The type of the values in the map.
 *
 * @example Usage
 * ```ts
 * import { BidirectionalMap } from "@std/data-structures/unstable-bidirectional-map";
 * import { assertEquals } from "@std/assert";
 *
 * const map = new BidirectionalMap([["one", 1]]);
 *
 * assertEquals(map.get("one"), 1);
 * assertEquals(map.getReverse(1), "one");
 * ```
 *
 * @example Inserting a value that already exists
 * ```ts
 * import { BidirectionalMap } from "@std/data-structures/unstable-bidirectional-map";
 * import { assertEquals } from "@std/assert";
 *
 * const map = new BidirectionalMap();
 * map.set(1, "one");
 * map.set(2, "one");
 *
 * assertEquals(map.size, 1);
 * assertEquals(map.get(1), undefined);
 * assertEquals(map.getReverse("one"), 2);
 * ```
 */
class BidirectionalMap<K, V> extends _class_BidirectionalMap<K, V> {}
export { BidirectionalMap }
