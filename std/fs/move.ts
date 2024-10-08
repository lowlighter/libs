import type { MoveOptions as _interface_MoveOptions } from "jsr:@std/fs@1.0.4/move"
/**
 * Options for {@linkcode move} and {@linkcode moveSync}.
 */
interface MoveOptions extends _interface_MoveOptions {}
export type { MoveOptions }

import { move as _function_move } from "jsr:@std/fs@1.0.4/move"
/**
 * Asynchronously moves a file or directory (along with its contents).
 *
 * Requires `--allow-read` and `--allow-write` permissions.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param src The source file or directory as a string or URL.
 * @param dest The destination file or directory as a string or URL.
 * @param options Options for the move operation.
 * @throws If `dest` already exists and
 * `options.overwrite` is `false`.
 * @throws If `src` is a sub-directory of `dest`.
 *
 * @return A void promise that resolves once the operation completes.
 *
 * @example Basic usage
 * ```ts ignore
 * import { move } from "@std/fs/move";
 *
 * await move("./foo", "./bar");
 * ```
 *
 * This will move the file or directory at `./foo` to `./bar` without
 * overwriting.
 *
 * @example Overwriting
 * ```ts ignore
 * import { move } from "@std/fs/move";
 *
 * await move("./foo", "./bar", { overwrite: true });
 * ```
 *
 * This will move the file or directory at `./foo` to `./bar`, overwriting
 * `./bar` if it already exists.
 */
const move = _function_move as typeof _function_move
export { move }

import { moveSync as _function_moveSync } from "jsr:@std/fs@1.0.4/move"
/**
 * Synchronously moves a file or directory (along with its contents).
 *
 * Requires `--allow-read` and `--allow-write` permissions.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param src The source file or directory as a string or URL.
 * @param dest The destination file or directory as a string or URL.
 * @param options Options for the move operation.
 * @throws If `dest` already exists and
 * `options.overwrite` is `false`.
 * @throws If `src` is a sub-directory of `dest`.
 *
 * @return A void value that returns once the operation completes.
 *
 * @example Basic usage
 * ```ts ignore
 * import { moveSync } from "@std/fs/move";
 *
 * moveSync("./foo", "./bar");
 * ```
 *
 * This will move the file or directory at `./foo` to `./bar` without
 * overwriting.
 *
 * @example Overwriting
 * ```ts ignore
 * import { moveSync } from "@std/fs/move";
 *
 * moveSync("./foo", "./bar", { overwrite: true });
 * ```
 *
 * This will move the file or directory at `./foo` to `./bar`, overwriting
 * `./bar` if it already exists.
 */
const moveSync = _function_moveSync as typeof _function_moveSync
export { moveSync }
