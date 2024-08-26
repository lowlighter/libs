/**
 * Provides user-friendly {@linkcode serve} on top of Deno's native HTTP server
 * and other utilities for creating HTTP servers and clients.
 *
 * ## File Server
 *
 * A small program for serving local files over HTTP.
 *
 * ```sh
 * deno run --allow-net --allow-read jsr:@std/http/file-server
 * Listening on:
 * - Local: http://localhost:8000
 * ```
 *
 * When the `--allow-sys=networkInterfaces` permission is provided, the file
 * server will also display the local area network addresses that can be used to
 * access the server.
 *
 * ## HTTP Status Code and Status Text
 *
 * Helper for processing status code and status text.
 *
 * ## HTTP errors
 *
 * Provides error classes for each HTTP error status code as well as utility
 * functions for handling HTTP errors in a structured way.
 *
 * ## Methods
 *
 * Provides helper functions and types to work with HTTP method strings safely.
 *
 * ## Negotiation
 *
 * A set of functions which can be used to negotiate content types, encodings and
 * languages when responding to requests.
 *
 * > Note: some libraries include accept charset functionality by analyzing the
 * > `Accept-Charset` header. This is a legacy header that
 * > {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Charset | clients omit and servers should ignore}
 * > therefore is not provided.
 *
 * ## User agent handling
 *
 * The {@linkcode UserAgent} class provides user agent string parsing, allowing
 * a user agent flag to be semantically understood.
 *
 * For example to integrate the user agent provided in the header `User-Agent`
 * in an http request would look like this:
 *
 * ```ts no-eval
 * import { UserAgent } from "@std/http/user-agent";
 *
 * Deno.serve((req) => {
 *   const userAgent = new UserAgent(req.headers.get("user-agent") ?? "");
 *   return new Response(`Hello, ${userAgent.browser.name}
 *     on ${userAgent.os.name} ${userAgent.os.version}!`);
 * });
 * ```
 *
 * ### Routing
 *
 * {@linkcode route} provides an easy way to route requests to different
 * handlers based on the request path and method.
 *
 * ```ts no-eval
 * import { route, type Route } from "@std/http/route";
 * import { serveDir } from "@std/http/file-server";
 *
 * const routes: Route[] = [
 *   {
 *     pattern: new URLPattern({ pathname: "/about" }),
 *     handler: () => new Response("About page"),
 *   },
 *   {
 *     pattern: new URLPattern({ pathname: "/users/:id" }),
 *     handler: (_req, _info, params) => new Response(params?.pathname.groups.id),
 *   },
 *   {
 *     pattern: new URLPattern({ pathname: "/static/*" }),
 *     handler: (req: Request) => serveDir(req)
 *   }
 * ];
 *
 * function defaultHandler(_req: Request) {
 *   return new Response("Not found", { status: 404 });
 * }
 *
 * Deno.serve(route(routes, defaultHandler));
 * ```
 *
 * @module
 */
import type { Cookie as _interface_Cookie } from "jsr:@std/http@1.0.3"
/**
 * Represents an HTTP Cookie.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc6265.html#section-4.2.1}
 */
interface Cookie extends _interface_Cookie {}
export type { Cookie }

import { getCookies as _function_getCookies } from "jsr:@std/http@1.0.3"
/**
 * Parse cookies of a header
 *
 * @example Usage
 * ```ts
 * import { getCookies } from "@std/http/cookie";
 * import { assertEquals } from "@std/assert";
 *
 * const headers = new Headers();
 * headers.set("Cookie", "full=of; tasty=chocolate");
 *
 * const cookies = getCookies(headers);
 * assertEquals(cookies, { full: "of", tasty: "chocolate" });
 * ```
 *
 * @param headers The headers instance to get cookies from
 * @return Object with cookie names as keys
 */
const getCookies = _function_getCookies as typeof _function_getCookies
export { getCookies }

