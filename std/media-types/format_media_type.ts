import { formatMediaType as _function_formatMediaType } from "jsr:@std/media-types@1.0.2/format-media-type"
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
const formatMediaType = _function_formatMediaType
export { formatMediaType }
