/**
 * Streaming utilities for working with tar archives.
 *
 * Files are not compressed, only collected into the archive.
 *
 * ```ts no-eval
 * import { UntarStream } from "@std/tar/untar-stream";
 * import { dirname, normalize } from "@std/path";
 *
 * for await (
 *   const entry of (await Deno.open("./out.tar.gz"))
 *     .readable
 *     .pipeThrough(new DecompressionStream("gzip"))
 *     .pipeThrough(new UntarStream())
 * ) {
 *   const path = normalize(entry.path);
 *   await Deno.mkdir(dirname(path));
 *   await entry.readable?.pipeTo((await Deno.create(path)).writable);
 * }
 * ```
 *
 * @experimental
 * @module
 */
import type { TarStreamFile as _interface_TarStreamFile } from "jsr:@std/tar@0.1.0"
/**
 * The interface required to provide a file.
 *
 * @experimental
 */
interface TarStreamFile extends _interface_TarStreamFile {}
export type { TarStreamFile }

import type { TarStreamDir as _interface_TarStreamDir } from "jsr:@std/tar@0.1.0"
/**
 * The interface required to provide a directory.
 *
 * @experimental
 */
interface TarStreamDir extends _interface_TarStreamDir {}
export type { TarStreamDir }

import type { TarStreamInput as _typeAlias_TarStreamInput } from "jsr:@std/tar@0.1.0"
/**
 * A union type merging all the TarStream interfaces that can be piped into the
 * TarStream class.
 *
 * @experimental
 */
type TarStreamInput = _typeAlias_TarStreamInput
export type { TarStreamInput }

import type { TarStreamOptions as _interface_TarStreamOptions } from "jsr:@std/tar@0.1.0"
/**
 * The options that can go along with a file or directory.
 *
 * @experimental
 */
interface TarStreamOptions extends _interface_TarStreamOptions {}
export type { TarStreamOptions }

import { TarStream as _class_TarStream } from "jsr:@std/tar@0.1.0"
/**
 * ### Overview
 * A TransformStream to create a tar archive. Tar archives allow for storing
 * multiple files in a single file (called an archive, or sometimes a tarball).
 *   These archives typically have a single '.tar' extension.  This
 * implementation follows the [FreeBSD 15.0](https://man.freebsd.org/cgi/man.cgi?query=tar&sektion=5&apropos=0&manpath=FreeBSD+15.0-CURRENT) spec.
 *
 * ### File Format & Limitations
 * The ustar file format is used for creating the tar archive.  While this
 * format is compatible with most tar readers, the format has several
 * limitations, including:
 * - Paths must be at most 256 characters.
 * - Files must be at most 8 GiBs in size, or 64 GiBs if `sizeExtension` is set
 * to true.
 * - Sparse files are not supported.
 *
 * ### Usage
 * TarStream may throw an error for several reasons. A few of those are:
 * - The path is invalid.
 * - The size provided does not match that of the iterable's length.
 *
 * ### Compression
 * Tar archives are not compressed by default.  If you'd like to compress the
 * archive, you may do so by piping it through a compression stream.
 *
 * @experimental
 * @example Usage
 * ```ts no-eval
 * import { TarStream, type TarStreamInput } from "@std/tar/tar-stream";
 *
 * await ReadableStream.from<TarStreamInput>([
 *   {
 *     type: "directory",
 *     path: 'potato/'
 *   },
 *   {
 *     type: "file",
 *     path: 'deno.json',
 *     size: (await Deno.stat('deno.json')).size,
 *     readable: (await Deno.open('deno.json')).readable
 *   },
 *   {
 *     type: "file",
 *     path: '.vscode/settings.json',
 *     size: (await Deno.stat('.vscode/settings.json')).size,
 *     readable: (await Deno.open('.vscode/settings.json')).readable
 *   }
 * ])
 *   .pipeThrough(new TarStream())
 *   .pipeThrough(new CompressionStream('gzip'))
 *   .pipeTo((await Deno.create('./out.tar.gz')).writable)
 * ```
 */
class TarStream extends _class_TarStream {}
export { TarStream }

import { assertValidPath as _function_assertValidPath } from "jsr:@std/tar@0.1.0"
/**
 * Asserts that the path provided is valid for a {@linkcode TarStream}.
 *
 * @experimental
 * @param path The path as a string
 *
 * @example Usage
 * ```ts no-assert no-eval
 * import { assertValidPath, TarStream, type TarStreamInput } from "@std/tar";
 *
 * const paths = (await Array.fromAsync(Deno.readDir("./")))
 *   .filter(entry => entry.isFile)
 *   .map((entry) => entry.name)
 *   // Filter out any paths that are invalid as they are to be placed inside a Tar.
 *   .filter(path => {
 *     try {
 *       assertValidPath(path);
 *       return true;
 *     } catch (error) {
 *       console.error(error);
 *       return false;
 *     }
 *   });
 *
 * await Deno.mkdir('./out/', { recursive: true })
 * await ReadableStream.from(paths)
 *   .pipeThrough(
 *     new TransformStream<string, TarStreamInput>({
 *       async transform(path, controller) {
 *         controller.enqueue({
 *           type: "file",
 *           path,
 *           size: (await Deno.stat(path)).size,
 *           readable: (await Deno.open(path)).readable,
 *         });
 *       },
 *     }),
 *   )
 *   .pipeThrough(new TarStream())
 *   .pipeThrough(new CompressionStream('gzip'))
 *   .pipeTo((await Deno.create('./out/archive.tar.gz')).writable);
 * ```
 */
