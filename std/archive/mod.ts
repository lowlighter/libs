/**
 * Tar is a utility for collecting multiple files (or any arbitrary data) into one
 * archive file, while untar is the inverse utility to extract the files from an
 * archive.  Files are not compressed, only collected into the archive.
 *
 * ```ts
 * import { Tar } from "@std/archive/tar";
 * import { Buffer } from "@std/io/buffer";
 * import { copy } from "@std/io/copy";
 *
 * const tar = new Tar();
 *
 * // Now that we've created our tar, let's add some files to it:
 *
 * const content = new TextEncoder().encode("Some arbitrary content");
 * await tar.append("deno.txt", {
 *   reader: new Buffer(content),
 *   contentSize: content.byteLength,
 * });
 *
 * // This file is sourced from the filesystem (and renamed in the archive)
 * await tar.append("filename_in_archive.txt", {
 *   filePath: "./filename_on_filesystem.txt",
 * });
 *
 * // Now let's write the tar (with it's two files) to the filesystem
 * // use tar.getReader() to read the contents.
 *
 * const writer = await Deno.open("./out.tar", { write: true, create: true });
 * await copy(tar.getReader(), writer);
 * writer.close();
 * ```
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @module
 */
import type { TarInfo as _interface_TarInfo } from "jsr:@std/archive@0.225.0"
/**
 * Base interface for {@linkcode TarMeta}.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
interface TarInfo extends _interface_TarInfo {}
export type { TarInfo }

import type { TarMeta as _interface_TarMeta } from "jsr:@std/archive@0.225.0"
/**
 * Base interface for {@linkcode TarMetaWithLinkName}.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
interface TarMeta extends _interface_TarMeta {}
export type { TarMeta }

import type { TarOptions as _interface_TarOptions } from "jsr:@std/archive@0.225.0"
/**
 * Options for {@linkcode Tar.append}.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
interface TarOptions extends _interface_TarOptions {}
export type { TarOptions }

import type { TarData as _interface_TarData } from "jsr:@std/archive@0.225.0"
/**
 * Base interface for {@linkcode TarDataWithSource}.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
interface TarData extends _interface_TarData {}
export type { TarData }

import type { TarDataWithSource as _interface_TarDataWithSource } from "jsr:@std/archive@0.225.0"
/**
 * Tar data interface for {@linkcode Tar.data}.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
interface TarDataWithSource extends _interface_TarDataWithSource {}
export type { TarDataWithSource }

import { Tar as _class_Tar } from "jsr:@std/archive@0.225.0"
/**
 * ### Overview
 * A class to create a tar archive.  Tar archives allow for storing multiple files in a
 * single file (called an archive, or sometimes a tarball).  These archives typically
 * have the '.tar' extension.
 *
 * ### Usage
 * The workflow is to create a Tar instance, append files to it, and then write the
 * tar archive to the filesystem (or other output stream).  See the worked example
 * below for details.
 *
 * ### Compression
 * Tar archives are not compressed by default.  If you want to compress the archive,
 * you may compress the tar archive after creation, but this capability is not provided
 * here.
 *
 * ### File format and limitations
 *
 * The ustar file format is used for creating the archive file.
 * While this format is compatible with most tar readers,
 * the format has several limitations, including:
 * * Files must be smaller than 8GiB
 * * Filenames (including path) must be shorter than 256 characters
 * * Filenames (including path) cannot contain non-ASCII characters
 * * Sparse files are not supported
 *
 * @example ```ts
 * import { Tar } from "@std/archive/tar";
 * import { Buffer } from "@std/io/buffer";
 * import { copy } from "@std/io/copy";
 *
 * const tar = new Tar();
 *
 * // Now that we've created our tar, let's add some files to it:
 *
 * const content = new TextEncoder().encode("Some arbitrary content");
 * await tar.append("deno.txt", {
 *   reader: new Buffer(content),
 *   contentSize: content.byteLength,
 * });
 *
 * // This file is sourced from the filesystem (and renamed in the archive)
 * await tar.append("filename_in_archive.txt", {
 *   filePath: "./filename_on_filesystem.txt",
 * });
 *
 * // Now let's write the tar (with it's two files) to the filesystem
 * // use tar.getReader() to read the contents.
 *
 * const writer = await Deno.open("./out.tar", { write: true, create: true });
 * await copy(tar.getReader(), writer);
 * writer.close();
 * ```
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
class Tar extends _class_Tar {}
export { Tar }

import type { TarMetaWithLinkName as _interface_TarMetaWithLinkName } from "jsr:@std/archive@0.225.0"
/**
 * Extend TarMeta with the `linkName` property so that readers can access
 * symbolic link values without polluting the world of archive writers.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
interface TarMetaWithLinkName extends _interface_TarMetaWithLinkName {}
export type { TarMetaWithLinkName }

import type { TarHeader as _typeAlias_TarHeader } from "jsr:@std/archive@0.225.0"
/**
 * Tar header with raw, unprocessed bytes as values.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
type TarHeader = _typeAlias_TarHeader
export type { TarHeader }

import { TarEntry as _class_TarEntry } from "jsr:@std/archive@0.225.0"
/**
 * Contains tar header metadata and a reader to the entry's body.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
class TarEntry extends _class_TarEntry {}
export { TarEntry }

import { Untar as _class_Untar } from "jsr:@std/archive@0.225.0"
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
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
class Untar extends _class_Untar {}
export { Untar }
