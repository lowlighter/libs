import { decodeBase32 as _function_decodeBase32 } from "jsr:@std/encoding@1.0.4/base32"
/**
 * Decodes a base32-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-6}
 *
 * @param b32 The base32-encoded string to decode.
 * @return The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeBase32 } from "@std/encoding/base32";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeBase32("GZRTMMDDGA======"),
 *   new TextEncoder().encode("6c60c0"),
 * );
 * ```
 */
const decodeBase32 = _function_decodeBase32 as typeof _function_decodeBase32
export { decodeBase32 }

import { encodeBase32 as _function_encodeBase32 } from "jsr:@std/encoding@1.0.4/base32"
/**
 * Converts data into a base32-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-6}
 *
 * @param data The data to encode.
 * @return The base32-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeBase32 } from "@std/encoding/base32";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeBase32("6c60c0"), "GZRTMMDDGA======");
 * ```
 */
const encodeBase32 = _function_encodeBase32 as typeof _function_encodeBase32
export { encodeBase32 }