import { setCookie as _function_setCookie } from "jsr:@std/http@1.0.3"
/**
 * Set the cookie header properly in the headers
 *
 * @example Usage
 * ```ts
 * import { Cookie, setCookie } from "@std/http/cookie";
 * import { assertEquals } from "@std/assert";
 *
 * const headers = new Headers();
 * const cookie: Cookie = { name: "Space", value: "Cat" };
 * setCookie(headers, cookie);
 *
 * const cookieHeader = headers.get("set-cookie");
 *
 * assertEquals(cookieHeader, "Space=Cat");
 * ```
 *
 * @param headers The headers instance to set the cookie to
 * @param cookie Cookie to set
 */
const setCookie = _function_setCookie as typeof _function_setCookie
export { setCookie }

import { deleteCookie as _function_deleteCookie } from "jsr:@std/http@1.0.3"
/**
 * Set the cookie header with empty value in the headers to delete it.
 *
 * The attributes (`path`, `domain`, `secure`, `httpOnly`, `partitioned`) need
 * to match the values when the cookie was set.
 *
 * > Note: Deleting a `Cookie` will set its expiration date before now. Forcing
 * > the browser to delete it.
 *
 * @example Usage
 * ```ts
 * import { deleteCookie } from "@std/http/cookie";
 * import { assertEquals } from "@std/assert";
 *
 * const headers = new Headers();
 * deleteCookie(headers, "deno");
 *
 * const cookieHeader = headers.get("set-cookie");
 *
 * assertEquals(cookieHeader, "deno=; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
 * ```
 *
 * @param headers The headers instance to delete the cookie from
 * @param name Name of cookie
 * @param attributes Additional cookie attributes
 */
const deleteCookie = _function_deleteCookie as typeof _function_deleteCookie
export { deleteCookie }

import { getSetCookies as _function_getSetCookies } from "jsr:@std/http@1.0.3"
/**
 * Parse set-cookies of a header
 *
 * @example Usage
 * ```ts
 * import { getSetCookies } from "@std/http/cookie";
 * import { assertEquals } from "@std/assert";
 *
 * const headers = new Headers([
 *   ["Set-Cookie", "lulu=meow; Secure; Max-Age=3600"],
 *   ["Set-Cookie", "booya=kasha; HttpOnly; Path=/"],
 * ]);
 *
 * const cookies = getSetCookies(headers);
 *
 * assertEquals(cookies[0], {
 *   name: "lulu",
 *   value: "meow",
 *   secure: true,
 *   maxAge: 3600
 * });
 * ```
 *
 * @param headers The headers instance to get set-cookies from
 * @return List of cookies
 */
const getSetCookies = _function_getSetCookies as typeof _function_getSetCookies
export { getSetCookies }

import type { FileInfo as _interface_FileInfo } from "jsr:@std/http@1.0.3"
/**
 * Just the part of {@linkcode Deno.FileInfo} that is required to calculate an `ETag`,
 * so partial or user generated file information can be passed.
 */
interface FileInfo extends _interface_FileInfo {}
export type { FileInfo }

import type { ETagOptions as _interface_ETagOptions } from "jsr:@std/http@1.0.3"
/**
 * Options for {@linkcode eTag}.
 */
interface ETagOptions extends _interface_ETagOptions {}
export type { ETagOptions }

import { eTag as _function_eTag } from "jsr:@std/http@1.0.3"
/** UNDOCUMENTED */
const eTag = _function_eTag as typeof _function_eTag
export { eTag }

import { ifMatch as _function_ifMatch } from "jsr:@std/http@1.0.3"
/**
 * A helper function that takes the value from the `If-Match` header and a
 * calculated etag for the target. By using strong comparison, return `true` if
 * the values match, otherwise `false`.
 *
 * See MDN's [`If-Match`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match)
 * article for more information on how to use this function.
 *
 * @example Usage
 * ```ts no-eval
 * import {
 *   eTag,
 *   ifMatch,
 * } from "@std/http/etag";
 * import { assert } from "@std/assert";
 *
 * const body = "hello deno!";
 *
 * Deno.serve(async (req) => {
 *   const ifMatchValue = req.headers.get("if-match");
 *   const etag = await eTag(body);
 *   assert(etag);
 *   if (!ifMatchValue || ifMatch(ifMatchValue, etag)) {
 *     return new Response(body, { status: 200, headers: { etag } });
 *   } else {
 *     return new Response(null, { status: 412, statusText: "Precondition Failed"});
 *   }
 * });
 * ```
 *
 * @param value the If-Match header value.
 * @param etag the ETag to check against.
 * @return whether or not the parameters match.
 */
