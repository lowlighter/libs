import { ParseError as _class_ParseError } from "jsr:@std/csv@0.224.3/parse"
/**
 * A ParseError is returned for parsing errors.
 * Line numbers are 1-indexed and columns are 0-indexed.
 *
 * @example Usage
 * ```ts
 * import { parse, ParseError } from "@std/csv/parse";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * try {
 *   parse(`a "word","b"`);
 * } catch (error) {
 *   if (error instanceof ParseError) {
 *     assertEquals(error.message, `parse error on line 1, column 2: bare " in non-quoted-field`);
 *   }
 * }
 * ```
 */
class ParseError extends _class_ParseError {}
export { ParseError }

import type { ParseResult as _typeAlias_ParseResult } from "jsr:@std/csv@0.224.3/parse"
/**
 * Options for {@linkcode parse} and {@linkcode CsvParseStream}.
 */
type ParseResult<ParseOptions, T> = _typeAlias_ParseResult<ParseOptions, T>
export type { ParseResult }

import type { ReadOptions as _interface_ReadOptions } from "jsr:@std/csv@0.224.3/parse"
/**
 * Options for {@linkcode parseRecord}.
 */
interface ReadOptions extends _interface_ReadOptions {}
export type { ReadOptions }

import type { RecordWithColumn as _typeAlias_RecordWithColumn } from "jsr:@std/csv@0.224.3/parse"
/**
 * Record type with column type.
 *
 * @example ```
 * type RecordWithColumn<"aaa"|"bbb"> => Record<"aaa"|"bbb", string>
 * type RecordWithColumn<string> => Record<string, string | undefined>
 * ```
 */
type RecordWithColumn<C extends string> = _typeAlias_RecordWithColumn<C>
export type { RecordWithColumn }

import type { ParseOptions as _interface_ParseOptions } from "jsr:@std/csv@0.224.3/parse"
/**
 * Options for {@linkcode parse}.
 */
interface ParseOptions extends _interface_ParseOptions {}
export type { ParseOptions }

import { parse as _function_parse } from "jsr:@std/csv@0.224.3/parse"
/** UNDOCUMENTED */
const parse = _function_parse
export { parse }
