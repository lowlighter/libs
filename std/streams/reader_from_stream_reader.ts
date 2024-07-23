import { readerFromStreamReader as _function_readerFromStreamReader } from "jsr:@std/streams@0.224.5/reader-from-stream-reader"
/**
 * Create a {@linkcode https://jsr.io/@std/io/doc/types/~/Reader | Reader} from a {@linkcode ReadableStreamDefaultReader}.
 *
 * @param streamReader A `ReadableStreamDefaultReader` to convert into a `Reader`.
 * @return A `Reader` that reads from the `streamReader`.
 *
 * @example Copy the response body of a fetch request to the blackhole
 * ```ts no-eval no-assert
 * import { copy } from "@std/io/copy";
 * import { readerFromStreamReader } from "@std/streams/reader-from-stream-reader";
 * import { devNull } from "node:os";
 *
 * const res = await fetch("https://deno.land");
 * using blackhole = await Deno.open(devNull, { write: true });
 *
 * const reader = readerFromStreamReader(res.body!.getReader());
 * await copy(reader, blackhole);
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/io | @std/io} instead.
 */
const readerFromStreamReader = _function_readerFromStreamReader
export { readerFromStreamReader }
