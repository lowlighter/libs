import type { Reader as _interface_Reader } from "jsr:@std/archive@0.225.3/untar"
/**
 * An abstract interface which when implemented provides an interface to read
 * bytes into an array buffer asynchronously.
 */
interface Reader extends _interface_Reader {}
export type { Reader }

import type { Seeker as _interface_Seeker } from "jsr:@std/archive@0.225.3/untar"
/**
 * An abstract interface which when implemented provides an interface to seek
 * within an open file/resource asynchronously.
 */
interface Seeker extends _interface_Seeker {}
export type { Seeker }

import type { TarMetaWithLinkName as _interface_TarMetaWithLinkName } from "jsr:@std/archive@0.225.3/untar"
/**
 * Extend TarMeta with the `linkName` property so that readers can access
 * symbolic link values without polluting the world of archive writers.
 *
 * @experimental
 */
interface TarMetaWithLinkName extends _interface_TarMetaWithLinkName {}
export type { TarMetaWithLinkName }

import type { TarHeader as _typeAlias_TarHeader } from "jsr:@std/archive@0.225.3/untar"
/**
 * Tar header with raw, unprocessed bytes as values.
 *
 * @experimental
 */
type TarHeader = _typeAlias_TarHeader
export type { TarHeader }

import { TarEntry as _class_TarEntry } from "jsr:@std/archive@0.225.3/untar"
/**
 * Contains tar header metadata and a reader to the entry's body.
 *
 * @experimental
 * @example Usage
 * ```ts no-assert
 * import { TarEntry } from "@std/archive/untar";
 * import { Buffer } from "@std/io/buffer";
 *
 * const content = new TextEncoder().encode("hello tar world!");
 * const reader = new Buffer(content);
 * const tarMeta = {
 *   fileName: "archive/",
 *   fileSize: 0,
 *   fileMode: 509,
 *   mtime: 1591800767,
 *   uid: 1001,
 *   gid: 1001,
 *   owner: "deno",
 *   group: "deno",
 *   type: "directory",
 * };
 * const tarEntry: TarEntry = new TarEntry(tarMeta, reader);
 * ```
 */
class TarEntry extends _class_TarEntry {}
export { TarEntry }

import { Untar as _class_Untar } from "jsr:@std/archive@0.225.3/untar"
/**
 * ### Overview
 * A class to extract from a tar archive.  Tar archives allow for storing multiple
 * files in a single file (called an archive, or sometimes a tarball).  These
 * archives typically have the '.tar' extension.
 *
 * ### Supported file formats
 * Only the ustar file format is supported.  This is the most common format. The
 * pax file format may also be read, but additional features, such as longer
 * filenames may be ignored.
 *
 * ### Usage
 * The workflow is to create a Untar instance referencing the source of the tar file.
 * You can then use the untar reference to extract files one at a time. See the worked
 * example below for details.
 *
 * ### Understanding compression
 * A tar archive may be compressed, often identified by the `.tar.gz` extension.
 * This utility does not support decompression which must be done before extracting
 * the files.
 *
 * @example Usage
 * ```ts no-eval
 * import { Untar } from "@std/archive/untar";
 * import { ensureFile } from "@std/fs/ensure-file";
 * import { ensureDir } from "@std/fs/ensure-dir";
 * import { copy } from "@std/io/copy";
 *
 * using reader = await Deno.open("./out.tar", { read: true });
 * const untar = new Untar(reader);
 *
 * for await (const entry of untar) {
 *   console.log(entry); // metadata
 *
 *   if (entry.type === "directory") {
 *     await ensureDir(entry.fileName);
 *     continue;
 *   }
 *
 *   await ensureFile(entry.fileName);
 *   using file = await Deno.open(entry.fileName, { write: true });
 *   // <entry> is a reader.
 *   await copy(entry, file);
 * }
 * ```
 *
 * @experimental
 */
class Untar extends _class_Untar {}
export { Untar }
