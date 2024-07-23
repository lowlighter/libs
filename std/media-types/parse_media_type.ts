import { parseMediaType as _function_parseMediaType } from "jsr:@std/media-types@1.0.2/parse-media-type"
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
const parseMediaType = _function_parseMediaType
export { parseMediaType }
