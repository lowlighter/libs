import type { Ascii85Standard as _typeAlias_Ascii85Standard } from "jsr:@std/encoding@1.0.3/ascii85"
/**
 * Supported ascii85 standards for {@linkcode EncodeAscii85Options} and
 * {@linkcode DecodeAscii85Options}.
 */
type Ascii85Standard = _typeAlias_Ascii85Standard
export type { Ascii85Standard }

import type { EncodeAscii85Options as _interface_EncodeAscii85Options } from "jsr:@std/encoding@1.0.3/ascii85"
/**
 * Options for {@linkcode encodeAscii85}.
 */
interface EncodeAscii85Options extends _interface_EncodeAscii85Options {}
export type { EncodeAscii85Options }

import { encodeAscii85 as _function_encodeAscii85 } from "jsr:@std/encoding@1.0.3/ascii85"
/**
 * Converts data into an ascii85-encoded string.
 *
 * @param data The data to encode.
 * @param options Options for encoding.
 *
 * @return The ascii85-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeAscii85 } from "@std/encoding/ascii85";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeAscii85("Hello world!"), "87cURD]j7BEbo80");
 * ```
 */
const encodeAscii85 = _function_encodeAscii85 as typeof _function_encodeAscii85
export { encodeAscii85 }

import type { DecodeAscii85Options as _typeAlias_DecodeAscii85Options } from "jsr:@std/encoding@1.0.3/ascii85"
/**
 * Options for {@linkcode decodeAscii85}.
 */
type DecodeAscii85Options = _typeAlias_DecodeAscii85Options
export type { DecodeAscii85Options }

import { decodeAscii85 as _function_decodeAscii85 } from "jsr:@std/encoding@1.0.3/ascii85"
/**
 * Decodes a ascii85-encoded string.
 *
 * @param ascii85 The ascii85-encoded string to decode.
 * @param options Options for decoding.
 * @return The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeAscii85 } from "@std/encoding/ascii85";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeAscii85("87cURD]j7BEbo80"),
 *   new TextEncoder().encode("Hello world!"),
 * );
 * ```
 */
const decodeAscii85 = _function_decodeAscii85 as typeof _function_decodeAscii85
export { decodeAscii85 }
