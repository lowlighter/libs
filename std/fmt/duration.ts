import type { FormatOptions as _interface_FormatOptions } from "jsr:@std/fmt@1.0.0/duration"
/**
 * Options for {@linkcode format}.
 */
interface FormatOptions extends _interface_FormatOptions {}
export type { FormatOptions }

import { format as _function_format } from "jsr:@std/fmt@1.0.0/duration"
/**
 * Format milliseconds to time duration.
 *
 * @example Usage
 * ```ts
 * import { format } from "@std/fmt/duration";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(format(99674, { style: "digital" }), "00:00:01:39:674:000:000");
 *
 * assertEquals(format(99674), "0d 0h 1m 39s 674ms 0µs 0ns");
 *
 * assertEquals(format(99674, { ignoreZero: true }), "1m 39s 674ms");
 *
 * assertEquals(format(99674, { style: "full", ignoreZero: true }), "1 minutes, 39 seconds, 674 milliseconds");
 * ```
 *
 * @param ms The milliseconds value to format
 * @param options The options for formatting
 * @return The formatted string
 */
const format = _function_format as typeof _function_format
export { format }