const ifMatch = _function_ifMatch as typeof _function_ifMatch
export { ifMatch }

import { ifNoneMatch as _function_ifNoneMatch } from "jsr:@std/http@1.0.3"
/**
 * A helper function that takes the value from the `If-None-Match` header and
 * a calculated etag for the target entity and returns `false` if the etag for
 * the entity matches the supplied value, otherwise `true`.
 *
 * See MDN's [`If-None-Match`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match)
 * article for more information on how to use this function.
 *
 * @example Usage
 * ```ts no-eval
 * import {
 *   eTag,
 *   ifNoneMatch,
 * } from "@std/http/etag";
 * import { assert } from "@std/assert";
 *
 * const body = "hello deno!";
 *
 * Deno.serve(async (req) => {
 *   const ifNoneMatchValue = req.headers.get("if-none-match");
 *   const etag = await eTag(body);
 *   assert(etag);
 *   if (!ifNoneMatch(ifNoneMatchValue, etag)) {
 *     return new Response(null, { status: 304, headers: { etag } });
 *   } else {
 *     return new Response(body, { status: 200, headers: { etag } });
 *   }
 * });
 * ```
 *
 * @param value the If-None-Match header value.
 * @param etag the ETag to check against.
 * @return whether or not the parameters do not match.
 */
const ifNoneMatch = _function_ifNoneMatch as typeof _function_ifNoneMatch
export { ifNoneMatch }

import { STATUS_CODE as _variable_STATUS_CODE } from "jsr:@std/http@1.0.3"
/**
 * Contains the {@linkcode STATUS_CODE} object which contains standard HTTP
 * status codes and provides several type guards for handling status codes
 * with type safety.
 *
 * @example The status code and status text
 * ```ts
 * import {
 *   STATUS_CODE,
 *   STATUS_TEXT,
 * } from "@std/http/status";
 *
 * console.log(STATUS_CODE.NotFound); // Returns 404
 * console.log(STATUS_TEXT[STATUS_CODE.NotFound]); // Returns "Not Found"
 * ```
 *
 * @example Checking the status code type
 * ```ts
 * import { isErrorStatus } from "@std/http/status";
 *
 * const res = await fetch("https://example.com/");
 *
 * if (isErrorStatus(res.status)) {
 *   // error handling here...
 * }
 * ```
 *
 * @module
 */
const STATUS_CODE = _variable_STATUS_CODE as typeof _variable_STATUS_CODE
export { STATUS_CODE }

import type { StatusCode as _typeAlias_StatusCode } from "jsr:@std/http@1.0.3"
/**
 * An HTTP status code.
 */
type StatusCode = _typeAlias_StatusCode
export type { StatusCode }

import { STATUS_TEXT as _variable_STATUS_TEXT } from "jsr:@std/http@1.0.3"
/**
 * A record of all the status codes text.
 */
const STATUS_TEXT = _variable_STATUS_TEXT as typeof _variable_STATUS_TEXT
export { STATUS_TEXT }

import type { StatusText as _typeAlias_StatusText } from "jsr:@std/http@1.0.3"
/**
 * An HTTP status text.
 */
type StatusText = _typeAlias_StatusText
export type { StatusText }

import type { InformationalStatus as _typeAlias_InformationalStatus } from "jsr:@std/http@1.0.3"
/**
 * An HTTP status that is a informational (1XX).
 */
type InformationalStatus = _typeAlias_InformationalStatus
export type { InformationalStatus }

import type { SuccessfulStatus as _typeAlias_SuccessfulStatus } from "jsr:@std/http@1.0.3"
/**
 * An HTTP status that is a success (2XX).
 */
