import type { Reader as _interface_Reader } from "jsr:@std/io@0.224.3/iterate-reader"
/**
 * An abstract interface which when implemented provides an interface to read bytes into an array buffer asynchronously.
 */
interface Reader extends _interface_Reader {}
export type { Reader }

import type { ReaderSync as _interface_ReaderSync } from "jsr:@std/io@0.224.3/iterate-reader"
/**
 * An abstract interface which when implemented provides an interface to read bytes into an array buffer synchronously.
 */
interface ReaderSync extends _interface_ReaderSync {}
export type { ReaderSync }

import { iterateReader as _function_iterateReader } from "jsr:@std/io@0.224.3/iterate-reader"
/**
 * Turns a {@linkcode Reader} into an async iterator.
 *
 * @example ```ts
 * import { iterateReader } from "@std/io/iterate-reader";
 *
 * using file = await Deno.open("/etc/passwd");
 * for await (const chunk of iterateReader(file)) {
 *   console.log(chunk);
 * }
 * ```
 *
 * Second argument can be used to tune size of a buffer.
 * Default size of the buffer is 32kB.
 *
 * @example ```ts
 * import { iterateReader } from "@std/io/iterate-reader";
 *
 * using file = await Deno.open("/etc/passwd");
 * const iter = iterateReader(file, {
 *   bufSize: 1024 * 1024
 * });
 * for await (const chunk of iter) {
 *   console.log(chunk);
 * }
 * ```
 */
const iterateReader = _function_iterateReader
export { iterateReader }

import { iterateReaderSync as _function_iterateReaderSync } from "jsr:@std/io@0.224.3/iterate-reader"
/**
 * Turns a {@linkcode ReaderSync} into an iterator.
 *
 * ```ts
 * import { iterateReaderSync } from "@std/io/iterate-reader";
 *
 * using file = Deno.openSync("/etc/passwd");
 * for (const chunk of iterateReaderSync(file)) {
 *   console.log(chunk);
 * }
 * ```
 *
 * Second argument can be used to tune size of a buffer.
 * Default size of the buffer is 32kB.
 *
 * ```ts
 * import { iterateReaderSync } from "@std/io/iterate-reader";
 *
 * using file = await Deno.open("/etc/passwd");
 * const iter = iterateReaderSync(file, {
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
 */
const iterateReaderSync = _function_iterateReaderSync
export { iterateReaderSync }
