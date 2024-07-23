import { MuxAsyncIterator as _class_MuxAsyncIterator } from "jsr:@std/async@1.0.0/mux-async-iterator"
/**
 * Multiplexes multiple async iterators into a single stream. It currently
 * makes an assumption that the final result (the value returned and not
 * yielded from the iterator) does not matter; if there is any result, it is
 * discarded.
 *
 * @example Usage
 * ```ts
 * import { MuxAsyncIterator } from "@std/async/mux-async-iterator";
 * import { assertEquals } from "@std/assert";
 *
 * async function* gen123(): AsyncIterableIterator<number> {
 *   yield 1;
 *   yield 2;
 *   yield 3;
 * }
 *
 * async function* gen456(): AsyncIterableIterator<number> {
 *   yield 4;
 *   yield 5;
 *   yield 6;
 * }
 *
 * const mux = new MuxAsyncIterator<number>();
 * mux.add(gen123());
 * mux.add(gen456());
 *
 * const result = await Array.fromAsync(mux);
 *
 * assertEquals(result, [1, 4, 2, 5, 3, 6]);
 * ```
 *
 * @template T The type of the provided async iterables and generated async iterable.
 */
class MuxAsyncIterator<T> extends _class_MuxAsyncIterator<T> {}
export { MuxAsyncIterator }