type SuccessfulStatus = _typeAlias_SuccessfulStatus
export type { SuccessfulStatus }

import type { RedirectStatus as _typeAlias_RedirectStatus } from "jsr:@std/http@1.0.3"
/**
 * An HTTP status that is a redirect (3XX).
 */
type RedirectStatus = _typeAlias_RedirectStatus
export type { RedirectStatus }

import type { ClientErrorStatus as _typeAlias_ClientErrorStatus } from "jsr:@std/http@1.0.3"
/**
 * An HTTP status that is a client error (4XX).
 */
type ClientErrorStatus = _typeAlias_ClientErrorStatus
export type { ClientErrorStatus }

import type { ServerErrorStatus as _typeAlias_ServerErrorStatus } from "jsr:@std/http@1.0.3"
/**
 * An HTTP status that is a server error (5XX).
 */
type ServerErrorStatus = _typeAlias_ServerErrorStatus
export type { ServerErrorStatus }

import type { ErrorStatus as _typeAlias_ErrorStatus } from "jsr:@std/http@1.0.3"
/**
 * An HTTP status that is an error (4XX and 5XX).
 */
type ErrorStatus = _typeAlias_ErrorStatus
export type { ErrorStatus }

import { isStatus as _function_isStatus } from "jsr:@std/http@1.0.3"
/**
 * Returns whether the provided number is a valid HTTP status code.
 *
 * @example Usage
 * ```ts
 * import { isStatus } from "@std/http/status";
 * import { assert } from "@std/assert";
 *
 * assert(isStatus(404));
 * ```
 *
 * @param status The status to assert against.
 * @return Whether or not the provided status is a valid status code.
 */
const isStatus = _function_isStatus as typeof _function_isStatus
export { isStatus }

import { isInformationalStatus as _function_isInformationalStatus } from "jsr:@std/http@1.0.3"
/**
 * A type guard that determines if the status code is informational.
 *
 * @example Usage
 * ```ts
 * import { isInformationalStatus } from "@std/http/status";
 * import { assert } from "@std/assert";
 *
 * assert(isInformationalStatus(100));
 * ```
 *
 * @param status The status to assert against.
 * @return Whether or not the provided status is an informational status code.
 */
const isInformationalStatus = _function_isInformationalStatus as typeof _function_isInformationalStatus
export { isInformationalStatus }

import { isSuccessfulStatus as _function_isSuccessfulStatus } from "jsr:@std/http@1.0.3"
/**
 * A type guard that determines if the status code is successful.
 *
 * @example Usage
 * ```ts
 * import { isSuccessfulStatus } from "@std/http/status";
 * import { assert } from "@std/assert";
 *
 * assert(isSuccessfulStatus(200));
 * ```
 *
 * @param status The status to assert against.
 * @return Whether or not the provided status is a successful status code.
 */
const isSuccessfulStatus = _function_isSuccessfulStatus as typeof _function_isSuccessfulStatus
export { isSuccessfulStatus }

import { isRedirectStatus as _function_isRedirectStatus } from "jsr:@std/http@1.0.3"
/**
 * A type guard that determines if the status code is a redirection.
 *
 * @example Usage
 * ```ts
 * import { isRedirectStatus } from "@std/http/status";
 * import { assert } from "@std/assert";
 *
 * assert(isRedirectStatus(302));
 * ```
 *
 * @param status The status to assert against.
 * @return Whether or not the provided status is a redirect status code.
 */
const isRedirectStatus = _function_isRedirectStatus as typeof _function_isRedirectStatus
export { isRedirectStatus }

import { isClientErrorStatus as _function_isClientErrorStatus } from "jsr:@std/http@1.0.3"
/**
 * A type guard that determines if the status code is a client error.
 *
 * @example Usage
 * ```ts
 * import { isClientErrorStatus } from "@std/http/status";
 * import { assert } from "@std/assert";
 *
 * assert(isClientErrorStatus(404));
 * ```
 *
 * @param status The status to assert against.
 * @return Whether or not the provided status is a client error status code.
 */
