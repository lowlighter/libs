import { encodeBase64Url as _function_encodeBase64Url } from "jsr:@std/encoding@1.0.4/base64url"
/**
 * Convert data into a base64url-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-5}
 *
 * @param data The data to encode.
 * @return The base64url-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeBase64Url } from "@std/encoding/base64url";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeBase64Url("foobar"), "Zm9vYmFy");
 * ```
 */
const encodeBase64Url = _function_encodeBase64Url as typeof _function_encodeBase64Url
export { encodeBase64Url }

import { decodeBase64Url as _function_decodeBase64Url } from "jsr:@std/encoding@1.0.4/base64url"
/**
 * Decodes a given base64url-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-5}
 *
 * @param b64url The base64url-encoded string to decode.
 * @return The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeBase64Url } from "@std/encoding/base64url";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeBase64Url("Zm9vYmFy"),
 *   new TextEncoder().encode("foobar")
 * );
 * ```
 */
const decodeBase64Url = _function_decodeBase64Url as typeof _function_decodeBase64Url
export { decodeBase64Url }
