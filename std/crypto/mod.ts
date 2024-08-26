/**
 * Extensions to the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API | Web Crypto}
 * supporting additional encryption APIs, but also delegating to the built-in
 * APIs when possible.
 *
 * ```ts no-assert
 * import { crypto } from "@std/crypto/crypto";
 *
 * const message = "Hello, Deno!";
 * const encoder = new TextEncoder();
 * const data = encoder.encode(message);
 *
 * await crypto.subtle.digest("BLAKE3", data);
 * ```
 *
 * @module
 */
import { DIGEST_ALGORITHM_NAMES as _variable_DIGEST_ALGORITHM_NAMES } from "jsr:@std/crypto@1.0.2"
/**
 * All cryptographic hash/digest algorithms supported by std/crypto.
 *
 * For algorithms that are supported by WebCrypto, the name here will match the
 * one used by WebCrypto. Otherwise we prefer the formatting used in the
 * algorithm's official specification. All names are uppercase to facilitate
 * case-insensitive comparisons required by the WebCrypto spec.
 */
const DIGEST_ALGORITHM_NAMES = _variable_DIGEST_ALGORITHM_NAMES as typeof _variable_DIGEST_ALGORITHM_NAMES
export { DIGEST_ALGORITHM_NAMES }

import type { DigestAlgorithmName as _typeAlias_DigestAlgorithmName } from "jsr:@std/crypto@1.0.2"
/**
 * An algorithm name supported by std/crypto.
 */
type DigestAlgorithmName = _typeAlias_DigestAlgorithmName
export type { DigestAlgorithmName }

import type { StdSubtleCrypto as _interface_StdSubtleCrypto } from "jsr:@std/crypto@1.0.2"
/**
 * Extensions to the web standard `SubtleCrypto` interface.
 */
interface StdSubtleCrypto extends _interface_StdSubtleCrypto {}
export type { StdSubtleCrypto }

import type { StdCrypto as _interface_StdCrypto } from "jsr:@std/crypto@1.0.2"
/**
 * Extensions to the Web {@linkcode Crypto} interface.
 */
interface StdCrypto extends _interface_StdCrypto {}
export type { StdCrypto }

import type { DigestAlgorithmObject as _typeAlias_DigestAlgorithmObject } from "jsr:@std/crypto@1.0.2"
/**
 * Extended digest algorithm objects.
 */
type DigestAlgorithmObject = _typeAlias_DigestAlgorithmObject
export type { DigestAlgorithmObject }

import type { DigestAlgorithm as _typeAlias_DigestAlgorithm } from "jsr:@std/crypto@1.0.2"
/**
 * Extended digest algorithms accepted by {@linkcode stdCrypto.subtle.digest}.
 *
 * The `length` option will be ignored for
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#algorithm | Web Standard algorithms}.
 */
type DigestAlgorithm = _typeAlias_DigestAlgorithm
export type { DigestAlgorithm }

import { crypto as _variable_crypto } from "jsr:@std/crypto@1.0.2"
/**
 * An wrapper for WebCrypto adding support for additional non-standard
 * algorithms, but delegating to the runtime WebCrypto implementation whenever
 * possible.
 */
const crypto = _variable_crypto as typeof _variable_crypto
export { crypto }

import { timingSafeEqual as _function_timingSafeEqual } from "jsr:@std/crypto@1.0.2"
/**
 * When checking the values of cryptographic hashes are equal, default
 * comparisons can be susceptible to timing based attacks, where attacker is
 * able to find out information about the host system by repeatedly checking
 * response times to equality comparisons of values.
 *
 * It is likely some form of timing safe equality will make its way to the
 * WebCrypto standard (see:
 * {@link https://github.com/w3c/webcrypto/issues/270 | w3c/webcrypto#270}), but until
 * that time, `timingSafeEqual()` is provided:
 *
 * @example Usage
 * ```ts
 * import { timingSafeEqual } from "@std/crypto/timing-safe-equal";
 * import { assert } from "@std/assert";
 *
 * const a = await crypto.subtle.digest(
 *   "SHA-384",
 *   new TextEncoder().encode("hello world"),
 * );
 * const b = await crypto.subtle.digest(
 *   "SHA-384",
 *   new TextEncoder().encode("hello world"),
 * );
 *
 * assert(timingSafeEqual(a, b));
 * ```
 *
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @return `true` if the values are equal, otherwise `false`.
 */
const timingSafeEqual = _function_timingSafeEqual as typeof _function_timingSafeEqual
export { timingSafeEqual }
