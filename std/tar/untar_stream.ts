import type { OldStyleFormat as _interface_OldStyleFormat } from "jsr:@std/tar@0.1.2/untar-stream"
/**
 * The original tar	archive	header format.
 *
 * @experimental
 */
interface OldStyleFormat extends _interface_OldStyleFormat {}
export type { OldStyleFormat }

import type { PosixUstarFormat as _interface_PosixUstarFormat } from "jsr:@std/tar@0.1.2/untar-stream"
/**
 * The POSIX ustar archive header format.
 *
 * @experimental
 */
interface PosixUstarFormat extends _interface_PosixUstarFormat {}
export type { PosixUstarFormat }

import type { TarStreamEntry as _interface_TarStreamEntry } from "jsr:@std/tar@0.1.2/untar-stream"
/**
 * The structure of an entry extracted from a Tar archive.
 *
 * @experimental
 */
interface TarStreamEntry extends _interface_TarStreamEntry {}
export type { TarStreamEntry }

import { UntarStream as _class_UntarStream } from "jsr:@std/tar@0.1.2/untar-stream"
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
 * ```ts ignore
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
