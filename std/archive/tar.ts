import type { TarInfo as _interface_TarInfo } from "jsr:@std/archive@0.225.0/tar"
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

import type { TarMeta as _interface_TarMeta } from "jsr:@std/archive@0.225.0/tar"
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

import type { TarOptions as _interface_TarOptions } from "jsr:@std/archive@0.225.0/tar"
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

import type { TarData as _interface_TarData } from "jsr:@std/archive@0.225.0/tar"
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

import type { TarDataWithSource as _interface_TarDataWithSource } from "jsr:@std/archive@0.225.0/tar"
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

import { Tar as _class_Tar } from "jsr:@std/archive@0.225.0/tar"
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
