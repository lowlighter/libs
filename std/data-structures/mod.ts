/**
 * Data structures for use in algorithms and other data manipulation.
 *
 * ```ts
 * import { BinarySearchTree } from "@std/data-structures";
 * import { assertEquals } from "@std/assert";
 *
 * const values = [3, 10, 13, 4, 6, 7, 1, 14];
 * const tree = new BinarySearchTree<number>();
 * values.forEach((value) => tree.insert(value));
 *
 * assertEquals([...tree], [1, 3, 4, 6, 7, 10, 13, 14]);
 * assertEquals(tree.min(), 1);
 * assertEquals(tree.max(), 14);
 * assertEquals(tree.find(42), null);
 * assertEquals(tree.find(7), 7);
 * assertEquals(tree.remove(42), false);
 * assertEquals(tree.remove(7), true);
 * assertEquals([...tree], [1, 3, 4, 6, 10, 13, 14]);
 * ```
 *
 * @module
 */
import { BinaryHeap as _class_BinaryHeap } from "jsr:@std/data-structures@1.0.0"
/**
 * A priority queue implemented with a binary heap. The heap is in descending
 * order by default, using JavaScript's built-in comparison operators to sort
 * the values.
 *
 * | Method      | Average Case | Worst Case |
 * | ----------- | ------------ | ---------- |
 * | peek()      | O(1)         | O(1)       |
 * | pop()       | O(log n)     | O(log n)   |
 * | push(value) | O(1)         | O(log n)   |
 *
 * @example Usage
 * ```ts
 * import {
 *   ascend,
 *   BinaryHeap,
 *   descend,
 * } from "@std/data-structures";
 * import { assertEquals } from "@std/assert";
 *
 * const maxHeap = new BinaryHeap<number>();
 * maxHeap.push(4, 1, 3, 5, 2);
 * assertEquals(maxHeap.peek(), 5);
 * assertEquals(maxHeap.pop(), 5);
 * assertEquals([...maxHeap], [4, 3, 2, 1]);
 * assertEquals([...maxHeap], []);
 *
 * const minHeap = new BinaryHeap<number>(ascend);
 * minHeap.push(4, 1, 3, 5, 2);
 * assertEquals(minHeap.peek(), 1);
 * assertEquals(minHeap.pop(), 1);
 * assertEquals([...minHeap], [2, 3, 4, 5]);
 * assertEquals([...minHeap], []);
 *
 * const words = new BinaryHeap<string>((a, b) => descend(a.length, b.length));
 * words.push("truck", "car", "helicopter", "tank");
 * assertEquals(words.peek(), "helicopter");
 * assertEquals(words.pop(), "helicopter");
 * assertEquals([...words], ["truck", "tank", "car"]);
 * assertEquals([...words], []);
 * ```
 *
 * @template T The type of the values stored in the binary heap.
 */
class BinaryHeap<T> extends _class_BinaryHeap<T> {}
export { BinaryHeap }

import { BinarySearchTree as _class_BinarySearchTree } from "jsr:@std/data-structures@1.0.0"
/**
 * An unbalanced binary search tree. The values are in ascending order by default,
 * using JavaScript's built-in comparison operators to sort the values.
 *
 * For performance, it's recommended that you use a self-balancing binary search
 * tree instead of this one unless you are extending this to create a
 * self-balancing tree. See {@link RedBlackTree} for an example of how BinarySearchTree
 * can be extended to create a self-balancing binary search tree.
 *
 * | Method        | Average Case | Worst Case |
 * | ------------- | ------------ | ---------- |
 * | find(value)   | O(log n)     | O(n)       |
 * | insert(value) | O(log n)     | O(n)       |
 * | remove(value) | O(log n)     | O(n)       |
 * | min()         | O(log n)     | O(n)       |
 * | max()         | O(log n)     | O(n)       |
 *
 * @example Usage
 * ```ts
 * import {
 *   BinarySearchTree,
 *   ascend,
 *   descend,
 * } from "@std/data-structures";
 * import { assertEquals } from "@std/assert";
 *
 * const values = [3, 10, 13, 4, 6, 7, 1, 14];
 * const tree = new BinarySearchTree<number>();
 * values.forEach((value) => tree.insert(value));
 * assertEquals([...tree], [1, 3, 4, 6, 7, 10, 13, 14]);
 * assertEquals(tree.min(), 1);
 * assertEquals(tree.max(), 14);
 * assertEquals(tree.find(42), null);
 * assertEquals(tree.find(7), 7);
 * assertEquals(tree.remove(42), false);
 * assertEquals(tree.remove(7), true);
 * assertEquals([...tree], [1, 3, 4, 6, 10, 13, 14]);
 *
 * const invertedTree = new BinarySearchTree<number>(descend);
 * values.forEach((value) => invertedTree.insert(value));
 * assertEquals([...invertedTree], [14, 13, 10, 7, 6, 4, 3, 1]);
 * assertEquals(invertedTree.min(), 14);
 * assertEquals(invertedTree.max(), 1);
 * assertEquals(invertedTree.find(42), null);
 * assertEquals(invertedTree.find(7), 7);
 * assertEquals(invertedTree.remove(42), false);
 * assertEquals(invertedTree.remove(7), true);
 * assertEquals([...invertedTree], [14, 13, 10, 6, 4, 3, 1]);
 *
 * const words = new BinarySearchTree<string>((a, b) =>
 *   ascend(a.length, b.length) || ascend(a, b)
 * );
 * ["truck", "car", "helicopter", "tank", "train", "suv", "semi", "van"]
 *   .forEach((value) => words.insert(value));
 * assertEquals([...words], [
 *   "car",
 *   "suv",
 *   "van",
 *   "semi",
 *   "tank",
 *   "train",
 *   "truck",
 *   "helicopter",
 * ]);
 * assertEquals(words.min(), "car");
 * assertEquals(words.max(), "helicopter");
 * assertEquals(words.find("scooter"), null);
 * assertEquals(words.find("tank"), "tank");
 * assertEquals(words.remove("scooter"), false);
 * assertEquals(words.remove("tank"), true);
 * assertEquals([...words], [
 *   "car",
 *   "suv",
 *   "van",
 *   "semi",
 *   "train",
 *   "truck",
 *   "helicopter",
 * ]);
 * ```
 *
 * @template T The type of the values stored in the binary search tree.
 */
