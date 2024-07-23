import type { ReleaseType as _typeAlias_ReleaseType } from "jsr:@std/semver@0.224.3/types"
/**
 * The possible release types are used as an operator for the
 * increment function and as a result of the difference function.
 */
type ReleaseType = _typeAlias_ReleaseType
export type { ReleaseType }

import type { Operator as _typeAlias_Operator } from "jsr:@std/semver@0.224.3/types"
/**
 * SemVer comparison operators.
 */
type Operator = _typeAlias_Operator
export type { Operator }

import type { Comparator as _interface_Comparator } from "jsr:@std/semver@0.224.3/types"
/**
 * The shape of a valid semantic version comparator
 * @example >=0.0.0
 */
interface Comparator extends _interface_Comparator {}
export type { Comparator }

import type { SemVer as _interface_SemVer } from "jsr:@std/semver@0.224.3/types"
/**
 * A SemVer object parsed into its constituent parts.
 */
interface SemVer extends _interface_SemVer {}
export type { SemVer }

import type { Range as _typeAlias_Range } from "jsr:@std/semver@0.224.3/types"
/**
 * A type representing a semantic version range. The ranges consist of
 * a nested array, which represents a set of OR comparisons while the
 * inner array represents AND comparisons.
 */
type Range = _typeAlias_Range
export type { Range }
