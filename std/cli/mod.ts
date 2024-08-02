/**
 * Tools for creating interactive command line tools.
 *
 * ```ts
 * import { parseArgs } from "@std/cli/parse-args";
 * import { assertEquals } from "@std/assert";
 *
 * // Same as running `deno run example.ts --foo --bar=baz ./quux.txt`
 * const args = parseArgs(["--foo", "--bar=baz", "./quux.txt"]);
 * assertEquals(args, { foo: true, bar: "baz", _: ["./quux.txt"] });
 * ```
 *
 * @module
 */
/** @internal */
type BooleanType = boolean | string | undefined
/** @internal */
type StringType = string | undefined
/** @internal */
type Collectable = string | undefined
/** @internal */
type Negatable = string | undefined
/** @internal */
type Aliases<TArgNames = string, TAliasNames extends string = string> = Partial<Record<Extract<TArgNames, string>, TAliasNames | ReadonlyArray<TAliasNames>>>

import type { Args as _typeAlias_Args } from "jsr:@std/cli@1.0.2"
/**
 * The value returned from {@linkcode parseArgs}.
 */
type Args<TArgs extends Record<string, unknown> = Record<string, any>, TDoubleDash extends boolean | undefined = undefined> = _typeAlias_Args<TArgs, TDoubleDash>
export type { Args }

import type { ParseOptions as _interface_ParseOptions } from "jsr:@std/cli@1.0.2"
/**
 * Options for {@linkcode parseArgs}.
 */
interface ParseOptions<
  TBooleans extends BooleanType = BooleanType,
  TStrings extends StringType = StringType,
  TCollectable extends Collectable = Collectable,
  TNegatable extends Negatable = Negatable,
  TDefault extends Record<string, unknown> | undefined = Record<string, unknown> | undefined,
  TAliases extends Aliases | undefined = Aliases | undefined,
  TDoubleDash extends boolean | undefined = boolean | undefined,
> extends _interface_ParseOptions<TBooleans, TStrings, TCollectable, TNegatable, TDefault, TAliases, TDoubleDash> {}
export type { ParseOptions }

import { parseArgs as _function_parseArgs } from "jsr:@std/cli@1.0.2"
/**
 * Take a set of command line arguments, optionally with a set of options, and
 * return an object representing the flags found in the passed arguments.
 *
 * By default, any arguments starting with `-` or `--` are considered boolean
 * flags. If the argument name is followed by an equal sign (`=`) it is
 * considered a key-value pair. Any arguments which could not be parsed are
 * available in the `_` property of the returned object.
 *
 * By default, this module tries to determine the type of all arguments
 * automatically and the return type of this function will have an index
 * signature with `any` as value (`{ [x: string]: any }`).
 *
 * If the `string`, `boolean` or `collect` option is set, the return value of
 * this function will be fully typed and the index signature of the return
 * type will change to `{ [x: string]: unknown }`.
 *
 * Any arguments after `'--'` will not be parsed and will end up in `parsedArgs._`.
 *
 * Numeric-looking arguments will be returned as numbers unless `options.string`
 * or `options.boolean` is set for that argument name.
 *
 * @param args An array of command line arguments.
 * @param options Options for the parse function.
 *
 * @template TArgs Type of result.
 * @template TDoubleDash Used by `TArgs` for the result.
 * @template TBooleans Used by `TArgs` for the result.
 * @template TStrings Used by `TArgs` for the result.
 * @template TCollectable Used by `TArgs` for the result.
 * @template TNegatable Used by `TArgs` for the result.
 * @template TDefaults Used by `TArgs` for the result.
 * @template TAliases Used by `TArgs` for the result.
 * @template TAliasArgNames Used by `TArgs` for the result.
 * @template TAliasNames Used by `TArgs` for the result.
 *
 * @return The parsed arguments.
 *
 * @example Usage
 * ```ts
 * import { parseArgs } from "@std/cli/parse-args";
 * import { assertEquals } from "@std/assert";
 *
 * // For proper use, one should use `parseArgs(Deno.args)`
 * assertEquals(parseArgs(["--foo", "--bar=baz", "./quux.txt"]), {
 *   foo: true,
 *   bar: "baz",
 *   _: ["./quux.txt"],
 * });
 * ```
 */
const parseArgs = _function_parseArgs
export { parseArgs }

import type { PromptSecretOptions as _typeAlias_PromptSecretOptions } from "jsr:@std/cli@1.0.2"
/**
 * Options for {@linkcode promptSecret}.
 */
type PromptSecretOptions = _typeAlias_PromptSecretOptions
export type { PromptSecretOptions }

import { promptSecret as _function_promptSecret } from "jsr:@std/cli@1.0.2"
/**
 * Shows the given message and waits for the user's input. Returns the user's input as string.
 * This is similar to `prompt()` but it print user's input as `*` to prevent password from being shown.
 * Use an empty `mask` if you don't want to show any character.
 *
 * @param message The prompt message to show to the user.
 * @param options The options for the prompt.
 * @return The string that was entered or `null` if stdin is not a TTY.
 *
 * @example Usage
 * ```ts no-eval
 * import { promptSecret } from "@std/cli/prompt-secret";
 *
 * const password = promptSecret("Please provide the password:");
 * if (password !== "some-password") {
 *   throw new Error("Access denied.");
 * }
 * ```
 */
const promptSecret = _function_promptSecret
export { promptSecret }

import type { Ansi as _typeAlias_Ansi } from "jsr:@std/cli@1.0.2"
/**
 * This is a hack to allow us to use the same type for both the color name and
 * an ANSI escape code.
 *
 * @see {@link https://github.com/microsoft/TypeScript/issues/29729#issuecomment-460346421}
 *
 * @internal
 */
type Ansi = _typeAlias_Ansi
export type { Ansi }

import type { Color as _typeAlias_Color } from "jsr:@std/cli@1.0.2"
/**
 * Color options for {@linkcode SpinnerOptions.color}.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
type Color = _typeAlias_Color
export type { Color }

import type { SpinnerOptions as _interface_SpinnerOptions } from "jsr:@std/cli@1.0.2"
/**
 * Options for {@linkcode Spinner}.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
interface SpinnerOptions extends _interface_SpinnerOptions {}
export type { SpinnerOptions }

import { Spinner as _class_Spinner } from "jsr:@std/cli@1.0.2"
/**
 * A spinner that can be used to indicate that something is loading.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @example Usage
 * ```ts no-eval
 * import { Spinner } from "@std/cli/spinner";
 *
 * const spinner = new Spinner({ message: "Loading...", color: "yellow" });
 * spinner.start();
 *
 * setTimeout(() => {
 *  spinner.stop();
 *  console.log("Finished loading!");
 * }, 3_000);
 * ```
 *
 * @experimental
 */
class Spinner extends _class_Spinner {}
export { Spinner }

import { unicodeWidth as _function_unicodeWidth } from "jsr:@std/cli@1.0.2"
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
