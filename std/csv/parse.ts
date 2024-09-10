import type { ParseResult as _typeAlias_ParseResult } from "jsr:@std/csv@1.0.3/parse"
/**
 * Parse result type for {@linkcode parse} and {@linkcode CsvParseStream}.
 */
type ParseResult<ParseOptions, T> = _typeAlias_ParseResult<ParseOptions, T>
export type { ParseResult }

import type { RecordWithColumn as _typeAlias_RecordWithColumn } from "jsr:@std/csv@1.0.3/parse"
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

import type { ParseOptions as _interface_ParseOptions } from "jsr:@std/csv@1.0.3/parse"
/**
 * Options for {@linkcode parse}.
 */
interface ParseOptions extends _interface_ParseOptions {}
export type { ParseOptions }

import { parse as _function_parse } from "jsr:@std/csv@1.0.3/parse"
/** UNDOCUMENTED */
const parse = _function_parse as typeof _function_parse
export { parse }
