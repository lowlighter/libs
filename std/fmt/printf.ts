import { sprintf as _function_sprintf } from "jsr:@std/fmt@1.0.0/printf"
/**
 * Converts and formats a variable number of `args` as is specified by `format`.
 * `sprintf` returns the formatted string.
 *
 * See the module documentation for the available format strings.
 *
 * @example Usage
 * ```ts
 * import { sprintf } from "@std/fmt/printf";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(sprintf("%d", 9), "9");
 *
 * assertEquals(sprintf("%o", 9), "11");
 *
 * assertEquals(sprintf("%f", 4), "4.000000");
 *
 * assertEquals(sprintf("%.3f", 0.9999), "1.000");
 * ```
 *
 * @param format The format string to use
 * @param args The arguments to format
 * @return The formatted string
 */
const sprintf = _function_sprintf
export { sprintf }

import { printf as _function_printf } from "jsr:@std/fmt@1.0.0/printf"
/**
 * Converts and format a variable number of `args` as is specified by `format`.
 * `printf` writes the formatted string to standard output.
 *
 * See the module documentation for the available format strings.
 *
 * @example Usage
 * ```ts no-assert
 * import { printf } from "@std/fmt/printf";
 *
 * printf("%d", 9); // Prints "9"
 *
 * printf("%o", 9); // Prints "11"
 *
 * printf("%f", 4); // Prints "4.000000"
 *
 * printf("%.3f", 0.9999); // Prints "1.000"
 * ```
 *
 * @param format The format string to use
 * @param args The arguments to format
 */
const printf = _function_printf
export { printf }
