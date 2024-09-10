import { emptyDir as _function_emptyDir } from "jsr:@std/fs@1.0.3/empty-dir"
/**
 * Asynchronously ensures that a directory is empty.
 *
 * If the directory does not exist, it is created. The directory itself is not
 * deleted.
 *
 * Requires `--allow-read` and `--allow-write` permissions.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param dir The path of the directory to empty, as a string or URL.
 *
 * @return A void promise that resolves once the directory is empty.
 *
 * @example Usage
 * ```ts no-eval
 * import { emptyDir } from "@std/fs/empty-dir";
 *
 * await emptyDir("./foo");
 * ```
 */
const emptyDir = _function_emptyDir as typeof _function_emptyDir
export { emptyDir }

import { emptyDirSync as _function_emptyDirSync } from "jsr:@std/fs@1.0.3/empty-dir"
/**
 * Synchronously ensures that a directory is empty deletes the directory
 * contents it is not empty.
 *
 * If the directory does not exist, it is created. The directory itself is not
 * deleted.
 *
 * Requires `--allow-read` and `--allow-write` permissions.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param dir The path of the directory to empty, as a string or URL.
 *
 * @return A void value that returns once the directory is empty.
 *
 * @example Usage
 * ```ts no-eval
 * import { emptyDirSync } from "@std/fs/empty-dir";
 *
 * emptyDirSync("./foo");
 * ```
 */
const emptyDirSync = _function_emptyDirSync as typeof _function_emptyDirSync
export { emptyDirSync }
