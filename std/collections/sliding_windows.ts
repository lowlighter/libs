import type { SlidingWindowsOptions as _interface_SlidingWindowsOptions } from "jsr:@std/collections@1.0.5/sliding-windows"
/**
 * Options for {@linkcode slidingWindows}.
 */
interface SlidingWindowsOptions extends _interface_SlidingWindowsOptions {}
export type { SlidingWindowsOptions }

import { slidingWindows as _function_slidingWindows } from "jsr:@std/collections@1.0.5/sliding-windows"
/**
 * Generates sliding views of the given array of the given size and returns a
 * new array containing all of them.
 *
 * If step is set, each window will start that many elements after the last
 * window's start. (Default: 1)
 *
 * If partial is set, windows will be generated for the last elements of the
 * collection, resulting in some undefined values if size is greater than 1.
 *
 * @template T The type of the array elements.
 *
 * @param array The array to generate sliding windows from.
 * @param size The size of the sliding windows.
 * @param options The options for generating sliding windows.
 *
 * @return A new array containing all sliding windows of the given size.
 *
 * @example Usage
 * ```ts
 * import { slidingWindows } from "@std/collections/sliding-windows";
 * import { assertEquals } from "@std/assert";
 * const numbers = [1, 2, 3, 4, 5];
 *
 * const windows = slidingWindows(numbers, 3);
 * assertEquals(windows, [
 *   [1, 2, 3],
 *   [2, 3, 4],
 *   [3, 4, 5],
 * ]);
 *
 * const windowsWithStep = slidingWindows(numbers, 3, { step: 2 });
 * assertEquals(windowsWithStep, [
 *   [1, 2, 3],
 *   [3, 4, 5],
 * ]);
 *
 * const windowsWithPartial = slidingWindows(numbers, 3, { partial: true });
 * assertEquals(windowsWithPartial, [
 *   [1, 2, 3],
 *   [2, 3, 4],
 *   [3, 4, 5],
 *   [4, 5],
 *   [5],
 * ]);
 * ```
 */
const slidingWindows = _function_slidingWindows
export { slidingWindows }
