import type { CsvStringifyStreamOptions as _interface_CsvStringifyStreamOptions } from "jsr:@std/csv@0.224.3/csv-stringify-stream"
/**
 * Options for {@linkcode CsvStringifyStream}.
 */
interface CsvStringifyStreamOptions extends _interface_CsvStringifyStreamOptions {}
export type { CsvStringifyStreamOptions }

import { CsvStringifyStream as _class_CsvStringifyStream } from "jsr:@std/csv@0.224.3/csv-stringify-stream"
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
