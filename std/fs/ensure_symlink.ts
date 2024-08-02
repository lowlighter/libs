import { ensureSymlink as _function_ensureSymlink } from "jsr:@std/fs@1.0.1/ensure-symlink"
/**
 * Asynchronously ensures that the link exists, and points to a valid file.
 *
 * If the parent directories for the link do not exist, they are created. If the
 * link already exists, and it is not modified, this function does nothing. If
 * the link already exists, and it does not point to the given target, an error
 * is thrown.
 *
 * Requires `--allow-read` and `--allow-write` permissions.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param target The source file path as a string or URL.
 * @param linkName The destination link path as a string or URL.
 *
 * @return A void promise that resolves once the link exists.
 *
 * @example Usage
 * ```ts no-eval
 * import { ensureSymlink } from "@std/fs/ensure-symlink";
 *
 * await ensureSymlink("./folder/targetFile.dat", "./folder/targetFile.link.dat");
 * ```
 */
const ensureSymlink = _function_ensureSymlink
export { ensureSymlink }

import { ensureSymlinkSync as _function_ensureSymlinkSync } from "jsr:@std/fs@1.0.1/ensure-symlink"
/**
 * Synchronously ensures that the link exists, and points to a valid file.
 *
 * If the parent directories for the link do not exist, they are created. If the
 * link already exists, and it is not modified, this function does nothing. If
 * the link already exists, and it does not point to the given target, an error
 * is thrown.
 *
 * Requires `--allow-read` and `--allow-write` permissions.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param target The source file path as a string or URL.
 * @param linkName The destination link path as a string or URL.
 * @return A void value that returns once the link exists.
 *
 * @example Usage
 * ```ts no-eval
 * import { ensureSymlinkSync } from "@std/fs/ensure-symlink";
 *
 * ensureSymlinkSync("./folder/targetFile.dat", "./folder/targetFile.link.dat");
 * ```
 */
const ensureSymlinkSync = _function_ensureSymlinkSync
export { ensureSymlinkSync }
