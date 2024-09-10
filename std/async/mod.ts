/**
 * Provide helpers with asynchronous tasks like {@linkcode delay | delays},
 * {@linkcode debounce | debouncing}, {@linkcode retry | retrying}, or
 * {@linkcode pooledMap | pooling}.
 *
 * ```ts no-assert
 * import { delay } from "@std/async/delay";
 *
 * await delay(100); // waits for 100 milliseconds
 * ```
 *
 * @module
 */
import { abortable as _function_abortable } from "jsr:@std/async@1.0.5"
/** UNDOCUMENTED */
const abortable = _function_abortable as typeof _function_abortable
export { abortable }

import type { DeadlineOptions as _interface_DeadlineOptions } from "jsr:@std/async@1.0.5"
/**
 * Options for {@linkcode deadline}.
 */
interface DeadlineOptions extends _interface_DeadlineOptions {}
export type { DeadlineOptions }

import { deadline as _function_deadline } from "jsr:@std/async@1.0.5"
/**
 * Create a promise which will be rejected with {@linkcode DOMException} when
 * a given delay is exceeded.
 *
 * Note: Prefer to use {@linkcode AbortSignal.timeout} instead for the APIs
 * that accept {@linkcode AbortSignal}.
 *
 * @throws
 * @throws
 * @throws If the optional signal is aborted with a
 * custom `reason` before resolving or timing out.
 * @template T The type of the provided and returned promise.
 * @param p The promise to make rejectable.
 * @param ms Duration in milliseconds for when the promise should time out.
 * @param options Additional options.
 * @return A promise that will reject if the provided duration runs out before resolving.
 *
 * @example Usage
 * ```ts no-eval
 * import { deadline } from "@std/async/deadline";
 * import { delay } from "@std/async/delay";
 *
 * const delayedPromise = delay(1_000);
 * // Below throws `DOMException` after 10 ms
 * const result = await deadline(delayedPromise, 10);
 * ```
 */
const deadline = _function_deadline as typeof _function_deadline
export { deadline }

import type { DebouncedFunction as _interface_DebouncedFunction } from "jsr:@std/async@1.0.5"
/**
 * A debounced function that will be delayed by a given `wait`
 * time in milliseconds. If the method is called again before
 * the timeout expires, the previous call will be aborted.
 */
interface DebouncedFunction<T extends Array<unknown>> extends _interface_DebouncedFunction<T> {}
export type { DebouncedFunction }

import { debounce as _function_debounce } from "jsr:@std/async@1.0.5"
/**
 * Creates a debounced function that delays the given `func`
 * by a given `wait` time in milliseconds. If the method is called
 * again before the timeout expires, the previous call will be
 * aborted.
 *
 * @example Usage
 * ```ts no-eval
 * import { debounce } from "@std/async/debounce";
 *
 * const log = debounce(
 *   (event: Deno.FsEvent) =>
 *     console.log("[%s] %s", event.kind, event.paths[0]),
 *   200,
 * );
 *
 * for await (const event of Deno.watchFs("./")) {
 *   log(event);
 * }
 * // wait 200ms ...
 * // output: Function debounced after 200ms with baz
 * ```
 *
 * @template T The arguments of the provided function.
 * @param fn The function to debounce.
 * @param wait The time in milliseconds to delay the function.
 * @return The debounced function.
 */
const debounce = _function_debounce as typeof _function_debounce
export { debounce }

import type { DelayOptions as _interface_DelayOptions } from "jsr:@std/async@1.0.5"
/**
 * Options for {@linkcode delay}.
 */
interface DelayOptions extends _interface_DelayOptions {}
export type { DelayOptions }

import { delay as _function_delay } from "jsr:@std/async@1.0.5"
/**
 * Resolve a {@linkcode Promise} after a given amount of milliseconds.
 *
 * @throws If the optional signal is aborted before the delay
 * duration, and `signal.reason` is undefined.
 * @param ms Duration in milliseconds for how long the delay should last.
 * @param options Additional options.
 *
 * @example Basic usage
 * ```ts no-assert
 * import { delay } from "@std/async/delay";
 *
 * // ...
 * const delayedPromise = delay(100);
 * const result = await delayedPromise;
 * // ...
 * ```
 *
 * @example Disable persistence
 *
 * Setting `persistent` to `false` will allow the process to continue to run as
 * long as the timer exists.
 *
 * ```ts no-assert
 * import { delay } from "@std/async/delay";
 *
 * // ...
 * await delay(100, { persistent: false });
 * // ...
 * ```
 */
