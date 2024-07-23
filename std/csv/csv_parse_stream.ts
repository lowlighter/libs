import type { CsvParseStreamOptions as _interface_CsvParseStreamOptions } from "jsr:@std/csv@0.224.3/csv-parse-stream"
/**
 * Options for {@linkcode CsvParseStream}.
 */
interface CsvParseStreamOptions extends _interface_CsvParseStreamOptions {}
export type { CsvParseStreamOptions }

import type { RowType as _typeAlias_RowType } from "jsr:@std/csv@0.224.3/csv-parse-stream"
/**
 * Row return type.
 */
type RowType<T> = _typeAlias_RowType<T>
export type { RowType }

import { CsvParseStream as _class_CsvParseStream } from "jsr:@std/csv@0.224.3/csv-parse-stream"
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
