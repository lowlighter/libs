import type { CsvStringifyStreamOptions as _interface_CsvStringifyStreamOptions } from "jsr:@std/csv@1.0.3/stringify-stream"
/**
 * Options for {@linkcode CsvStringifyStream}.
 */
interface CsvStringifyStreamOptions extends _interface_CsvStringifyStreamOptions {}
export type { CsvStringifyStreamOptions }

import { CsvStringifyStream as _class_CsvStringifyStream } from "jsr:@std/csv@1.0.3/stringify-stream"
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
