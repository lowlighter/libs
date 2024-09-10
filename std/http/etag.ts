import type { FileInfo as _interface_FileInfo } from "jsr:@std/http@1.0.5/etag"
/**
 * Just the part of {@linkcode Deno.FileInfo} that is required to calculate an `ETag`,
 * so partial or user generated file information can be passed.
 */
interface FileInfo extends _interface_FileInfo {}
export type { FileInfo }

import type { ETagOptions as _interface_ETagOptions } from "jsr:@std/http@1.0.5/etag"
/**
 * Options for {@linkcode eTag}.
 */
interface ETagOptions extends _interface_ETagOptions {}
export type { ETagOptions }

import { eTag as _function_eTag } from "jsr:@std/http@1.0.5/etag"
/** UNDOCUMENTED */
const eTag = _function_eTag as typeof _function_eTag
export { eTag }

import { ifMatch as _function_ifMatch } from "jsr:@std/http@1.0.5/etag"
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

import { ifNoneMatch as _function_ifNoneMatch } from "jsr:@std/http@1.0.5/etag"
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
