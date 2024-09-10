import type { Rgb as _interface_Rgb } from "jsr:@std/fmt@1.0.2/colors"
/**
 * RGB 8-bits per channel. Each in range `0->255` or `0x00->0xff`
 */
interface Rgb extends _interface_Rgb {}
export type { Rgb }

import { setColorEnabled as _function_setColorEnabled } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Enable or disable text color when styling.
 *
 * `@std/fmt/colors` automatically detects NO_COLOR environmental variable
 * and disables text color. Use this API only when the automatic detection
 * doesn't work.
 *
 * @example Usage
 * ```ts no-assert
 * import { setColorEnabled } from "@std/fmt/colors";
 *
 * // Disable text color
 * setColorEnabled(false);
 *
 * // Enable text color
 * setColorEnabled(true);
 * ```
 *
 * @param value The boolean value to enable or disable text color
 */
const setColorEnabled = _function_setColorEnabled as typeof _function_setColorEnabled
export { setColorEnabled }

import { getColorEnabled as _function_getColorEnabled } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Get whether text color change is enabled or disabled.
 *
 * @example Usage
 * ```ts no-assert
 * import { getColorEnabled } from "@std/fmt/colors";
 *
 * console.log(getColorEnabled()); // true if enabled, false if disabled
 * ```
 * @return `true` if text color is enabled, `false` otherwise
 */
const getColorEnabled = _function_getColorEnabled as typeof _function_getColorEnabled
export { getColorEnabled }

import { reset as _function_reset } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Reset the text modified.
 *
 * @example Usage
 * ```ts no-assert
 * import { reset } from "@std/fmt/colors";
 *
 * console.log(reset("Hello, world!"));
 * ```
 *
 * @param str The text to reset
 * @return The text with reset color
 */
const reset = _function_reset as typeof _function_reset
export { reset }

import { bold as _function_bold } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Make the text bold.
 *
 * @example Usage
 * ```ts no-assert
 * import { bold } from "@std/fmt/colors";
 *
 * console.log(bold("Hello, world!"));
 * ```
 *
 * @param str The text to make bold
 * @return The bold text
 */
const bold = _function_bold as typeof _function_bold
export { bold }

import { dim as _function_dim } from "jsr:@std/fmt@1.0.2/colors"
/**
 * The text emits only a small amount of light.
 *
 * @example Usage
 * ```ts no-assert
 * import { dim } from "@std/fmt/colors";
 *
 * console.log(dim("Hello, world!"));
 * ```
 *
 * @param str The text to dim
 * @return The dimmed text
 *
 * Warning: Not all terminal emulators support `dim`.
 * For compatibility across all terminals, use {@linkcode gray} or {@linkcode brightBlack} instead.
 */
const dim = _function_dim as typeof _function_dim
export { dim }

import { italic as _function_italic } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Make the text italic.
 *
 * @example Usage
 * ```ts no-assert
 * import { italic } from "@std/fmt/colors";
 *
 * console.log(italic("Hello, world!"));
 * ```
 *
 * @param str The text to make italic
 * @return The italic text
 */
const italic = _function_italic as typeof _function_italic
export { italic }

import { underline as _function_underline } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Make the text underline.
 *
 * @example Usage
 * ```ts no-assert
 * import { underline } from "@std/fmt/colors";
 *
 * console.log(underline("Hello, world!"));
 * ```
 *
 * @param str The text to underline
 * @return The underlined text
 */
const underline = _function_underline as typeof _function_underline
export { underline }

import { inverse as _function_inverse } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Invert background color and text color.
 *
 * @example Usage
 * ```ts no-assert
 * import { inverse } from "@std/fmt/colors";
 *
 * console.log(inverse("Hello, world!"));
 * ```
 *
 * @param str The text to invert its color
 * @return The inverted text
 */
const inverse = _function_inverse as typeof _function_inverse
export { inverse }

import { hidden as _function_hidden } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Make the text hidden.
 *
 * @example Usage
 * ```ts no-assert
 * import { hidden } from "@std/fmt/colors";
 *
 * console.log(hidden("Hello, world!"));
 * ```
 *
 * @param str The text to hide
 * @return The hidden text
 */
