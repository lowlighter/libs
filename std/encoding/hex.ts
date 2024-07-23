import { encodeHex as _function_encodeHex } from "jsr:@std/encoding@1.0.1/hex"
/**
 * Converts data into a hex-encoded string.
 *
 * @param src The data to encode.
 *
 * @return The hex-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeHex } from "@std/encoding/hex";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeHex("abc"), "616263");
 * ```
 */
const encodeHex = _function_encodeHex
export { encodeHex }

import { decodeHex as _function_decodeHex } from "jsr:@std/encoding@1.0.1/hex"
/**
 * Decodes the given hex-encoded string. If the input is malformed, an error is
 * thrown.
 *
 * @param src The hex-encoded string to decode.
 *
 * @return The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeHex } from "@std/encoding/hex";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeHex("616263"),
 *   new TextEncoder().encode("abc"),
 * );
 * ```
 */
const decodeHex = _function_decodeHex
export { decodeHex }
