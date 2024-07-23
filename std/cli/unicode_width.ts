import { unicodeWidth as _function_unicodeWidth } from "jsr:@std/cli@1.0.0/unicode-width"
/**
 * Calculate the physical width of a string in a TTY-like environment. This is
 * useful for cases such as calculating where a line-wrap will occur and
 * underlining strings.
 *
 * The physical width is given by the number of columns required to display
 * the string. The number of columns a given unicode character occupies can
 * vary depending on the character itself.
 *
 * @param str The string to measure.
 * @return The unicode width of the string.
 *
 * @example Calculating the unicode width of a string
 * ```ts
 * import { unicodeWidth } from "@std/cli/unicode-width";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(unicodeWidth("hello world"), 11);
 * assertEquals(unicodeWidth("天地玄黃宇宙洪荒"), 16);
 * assertEquals(unicodeWidth("ｆｕｌｌｗｉｄｔｈ"), 18);
 * ```
 *
 * @example Calculating the unicode width of a color-encoded string
 * ```ts
 * import { unicodeWidth } from "@std/cli/unicode-width";
 * import { stripAnsiCode } from "@std/fmt/colors";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(unicodeWidth(stripAnsiCode("\x1b[36mголубой\x1b[39m")), 7);
 * assertEquals(unicodeWidth(stripAnsiCode("\x1b[31m紅色\x1b[39m")), 4);
 * assertEquals(unicodeWidth(stripAnsiCode("\x1B]8;;https://deno.land\x07🦕\x1B]8;;\x07")), 2);
 * ```
 *
 * Use
 * {@linkcode https://jsr.io/@std/fmt/doc/colors/~/stripAnsiCode | stripAnsiCode}
 * to remove ANSI escape codes from a string before passing it to
 * {@linkcode unicodeWidth}.
 */
const unicodeWidth = _function_unicodeWidth
export { unicodeWidth }
