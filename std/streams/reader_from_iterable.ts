import { readerFromIterable as _function_readerFromIterable } from "jsr:@std/streams@0.224.5/reader-from-iterable"
/**
 * Create a {@linkcode https://jsr.io/@std/io/doc/types/~/Reader | Reader} from an iterable of {@linkcode Uint8Array}s.
 *
 * @param iterable An iterable or async iterable of `Uint8Array`s to convert into a `Reader`.
 * @return A `Reader` that reads from the iterable.
 *
 * @example Write `Deno.build` information to the blackhole 3 times every second
 * ```ts no-eval no-assert
 * import { readerFromIterable } from "@std/streams/reader-from-iterable";
 * import { copy } from "@std/io/copy";
 * import { delay } from "@std/async/delay";
 * import { devNull } from "node:os";
 *
 * const reader = readerFromIterable((async function* () {
 *   for (let i = 0; i < 3; i++) {
 *     await delay(1000);
 *     const message = `data: ${JSON.stringify(Deno.build)}\n\n`;
 *     yield new TextEncoder().encode(message);
 *   }
 * })());
 *
 * using blackhole = await Deno.open(devNull, { write: true });
 * await copy(reader, blackhole);
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode ReadableStream.from} instead.
 */
const readerFromIterable = _function_readerFromIterable
export { readerFromIterable }
