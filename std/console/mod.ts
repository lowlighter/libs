/**
 * Functions for console-related tasks such as TTY text layout.
 *
 * ## Unicode width
 *
 * {@linkcode unicodeWidth} calculates the physical width of a string in a
 * TTY-like environment.
 *
 * ```ts
 * import { unicodeWidth } from "@std/console/unicode-width";
 *
 * unicodeWidth("天地玄黃宇宙洪荒"); // 16
 * ```
 *
 * @deprecated Use {@link https://jsr.io/@std/cli | std/cli} instead. This
 * module will be removed once the Standard Library migrates to
 * {@link https://jsr.io/ | JSR}.
 *
 * @module
 */
import { unicodeWidth as _function_unicodeWidth } from "jsr:@std/console@0.224.0"
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
 * import { unicodeWidth } from "@std/console/unicode-width";
 *
 * unicodeWidth("hello world"); // 11
 * unicodeWidth("天地玄黃宇宙洪荒"); // 16
 * unicodeWidth("ｆｕｌｌｗｉｄｔｈ"); // 18
 * ```
 *
 * @example Calculating the unicode width of a color-encoded string
 * ```ts
 * import { unicodeWidth } from "@std/console/unicode-width";
 * import { stripAnsiCode } from "@std/fmt/colors";
 *
 * unicodeWidth(stripAnsiCode("\x1b[36mголубой\x1b[39m")); // 7
 * unicodeWidth(stripAnsiCode("\x1b[31m紅色\x1b[39m")); // 4
 * unicodeWidth(stripAnsiCode("\x1B]8;;https://deno.land\x07🦕\x1B]8;;\x07")); // 2
 * ```
 *
 * Use
 * {@linkcode https://jsr.io/@std/fmt/doc/colors/~/stripAnsiCode | stripAnsiCode}
 * to remove ANSI escape codes from a string before passing it to
 * {@linkcode unicodeWidth}.
 *
 * @deprecated Use {@linkcode unicodeWidth} from `std/cli` instead. This will be
 * removed once the Standard Library migrates to {@link https://jsr.io/ | JSR}.
 */
const unicodeWidth = _function_unicodeWidth as typeof _function_unicodeWidth
export { unicodeWidth }
