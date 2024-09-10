/**
 * Reads and writes comma-separated values (CSV) files.
 *
 * ```ts
 * import { parse } from "@std/csv/parse";
 * import { assertEquals } from "@std/assert";
 *
 * const string = "a,b,c\nd,e,f";
 *
 * assertEquals(parse(string, { skipFirstRow: false }), [["a", "b", "c"], ["d", "e", "f"]]);
 * assertEquals(parse(string, { skipFirstRow: true }), [{ a: "d", b: "e", c: "f" }]);
 * assertEquals(parse(string, { columns: ["x", "y", "z"] }), [{ x: "a", y: "b", z: "c" }, { x: "d", y: "e", z: "f" }]);
 * ```
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
 * ```ts no-assert
 * [`the "word" is true`, `a "quoted-field"`]
 * ```
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
import type { ParseResult as _typeAlias_ParseResult } from "jsr:@std/csv@1.0.3"
/**
 * Parse result type for {@linkcode parse} and {@linkcode CsvParseStream}.
 */
type ParseResult<ParseOptions, T> = _typeAlias_ParseResult<ParseOptions, T>
export type { ParseResult }

import type { RecordWithColumn as _typeAlias_RecordWithColumn } from "jsr:@std/csv@1.0.3"
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

import type { ParseOptions as _interface_ParseOptions } from "jsr:@std/csv@1.0.3"
/**
 * Options for {@linkcode parse}.
 */
interface ParseOptions extends _interface_ParseOptions {}
export type { ParseOptions }

import { parse as _function_parse } from "jsr:@std/csv@1.0.3"
/** UNDOCUMENTED */
const parse = _function_parse as typeof _function_parse
export { parse }

import type { CsvParseStreamOptions as _interface_CsvParseStreamOptions } from "jsr:@std/csv@1.0.3"
/**
 * Options for {@linkcode CsvParseStream}.
 */
interface CsvParseStreamOptions extends _interface_CsvParseStreamOptions {}
export type { CsvParseStreamOptions }

import type { RowType as _typeAlias_RowType } from "jsr:@std/csv@1.0.3"
/**
 * Row return type.
 */
type RowType<T> = _typeAlias_RowType<T>
export type { RowType }