const assertValidPath = _function_assertValidPath as typeof _function_assertValidPath
export { assertValidPath }

import { assertValidTarStreamOptions as _function_assertValidTarStreamOptions } from "jsr:@std/tar@0.1.0"
/**
 * Asserts that the options provided are valid for a {@linkcode TarStream}.
 *
 * @experimental
 * @param options The TarStreamOptions
 *
 * @example Usage
 * ```ts no-assert no-eval
 * import { assertValidTarStreamOptions, TarStream, type TarStreamInput } from "@std/tar";
 *
 *  const paths = (await Array.fromAsync(Deno.readDir('./')))
 *   .filter(entry => entry.isFile)
 *   .map(entry => entry.name);
 *
 * await Deno.mkdir('./out/', { recursive: true })
 * await ReadableStream.from(paths)
 *   .pipeThrough(new TransformStream<string, TarStreamInput>({
 *     async transform(path, controller) {
 *       const stats = await Deno.stat(path);
 *       const options = { mtime: stats.mtime?.getTime()! / 1000 };
 *       try {
 *         // Filter out any paths that would have an invalid options provided.
 *         assertValidTarStreamOptions(options);
 *         controller.enqueue({
 *           type: "file",
 *           path,
 *           size: stats.size,
 *           readable: (await Deno.open(path)).readable,
 *           options,
 *         });
 *       } catch (error) {
 *         console.error(error);
 *       }
 *     },
 *   }))
 *   .pipeThrough(new TarStream())
 *   .pipeThrough(new CompressionStream('gzip'))
 *   .pipeTo((await Deno.create('./out/archive.tar.gz')).writable);
 * ```
 */
const assertValidTarStreamOptions = _function_assertValidTarStreamOptions as typeof _function_assertValidTarStreamOptions
export { assertValidTarStreamOptions }

import type { OldStyleFormat as _interface_OldStyleFormat } from "jsr:@std/tar@0.1.0"
/**
 * The original tar	archive	header format.
 *
 * @experimental
 */
interface OldStyleFormat extends _interface_OldStyleFormat {}
export type { OldStyleFormat }

import type { PosixUstarFormat as _interface_PosixUstarFormat } from "jsr:@std/tar@0.1.0"
/**
 * The POSIX ustar archive header format.
 *
 * @experimental
 */
interface PosixUstarFormat extends _interface_PosixUstarFormat {}
export type { PosixUstarFormat }

import type { TarStreamEntry as _interface_TarStreamEntry } from "jsr:@std/tar@0.1.0"
/**
 * The structure of an entry extracted from a Tar archive.
 *
 * @experimental
 */
interface TarStreamEntry extends _interface_TarStreamEntry {}
export type { TarStreamEntry }

import { UntarStream as _class_UntarStream } from "jsr:@std/tar@0.1.0"
/**
 * ### Overview
 * A TransformStream to expand a tar archive.  Tar archives allow for storing
 * multiple files in a single file (called an archive, or sometimes a tarball).
 *
 * These archives typically have a single '.tar' extension.  This
 * implementation follows the [FreeBSD 15.0](https://man.freebsd.org/cgi/man.cgi?query=tar&sektion=5&apropos=0&manpath=FreeBSD+15.0-CURRENT) spec.
 *
 * ### Supported File Formats
 * Only the ustar file format is supported.  This is the most common format.
 * Additionally the numeric extension for file size.
 *
 * ### Usage
 * When expanding the archive, as demonstrated in the example, one must decide
 * to either consume the ReadableStream property, if present, or cancel it. The
 * next entry won't be resolved until the previous ReadableStream is either
 * consumed or cancelled.
 *
 * ### Understanding Compressed
 * A tar archive may be compressed, often identified by an additional file
 * extension, such as '.tar.gz' for gzip. This TransformStream does not support
 * decompression which must be done before expanding the archive.
 *
 * @experimental
 * @example Usage
 * ```ts no-eval
 * import { UntarStream } from "@std/tar/untar-stream";
 * import { dirname, normalize } from "@std/path";
 *
 * for await (
 *   const entry of (await Deno.open("./out.tar.gz"))
 *     .readable
 *     .pipeThrough(new DecompressionStream("gzip"))
 *     .pipeThrough(new UntarStream())
 * ) {
 *   const path = normalize(entry.path);
 *   await Deno.mkdir(dirname(path));
 *   await entry.readable?.pipeTo((await Deno.create(path)).writable);
 * }
 * ```
 */
class UntarStream extends _class_UntarStream {}
export { UntarStream }