import type { ConnInfo as _interface_ConnInfo } from "jsr:@std/http@0.224.5/server"
/**
 * Information about the connection a request arrived on.
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode Deno.ServeHandlerInfo} instead.
 */
interface ConnInfo extends _interface_ConnInfo {}
export type { ConnInfo }

import type { Handler as _typeAlias_Handler } from "jsr:@std/http@0.224.5/server"
/**
 * A handler for HTTP requests. Consumes a request and connection information
 * and returns a response.
 *
 * If a handler throws, the server calling the handler will assume the impact
 * of the error is isolated to the individual request. It will catch the error
 * and close the underlying connection.
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode Deno.ServeHandler} instead.
 */
type Handler = _typeAlias_Handler
export type { Handler }

import type { ServerInit as _interface_ServerInit } from "jsr:@std/http@0.224.5/server"
/**
 * Options for running an HTTP server.
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode Deno.ServeInit} instead.
 */
interface ServerInit extends _interface_ServerInit {}
export type { ServerInit }

import { Server as _class_Server } from "jsr:@std/http@0.224.5/server"
/**
 * Used to construct an HTTP server.
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode Deno.serve} instead.
 *
 * @example Usage
 * ```ts no-eval
 * import { Server } from "@std/http/server";
 *
 * const port = 4505;
 * const handler = (request: Request) => {
 *   const body = `Your user-agent is:\n\n${request.headers.get(
 *    "user-agent",
 *   ) ?? "Unknown"}`;
 *
 *   return new Response(body, { status: 200 });
 * };
 *
 * const server = new Server({ port, handler });
 * ```
 */
class Server extends _class_Server {}
export { Server }

import type { ServeInit as _interface_ServeInit } from "jsr:@std/http@0.224.5/server"
/**
 * Additional serve options.
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode Deno.ServeInit} instead.
 */
interface ServeInit extends _interface_ServeInit {}
export type { ServeInit }

import type { ServeListenerOptions as _interface_ServeListenerOptions } from "jsr:@std/http@0.224.5/server"
/**
 * Additional serve listener options.
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode Deno.ServeOptions} instead.
 */
interface ServeListenerOptions extends _interface_ServeListenerOptions {}
export type { ServeListenerOptions }

import { serveListener as _function_serveListener } from "jsr:@std/http@0.224.5/server"
/**
 * Constructs a server, accepts incoming connections on the given listener, and
 * handles requests on these connections with the given handler.
 *
 * @example Usage
 * ```ts no-eval
 * import { serveListener } from "@std/http/server";
 *
 * const listener = Deno.listen({ port: 4505 });
 *
 * console.log("server listening on http://localhost:4505");
 *
 * await serveListener(listener, (request) => {
 *   const body = `Your user-agent is:\n\n${request.headers.get(
 *     "user-agent",
 *   ) ?? "Unknown"}`;
 *
 *   return new Response(body, { status: 200 });
 * });
 * ```
 *
 * @param listener The listener to accept connections from.
 * @param handler The handler for individual HTTP requests.
 * @param options Optional serve options.
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode Deno.serve} instead.
 */
const serveListener = _function_serveListener
export { serveListener }

import { serve as _function_serve } from "jsr:@std/http@0.224.5/server"
/**
 * Serves HTTP requests with the given handler.
 *
 * You can specify an object with a port and hostname option, which is the
 * address to listen on. The default is port 8000 on hostname "0.0.0.0".
 *
 * @example The below example serves with the port 8000.
 * ```ts no-eval
 * import { serve } from "@std/http/server";
 * serve((_req) => new Response("Hello, world"));
 * ```
 *
 * @example You can change the listening address by the `hostname` and `port` options.
 * The below example serves with the port 3000.
 *
 * ```ts no-eval
 * import { serve } from "@std/http/server";
 * serve((_req) => new Response("Hello, world"), { port: 3000 });
 * ```
 *
 * @example `serve` function prints the message `Listening on http://<hostname>:<port>/`
 * on start-up by default. If you like to change this message, you can specify
 * `onListen` option to override it.
 *
 * ```ts no-eval
 * import { serve } from "@std/http/server";
 * serve((_req) => new Response("Hello, world"), {
 *   onListen({ port, hostname }) {
 *     console.log(`Server started at http://${hostname}:${port}`);
 *     // ... more info specific to your server ..
 *   },
 * });
 * ```
 *
 * @example You can also specify `undefined` or `null` to stop the logging behavior.
 *
 * ```ts no-eval
 * import { serve } from "@std/http/server";
 * serve((_req) => new Response("Hello, world"), { onListen: undefined });
 * ```
 *
 * @param handler The handler for individual HTTP requests.
 * @param options The options. See `ServeInit` documentation for details.
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode Deno.serve} instead.
 */
const serve = _function_serve
export { serve }

import type { ServeTlsInit as _interface_ServeTlsInit } from "jsr:@std/http@0.224.5/server"
/**
 * Initialization parameters for {@linkcode serveTls}.
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode Deno.ServeTlsOptions} instead.
 */
interface ServeTlsInit extends _interface_ServeTlsInit {}
export type { ServeTlsInit }

import { serveTls as _function_serveTls } from "jsr:@std/http@0.224.5/server"
/**
 * Serves HTTPS requests with the given handler.
 *
 * You must specify `key` or `keyFile` and `cert` or `certFile` options.
 *
 * You can specify an object with a port and hostname option, which is the
 * address to listen on. The default is port 8443 on hostname "0.0.0.0".
 *
 * @example The below example serves with the default port 8443.
 *
 * ```ts no-eval
 * import { serveTls } from "@std/http/server";
 *
 * const cert = "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n";
 * const key = "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n";
 * serveTls((_req) => new Response("Hello, world"), { cert, key });
 *
 * // Or
 *
 * const certFile = "/path/to/certFile.crt";
 * const keyFile = "/path/to/keyFile.key";
 * serveTls((_req) => new Response("Hello, world"), { certFile, keyFile });
 * ```
 *
 * @example `serveTls` function prints the message `Listening on https://<hostname>:<port>/`
 * on start-up by default. If you like to change this message, you can specify
 * `onListen` option to override it.
 *
 * ```ts no-eval
 * import { serveTls } from "@std/http/server";
 * const certFile = "/path/to/certFile.crt";
 * const keyFile = "/path/to/keyFile.key";
 * serveTls((_req) => new Response("Hello, world"), {
 *   certFile,
 *   keyFile,
 *   onListen({ port, hostname }) {
 *     console.log(`Server started at https://${hostname}:${port}`);
 *     // ... more info specific to your server ..
 *   },
 * });
 * ```
 *
 * @example You can also specify `undefined` or `null` to stop the logging behavior.
 *
 * ```ts no-eval
 * import { serveTls } from "@std/http/server";
 * const certFile = "/path/to/certFile.crt";
 * const keyFile = "/path/to/keyFile.key";
 * serveTls((_req) => new Response("Hello, world"), {
 *   certFile,
 *   keyFile,
 *   onListen: undefined,
 * });
 * ```
 *
 * @param handler The handler for individual HTTPS requests.
 * @param options The options. See `ServeTlsInit` documentation for details.
 * @return
 * @deprecated This will be removed in 1.0.0. Use {@linkcode Deno.serve} instead.
 */
const serveTls = _function_serveTls
export { serveTls }
