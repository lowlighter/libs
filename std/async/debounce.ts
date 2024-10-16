import type { DebouncedFunction as _interface_DebouncedFunction } from "jsr:@std/async@1.0.6/debounce"
/**
 * A debounced function that will be delayed by a given `wait`
 * time in milliseconds. If the method is called again before
 * the timeout expires, the previous call will be aborted.
 */
interface DebouncedFunction<T extends Array<unknown>> extends _interface_DebouncedFunction<T> {}
export type { DebouncedFunction }

import { debounce as _function_debounce } from "jsr:@std/async@1.0.6/debounce"
/**
 * Creates a debounced function that delays the given `func`
 * by a given `wait` time in milliseconds. If the method is called
 * again before the timeout expires, the previous call will be
 * aborted.
 *
 * @example Usage
 * ```ts ignore
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
