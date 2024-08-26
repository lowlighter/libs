/**
 * Utility functions for media types (MIME types).
 *
 * This API is inspired by the GoLang {@linkcode https://pkg.go.dev/mime | mime}
 * package and {@link https://github.com/jshttp/mime-types | jshttp/mime-types},
 * and is designed to integrate and improve the APIs from
 * {@link https://deno.land/x/media_types | x/media_types}.
 *
 * The `vendor` folder contains copy of the
 * {@link https://github.com/jshttp/mime-types | jshttp/mime-db} `db.json` file,
 * along with its license.
 *
 * ```ts
 * import { contentType, allExtensions, getCharset } from "@std/media-types";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(allExtensions("application/json"), ["json", "map"]);
 *
 * assertEquals(contentType(".json"), "application/json; charset=UTF-8");
 *
 * assertEquals(getCharset("text/plain"), "UTF-8");
 * ```
 *
 * @module
 */
import type { DB as _typeAlias_DB } from "jsr:@std/media-types@1.0.2"
/**
 * MIME-types database.
 */
type DB = _typeAlias_DB
export type { DB }

import type { ContentTypeToExtension as _typeAlias_ContentTypeToExtension } from "jsr:@std/media-types@1.0.2"
/**
 * Maps content types to their corresponding file extensions.
 */
type ContentTypeToExtension = _typeAlias_ContentTypeToExtension
export type { ContentTypeToExtension }

import type { KnownExtensionOrType as _typeAlias_KnownExtensionOrType } from "jsr:@std/media-types@1.0.2"
/**
 * Known extension or type. Used in {@linkcode contentType}.
 */
type KnownExtensionOrType = _typeAlias_KnownExtensionOrType
export type { KnownExtensionOrType }

import { contentType as _function_contentType } from "jsr:@std/media-types@1.0.2"
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

import { extension as _function_extension } from "jsr:@std/media-types@1.0.2"
/**
 * Returns the most relevant extension for the given media type, or `undefined`
 * if no extension can be found.
 *
 * Extensions are returned without a leading `.`.
 *
 * @param type The media type to get the extension for.
 *
 * @return The extension for the given media type, or `undefined` if no
 * extension is found.
 *
 * @example Usage
 * ```ts
 * import { extension } from "@std/media-types/extension";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(extension("text/plain"), "txt");
 * assertEquals(extension("application/json"), "json");
 * assertEquals(extension("text/html; charset=UTF-8"), "html");
 * assertEquals(extension("application/foo"), undefined);
 * ```
 */
const extension = _function_extension as typeof _function_extension
export { extension }

import { allExtensions as _function_allExtensions } from "jsr:@std/media-types@1.0.2"
/**
 * Returns all the extensions known to be associated with the media type `type`, or
 * `undefined` if no extensions are found.
 *
 * Extensions are returned without a leading `.`.
 *
 * @param type The media type to get the extensions for.
 *
 * @return The extensions for the given media type, or `undefined` if no
 * extensions are found.
 *
 * @example Usage
 * ```ts
 * import { allExtensions } from "@std/media-types/all-extensions";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(allExtensions("application/json"), ["json", "map"]);
 * assertEquals(allExtensions("text/html; charset=UTF-8"), ["html", "htm", "shtml"]);
 * assertEquals(allExtensions("application/foo"), undefined);
 * ```
 */
const allExtensions = _function_allExtensions as typeof _function_allExtensions
export { allExtensions }

import { formatMediaType as _function_formatMediaType } from "jsr:@std/media-types@1.0.2"
/**
 * Serializes the media type and the optional parameters as a media type
 * conforming to {@link https://www.rfc-editor.org/rfc/rfc2045.html | RFC 2045} and
 * {@link https://www.rfc-editor.org/rfc/rfc2616.html | RFC 2616}.
 *
 * The type and parameter names are written in lower-case.
 *
 * When any of the arguments results in a standard violation then the return
 * value will be an empty string (`""`).
 *
 * @param type The media type to serialize.
 * @param param Optional parameters to serialize.
 *
 * @return The serialized media type.
 *
 * @example Basic usage
 * ```ts
 * import { formatMediaType } from "@std/media-types/format-media-type";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(formatMediaType("text/plain"), "text/plain");
 * ```
 *
 * @example With parameters
 * ```ts
 * import { formatMediaType } from "@std/media-types/format-media-type";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(formatMediaType("text/plain", { charset: "UTF-8" }), "text/plain; charset=UTF-8");
 * ```
 */
const formatMediaType = _function_formatMediaType as typeof _function_formatMediaType
export { formatMediaType }

import { getCharset as _function_getCharset } from "jsr:@std/media-types@1.0.2"
/**
 * Given a media type or header value, identify the encoding charset. If the
 * charset cannot be determined, the function returns `undefined`.
 *
 * @param type The media type or header value to get the charset for.
 *
 * @return The charset for the given media type or header value, or `undefined`
 * if the charset cannot be determined.
 *
 * @example Usage
 * ```ts
 * import { getCharset } from "@std/media-types/get-charset";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(getCharset("text/plain"), "UTF-8");
 * assertEquals(getCharset("application/foo"), undefined);
 * assertEquals(getCharset("application/news-checkgroups"), "US-ASCII");
 * assertEquals(getCharset("application/news-checkgroups; charset=UTF-8"), "UTF-8");
 * ```
 */
const getCharset = _function_getCharset as typeof _function_getCharset
export { getCharset }

import { parseMediaType as _function_parseMediaType } from "jsr:@std/media-types@1.0.2"
/**
 * Parses the media type and any optional parameters, per
 * {@link https://www.rfc-editor.org/rfc/rfc1521.html | RFC 1521}.
 *
 * Media types are the values in `Content-Type` and `Content-Disposition`
 * headers. On success the function returns a tuple where the first element is
 * the media type and the second element is the optional parameters or
 * `undefined` if there are none.
 *
 * The function will throw if the parsed value is invalid.
 *
 * The returned media type will be normalized to be lower case, and returned
 * params keys will be normalized to lower case, but preserves the casing of
 * the value.
 *
 * @param type The media type to parse.
 *
 * @return A tuple where the first element is the media type and the second
 * element is the optional parameters or `undefined` if there are none.
 *
 * @example Usage
 * ```ts
 * import { parseMediaType } from "@std/media-types/parse-media-type";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(parseMediaType("application/JSON"), ["application/json", undefined]);
 * assertEquals(parseMediaType("text/html; charset=UTF-8"), ["text/html", { charset: "UTF-8" }]);
 * ```
 */
const parseMediaType = _function_parseMediaType as typeof _function_parseMediaType
export { parseMediaType }

import { typeByExtension as _function_typeByExtension } from "jsr:@std/media-types@1.0.2"
/**
 * Returns the media type associated with the file extension, or `undefined` if
 * no media type is found.
 *
 * Values are normalized to lower case and matched irrespective of a leading
 * `.`.
 *
 * @param extension The file extension to get the media type for.
 *
 * @return The media type associated with the file extension, or `undefined` if
 * no media type is found.
 *
 * @example Usage
 * ```ts
 * import { typeByExtension } from "@std/media-types/type-by-extension";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(typeByExtension("js"), "text/javascript");
 * assertEquals(typeByExtension(".HTML"), "text/html");
 * assertEquals(typeByExtension("foo"), undefined);
 * assertEquals(typeByExtension("file.json"), undefined);
 * ```
 */
const typeByExtension = _function_typeByExtension as typeof _function_typeByExtension
export { typeByExtension }