const isClientErrorStatus = _function_isClientErrorStatus as typeof _function_isClientErrorStatus
export { isClientErrorStatus }

import { isServerErrorStatus as _function_isServerErrorStatus } from "jsr:@std/http@1.0.3"
/**
 * A type guard that determines if the status code is a server error.
 *
 * @example Usage
 * ```ts
 * import { isServerErrorStatus } from "@std/http/status";
 * import { assert } from "@std/assert";
 *
 * assert(isServerErrorStatus(502));
 * ```
 *
 * @param status The status to assert against.
 * @return Whether or not the provided status is a server error status code.
 */
const isServerErrorStatus = _function_isServerErrorStatus as typeof _function_isServerErrorStatus
export { isServerErrorStatus }

import { isErrorStatus as _function_isErrorStatus } from "jsr:@std/http@1.0.3"
/**
 * A type guard that determines if the status code is an error.
 *
 * @example Usage
 * ```ts
 * import { isErrorStatus } from "@std/http/status";
 * import { assert } from "@std/assert";
 *
 * assert(isErrorStatus(502));
 * ```
 *
 * @param status The status to assert against.
 * @return Whether or not the provided status is an error status code.
 */
const isErrorStatus = _function_isErrorStatus as typeof _function_isErrorStatus
export { isErrorStatus }

import { accepts as _function_accepts } from "jsr:@std/http@1.0.3"
/** UNDOCUMENTED */
const accepts = _function_accepts as typeof _function_accepts
export { accepts }

import { acceptsEncodings as _function_acceptsEncodings } from "jsr:@std/http@1.0.3"
/** UNDOCUMENTED */
const acceptsEncodings = _function_acceptsEncodings as typeof _function_acceptsEncodings
export { acceptsEncodings }

import { acceptsLanguages as _function_acceptsLanguages } from "jsr:@std/http@1.0.3"
/** UNDOCUMENTED */
const acceptsLanguages = _function_acceptsLanguages as typeof _function_acceptsLanguages
export { acceptsLanguages }

import { signCookie as _function_signCookie } from "jsr:@std/http@1.0.3"
/**
 * Returns a promise with the signed cookie value from the given cryptographic
 * key.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @example Usage
 * ```ts no-eval no-assert
 * import { signCookie } from "@std/http/signed-cookie";
 * import { setCookie } from "@std/http/cookie";
 *
 * const key = await crypto.subtle.generateKey(
 *   { name: "HMAC", hash: "SHA-256" },
 *   true,
 *   ["sign", "verify"],
 * );
 * const value = await signCookie("my-cookie-value", key);
 *
 * const headers = new Headers();
 * setCookie(headers, {
 *   name: "my-cookie-name",
 *   value,
 * });
 *
 * const cookieHeader = headers.get("set-cookie");
 * ```
 *
 * @param value The cookie value to sign.
 * @param key The cryptographic key to sign the cookie with.
 * @return The signed cookie.
 */
const signCookie = _function_signCookie as typeof _function_signCookie
export { signCookie }

import { verifySignedCookie as _function_verifySignedCookie } from "jsr:@std/http@1.0.3"
/**
 * Returns a promise of a boolean indicating whether the signed cookie is valid.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @example Usage
 * ```ts no-eval no-assert
 * import { verifySignedCookie } from "@std/http/signed-cookie";
 * import { getCookies } from "@std/http/cookie";
 *
 * const key = await crypto.subtle.generateKey(
 *   { name: "HMAC", hash: "SHA-256" },
 *   true,
 *   ["sign", "verify"],
 * );
 *
 * const headers = new Headers({
 *   Cookie: "location=tokyo.37f7481039762eef5cd46669f93c0a3214dfecba7d0cdc0b0dc40036063fb22e",
 * });
 * const signedCookie = getCookies(headers)["location"];
 * if (signedCookie === undefined) throw new Error("Cookie not found");
 * await verifySignedCookie(signedCookie, key);
 * ```
 *
 * @param signedCookie The signed cookie to verify.
 * @param key The cryptographic key to verify the cookie with.
 * @return Whether or not the cookie is valid.
 */
