import type { DB as _typeAlias_DB } from "jsr:@std/media-types@1.0.2/content-type"
/**
 * MIME-types database.
 */
type DB = _typeAlias_DB
export type { DB }

import type { ContentTypeToExtension as _typeAlias_ContentTypeToExtension } from "jsr:@std/media-types@1.0.2/content-type"
/**
 * Maps content types to their corresponding file extensions.
 */
type ContentTypeToExtension = _typeAlias_ContentTypeToExtension
export type { ContentTypeToExtension }

import type { KnownExtensionOrType as _typeAlias_KnownExtensionOrType } from "jsr:@std/media-types@1.0.2/content-type"
/**
 * Known extension or type. Used in {@linkcode contentType}.
 */
type KnownExtensionOrType = _typeAlias_KnownExtensionOrType
export type { KnownExtensionOrType }

import { contentType as _function_contentType } from "jsr:@std/media-types@1.0.2/content-type"
/**
 * Returns the full `Content-Type` or `Content-Disposition` header value for the
 * given extension or media type.
 *
 * The function will treat the `extensionOrType` as a media type when it
 * contains a `/`, otherwise it will process it as an extension, with or without
 * the leading `.`.
 *
 * Returns `undefined` if unable to resolve the media type.
 *
 * @template T Type of the extension or media type to resolve.
 *
 * @param extensionOrType The extension or media type to resolve.
 *
 * @return The full `Content-Type` or `Content-Disposition` header value, or
 * `undefined` if unable to resolve the media type.
 *
 * @example Usage
 * ```ts
 * import { contentType } from "@std/media-types/content-type";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(contentType(".json"), "application/json; charset=UTF-8");
 * assertEquals(contentType("text/html"), "text/html; charset=UTF-8");
 * assertEquals(contentType("text/html; charset=UTF-8"), "text/html; charset=UTF-8");
 * assertEquals(contentType("txt"), "text/plain; charset=UTF-8");
 * assertEquals(contentType("foo"), undefined);
 * assertEquals(contentType("file.json"), undefined);
 * ```
 */
const contentType = _function_contentType as typeof _function_contentType
export { contentType }