import { CsvParseStream as _class_CsvParseStream } from "jsr:@std/csv@1.0.3"
/**
 * `CsvParseStream` transforms a stream of CSV-encoded text into a stream of
 * parsed objects.
 *
 * A `CsvParseStream` expects input conforming to
 * {@link https://www.rfc-editor.org/rfc/rfc4180.html | RFC 4180}.
 *
 * @example Usage with default options
 * ```ts
 * import { CsvParseStream } from "@std/csv/parse-stream";
 * import { assertEquals } from "@std/assert/equals";
 * import { assertType, IsExact } from "@std/testing/types"
 *
 * const source = ReadableStream.from([
 *   "name,age\n",
 *   "Alice,34\n",
 *   "Bob,24\n",
 * ]);
 * const stream = source.pipeThrough(new CsvParseStream());
 * const result = await Array.fromAsync(stream);
 *
 * assertEquals(result, [
 *   ["name", "age"],
 *   ["Alice", "34"],
 *   ["Bob", "24"],
 * ]);
 * assertType<IsExact<typeof result, string[][]>>(true);
 * ```
 *
 * @example Skip first row with `skipFirstRow: true`
 * ```ts
 * import { CsvParseStream } from "@std/csv/parse-stream";
 * import { assertEquals } from "@std/assert/equals";
 * import { assertType, IsExact } from "@std/testing/types"
 *
 * const source = ReadableStream.from([
 *   "name,age\n",
 *   "Alice,34\n",
 *   "Bob,24\n",
 * ]);
 * const stream = source.pipeThrough(new CsvParseStream({ skipFirstRow: true }));
 * const result = await Array.fromAsync(stream);
 *
 * assertEquals(result, [
 *   { name: "Alice", age: "34" },
 *   { name: "Bob", age: "24" },
 * ]);
 * assertType<IsExact<typeof result, Record<string, string>[]>>(true);
 * ```
 *
 * @example Specify columns with `columns` option
 * ```ts
 * import { CsvParseStream } from "@std/csv/parse-stream";
 * import { assertEquals } from "@std/assert/equals";
 * import { assertType, IsExact } from "@std/testing/types"
 *
 * const source = ReadableStream.from([
 *   "Alice,34\n",
 *   "Bob,24\n",
 * ]);
 * const stream = source.pipeThrough(new CsvParseStream({
 *   columns: ["name", "age"]
 * }));
 * const result = await Array.fromAsync(stream);
 *
 * assertEquals(result, [
 *   { name: "Alice", age: "34" },
 *   { name: "Bob", age: "24" },
 * ]);
 * assertType<IsExact<typeof result, Record<"name" | "age", string>[]>>(true);
 * ```
 *
 * @example Specify columns with `columns` option and skip first row with
 * `skipFirstRow: true`
 * ```ts
 * import { CsvParseStream } from "@std/csv/parse-stream";
 * import { assertEquals } from "@std/assert/equals";
 * import { assertType, IsExact } from "@std/testing/types"
 *
 * const source = ReadableStream.from([
 *   "Alice,34\n",
 *   "Bob,24\n",
 * ]);
 * const stream = source.pipeThrough(new CsvParseStream({
 *   columns: ["name", "age"],
 *   skipFirstRow: true,
 * }));
 * const result = await Array.fromAsync(stream);
 *
 * assertEquals(result, [{ name: "Bob", age: "24" }]);
 * assertType<IsExact<typeof result, Record<"name" | "age", string>[]>>(true);
 * ```
 *
 * @example TSV (tab-separated values) with `separator: "\t"`
 * ```ts
 * import { CsvParseStream } from "@std/csv/parse-stream";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const source = ReadableStream.from([
 *   "Alice\t34\n",
 *   "Bob\t24\n",
 * ]);
 * const stream = source.pipeThrough(new CsvParseStream({
 *   separator: "\t",
 * }));
 * const result = await Array.fromAsync(stream);
 *
 * assertEquals(result, [
 *   ["Alice", "34"],
 *   ["Bob", "24"],
 * ]);
 * ```
 *
 * @example Trim leading space with `trimLeadingSpace: true`
 * ```ts
 * import { CsvParseStream } from "@std/csv/parse-stream";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const source = ReadableStream.from([
 *   "      Alice,34\n          ",
 *   "Bob,     24\n",
 * ]);
 * const stream = source.pipeThrough(new CsvParseStream({
 *   trimLeadingSpace: true,
 * }));
 * const result = await Array.fromAsync(stream);
 *
 * assertEquals(result, [
 *   ["Alice", "34"],
 *   ["Bob", "24"],
 * ]);
 * ```
 *
 * @example Quoted fields
 * ```ts
 * import { CsvParseStream } from "@std/csv/parse-stream";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const source = ReadableStream.from([
 *   `"a ""word""","com`,
 *   `ma,","newline`,
 *   `\n"\nfoo,bar,b`,
 *   `az\n`,
 * ]);
 * const stream = source.pipeThrough(new CsvParseStream());
 * const result = await Array.fromAsync(stream);
 *
 * assertEquals(result, [
 *   ['a "word"', "comma,", "newline\n"],
 *   ["foo", "bar", "baz"]
 * ]);
 * ```
 *
 * @example Allow lazy quotes with `lazyQuotes: true`
 * ```ts
 * import { CsvParseStream } from "@std/csv/parse-stream";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const source = ReadableStream.from([
 *   `a "word","1"`,
 *   `2",a","b`,
 * ]);
 * const stream = source.pipeThrough(new CsvParseStream({
 *   lazyQuotes: true,
 * }));
 * const result = await Array.fromAsync(stream);
 *
 * assertEquals(result, [['a "word"', '1"2', 'a"', 'b']]);
 * ```
 *
 * @example Define comment prefix with `comment` option
 * ```ts
 * import { CsvParseStream } from "@std/csv/parse-stream";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const source = ReadableStream.from([
 *   "Alice,34\n",
 *   "# THIS IS A COMMENT\n",
 *   "Bob,24\n",
 * ]);
 * const stream = source.pipeThrough(new CsvParseStream({
 *   comment: "#",
 * }));
 * const result = await Array.fromAsync(stream);
 *
 * assertEquals(result, [
 *   ["Alice", "34"],
 *   ["Bob", "24"],
 * ]);
 * ```
 *
 * @example Infer the number of fields from the first row with
 * `fieldsPerRecord: 0`
 * ```ts
 * import { CsvParseStream } from "@std/csv/parse-stream";
 * import { assertEquals } from "@std/assert/equals";
 * import { assertRejects } from "@std/assert/rejects";
 *
 * const source = ReadableStream.from([
 *   "Alice,34\n",
 *   "Bob,24,CA\n", // Note that this row has more fields than the first row
 * ]);
 * const stream = source.pipeThrough(new CsvParseStream({
 *   fieldsPerRecord: 0,
 * }));
 * const reader = stream.getReader();
 * assertEquals(await reader.read(), { done: false, value: ["Alice", "34"] });
 * await assertRejects(
 *   () => reader.read(),
 *   SyntaxError,
 *   "Syntax error on line 2: expected 2 fields but got 3",
 * );
 * ```
 *
 * @example Enforce the number of field for each row with `fieldsPerRecord: 2`
 * ```ts
 * import { CsvParseStream } from "@std/csv/parse-stream";
 * import { assertEquals } from "@std/assert/equals";
 * import { assertRejects } from "@std/assert/rejects";
 *
 * const source = ReadableStream.from([
 *   "Alice,34\n",
 *   "Bob,24,CA\n",
 * ]);
 * const stream = source.pipeThrough(new CsvParseStream({
 *   fieldsPerRecord: 2,
 * }));
 * const reader = stream.getReader();
 * assertEquals(await reader.read(), { done: false, value: ["Alice", "34"] });
 * await assertRejects(
 *   () => reader.read(),
 *   SyntaxError,
 *   "Syntax error on line 2: expected 2 fields but got 3",
 * );
 * ```
 *
 * @template T The type of options for the stream.
 */
