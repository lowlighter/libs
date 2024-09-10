import { pooledMap as _function_pooledMap } from "jsr:@std/async@1.0.5/pool"
/**
 * pooledMap transforms values from an (async) iterable into another async
 * iterable. The transforms are done concurrently, with a max concurrency
 * defined by the poolLimit.
 *
 * If an error is thrown from `iterableFn`, no new transformations will begin.
 * All currently executing transformations are allowed to finish and still
 * yielded on success. After that, the rejections among them are gathered and
 * thrown by the iterator in an `AggregateError`.
 *
 * @example Usage
 * ```ts
 * import { pooledMap } from "@std/async/pool";
 * import { assertEquals } from "@std/assert";
 *
 * const results = pooledMap(
 *   2,
 *   [1, 2, 3],
 *   (i) => new Promise((r) => setTimeout(() => r(i), 1000)),
 * );
 *
 * assertEquals(await Array.fromAsync(results), [1, 2, 3]);
 * ```
 *
 * @template T the input type.
 * @template R the output type.
 * @param poolLimit The maximum count of items being processed concurrently.
 * @param array The input array for mapping.
 * @param iteratorFn The function to call for every item of the array.
 * @return The async iterator with the transformed values.
 */
const pooledMap = _function_pooledMap as typeof _function_pooledMap
export { pooledMap }
