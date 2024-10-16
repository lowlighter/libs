import type { CborPrimitiveType as _typeAlias_CborPrimitiveType } from "jsr:@std/cbor@0.1.1/types"
/**
 * This type specifies the primitive types that the implementation can
 * encode/decode into/from.
 */
type CborPrimitiveType = _typeAlias_CborPrimitiveType
export type { CborPrimitiveType }

import type { CborType as _typeAlias_CborType } from "jsr:@std/cbor@0.1.1/types"
/**
 * This type specifies the encodable and decodable values for
 * {@link encodeCbor}, {@link decodeCbor}, {@link encodeCborSequence}, and
 * {@link decodeCborSequence}.
 */
type CborType = _typeAlias_CborType
export type { CborType }

import type { CborStreamInput as _typeAlias_CborStreamInput } from "jsr:@std/cbor@0.1.1/types"
/**
 * Specifies the encodable value types for the {@link CborSequenceEncoderStream}
 * and {@link CborArrayEncoderStream}.
 */
type CborStreamInput = _typeAlias_CborStreamInput
export type { CborStreamInput }

import type { CborMapStreamInput as _typeAlias_CborMapStreamInput } from "jsr:@std/cbor@0.1.1/types"
/**
 * Specifies the structure of input for the {@link CborMapEncoderStream}.
 */
type CborMapStreamInput = _typeAlias_CborMapStreamInput
export type { CborMapStreamInput }

import type { CborStreamOutput as _typeAlias_CborStreamOutput } from "jsr:@std/cbor@0.1.1/types"
/**
 * Specifies the decodable value types for the {@link CborSequenceDecoderStream}
 * and {@link CborMapDecodedStream}.
 */
type CborStreamOutput = _typeAlias_CborStreamOutput
export type { CborStreamOutput }

import type { CborMapStreamOutput as _typeAlias_CborMapStreamOutput } from "jsr:@std/cbor@0.1.1/types"
/**
 * Specifies the structure of the output for the {@link CborMapDecodedStream}.
 */
type CborMapStreamOutput = _typeAlias_CborMapStreamOutput
export type { CborMapStreamOutput }
