import type { ServeFileOptions as _interface_ServeFileOptions } from "jsr:@std/http@1.0.3/file-server"
/**
 * Options for {@linkcode serveFile}.
 */
interface ServeFileOptions extends _interface_ServeFileOptions {}
export type { ServeFileOptions }

import { serveFile as _function_serveFile } from "jsr:@std/http@1.0.3/file-server"
/**
 * Resolves a {@linkcode Response} with the requested file as the body.
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
 * @param options Additional options.
 * @return A response for the request.
 */
const serveFile = _function_serveFile as typeof _function_serveFile
export { serveFile }

import type { ServeDirOptions as _interface_ServeDirOptions } from "jsr:@std/http@1.0.3/file-server"
/**
 * Interface for serveDir options.
 */
interface ServeDirOptions extends _interface_ServeDirOptions {}
export type { ServeDirOptions }

import { serveDir as _function_serveDir } from "jsr:@std/http@1.0.3/file-server"
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
 * @example Changing the URL root
 *
 * Requests to `/static/path/to/file` will be served from `./public/path/to/file`.
 *
 * ```ts no-eval
 * import { serveDir } from "@std/http/file-server";
 *
 * Deno.serve((req) => serveDir(req, {
 *   fsRoot: "public",
 *   urlRoot: "static",
 * }));
 * ```
 *
 * @param req The request to handle
 * @param opts Additional options.
 * @return A response for the request.
 */
const serveDir = _function_serveDir as typeof _function_serveDir
export { serveDir }