class CsvParseStream<T extends CsvParseStreamOptions | undefined = undefined> extends _class_CsvParseStream<T> {}
export { CsvParseStream }

import type { PropertyAccessor as _typeAlias_PropertyAccessor } from "jsr:@std/csv@1.0.3"
/**
 * Array index or record key corresponding to a value for a data object.
 */
type PropertyAccessor = _typeAlias_PropertyAccessor
export type { PropertyAccessor }

import type { ColumnDetails as _typeAlias_ColumnDetails } from "jsr:@std/csv@1.0.3"
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

import type { Column as _typeAlias_Column } from "jsr:@std/csv@1.0.3"
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

import type { DataItem as _typeAlias_DataItem } from "jsr:@std/csv@1.0.3"
/**
 * An object (plain or array)
 */
type DataItem = _typeAlias_DataItem
export type { DataItem }

import type { StringifyOptions as _typeAlias_StringifyOptions } from "jsr:@std/csv@1.0.3"
/**
 * Options for {@linkcode stringify}.
 */
type StringifyOptions = _typeAlias_StringifyOptions
export type { StringifyOptions }

import { stringify as _function_stringify } from "jsr:@std/csv@1.0.3"
/**
 * Converts an array of objects into a CSV string.
 *
 * @example Default options
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
 *   ["Rick", 70],
 *   ["Morty", 14],
 * ];
 *
 * assertEquals(stringify(data), `Rick,70\r\nMorty,14\r\n`);
 * ```
 *
 * @example Give an array of objects and specify columns
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
 *   { name: "Rick", age: 70 },
 *   { name: "Morty", age: 14 },
 * ];
 *
 * const columns = ["name", "age"];
 *
 * assertEquals(stringify(data, { columns }), `name,age\r\nRick,70\r\nMorty,14\r\n`);
 * ```
 *
 * @example Give an array of objects without specifying columns
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertThrows } from "@std/assert/throws";
 *
 * const data = [
 *   { name: "Rick", age: 70 },
 *   { name: "Morty", age: 14 },
 * ];
 *
 * assertThrows(
 *   () => stringify(data),
 *   TypeError,
 *   "No property accessor function was provided for object",
 * );
 * ```
 *
 * @example Give an array of objects and specify columns with `headers: false`
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
 *   { name: "Rick", age: 70 },
 *   { name: "Morty", age: 14 },
 * ];
 *
 * const columns = ["name", "age"];
 *
 * assertEquals(
 *   stringify(data, { columns, headers: false }),
 *  `Rick,70\r\nMorty,14\r\n`,
 * );
 * ```
 *
 * @example Give an array of objects and specify columns with renaming
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
 *   { name: "Rick", age: 70 },
 *   { name: "Morty", age: 14 },
 * ];
 *
 * const columns = [
 *   { prop: "name", header: "user name" },
 *   "age",
 * ];
 *
 * assertEquals(
 *   stringify(data, { columns }),
 *  `user name,age\r\nRick,70\r\nMorty,14\r\n`,
 * );
 * ```
 *
 * @example Give an array of objects with nested property and specify columns
 * ```ts
 * import {
 *   Column,
 *   stringify,
 * } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
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
 * const columns: Column[] = [
 *   ["name", "first"],
 *   "age",
 * ];
 *
 * assertEquals(
 *   stringify(data, { columns }),
 *  `first,age\r\nRick,70\r\nMorty,14\r\n`,
 * );
 * ```
 *
 * @example Give an array of objects with nested property and specify columns
 * with renaming
 * ```ts
 * import {
 *   Column,
 *   stringify,
 * } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
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
 * const columns: Column[] = [
 *   { prop: ["name", "first"], header: "first name" },
 *   "age",
 * ];
 *
 * assertEquals(
 *   stringify(data, { columns }),
 *  `first name,age\r\nRick,70\r\nMorty,14\r\n`,
 * );
 * ```
 *
 * @example Give an array of string arrays and specify columns with renaming
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
 *   ["Rick", 70],
 *   ["Morty", 14],
 * ];
 *
 * const columns = [
 *   { prop: 0, header: "name" },
 *   { prop: 1, header: "age" },
 * ];
 *
 * assertEquals(
 *   stringify(data, { columns }),
 *  `name,age\r\nRick,70\r\nMorty,14\r\n`,
 * );
 * ```
 *
 * @example Emit TSV (tab-separated values) with `separator: "\t"`
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [
 *   ["Rick", 70],
 *   ["Morty", 14],
 * ];
 *
 * assertEquals(stringify(data, { separator: "\t" }), `Rick\t70\r\nMorty\t14\r\n`);
 * ```
 *
 * @example Prepend a byte-order mark with `bom: true`
 * ```ts
 * import { stringify } from "@std/csv/stringify";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const data = [["Rick", 70]];
 *
 * assertEquals(stringify(data, { bom: true }), "\ufeffRick,70\r\n");
 * ```
 *
 * @param data The source data to stringify. It's an array of items which are
 * plain objects or arrays.
 * @param options Options for the stringification.
 * @return A CSV string.
 */
