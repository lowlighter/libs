import type { ServeFileOptions as _interface_ServeFileOptions } from "jsr:@std/http@0.224.5/file-server"
/**
 * Interface for serveFile options.
 */
interface ServeFileOptions extends _interface_ServeFileOptions {}
export type { ServeFileOptions }

import { serveFile as _function_serveFile } from "jsr:@std/http@0.224.5/file-server"
/**
 * Returns an HTTP Response with the requested file as the body.
 *
 * @example Usage
 * ```ts no-eval
 * import { serveFile } from "@std/http/file-server";
 *
 * Deno.serve((req) => {
 *   return serveFile(req, "README.md");
 * });
 * ```
 *
 * @param req The server request context used to cleanup the file handle.
 * @param filePath Path of the file to serve.
 * @return A response for the request.
 */
const serveFile = _function_serveFile
export { serveFile }

import type { ServeDirOptions as _interface_ServeDirOptions } from "jsr:@std/http@0.224.5/file-server"
/**
 * Interface for serveDir options.
 */
interface ServeDirOptions extends _interface_ServeDirOptions {}
export type { ServeDirOptions }

import { serveDir as _function_serveDir } from "jsr:@std/http@0.224.5/file-server"
/**
 * Serves the files under the given directory root (opts.fsRoot).
 *
 * @example Usage
 * ```ts no-eval
 * import { serveDir } from "@std/http/file-server";
 *
 * Deno.serve((req) => {
 *   const pathname = new URL(req.url).pathname;
 *   if (pathname.startsWith("/static")) {
 *     return serveDir(req, {
 *       fsRoot: "path/to/static/files/dir",
 *     });
 *   }
 *   // Do dynamic responses
 *   return new Response();
 * });
 * ```
 *
 * @example Optionally you can pass `urlRoot` option. If it's specified that part is stripped from the beginning of the requested pathname.
 *
 * ```ts no-eval
 * import { serveDir } from "@std/http/file-server";
 *
 * // ...
 * serveDir(new Request("http://localhost/static/path/to/file"), {
 *   fsRoot: "public",
 *   urlRoot: "static",
 * });
 * ```
 *
 * The above example serves `./public/path/to/file` for the request to `/static/path/to/file`.
 *
 * @param req The request to handle
 * @param opts Additional options.
 * @return A response for the request.
 */
const serveDir = _function_serveDir
export { serveDir }
