/**
 * Reads and writes comma-separated values (CSV) files.
 *
 * There are many kinds of CSV files; this module supports the format described
 * in {@link https://www.rfc-editor.org/rfc/rfc4180.html | RFC 4180}.
 *
 * A csv file contains zero or more records of one or more fields per record.
 * Each record is separated by the newline character. The final record may
 * optionally be followed by a newline character.
 *
 * ```csv
 * field1,field2,field3
 * ```
 *
 * White space is considered part of a field.
 *
 * Carriage returns before newline characters are silently removed.
 *
 * Blank lines are ignored. A line with only whitespace characters (excluding
 * the ending newline character) is not considered a blank line.
 *
 * Fields which start and stop with the quote character " are called
 * quoted-fields. The beginning and ending quote are not part of the field.
 *
 * The source:
 *
 * ```csv
 * normal string,"quoted-field"
 * ```
 *
 * results in the fields
 *
 * ```ts no-assert
 * [`normal string`, `quoted-field`]
 * ```
 *
 * Within a quoted-field a quote character followed by a second quote character is considered a single quote.
 *
 * ```csv
 * "the ""word"" is true","a ""quoted-field"""
 * ```
 *
 * results in
 *
 * [`the "word" is true`, `a "quoted-field"`]
 *
 * Newlines and commas may be included in a quoted-field
 *
 * ```csv
 * "Multi-line
 * field","comma is ,"
 * ```
 *
 * results in
 *
 * ```ts no-assert
 * [`Multi-line
 * field`, `comma is ,`]
 * ```
 *
 * @module
 */
import type { PropertyAccessor as _typeAlias_PropertyAccessor } from "jsr:@std/csv@0.224.3"
/**
 * Array index or record key corresponding to a value for a data object.
 */
type PropertyAccessor = _typeAlias_PropertyAccessor
export type { PropertyAccessor }

import type { ColumnDetails as _typeAlias_ColumnDetails } from "jsr:@std/csv@0.224.3"
/**
 * Column information.
 *
 * @param header Explicit column header name. If omitted,
 * the (final) property accessor is used for this value.
 *
 * @param prop Property accessor(s) used to access the value on the object
 */
type ColumnDetails = _typeAlias_ColumnDetails
export type { ColumnDetails }

import type { Column as _typeAlias_Column } from "jsr:@std/csv@0.224.3"
/**
 * The most essential aspect of a column is accessing the property holding the
 * data for that column on each object in the data array. If that member is at
 * the top level, `Column` can simply be a property accessor, which is either a
 * `string` (if it's a plain object) or a `number` (if it's an array).
 *
 * ```ts
 * const columns = [
 *   "name",
 * ];
 * ```
 *
 * Each property accessor will be used as the header for the column:
 *
 * | name |
 * | :--: |
 * | Deno |
 *
 * - If the required data is not at the top level (it's nested in other
 *   objects/arrays), then a simple property accessor won't work, so an array of
 *   them will be required.
 *
 *   ```ts
 *   const columns = [
 *     ["repo", "name"],
 *     ["repo", "org"],
 *   ];
 *   ```
 *
 *   When using arrays of property accessors, the header names inherit the value
 *   of the last accessor in each array:
 *
 *   | name |   org    |
 *   | :--: | :------: |
 *   | deno | denoland |
 *
 *  - If a different column header is desired, then a `ColumnDetails` object type
 *     can be used for each column:
 *
 *   - **`header?: string`** is the optional value to use for the column header
 *     name
 *
 *   - **`prop: PropertyAccessor | PropertyAccessor[]`** is the property accessor
 *     (`string` or `number`) or array of property accessors used to access the
 *     data on each object
 *
 *   ```ts
 *   const columns = [
 *     "name",
 *     {
 *       prop: ["runsOn", 0],
 *       header: "language 1",
 *     },
 *     {
 *       prop: ["runsOn", 1],
 *       header: "language 2",
 *     },
 *   ];
 *   ```
 *
 *   | name | language 1 | language 2 |
 *   | :--: | :--------: | :--------: |
 *   | Deno |    Rust    | TypeScript |
 */
type Column = _typeAlias_Column
export type { Column }

import type { DataItem as _typeAlias_DataItem } from "jsr:@std/csv@0.224.3"
/**
 * An object (plain or array)
 */
type DataItem = _typeAlias_DataItem
export type { DataItem }

import type { StringifyOptions as _typeAlias_StringifyOptions } from "jsr:@std/csv@0.224.3"
/**
 * Options for {@linkcode stringify}.
 */
type StringifyOptions = _typeAlias_StringifyOptions
export type { StringifyOptions }

import { StringifyError as _class_StringifyError } from "jsr:@std/csv@0.224.3"
/**
 * Error thrown in {@linkcode stringify}.
 *
 * @example Usage
 * ```ts no-assert
 * import { stringify, StringifyError } from "@std/csv/stringify";
 *
 * try {
 *   stringify([{ a: 1 }, { a: 2 }], { separator: "\r\n" });
 * } catch (error) {
 *   if (error instanceof StringifyError) {
 *     console.error(error.message);
 *   }
 * }
 * ```
 */
