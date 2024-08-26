import type { Disposable as _typeAlias_Disposable } from "jsr:@std/signal@0.211.0"
/** UNDOCUMENTED */
type Disposable = _typeAlias_Disposable
export type { Disposable }

import { signal as _function_signal } from "jsr:@std/signal@0.211.0"
/**
 * Generates an AsyncIterable which can be awaited on for one or more signals.
 * `dispose()` can be called when you are finished waiting on the events.
 *
 * Example:
 *
 * ```ts
 * import { signal } from "@std/signal";
 *
 * const sig = signal("SIGUSR1", "SIGINT");
 * setTimeout(() => {}, 5000); // Prevents exiting immediately
 *
 * for await (const _ of sig) {
 *   // ..
 * }
 *
 * // At some other point in your code when finished listening:
 * sig.dispose();
 * ```
 *
 * @param signals - one or more signals to listen to
 *
 * @deprecated (will be removed in 0.212.0) Use the {@link https://docs.deno.com/runtime/tutorials/os_signals|Deno Signals API} directly instead.
 */
const signal = _function_signal as typeof _function_signal
export { signal }
