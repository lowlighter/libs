import { readerFromStreamReader as _function_readerFromStreamReader } from "jsr:@std/io@0.224.6/reader-from-stream-reader"
/**
 * Create a {@linkcode Reader} from a {@linkcode ReadableStreamDefaultReader}.
 *
 * @example Usage
 * ```ts no-assert
 * import { copy } from "@std/io/copy";
 * import { readerFromStreamReader } from "@std/io/reader-from-stream-reader";
 *
 * const res = await fetch("https://deno.land");
 *
 * const reader = readerFromStreamReader(res.body!.getReader());
 * await copy(reader, Deno.stdout);
 * ```
 *
 * @param streamReader The stream reader to read from
 * @return The reader
 */
const readerFromStreamReader = _function_readerFromStreamReader as typeof _function_readerFromStreamReader
export { readerFromStreamReader }