const hidden = _function_hidden as typeof _function_hidden
export { hidden }

import { strikethrough as _function_strikethrough } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Put horizontal line through the center of the text.
 *
 * @example Usage
 * ```ts no-assert
 * import { strikethrough } from "@std/fmt/colors";
 *
 * console.log(strikethrough("Hello, world!"));
 * ```
 *
 * @param str The text to strike through
 * @return The text with horizontal line through the center
 */
const strikethrough = _function_strikethrough as typeof _function_strikethrough
export { strikethrough }

import { black as _function_black } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to black.
 *
 * @example Usage
 * ```ts no-assert
 * import { black } from "@std/fmt/colors";
 *
 * console.log(black("Hello, world!"));
 * ```
 *
 * @param str The text to make black
 * @return The black text
 */
const black = _function_black as typeof _function_black
export { black }

import { red as _function_red } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to red.
 *
 * @example Usage
 * ```ts no-assert
 * import { red } from "@std/fmt/colors";
 *
 * console.log(red("Hello, world!"));
 * ```
 *
 * @param str The text to make red
 * @return The red text
 */
const red = _function_red as typeof _function_red
export { red }

import { green as _function_green } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to green.
 *
 * @example Usage
 * ```ts no-assert
 * import { green } from "@std/fmt/colors";
 *
 * console.log(green("Hello, world!"));
 * ```
 *
 * @param str The text to make green
 * @return The green text
 */
const green = _function_green as typeof _function_green
export { green }

import { yellow as _function_yellow } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to yellow.
 *
 * @example Usage
 * ```ts no-assert
 * import { yellow } from "@std/fmt/colors";
 *
 * console.log(yellow("Hello, world!"));
 * ```
 *
 * @param str The text to make yellow
 * @return The yellow text
 */
const yellow = _function_yellow as typeof _function_yellow
export { yellow }

import { blue as _function_blue } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to blue.
 *
 * @example Usage
 * ```ts no-assert
 * import { blue } from "@std/fmt/colors";
 *
 * console.log(blue("Hello, world!"));
 * ```
 *
 * @param str The text to make blue
 * @return The blue text
 */
const blue = _function_blue as typeof _function_blue
export { blue }

import { magenta as _function_magenta } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to magenta.
 *
 * @example Usage
 * ```ts no-assert
 * import { magenta } from "@std/fmt/colors";
 *
 * console.log(magenta("Hello, world!"));
 * ```
 *
 * @param str The text to make magenta
 * @return The magenta text
 */
const magenta = _function_magenta as typeof _function_magenta
export { magenta }

import { cyan as _function_cyan } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to cyan.
 *
 * @example Usage
 * ```ts no-assert
 * import { cyan } from "@std/fmt/colors";
 *
 * console.log(cyan("Hello, world!"));
 * ```
 *
 * @param str The text to make cyan
 * @return The cyan text
 */
const cyan = _function_cyan as typeof _function_cyan
export { cyan }

import { white as _function_white } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to white.
 *
 * @example Usage
 * ```ts no-assert
 * import { white } from "@std/fmt/colors";
 *
 * console.log(white("Hello, world!"));
 * ```
 *
 * @param str The text to make white
 * @return The white text
 */
const white = _function_white as typeof _function_white
export { white }

import { gray as _function_gray } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to gray.
 *
 * @example Usage
 * ```ts no-assert
 * import { gray } from "@std/fmt/colors";
 *
 * console.log(gray("Hello, world!"));
 * ```
 *
 * @param str The text to make gray
 * @return The gray text
 */
const gray = _function_gray as typeof _function_gray
export { gray }

import { brightBlack as _function_brightBlack } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to bright black.
 *
 * @example Usage
 * ```ts no-assert
 * import { brightBlack } from "@std/fmt/colors";
 *
 * console.log(brightBlack("Hello, world!"));
 * ```
 *
 * @param str The text to make bright black
 * @return The bright black text
 */
const brightBlack = _function_brightBlack as typeof _function_brightBlack
export { brightBlack }

