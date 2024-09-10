import { encodeBase58 as _function_encodeBase58 } from "jsr:@std/encoding@1.0.4/base58"
/**
 * Converts data into a base58-encoded string.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/draft-msporny-base58-03#section-3}
 *
 * @param data The data to encode.
 * @return The base58-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeBase58 } from "@std/encoding/base58";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeBase58("Hello World!"), "2NEpo7TZRRrLZSi2U");
 * ```
 */
const encodeBase58 = _function_encodeBase58 as typeof _function_encodeBase58
export { encodeBase58 }

import { decodeBase58 as _function_decodeBase58 } from "jsr:@std/encoding@1.0.4/base58"
/**
 * Decodes a base58-encoded string.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/draft-msporny-base58-03#section-4}
 *
 * @param b58 The base58-encoded string to decode.
 * @return The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeBase58 } from "@std/encoding/base58";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeBase58("2NEpo7TZRRrLZSi2U"),
 *   new TextEncoder().encode("Hello World!")
 * );
 * ```
 */
const decodeBase58 = _function_decodeBase58 as typeof _function_decodeBase58
export { decodeBase58 }
