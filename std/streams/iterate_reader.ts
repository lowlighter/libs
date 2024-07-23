import type { Reader as _interface_Reader } from "jsr:@std/streams@0.224.5/iterate-reader"
/**
 * An abstract interface which when implemented provides an interface to read bytes into an array buffer asynchronously.
 */
interface Reader extends _interface_Reader {}
export type { Reader }

import type { ReaderSync as _interface_ReaderSync } from "jsr:@std/streams@0.224.5/iterate-reader"
/**
 * An abstract interface which when implemented provides an interface to read bytes into an array buffer synchronously.
 */
interface ReaderSync extends _interface_ReaderSync {}
export type { ReaderSync }

import { iterateReader as _function_iterateReader } from "jsr:@std/streams@0.224.5/iterate-reader"
/**
 * Turns a {@linkcode https://jsr.io/@std/io/doc/types/~/Reader | Reader}, `r`, into an async iterator.
 *
 * @param r A reader to turn into an async iterator.
 * @param options Options for the iterateReader function.
 * @return An async iterator that yields Uint8Array.
 *
 * @example Convert a `Deno.FsFile` into an async iterator and iterate over it
 * ```ts no-assert no-eval
 * import { iterateReader } from "@std/streams/iterate-reader";
 *
 * using f = await Deno.open("./README.md");
 * for await (const chunk of iterateReader(f)) {
 *   console.log(chunk);
 * }
 * ```
 *
 * @example Specify a buffer size of 1MiB
 * ```ts no-assert no-eval
 * import { iterateReader } from "@std/streams/iterate-reader";
 *
 * using f = await Deno.open("./README.md");
 * const it = iterateReader(f, {
 *   bufSize: 1024 * 1024
 * });
 * for await (const chunk of it) {
 *   console.log(chunk);
 * }
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/io | @std/io} instead.
 */
const iterateReader = _function_iterateReader
export { iterateReader }

import { iterateReaderSync as _function_iterateReaderSync } from "jsr:@std/streams@0.224.5/iterate-reader"
/**
 * Turns a {@linkcode https://jsr.io/@std/io/doc/types/~/ReaderSync | ReaderSync}, `r`, into an iterator.
 *
 * @param r A reader to turn into an iterator.
 * @param options Options for the iterateReaderSync function.
 * @return An iterator that yields Uint8Array.
 *
 * @example Convert a `Deno.FsFile` into an iterator and iterate over it
 * ```ts no-eval no-assert
 * import { iterateReaderSync } from "@std/streams/iterate-reader";
 *
 * using f = Deno.openSync("./README.md");
 * for (const chunk of iterateReaderSync(f)) {
 *   console.log(chunk);
 * }
 * ```
 *
 * @example Specify a buffer size of 1MiB
 * ```ts no-eval no-assert
 * import { iterateReaderSync } from "@std/streams/iterate-reader";
 *
 * using f = await Deno.open("./README.md");
 * const iter = iterateReaderSync(f, {
 *   bufSize: 1024 * 1024
 * });
 * for (const chunk of iter) {
 *   console.log(chunk);
 * }
 * ```
 *
 * Iterator uses an internal buffer of fixed size for efficiency; it returns
 * a view on that buffer on each iteration. It is therefore caller's
 * responsibility to copy contents of the buffer if needed; otherwise the
 * next iteration will overwrite contents of previously returned chunk.
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/io | @std/io} instead.
 */
const iterateReaderSync = _function_iterateReaderSync
export { iterateReaderSync }