import { brightRed as _function_brightRed } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to bright red.
 *
 * @example Usage
 * ```ts no-assert
 * import { brightRed } from "@std/fmt/colors";
 *
 * console.log(brightRed("Hello, world!"));
 * ```
 *
 * @param str The text to make bright red
 * @return The bright red text
 */
const brightRed = _function_brightRed as typeof _function_brightRed
export { brightRed }

import { brightGreen as _function_brightGreen } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to bright green.
 *
 * @example Usage
 * ```ts no-assert
 * import { brightGreen } from "@std/fmt/colors";
 *
 * console.log(brightGreen("Hello, world!"));
 * ```
 *
 * @param str The text to make bright green
 * @return The bright green text
 */
const brightGreen = _function_brightGreen as typeof _function_brightGreen
export { brightGreen }

import { brightYellow as _function_brightYellow } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to bright yellow.
 *
 * @example Usage
 * ```ts no-assert
 * import { brightYellow } from "@std/fmt/colors";
 *
 * console.log(brightYellow("Hello, world!"));
 * ```
 *
 * @param str The text to make bright yellow
 * @return The bright yellow text
 */
const brightYellow = _function_brightYellow as typeof _function_brightYellow
export { brightYellow }

import { brightBlue as _function_brightBlue } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to bright blue.
 *
 * @example Usage
 * ```ts no-assert
 * import { brightBlue } from "@std/fmt/colors";
 *
 * console.log(brightBlue("Hello, world!"));
 * ```
 *
 * @param str The text to make bright blue
 * @return The bright blue text
 */
const brightBlue = _function_brightBlue as typeof _function_brightBlue
export { brightBlue }

import { brightMagenta as _function_brightMagenta } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to bright magenta.
 *
 * @example Usage
 * ```ts no-assert
 * import { brightMagenta } from "@std/fmt/colors";
 *
 * console.log(brightMagenta("Hello, world!"));
 * ```
 *
 * @param str The text to make bright magenta
 * @return The bright magenta text
 */
const brightMagenta = _function_brightMagenta as typeof _function_brightMagenta
export { brightMagenta }

import { brightCyan as _function_brightCyan } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to bright cyan.
 *
 * @example Usage
 * ```ts no-assert
 * import { brightCyan } from "@std/fmt/colors";
 *
 * console.log(brightCyan("Hello, world!"));
 * ```
 *
 * @param str The text to make bright cyan
 * @return The bright cyan text
 */
const brightCyan = _function_brightCyan as typeof _function_brightCyan
export { brightCyan }

import { brightWhite as _function_brightWhite } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color to bright white.
 *
 * @example Usage
 * ```ts no-assert
 * import { brightWhite } from "@std/fmt/colors";
 *
 * console.log(brightWhite("Hello, world!"));
 * ```
 *
 * @param str The text to make bright white
 * @return The bright white text
 */
const brightWhite = _function_brightWhite as typeof _function_brightWhite
export { brightWhite }

import { bgBlack as _function_bgBlack } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to black.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgBlack } from "@std/fmt/colors";
 *
 * console.log(bgBlack("Hello, world!"));
 * ```
 *
 * @param str The text to make its background black
 * @return The text with black background
 */
const bgBlack = _function_bgBlack as typeof _function_bgBlack
export { bgBlack }

import { bgRed as _function_bgRed } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to red.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgRed } from "@std/fmt/colors";
 *
 * console.log(bgRed("Hello, world!"));
 * ```
 *
 * @param str The text to make its background red
 * @return The text with red background
 */
const bgRed = _function_bgRed as typeof _function_bgRed
export { bgRed }

import { bgGreen as _function_bgGreen } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to green.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgGreen } from "@std/fmt/colors";
 *
 * console.log(bgGreen("Hello, world!"));
 * ```
 *
 * @param str The text to make its background green
 * @return The text with green background
 */
const bgGreen = _function_bgGreen as typeof _function_bgGreen
export { bgGreen }

import { bgYellow as _function_bgYellow } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to yellow.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgYellow } from "@std/fmt/colors";
 *
 * console.log(bgYellow("Hello, world!"));
 * ```
 *
 * @param str The text to make its background yellow
 * @return The text with yellow background
 */