const verifySignedCookie = _function_verifySignedCookie as typeof _function_verifySignedCookie
export { verifySignedCookie }

import { parseSignedCookie as _function_parseSignedCookie } from "jsr:@std/http@1.0.3"
/**
 * Parses a signed cookie to get its value.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * Important: always verify the cookie using {@linkcode verifySignedCookie} first.
 *
 * @experimental
 * @example Usage
 * ```ts no-eval no-assert
 * import { verifySignedCookie, parseSignedCookie } from "@std/http/signed-cookie";
 * import { getCookies } from "@std/http/cookie";
 *
 * const key = await crypto.subtle.generateKey(
 *   { name: "HMAC", hash: "SHA-256" },
 *   true,
 *   ["sign", "verify"],
 * );
 *
 * const headers = new Headers({
 *   Cookie: "location=tokyo.37f7481039762eef5cd46669f93c0a3214dfecba7d0cdc0b0dc40036063fb22e",
 * });
 * const signedCookie = getCookies(headers)["location"];
 * if (signedCookie === undefined) throw new Error("Cookie not found");
 * await verifySignedCookie(signedCookie, key);
 * const cookie = parseSignedCookie(signedCookie);
 * ```
 *
 * @param signedCookie The signed cookie to parse the value from.
 * @return The parsed cookie.
 */
const parseSignedCookie = _function_parseSignedCookie as typeof _function_parseSignedCookie
export { parseSignedCookie }

import type { ServerSentEventMessage as _interface_ServerSentEventMessage } from "jsr:@std/http@1.0.3"
/**
 * Represents a message in the Server-Sent Event (SSE) protocol.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#fields}
 */
interface ServerSentEventMessage extends _interface_ServerSentEventMessage {}
export type { ServerSentEventMessage }

import { ServerSentEventStream as _class_ServerSentEventStream } from "jsr:@std/http@1.0.3"
/**
 * Transforms server-sent message objects into strings for the client.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events}
 *
 * @example Usage
 * ```ts no-assert
 * import {
 *   type ServerSentEventMessage,
 *   ServerSentEventStream,
 * } from "@std/http/server-sent-event-stream";
 *
 * const stream = ReadableStream.from<ServerSentEventMessage>([
 *   { data: "hello there" }
 * ]).pipeThrough(new ServerSentEventStream());
 * new Response(stream, {
 *   headers: {
 *     "content-type": "text/event-stream",
 *     "cache-control": "no-cache",
 *   },
 * });
 * ```
 */
class ServerSentEventStream extends _class_ServerSentEventStream {}
export { ServerSentEventStream }

import type { Browser as _interface_Browser } from "jsr:@std/http@1.0.3"
/**
 * The browser as described by a user agent string.
 */
interface Browser extends _interface_Browser {}
export type { Browser }

import type { Device as _interface_Device } from "jsr:@std/http@1.0.3"
/**
 * The device as described by a user agent string.
 */
interface Device extends _interface_Device {}
export type { Device }

import type { Engine as _interface_Engine } from "jsr:@std/http@1.0.3"
/**
 * The browser engine as described by a user agent string.
 */
interface Engine extends _interface_Engine {}
export type { Engine }

import type { Os as _interface_Os } from "jsr:@std/http@1.0.3"
/**
 * The OS as described by a user agent string.
 */
interface Os extends _interface_Os {}
export type { Os }

import type { Cpu as _interface_Cpu } from "jsr:@std/http@1.0.3"
/**
 * The CPU information as described by a user agent string.
 */
interface Cpu extends _interface_Cpu {}
export type { Cpu }

import { UserAgent as _class_UserAgent } from "jsr:@std/http@1.0.3"
/**
 * A representation of user agent string, which can be used to determine
 * environmental information represented by the string. All properties are
 * determined lazily.
 *
 * @example Usage
 * ```ts no-eval
 * import { UserAgent } from "@std/http/user-agent";
 *
 * Deno.serve((req) => {
 *   const userAgent = new UserAgent(req.headers.get("user-agent") ?? "");
 *   return new Response(`Hello, ${userAgent.browser.name}
 *     on ${userAgent.os.name} ${userAgent.os.version}!`);
 * });
 * ```
 */
