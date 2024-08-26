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

import type { Args as _typeAlias_Args } from "jsr:@std/cli@1.0.3/parse-args"
/**
 * The value returned from {@linkcode parseArgs}.
 */
type Args<TArgs extends Record<string, unknown> = Record<string, any>, TDoubleDash extends boolean | undefined = undefined> = _typeAlias_Args<TArgs, TDoubleDash>
export type { Args }

import type { ParseOptions as _interface_ParseOptions } from "jsr:@std/cli@1.0.3/parse-args"
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

import { parseArgs as _function_parseArgs } from "jsr:@std/cli@1.0.3/parse-args"
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
const parseArgs = _function_parseArgs as typeof _function_parseArgs
export { parseArgs }