const bgYellow = _function_bgYellow as typeof _function_bgYellow
export { bgYellow }

import { bgBlue as _function_bgBlue } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to blue.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgBlue } from "@std/fmt/colors";
 *
 * console.log(bgBlue("Hello, world!"));
 * ```
 *
 * @param str The text to make its background blue
 * @return The text with blue background
 */
const bgBlue = _function_bgBlue as typeof _function_bgBlue
export { bgBlue }

import { bgMagenta as _function_bgMagenta } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to magenta.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgMagenta } from "@std/fmt/colors";
 *
 * console.log(bgMagenta("Hello, world!"));
 * ```
 *
 * @param str The text to make its background magenta
 * @return The text with magenta background
 */
const bgMagenta = _function_bgMagenta as typeof _function_bgMagenta
export { bgMagenta }

import { bgCyan as _function_bgCyan } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to cyan.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgCyan } from "@std/fmt/colors";
 *
 * console.log(bgCyan("Hello, world!"));
 * ```
 *
 * @param str The text to make its background cyan
 * @return The text with cyan background
 */
const bgCyan = _function_bgCyan as typeof _function_bgCyan
export { bgCyan }

import { bgWhite as _function_bgWhite } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to white.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgWhite } from "@std/fmt/colors";
 *
 * console.log(bgWhite("Hello, world!"));
 * ```
 *
 * @param str The text to make its background white
 * @return The text with white background
 */
const bgWhite = _function_bgWhite as typeof _function_bgWhite
export { bgWhite }

import { bgBrightBlack as _function_bgBrightBlack } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to bright black.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgBrightBlack } from "@std/fmt/colors";
 *
 * console.log(bgBrightBlack("Hello, world!"));
 * ```
 *
 * @param str The text to make its background bright black
 * @return The text with bright black background
 */
const bgBrightBlack = _function_bgBrightBlack as typeof _function_bgBrightBlack
export { bgBrightBlack }

import { bgBrightRed as _function_bgBrightRed } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to bright red.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgBrightRed } from "@std/fmt/colors";
 *
 * console.log(bgBrightRed("Hello, world!"));
 * ```
 *
 * @param str The text to make its background bright red
 * @return The text with bright red background
 */
const bgBrightRed = _function_bgBrightRed as typeof _function_bgBrightRed
export { bgBrightRed }

import { bgBrightGreen as _function_bgBrightGreen } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to bright green.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgBrightGreen } from "@std/fmt/colors";
 *
 * console.log(bgBrightGreen("Hello, world!"));
 * ```
 *
 * @param str The text to make its background bright green
 * @return The text with bright green background
 */
const bgBrightGreen = _function_bgBrightGreen as typeof _function_bgBrightGreen
export { bgBrightGreen }

import { bgBrightYellow as _function_bgBrightYellow } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to bright yellow.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgBrightYellow } from "@std/fmt/colors";
 *
 * console.log(bgBrightYellow("Hello, world!"));
 * ```
 *
 * @param str The text to make its background bright yellow
 * @return The text with bright yellow background
 */
const bgBrightYellow = _function_bgBrightYellow as typeof _function_bgBrightYellow
export { bgBrightYellow }

import { bgBrightBlue as _function_bgBrightBlue } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to bright blue.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgBrightBlue } from "@std/fmt/colors";
 *
 * console.log(bgBrightBlue("Hello, world!"));
 * ```
 *
 * @param str The text to make its background bright blue
 * @return The text with bright blue background
 */
const bgBrightBlue = _function_bgBrightBlue as typeof _function_bgBrightBlue
export { bgBrightBlue }

import { bgBrightMagenta as _function_bgBrightMagenta } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to bright magenta.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgBrightMagenta } from "@std/fmt/colors";
 *
 * console.log(bgBrightMagenta("Hello, world!"));
 * ```
 *
 * @param str The text to make its background bright magenta
 * @return The text with bright magenta background
 */
