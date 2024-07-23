import { deepMerge as _function_deepMerge } from "jsr:@std/collections@1.0.5/deep-merge"
/** UNDOCUMENTED */
const deepMerge = _function_deepMerge
export { deepMerge }

import type { MergingStrategy as _typeAlias_MergingStrategy } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Merging strategy
 */
type MergingStrategy = _typeAlias_MergingStrategy
export type { MergingStrategy }

import type { DeepMergeOptions as _typeAlias_DeepMergeOptions } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Options for {@linkcode deepMerge}.
 */
type DeepMergeOptions = _typeAlias_DeepMergeOptions
export type { DeepMergeOptions }

import type { ExpandRecursively as _typeAlias_ExpandRecursively } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Force intellisense to expand the typing to hide merging typings
 */
type ExpandRecursively<T> = _typeAlias_ExpandRecursively<T>
export type { ExpandRecursively }

import type { PartialByType as _typeAlias_PartialByType } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Filter of keys matching a given type
 */
type PartialByType<T, U> = _typeAlias_PartialByType<T, U>
export type { PartialByType }

import type { SetValueType as _typeAlias_SetValueType } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Get set values type
 */
type SetValueType<T> = _typeAlias_SetValueType<T>
export type { SetValueType }

import type { MergeAllSets as _typeAlias_MergeAllSets } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Merge all sets types definitions from keys present in both objects
 */
type MergeAllSets<T, U, X = PartialByType<T, Set<unknown>>, Y = PartialByType<U, Set<unknown>>, Z = { [K in keyof X & keyof Y]: Set<SetValueType<X[K]> | SetValueType<Y[K]>> }> = _typeAlias_MergeAllSets<T, U, X, Y, Z>
export type { MergeAllSets }

import type { ArrayValueType as _typeAlias_ArrayValueType } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Get array values type
 */
type ArrayValueType<T> = _typeAlias_ArrayValueType<T>
export type { ArrayValueType }

import type { MergeAllArrays as _typeAlias_MergeAllArrays } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Merge all sets types definitions from keys present in both objects
 */
type MergeAllArrays<T, U, X = PartialByType<T, Array<unknown>>, Y = PartialByType<U, Array<unknown>>, Z = { [K in keyof X & keyof Y]: Array<ArrayValueType<X[K]> | ArrayValueType<Y[K]>> }> = _typeAlias_MergeAllArrays<T, U, X, Y, Z>
export type { MergeAllArrays }

import type { MapKeyType as _typeAlias_MapKeyType } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Get map values types
 */
type MapKeyType<T> = _typeAlias_MapKeyType<T>
export type { MapKeyType }

import type { MapValueType as _typeAlias_MapValueType } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Get map values types
 */
type MapValueType<T> = _typeAlias_MapValueType<T>
export type { MapValueType }

import type { MergeAllMaps as _typeAlias_MergeAllMaps } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Merge all sets types definitions from keys present in both objects
 */
type MergeAllMaps<T, U, X = PartialByType<T, Map<unknown, unknown>>, Y = PartialByType<U, Map<unknown, unknown>>, Z = { [K in keyof X & keyof Y]: Map<MapKeyType<X[K]> | MapKeyType<Y[K]>, MapValueType<X[K]> | MapValueType<Y[K]>> }> = _typeAlias_MergeAllMaps<T, U, X, Y, Z>
export type { MergeAllMaps }

import type { MergeAllRecords as _typeAlias_MergeAllRecords } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Merge all records types definitions from keys present in both objects
 */
type MergeAllRecords<T, U, Options, X = PartialByType<T, Record<PropertyKey, unknown>>, Y = PartialByType<U, Record<PropertyKey, unknown>>, Z = { [K in keyof X & keyof Y]: DeepMerge<X[K], Y[K], Options> }> = _typeAlias_MergeAllRecords<T, U, Options, X, Y, Z>
export type { MergeAllRecords }

import type { OmitComplexes as _typeAlias_OmitComplexes } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Exclude map, sets and array from type
 */
type OmitComplexes<T> = _typeAlias_OmitComplexes<T>
export type { OmitComplexes }

import type { ObjectXorKeys as _typeAlias_ObjectXorKeys } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Object with keys in either T or U but not in both
 */
type ObjectXorKeys<T, U, X = Omit<T, keyof U> & Omit<U, keyof T>, Y = { [K in keyof X]: X[K] }> = _typeAlias_ObjectXorKeys<T, U, X, Y>
export type { ObjectXorKeys }

import type { MergeRightOmitComplexes as _typeAlias_MergeRightOmitComplexes } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Merge two objects, with left precedence
 */
type MergeRightOmitComplexes<T, U, X = ObjectXorKeys<T, U> & OmitComplexes<{ [K in keyof U]: U[K] }>> = _typeAlias_MergeRightOmitComplexes<T, U, X>
export type { MergeRightOmitComplexes }

import type { Merge as _typeAlias_Merge } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Merge two objects
 */
type Merge<
  T,
  U,
  Options,
  X =
    & MergeRightOmitComplexes<T, U>
    & MergeAllRecords<T, U, Options>
    & (Options extends { sets: "replace" } ? PartialByType<U, Set<unknown>> : MergeAllSets<T, U>)
    & (Options extends { arrays: "replace" } ? PartialByType<U, Array<unknown>> : MergeAllArrays<T, U>)
    & (Options extends { maps: "replace" } ? PartialByType<U, Map<unknown, unknown>> : MergeAllMaps<T, U>),
> = _typeAlias_Merge<T, U, Options, X>
export type { Merge }

import type { DeepMerge as _typeAlias_DeepMerge } from "jsr:@std/collections@1.0.5/deep-merge"
/**
 * Merge deeply two objects
 */
type DeepMerge<T, U, Options = Record<string, MergingStrategy>> = _typeAlias_DeepMerge<T, U, Options>
export type { DeepMerge }
