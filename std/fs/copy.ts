import type { CopyOptions as _interface_CopyOptions } from "jsr:@std/fs@1.0.1/copy"
/**
 * Options for {@linkcode copy} and {@linkcode copySync}.
 */
interface CopyOptions extends _interface_CopyOptions {}
export type { CopyOptions }

import { copy as _function_copy } from "jsr:@std/fs@1.0.1/copy"
/**
 * Asynchronously copy a file or directory (along with its contents), like
 * {@linkcode https://www.ibm.com/docs/en/aix/7.3?topic=c-cp-command#cp__cp_flagr | cp -r}.
 *
 * Both `src` and `dest` must both be a file or directory.
 *
 * Requires `--allow-read` and `--allow-write` permissions.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param src The source file/directory path as a string or URL.
 * @param dest The destination file/directory path as a string or URL.
 * @param options Options for copying.
 *
 * @return A promise that resolves once the copy operation completes.
 *
 * @example Basic usage
 * ```ts no-eval
 * import { copy } from "@std/fs/copy";
 *
 * await copy("./foo", "./bar");
 * ```
 *
 * This will copy the file or directory at `./foo` to `./bar` without
 * overwriting.
 *
 * @example Overwriting files/directories
 * ```ts no-eval
 * import { copy } from "@std/fs/copy";
 *
 * await copy("./foo", "./bar", { overwrite: true });
 * ```
 *
 * This will copy the file or directory at `./foo` to `./bar` and overwrite
 * any existing files or directories.
 *
 * @example Preserving timestamps
 * ```ts no-eval
 * import { copy } from "@std/fs/copy";
 *
 * await copy("./foo", "./bar", { preserveTimestamps: true });
 * ```
 *
 * This will copy the file or directory at `./foo` to `./bar` and set the
 * last modification and access times to the ones of the original source files.
 */
const copy = _function_copy as typeof _function_copy
export { copy }

import { copySync as _function_copySync } from "jsr:@std/fs@1.0.1/copy"
/**
 * Synchronously copy a file or directory (along with its contents), like
 * {@linkcode https://www.ibm.com/docs/en/aix/7.3?topic=c-cp-command#cp__cp_flagr | cp -r}.
 *
 * Both `src` and `dest` must both be a file or directory.
 *
 * Requires `--allow-read` and `--allow-write` permissions.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param src The source file/directory path as a string or URL.
 * @param dest The destination file/directory path as a string or URL.
 * @param options Options for copying.
 *
 * @return A void value that returns once the copy operation completes.
 *
 * @example Basic usage
 * ```ts no-eval
 * import { copySync } from "@std/fs/copy";
 *
 * copySync("./foo", "./bar");
 * ```
 *
 * This will copy the file or directory at `./foo` to `./bar` without
 * overwriting.
 *
 * @example Overwriting files/directories
 * ```ts no-eval
 * import { copySync } from "@std/fs/copy";
 *
 * copySync("./foo", "./bar", { overwrite: true });
 * ```
 *
 * This will copy the file or directory at `./foo` to `./bar` and overwrite
 * any existing files or directories.
 *
 * @example Preserving timestamps
 * ```ts no-eval
 * import { copySync } from "@std/fs/copy";
 *
 * copySync("./foo", "./bar", { preserveTimestamps: true });
 * ```
 *
 * This will copy the file or directory at `./foo` to `./bar` and set the
 * last modification and access times to the ones of the original source files.
 */
const copySync = _function_copySync as typeof _function_copySync
export { copySync }
