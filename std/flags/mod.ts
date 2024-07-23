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

import type { Args as _typeAlias_Args } from "jsr:@std/flags@0.224.0"
/**
 * The value returned from `parse`.
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://deno.land/std/cli/parse_args.ts} instead.
 */
type Args<TArgs extends Record<string, unknown> = Record<string, any>, TDoubleDash extends boolean | undefined = undefined> = _typeAlias_Args<TArgs, TDoubleDash>
export type { Args }

import type { ParseOptions as _interface_ParseOptions } from "jsr:@std/flags@0.224.0"
/**
 * The options for the `parse` call.
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://deno.land/std/cli/parse_args.ts} instead.
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

import { parse as _function_parse } from "jsr:@std/flags@0.224.0"
/**
 * Take a set of command line arguments, optionally with a set of options, and
 * return an object representing the flags found in the passed arguments.
 *
 * By default, any arguments starting with `-` or `--` are considered boolean
 * flags. If the argument name is followed by an equal sign (`=`) it is
 * considered a key-value pair. Any arguments which could not be parsed are
 * available in the `_` property of the returned object.
 *
 * By default, the flags module tries to determine the type of all arguments
 * automatically and the return type of the `parse` method will have an index
 * signature with `any` as value (`{ [x: string]: any }`).
 *
 * If the `string`, `boolean` or `collect` option is set, the return value of
 * the `parse` method will be fully typed and the index signature of the return
 * type will change to `{ [x: string]: unknown }`.
 *
 * Any arguments after `'--'` will not be parsed and will end up in `parsedArgs._`.
 *
 * Numeric-looking arguments will be returned as numbers unless `options.string`
 * or `options.boolean` is set for that argument name.
 *
 * @example ```ts
 * import { parse } from "@std/flags";
 * const parsedArgs = parse(Deno.args);
 * ```
 *
 * @example ```ts
 * import { parse } from "@std/flags";
 * const parsedArgs = parse(["--foo", "--bar=baz", "./quux.txt"]);
 * // parsedArgs: { foo: true, bar: "baz", _: ["./quux.txt"] }
 * ```
 *
 * @deprecated Use
 * {@linkcode https://jsr.io/@std/cli/doc/parse-args/~/parseArgs | parseArgs}
 * instead. This module will be removed once the Standard Library migrates to
 * {@link https://jsr.io/ | JSR}.
 */
const parse = _function_parse
export { parse }