class BinarySearchTree<T> extends _class_BinarySearchTree<T> {}
export { BinarySearchTree }

import { ascend as _function_ascend } from "jsr:@std/data-structures@1.0.0"
/**
 * Compare two values in ascending order using JavaScript's built in comparison
 * operators.
 *
 * @example Comparing numbers
 * ```ts
 * import { ascend } from "@std/data-structures";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(ascend(1, 2), -1);
 * assertEquals(ascend(2, 1), 1);
 * assertEquals(ascend(1, 1), 0);
 * ```
 *
 * @template T The type of the values being compared.
 * @param a The left comparison value.
 * @param b The right comparison value.
 * @return -1 if `a` is less than `b`, 0 if `a` is equal to `b`, and 1 if `a` is greater than `b`.
 */
const ascend = _function_ascend
export { ascend }

import { descend as _function_descend } from "jsr:@std/data-structures@1.0.0"
/**
 * Compare two values in descending order using JavaScript's built in comparison
 * operators.
 *
 * @example Comparing numbers
 * ```ts
 * import { descend } from "@std/data-structures";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(descend(1, 2), 1);
 * assertEquals(descend(2, 1), -1);
 * assertEquals(descend(1, 1), 0);
 * ```
 *
 * @template T The type of the values being compared.
 * @param a The left comparison value.
 * @param b The right comparison value.
 * @return -1 if `a` is greater than `b`, 0 if `a` is equal to `b`, and 1 if `a` is less than `b`.
 */
const descend = _function_descend
export { descend }

import { RedBlackTree as _class_RedBlackTree } from "jsr:@std/data-structures@1.0.0"
/**
 * A red-black tree. This is a kind of self-balancing binary search tree. The
 * values are in ascending order by default, using JavaScript's built-in
 * comparison operators to sort the values.
 *
 * Red-Black Trees require fewer rotations than AVL Trees, so they can provide
 * faster insertions and removal operations. If you need faster lookups, you
 * should use an AVL Tree instead. AVL Trees are more strictly balanced than
 * Red-Black Trees, so they can provide faster lookups.
 *
 * | Method        | Average Case | Worst Case |
 * | ------------- | ------------ | ---------- |
 * | find(value)   | O(log n)     | O(log n)   |
 * | insert(value) | O(log n)     | O(log n)   |
 * | remove(value) | O(log n)     | O(log n)   |
 * | min()         | O(log n)     | O(log n)   |
 * | max()         | O(log n)     | O(log n)   |
 *
 * @example Usage
 * ```ts
 * import {
 *   ascend,
 *   descend,
 *   RedBlackTree,
 * } from "@std/data-structures";
 * import { assertEquals } from "@std/assert";
 *
 * const values = [3, 10, 13, 4, 6, 7, 1, 14];
 * const tree = new RedBlackTree<number>();
 * values.forEach((value) => tree.insert(value));
 * assertEquals([...tree], [1, 3, 4, 6, 7, 10, 13, 14]);
 * assertEquals(tree.min(), 1);
 * assertEquals(tree.max(), 14);
 * assertEquals(tree.find(42), null);
 * assertEquals(tree.find(7), 7);
 * assertEquals(tree.remove(42), false);
 * assertEquals(tree.remove(7), true);
 * assertEquals([...tree], [1, 3, 4, 6, 10, 13, 14]);
 *
 * const invertedTree = new RedBlackTree<number>(descend);
 * values.forEach((value) => invertedTree.insert(value));
 * assertEquals([...invertedTree], [14, 13, 10, 7, 6, 4, 3, 1]);
 * assertEquals(invertedTree.min(), 14);
 * assertEquals(invertedTree.max(), 1);
 * assertEquals(invertedTree.find(42), null);
 * assertEquals(invertedTree.find(7), 7);
 * assertEquals(invertedTree.remove(42), false);
 * assertEquals(invertedTree.remove(7), true);
 * assertEquals([...invertedTree], [14, 13, 10, 6, 4, 3, 1]);
 *
 * const words = new RedBlackTree<string>((a, b) =>
 *   ascend(a.length, b.length) || ascend(a, b)
 * );
 * ["truck", "car", "helicopter", "tank", "train", "suv", "semi", "van"]
 *   .forEach((value) => words.insert(value));
 * assertEquals([...words], [
 *   "car",
 *   "suv",
 *   "van",
 *   "semi",
 *   "tank",
 *   "train",
 *   "truck",
 *   "helicopter",
 * ]);
 * assertEquals(words.min(), "car");
 * assertEquals(words.max(), "helicopter");
 * assertEquals(words.find("scooter"), null);
 * assertEquals(words.find("tank"), "tank");
 * assertEquals(words.remove("scooter"), false);
 * assertEquals(words.remove("tank"), true);
 * assertEquals([...words], [
 *   "car",
 *   "suv",
 *   "van",
 *   "semi",
 *   "train",
 *   "truck",
 *   "helicopter",
 * ]);
 * ```
 *
 * @template T The type of the values being stored in the tree.
 */
class RedBlackTree<T> extends _class_RedBlackTree<T> {}
export { RedBlackTree }