const bgBrightMagenta = _function_bgBrightMagenta as typeof _function_bgBrightMagenta
export { bgBrightMagenta }

import { bgBrightCyan as _function_bgBrightCyan } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to bright cyan.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgBrightCyan } from "@std/fmt/colors";
 *
 * console.log(bgBrightCyan("Hello, world!"));
 * ```
 *
 * @param str The text to make its background bright cyan
 * @return The text with bright cyan background
 */
const bgBrightCyan = _function_bgBrightCyan as typeof _function_bgBrightCyan
export { bgBrightCyan }

import { bgBrightWhite as _function_bgBrightWhite } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color to bright white.
 *
 * @example Usage
 * ```ts no-assert
 * import { bgBrightWhite } from "@std/fmt/colors";
 *
 * console.log(bgBrightWhite("Hello, world!"));
 * ```
 *
 * @param str The text to make its background bright white
 * @return The text with bright white background
 */
const bgBrightWhite = _function_bgBrightWhite as typeof _function_bgBrightWhite
export { bgBrightWhite }

import { rgb8 as _function_rgb8 } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color using paletted 8bit colors.
 * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
 *
 * @example Usage
 * ```ts no-assert
 * import { rgb8 } from "@std/fmt/colors";
 *
 * console.log(rgb8("Hello, world!", 42));
 * ```
 *
 * @param str The text color to apply paletted 8bit colors to
 * @param color The color code
 * @return The text with paletted 8bit color
 */
const rgb8 = _function_rgb8 as typeof _function_rgb8
export { rgb8 }

import { bgRgb8 as _function_bgRgb8 } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color using paletted 8bit colors.
 * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
 *
 * @example Usage
 * ```ts no-assert
 * import { bgRgb8 } from "@std/fmt/colors";
 *
 * console.log(bgRgb8("Hello, world!", 42));
 * ```
 *
 * @param str The text color to apply paletted 8bit background colors to
 * @param color code
 * @return The text with paletted 8bit background color
 */
const bgRgb8 = _function_bgRgb8 as typeof _function_bgRgb8
export { bgRgb8 }

import { rgb24 as _function_rgb24 } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set text color using 24bit rgb.
 * `color` can be a number in range `0x000000` to `0xffffff` or
 * an `Rgb`.
 *
 * @example To produce the color magenta:
 * ```ts no-assert
 * import { rgb24 } from "@std/fmt/colors";
 *
 * rgb24("foo", 0xff00ff);
 * rgb24("foo", {r: 255, g: 0, b: 255});
 * ```
 * @param str The text color to apply 24bit rgb to
 * @param color The color code
 * @return The text with 24bit rgb color
 */
const rgb24 = _function_rgb24 as typeof _function_rgb24
export { rgb24 }

import { bgRgb24 as _function_bgRgb24 } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Set background color using 24bit rgb.
 * `color` can be a number in range `0x000000` to `0xffffff` or
 * an `Rgb`.
 *
 * @example To produce the color magenta:
 * ```ts no-assert
 * import { bgRgb24 } from "@std/fmt/colors";
 *
 * bgRgb24("foo", 0xff00ff);
 * bgRgb24("foo", {r: 255, g: 0, b: 255});
 * ```
 * @param str The text color to apply 24bit rgb to
 * @param color The color code
 * @return The text with 24bit rgb color
 */
const bgRgb24 = _function_bgRgb24 as typeof _function_bgRgb24
export { bgRgb24 }

import { stripAnsiCode as _function_stripAnsiCode } from "jsr:@std/fmt@1.0.2/colors"
/**
 * Remove ANSI escape codes from the string.
 *
 * @example Usage
 * ```ts no-assert
 * import { stripAnsiCode, red } from "@std/fmt/colors";
 *
 * console.log(stripAnsiCode(red("Hello, world!")));
 * ```
 *
 * @param string The text to remove ANSI escape codes from
 * @return The text without ANSI escape codes
 */
const stripAnsiCode = _function_stripAnsiCode as typeof _function_stripAnsiCode
export { stripAnsiCode }