const delay = _function_delay as typeof _function_delay
export { delay }

import { MuxAsyncIterator as _class_MuxAsyncIterator } from "jsr:@std/async@1.0.5"
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

import { pooledMap as _function_pooledMap } from "jsr:@std/async@1.0.5"
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

import type { Tuple as _typeAlias_Tuple } from "jsr:@std/async@1.0.5"
/**
 * Utility for representing n-tuple. Used in {@linkcode tee}.
 *
 * @internal
 */
type Tuple<T, N extends number> = _typeAlias_Tuple<T, N>
export type { Tuple }

import type { TupleOf as _typeAlias_TupleOf } from "jsr:@std/async@1.0.5"
/**
 * Utility for representing n-tuple of. Used in {@linkcode Tuple}.
 *
 * @internal
 */
type TupleOf<T, N extends number, R extends unknown[]> = _typeAlias_TupleOf<T, N, R>
export type { TupleOf }

import { tee as _function_tee } from "jsr:@std/async@1.0.5"
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

import { RetryError as _class_RetryError } from "jsr:@std/async@1.0.5"
/**
 * Error thrown in {@linkcode retry} once the maximum number of failed attempts
 * has been reached.
 *
 * @example Usage
 * ```ts no-assert no-eval
 * import { RetryError } from "@std/async/retry";
 *
 * throw new RetryError({ foo: "bar" }, 3);
 * ```
 */
class RetryError extends _class_RetryError {}
export { RetryError }

import type { RetryOptions as _interface_RetryOptions } from "jsr:@std/async@1.0.5"
/**
 * Options for {@linkcode retry}.
 */
interface RetryOptions extends _interface_RetryOptions {}
export type { RetryOptions }

import { retry as _function_retry } from "jsr:@std/async@1.0.5"
/**
 * Calls the given (possibly asynchronous) function up to `maxAttempts` times.
 * Retries as long as the given function throws. If the attempts are exhausted,
 * throws a {@linkcode RetryError} with `cause` set to the inner exception.
 *
 * The backoff is calculated by multiplying `minTimeout` with `multiplier` to the power of the current attempt counter (starting at 0 up to `maxAttempts - 1`). It is capped at `maxTimeout` however.
 * How long the actual delay is, depends on `jitter`.
 *
 * When `jitter` is the default value of `1`, waits between two attempts for a
 * randomized amount between 0 and the backoff time. With the default options
 * the maximal delay will be `15s = 1s + 2s + 4s + 8s`. If all five attempts
 * are exhausted the mean delay will be `9.5s = ½(4s + 15s)`.
 *
 * When `jitter` is `0`, waits the full backoff time.
 *
 * @example Example configuration 1
 * ```ts no-assert
 * import { retry } from "@std/async/retry";
 * const req = async () => {
 *  // some function that throws sometimes
 * };
 *
 * // Below resolves to the first non-error result of `req`
 * const retryPromise = await retry(req, {
 *  multiplier: 2,
 *  maxTimeout: 60000,
 *  maxAttempts: 5,
 *  minTimeout: 100,
 *  jitter: 1,
 * });
 * ```
 *
 * @example Example configuration 2
 * ```ts no-assert
 * import { retry } from "@std/async/retry";
 * const req = async () => {
 *  // some function that throws sometimes
 * };
 *
 * // Make sure we wait at least 1 minute, but at most 2 minutes
 * const retryPromise = await retry(req, {
 *  multiplier: 2.34,
 *  maxTimeout: 80000,
 *  maxAttempts: 7,
 *  minTimeout: 1000,
 *  jitter: 0.5,
 * });
 * ```
 *
 * @template T The return type of the function to retry and returned promise.
 * @param fn The function to retry.
 * @param options Additional options.
 * @return The promise that resolves with the value returned by the function to retry.
 */
const retry = _function_retry as typeof _function_retry
export { retry }
