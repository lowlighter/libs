import { ensureFile as _function_ensureFile } from "jsr:@std/fs@1.0.1/ensure-file"
/**
 * Asynchronously ensures that the file exists.
 *
 * If the file already exists, this function does nothing. If the parent
 * directories for the file do not exist, they are created.
 *
 * Requires `--allow-read` and `--allow-write` permissions.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param filePath The path of the file to ensure, as a string or URL.
 *
 * @return A void promise that resolves once the file exists.
 *
 * @example Usage
 * ```ts no-eval
 * import { ensureFile } from "@std/fs/ensure-file";
 *
 * await ensureFile("./folder/targetFile.dat");
 * ```
 */
const ensureFile = _function_ensureFile
export { ensureFile }

import { ensureFileSync as _function_ensureFileSync } from "jsr:@std/fs@1.0.1/ensure-file"
/**
 * Synchronously ensures that the file exists.
 *
 * If the file already exists, this function does nothing. If the parent
 * directories for the file do not exist, they are created.
 *
 * Requires `--allow-read` and `--allow-write` permissions.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param filePath The path of the file to ensure, as a string or URL.
 *
 * @return A void value that returns once the file exists.
 *
 * @example Usage
 * ```ts no-eval
 * import { ensureFileSync } from "@std/fs/ensure-file";
 *
 * ensureFileSync("./folder/targetFile.dat");
 * ```
 */
const ensureFileSync = _function_ensureFileSync
export { ensureFileSync }