class StringifyError extends _class_StringifyError {}
export { StringifyError }

import { stringify as _function_stringify } from "jsr:@std/csv@0.224.3"
/**
 * Converts an array of objects into a CSV string.
 *
 * @example Usage
 * ```ts
 * import {
 *   Column,
 *   stringify,
 * } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * type Character = {
 *   age: number;
 *   name: {
 *     first: string;
 *     last: string;
 *   };
 * };
 *
 * const data: Character[] = [
 *   {
 *     age: 70,
 *     name: {
 *       first: "Rick",
 *       last: "Sanchez",
 *     },
 *   },
 *   {
 *     age: 14,
 *     name: {
 *       first: "Morty",
 *       last: "Smith",
 *     },
 *   },
 * ];
 *
 * let columns: Column[] = [
 *   ["name", "first"],
 *   "age",
 * ];
 *
 * assertEquals(stringify(data, { columns }), `first,age\r\nRick,70\r\nMorty,14\r\n`);
 * ```
 *
 * @param data The source data to stringify. It's an array of items which are
 * plain objects or arrays.
 * @return A CSV string.
 */
const stringify = _function_stringify
export { stringify }

import { ParseError as _class_ParseError } from "jsr:@std/csv@0.224.3"
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

import type { ParseResult as _typeAlias_ParseResult } from "jsr:@std/csv@0.224.3"
/**
 * Options for {@linkcode parse} and {@linkcode CsvParseStream}.
 */
type ParseResult<ParseOptions, T> = _typeAlias_ParseResult<ParseOptions, T>
export type { ParseResult }

import type { ReadOptions as _interface_ReadOptions } from "jsr:@std/csv@0.224.3"
/**
 * Options for {@linkcode parseRecord}.
 */
interface ReadOptions extends _interface_ReadOptions {}
export type { ReadOptions }

import type { RecordWithColumn as _typeAlias_RecordWithColumn } from "jsr:@std/csv@0.224.3"
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

import type { ParseOptions as _interface_ParseOptions } from "jsr:@std/csv@0.224.3"
/**
 * Options for {@linkcode parse}.
 */
interface ParseOptions extends _interface_ParseOptions {}
export type { ParseOptions }

import { parse as _function_parse } from "jsr:@std/csv@0.224.3"
/** UNDOCUMENTED */
const parse = _function_parse
export { parse }

import type { CsvParseStreamOptions as _interface_CsvParseStreamOptions } from "jsr:@std/csv@0.224.3"
/**
 * Options for {@linkcode CsvParseStream}.
 */
interface CsvParseStreamOptions extends _interface_CsvParseStreamOptions {}
export type { CsvParseStreamOptions }

import type { RowType as _typeAlias_RowType } from "jsr:@std/csv@0.224.3"
/**
 * Row return type.
 */
type RowType<T> = _typeAlias_RowType<T>
export type { RowType }

import { CsvParseStream as _class_CsvParseStream } from "jsr:@std/csv@0.224.3"
/**
 * Read data from a CSV-encoded stream or file. Provides an auto/custom mapper
 * for columns.
 *
 * A `CsvParseStream` expects input conforming to
 * {@link https://www.rfc-editor.org/rfc/rfc4180.html | RFC 4180}.
 *
 * @example Usage
 * ```ts no-assert
 * import { CsvParseStream } from "@std/csv/csv-parse-stream";
 *
 * const source = ReadableStream.from([
 *   "name,age",
 *   "Alice,34",
 *   "Bob,24",
 *   "Charlie,45",
 * ]);
 * const parts = source.pipeThrough(new CsvParseStream());
 * ```
 *
 * @template T The type of options for the stream.
 */
class CsvParseStream<T extends CsvParseStreamOptions | undefined = undefined> extends _class_CsvParseStream<T> {}
export { CsvParseStream }

import type { CsvStringifyStreamOptions as _interface_CsvStringifyStreamOptions } from "jsr:@std/csv@0.224.3"
/**
 * Options for {@linkcode CsvStringifyStream}.
 */
interface CsvStringifyStreamOptions extends _interface_CsvStringifyStreamOptions {}
export type { CsvStringifyStreamOptions }

import { CsvStringifyStream as _class_CsvStringifyStream } from "jsr:@std/csv@0.224.3"
/**
 * Convert each chunk to a CSV record.
 *
 * @example Usage
 * ```ts no-assert
 * import { CsvStringifyStream } from "@std/csv/csv-stringify-stream";
 *
 * const path = await Deno.makeTempFile();
 *
 * const file = await Deno.open(path, { create: true, write: true });
 * const readable = ReadableStream.from([
 *   { id: 1, name: "one" },
 *   { id: 2, name: "two" },
 *   { id: 3, name: "three" },
 * ]);
 *
 * await readable
 *   .pipeThrough(new CsvStringifyStream({ columns: ["id", "name"] }))
 *   .pipeThrough(new TextEncoderStream())
 *   .pipeTo(file.writable);
 * ```
 *
 * @template TOptions The type of options for the stream.
 */
class CsvStringifyStream<TOptions extends CsvStringifyStreamOptions> extends _class_CsvStringifyStream<TOptions> {}
export { CsvStringifyStream }
