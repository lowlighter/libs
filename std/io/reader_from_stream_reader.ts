import { readerFromStreamReader as _function_readerFromStreamReader } from "jsr:@std/io@0.224.4/reader-from-stream-reader"
/**
 * Create a {@linkcode Reader} from a {@linkcode ReadableStreamDefaultReader}.
 *
 * @example ```ts
 * import { copy } from "@std/io/copy";
 * import { readerFromStreamReader } from "@std/io/reader-from-stream-reader";
 *
 * const res = await fetch("https://deno.land");
 * using file = await Deno.open("./deno.land.html", { create: true, write: true });
 *
 * const reader = readerFromStreamReader(res.body!.getReader());
 * await copy(reader, file);
 * ```
 */
const readerFromStreamReader = _function_readerFromStreamReader
export { readerFromStreamReader }
