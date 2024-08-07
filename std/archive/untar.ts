import type { TarMetaWithLinkName as _interface_TarMetaWithLinkName } from "jsr:@std/archive@0.224.3/untar"
/**
 * Extend TarMeta with the `linkName` property so that readers can access
 * symbolic link values without polluting the world of archive writers.
 */
interface TarMetaWithLinkName extends _interface_TarMetaWithLinkName {}
export type { TarMetaWithLinkName }

import type { TarHeader as _typeAlias_TarHeader } from "jsr:@std/archive@0.224.3/untar"
/**
 * Tar header with raw, unprocessed bytes as values.
 */
type TarHeader = _typeAlias_TarHeader
export type { TarHeader }

import { TarEntry as _class_TarEntry } from "jsr:@std/archive@0.224.3/untar"
/**
 * Contains tar header metadata and a reader to the entry's body.
 */
class TarEntry extends _class_TarEntry {}
export { TarEntry }

import { Untar as _class_Untar } from "jsr:@std/archive@0.224.3/untar"
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
 * @example ```ts
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
 */
class Untar extends _class_Untar {}
export { Untar }
