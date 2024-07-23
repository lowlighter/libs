import { SubdirectoryMoveError as _class_SubdirectoryMoveError } from "jsr:@std/fs@0.229.3/move"
/**
 * Error thrown in {@linkcode move} or {@linkcode moveSync} when the destination
 * is a subdirectory of the source.
 *
 * @example Usage
 * ```ts no-eval
 * import { move, SubdirectoryMoveError } from "@std/fs/move";
 *
 * try {
 *   await move("./foo", "./foo/bar");
 * } catch (error) {
 *   if (error instanceof SubdirectoryMoveError) {
 *     console.error(error.message);
 *   }
 * }
 * ```
 */
class SubdirectoryMoveError extends _class_SubdirectoryMoveError {}
export { SubdirectoryMoveError }

import type { MoveOptions as _interface_MoveOptions } from "jsr:@std/fs@0.229.3/move"
/**
 * Options for {@linkcode move} and {@linkcode moveSync}.
 */
interface MoveOptions extends _interface_MoveOptions {}
export type { MoveOptions }

import { move as _function_move } from "jsr:@std/fs@0.229.3/move"
/**
 * Asynchronously moves a file or directory (along with its contents).
 *
 * If `src` is a sub-directory of `dest`, a {@linkcode SubdirectoryMoveError}
 * will be thrown.
 *
 * Requires `--allow-read` and `--allow-write` permissions.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param src The source file or directory as a string or URL.
 * @param dest The destination file or directory as a string or URL.
 * @param options Options for the move operation.
 *
 * @return A void promise that resolves once the operation completes.
 *
 * @example Basic usage
 * ```ts no-eval
 * import { move } from "@std/fs/move";
 *
 * await move("./foo", "./bar");
 * ```
 *
 * This will move the file or directory at `./foo` to `./bar` without
 * overwriting.
 *
 * @example Overwriting
 * ```ts no-eval
 * import { move } from "@std/fs/move";
 *
 * await move("./foo", "./bar", { overwrite: true });
 * ```
 *
 * This will move the file or directory at `./foo` to `./bar`, overwriting
 * `./bar` if it already exists.
 */
const move = _function_move
export { move }

import { moveSync as _function_moveSync } from "jsr:@std/fs@0.229.3/move"
/**
 * Synchronously moves a file or directory (along with its contents).
 *
 * If `src` is a sub-directory of `dest`, a {@linkcode SubdirectoryMoveError}
 * will be thrown.
 *
 * Requires `--allow-read` and `--allow-write` permissions.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param src The source file or directory as a string or URL.
 * @param dest The destination file or directory as a string or URL.
 * @param options Options for the move operation.
 *
 * @return A void value that returns once the operation completes.
 *
 * @example Basic usage
 * ```ts no-eval
 * import { moveSync } from "@std/fs/move";
 *
 * moveSync("./foo", "./bar");
 * ```
 *
 * This will move the file or directory at `./foo` to `./bar` without
 * overwriting.
 *
 * @example Overwriting
 * ```ts no-eval
 * import { moveSync } from "@std/fs/move";
 *
 * moveSync("./foo", "./bar", { overwrite: true });
 * ```
 *
 * This will move the file or directory at `./foo` to `./bar`, overwriting
 * `./bar` if it already exists.
 */
const moveSync = _function_moveSync
export { moveSync }
