import { ensureLink as _function_ensureLink } from "jsr:@std/fs@1.0.1/ensure-link"
/**
 * Asynchronously ensures that the hard link exists.
 *
 * If the parent directories for the hard link do not exist, they are created.
 *
 * Requires `--allow-read` and `--allow-write` permissions.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param src The source file path as a string or URL. Directory hard links are
 * not allowed.
 * @param dest The destination link path as a string or URL.
 *
 * @return A void promise that resolves once the hard link exists.
 *
 * @example Usage
 * ```ts no-eval
 * import { ensureLink } from "@std/fs/ensure-link";
 *
 * await ensureLink("./folder/targetFile.dat", "./folder/targetFile.link.dat");
 * ```
 */
const ensureLink = _function_ensureLink as typeof _function_ensureLink
export { ensureLink }

import { ensureLinkSync as _function_ensureLinkSync } from "jsr:@std/fs@1.0.1/ensure-link"
/**
 * Synchronously ensures that the hard link exists.
 *
 * If the parent directories for the hard link do not exist, they are created.
 *
 * Requires `--allow-read` and `--allow-write` permissions.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param src The source file path as a string or URL. Directory hard links are
 * not allowed.
 * @param dest The destination link path as a string or URL.
 *
 * @return A void value that returns once the hard link exists.
 *
 * @example Usage
 * ```ts no-eval
 * import { ensureLinkSync } from "@std/fs/ensure-link";
 *
 * ensureLinkSync("./folder/targetFile.dat", "./folder/targetFile.link.dat");
 * ```
 */
const ensureLinkSync = _function_ensureLinkSync as typeof _function_ensureLinkSync
export { ensureLinkSync }