const stringify = _function_stringify as typeof _function_stringify
export { stringify }

import type { CsvStringifyStreamOptions as _interface_CsvStringifyStreamOptions } from "jsr:@std/csv@1.0.3"
/**
 * Options for {@linkcode CsvStringifyStream}.
 */
interface CsvStringifyStreamOptions extends _interface_CsvStringifyStreamOptions {}
export type { CsvStringifyStreamOptions }

import { CsvStringifyStream as _class_CsvStringifyStream } from "jsr:@std/csv@1.0.3"
/**
 * Convert each chunk to a CSV record.
 *
 * @example Write CSV to a file
 * ```ts
 * import { CsvStringifyStream } from "@std/csv/stringify-stream";
 * import { assertEquals } from "@std/assert/equals";
 *
 * async function writeCsvToTempFile(): Promise<string> {
 *   const path = await Deno.makeTempFile();
 *   using file = await Deno.open(path, { write: true });
 *
 *   const readable = ReadableStream.from([
 *     { id: 1, name: "one" },
 *     { id: 2, name: "two" },
 *     { id: 3, name: "three" },
 *   ]);
 *
 *   await readable
 *     .pipeThrough(new CsvStringifyStream({ columns: ["id", "name"] }))
 *     .pipeThrough(new TextEncoderStream())
 *     .pipeTo(file.writable);
 *
 *   return path;
 * }
 *
 * const path = await writeCsvToTempFile();
 * const content = await Deno.readTextFile(path);
 * assertEquals(content, "id,name\r\n1,one\r\n2,two\r\n3,three\r\n");
 * ```
 *
 * @example Write TSV to a file
 * ```ts
 * import { CsvStringifyStream } from "@std/csv/stringify-stream";
 * import { assertEquals } from "@std/assert/equals";
 *
 * async function writeTsvToTempFile(): Promise<string> {
 *   const path = await Deno.makeTempFile();
 *   using file = await Deno.open(path, { write: true });
 *
 *   const readable = ReadableStream.from([
 *     { id: 1, name: "one" },
 *     { id: 2, name: "two" },
 *     { id: 3, name: "three" },
 *   ]);
 *
 *   await readable
 *     .pipeThrough(
 *       new CsvStringifyStream({
 *         columns: ["id", "name"],
 *         separator: "\t",
 *       }),
 *     )
 *     .pipeThrough(new TextEncoderStream())
 *     .pipeTo(file.writable);
 *
 *   return path;
 * }
 *
 * const path = await writeTsvToTempFile();
 * const content = await Deno.readTextFile(path);
 * assertEquals(content, "id\tname\r\n1\tone\r\n2\ttwo\r\n3\tthree\r\n");
 * ```
 *
 * @template TOptions The type of options for the stream.
 */
class CsvStringifyStream<TOptions extends CsvStringifyStreamOptions> extends _class_CsvStringifyStream<TOptions> {}
export { CsvStringifyStream }
