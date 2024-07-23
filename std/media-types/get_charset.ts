import { getCharset as _function_getCharset } from "jsr:@std/media-types@1.0.2/get-charset"
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
const getCharset = _function_getCharset
export { getCharset }