class UserAgent extends _class_UserAgent {}
export { UserAgent }

import type { ServeFileOptions as _interface_ServeFileOptions } from "jsr:@std/http@1.0.3"
/**
 * Options for {@linkcode serveFile}.
 */
interface ServeFileOptions extends _interface_ServeFileOptions {}
export type { ServeFileOptions }

import { serveFile as _function_serveFile } from "jsr:@std/http@1.0.3"
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

import type { ServeDirOptions as _interface_ServeDirOptions } from "jsr:@std/http@1.0.3"
/**
 * Interface for serveDir options.
 */
interface ServeDirOptions extends _interface_ServeDirOptions {}
export type { ServeDirOptions }

import { serveDir as _function_serveDir } from "jsr:@std/http@1.0.3"
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

import type { Handler as _typeAlias_Handler } from "jsr:@std/http@1.0.3"
/**
 * Request handler for {@linkcode Route}.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @param request Request
 * @param info Request info
 * @param params URL pattern result
 */
type Handler = _typeAlias_Handler
export type { Handler }

import type { Route as _interface_Route } from "jsr:@std/http@1.0.3"
/**
 * Route configuration for {@linkcode route}.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
interface Route extends _interface_Route {}
export type { Route }

import { route as _function_route } from "jsr:@std/http@1.0.3"
/**
 * Routes requests to different handlers based on the request path and method.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @example Usage
 * ```ts no-eval
 * import { route, type Route } from "@std/http/route";
 * import { serveDir } from "@std/http/file-server";
 *
 * const routes: Route[] = [
 *   {
 *     pattern: new URLPattern({ pathname: "/about" }),
 *     handler: () => new Response("About page"),
 *   },
 *   {
 *     pattern: new URLPattern({ pathname: "/users/:id" }),
 *     handler: (_req, _info, params) => new Response(params?.pathname.groups.id),
 *   },
 *   {
 *     pattern: new URLPattern({ pathname: "/static/*" }),
 *     handler: (req: Request) => serveDir(req)
 *   }
 * ];
 *
 * function defaultHandler(_req: Request) {
 *   return new Response("Not found", { status: 404 });
 * }
 *
 * Deno.serve(route(routes, defaultHandler));
 * ```
 *
 * @param routes Route configurations
 * @param defaultHandler Default request handler that's returned when no route
 * matches the given request. Serving HTTP 404 Not Found or 405 Method Not
 * Allowed response can be done in this function.
 * @return Request handler
 */
const route = _function_route as typeof _function_route
export { route }

import { HEADER as _variable_HEADER } from "jsr:@std/http@1.0.3"
/**
 * HTTP Headers with status permanent
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @see {@link https://www.iana.org/assignments/http-fields/http-fields.xhtml#field-names | IANA Hypertext Transfer Protocol (HTTP) Field Name Registry}
 */
const HEADER = _variable_HEADER as typeof _variable_HEADER
export { HEADER }

import type { Header as _typeAlias_Header } from "jsr:@std/http@1.0.3"
/**
 * A HTTP Header
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
type Header = _typeAlias_Header
export type { Header }

import { METHOD as _variable_METHOD } from "jsr:@std/http@1.0.3"
/**
 * HTTP Methods derived from IANA Hypertext Transfer Protocol (HTTP) Method Registry
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @see {@link https://www.iana.org/assignments/http-methods/http-methods.xhtml#methods | IANA Hypertext Transfer Protocol (HTTP) Method Registry}
 */
const METHOD = _variable_METHOD as typeof _variable_METHOD
export { METHOD }

import type { Method as _typeAlias_Method } from "jsr:@std/http@1.0.3"
/**
 * A HTTP Method
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
type Method = _typeAlias_Method
export type { Method }
