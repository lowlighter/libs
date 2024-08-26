import type { DelayOptions as _interface_DelayOptions } from "jsr:@std/async@1.0.3/delay"
/**
 * Options for {@linkcode delay}.
 */
interface DelayOptions extends _interface_DelayOptions {}
export type { DelayOptions }

import { delay as _function_delay } from "jsr:@std/async@1.0.3/delay"
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
