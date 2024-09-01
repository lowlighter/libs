import type { CsvParseStreamOptions as _interface_CsvParseStreamOptions } from "jsr:@std/csv@1.0.2/parse-stream"
/**
 * Options for {@linkcode CsvParseStream}.
 */
interface CsvParseStreamOptions extends _interface_CsvParseStreamOptions {}
export type { CsvParseStreamOptions }

import type { RowType as _typeAlias_RowType } from "jsr:@std/csv@1.0.2/parse-stream"
/**
 * Row return type.
 */
type RowType<T> = _typeAlias_RowType<T>
export type { RowType }

import { CsvParseStream as _class_CsvParseStream } from "jsr:@std/csv@1.0.2/parse-stream"
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
