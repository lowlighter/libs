import type { DeadlineOptions as _interface_DeadlineOptions } from "jsr:@std/async@1.0.2/deadline"
/**
 * Options for {@linkcode deadline}.
 */
interface DeadlineOptions extends _interface_DeadlineOptions {}
export type { DeadlineOptions }

import { deadline as _function_deadline } from "jsr:@std/async@1.0.2/deadline"
/**
 * Create a promise which will be rejected with {@linkcode DOMException} when
 * a given delay is exceeded.
 *
 * Note: Prefer to use {@linkcode AbortSignal.timeout} instead for the APIs
 * that accept {@linkcode AbortSignal}.
 *
 * @throws When the provided duration runs out before resolving
 * or if the optional signal is aborted, and `signal.reason` is undefined.
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
const deadline = _function_deadline
export { deadline }
