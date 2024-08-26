import { encodeBase64 as _function_encodeBase64 } from "jsr:@std/encoding@1.0.2/base64"
/**
 * Converts data into a base64-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-4}
 *
 * @param data The data to encode.
 * @return The base64-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeBase64 } from "@std/encoding/base64";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeBase64("foobar"), "Zm9vYmFy");
 * ```
 */
const encodeBase64 = _function_encodeBase64 as typeof _function_encodeBase64
export { encodeBase64 }

import { decodeBase64 as _function_decodeBase64 } from "jsr:@std/encoding@1.0.2/base64"
/**
 * Decodes a base64-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-4}
 *
 * @param b64 The base64-encoded string to decode.
 * @return The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeBase64 } from "@std/encoding/base64";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeBase64("Zm9vYmFy"),
 *   new TextEncoder().encode("foobar")
 * );
 * ```
 */
const decodeBase64 = _function_decodeBase64 as typeof _function_decodeBase64
export { decodeBase64 }
