import { DIGEST_ALGORITHM_NAMES as _variable_DIGEST_ALGORITHM_NAMES } from "jsr:@std/crypto@1.0.3/crypto"
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

import type { DigestAlgorithmName as _typeAlias_DigestAlgorithmName } from "jsr:@std/crypto@1.0.3/crypto"
/**
 * An algorithm name supported by std/crypto.
 */
type DigestAlgorithmName = _typeAlias_DigestAlgorithmName
export type { DigestAlgorithmName }

import type { StdSubtleCrypto as _interface_StdSubtleCrypto } from "jsr:@std/crypto@1.0.3/crypto"
/**
 * Extensions to the web standard `SubtleCrypto` interface.
 */
interface StdSubtleCrypto extends _interface_StdSubtleCrypto {}
export type { StdSubtleCrypto }

import type { StdCrypto as _interface_StdCrypto } from "jsr:@std/crypto@1.0.3/crypto"
/**
 * Extensions to the Web {@linkcode Crypto} interface.
 */
interface StdCrypto extends _interface_StdCrypto {}
export type { StdCrypto }

import type { DigestAlgorithmObject as _typeAlias_DigestAlgorithmObject } from "jsr:@std/crypto@1.0.3/crypto"
/**
 * Extended digest algorithm objects.
 */
type DigestAlgorithmObject = _typeAlias_DigestAlgorithmObject
export type { DigestAlgorithmObject }

import type { DigestAlgorithm as _typeAlias_DigestAlgorithm } from "jsr:@std/crypto@1.0.3/crypto"
/**
 * Extended digest algorithms accepted by {@linkcode stdCrypto.subtle.digest}.
 *
 * The `length` option will be ignored for
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#algorithm | Web Standard algorithms}.
 */
type DigestAlgorithm = _typeAlias_DigestAlgorithm
export type { DigestAlgorithm }

import { crypto as _variable_crypto } from "jsr:@std/crypto@1.0.3/crypto"
/**
 * An wrapper for WebCrypto adding support for additional non-standard
 * algorithms, but delegating to the runtime WebCrypto implementation whenever
 * possible.
 */
const crypto = _variable_crypto as typeof _variable_crypto
export { crypto }
