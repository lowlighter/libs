import { decodeBase32Hex as _function_decodeBase32Hex } from "jsr:@std/encoding@1.0.4/base32hex"
/**
 * Decodes a base32hex-encoded string.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-7}
 *
 * @param b32 The base32hex-encoded string to decode.
 * @return The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeBase32Hex } from "@std/encoding/base32hex";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeBase32Hex("6PHJCC3360======"),
 *   new TextEncoder().encode("6c60c0"),
 * );
 * ```
 */
const decodeBase32Hex = _function_decodeBase32Hex as typeof _function_decodeBase32Hex
export { decodeBase32Hex }

import { encodeBase32Hex as _function_encodeBase32Hex } from "jsr:@std/encoding@1.0.4/base32hex"
/**
 * Converts data into a base32hex-encoded string.
 *
 * @experimental
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-7}
 *
 * @param data The data to encode.
 * @return The base32hex-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeBase32Hex } from "@std/encoding/base32hex";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeBase32Hex("6c60c0"), "6PHJCC3360======");
 * ```
 */
const encodeBase32Hex = _function_encodeBase32Hex as typeof _function_encodeBase32Hex
export { encodeBase32Hex }
