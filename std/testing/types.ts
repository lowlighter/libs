import { assertType as _function_assertType } from "jsr:@std/testing@1.0.1/types"
/**
 * Asserts at compile time that the provided type argument's type resolves to the expected boolean literal type.
 *
 * @example Usage
 * ```ts expect-error ignore
 * import { assertType, IsExact, IsNullable } from "@std/testing/types";
 *
 * const result = "some result" as string | number;
 *
 * // compile error if the type of `result` is not exactly `string | number`
 * assertType<IsExact<typeof result, string | number>>(true);
 *
 * // causes a compile error that `true` is not assignable to `false`
 * assertType<IsNullable<string>>(true); // error: string is not nullable
 * ```
 *
 * @template T The expected type (`true` or `false`)
 * @param expectTrue True if the passed in type argument resolved to true.
 */
const assertType = _function_assertType as typeof _function_assertType
export { assertType }

import type { AssertTrue as _typeAlias_AssertTrue } from "jsr:@std/testing@1.0.1/types"
/**
 * Asserts at compile time that the provided type argument's type resolves to true.
 *
 * @example Usage
 * ```ts
 * import { AssertTrue, Has, IsNullable } from "@std/testing/types";
 *
 * const result = 1 as string | number | null;
 *
 * type doTest = AssertTrue<Has<typeof result, string> | IsNullable<typeof result>>;
 * ```
 *
 * @template T The type to assert is true.
 */
type AssertTrue<T extends true> = _typeAlias_AssertTrue<T>
export type { AssertTrue }

import type { AssertFalse as _typeAlias_AssertFalse } from "jsr:@std/testing@1.0.1/types"
/**
 * Asserts at compile time that the provided type argument's type resolves to false.
 *
 * @example Usage
 * ```ts
 * import { AssertFalse, IsNever } from "@std/testing/types";
 *
 * const result = 1 as string | number | null;
 *
 * type doTest = AssertFalse<IsNever<typeof result>>;
 * ```
 *
 * @template T The type to assert is false.
 */
type AssertFalse<T extends false> = _typeAlias_AssertFalse<T>
export type { AssertFalse }

import type { Assert as _typeAlias_Assert } from "jsr:@std/testing@1.0.1/types"
/**
 * Asserts at compile time that the provided type argument's type resolves to the expected boolean literal type.
 *
 * @example Usage
 * ```ts
 * import { Assert, Has } from "@std/testing/types";
 *
 * const result = 1 as string | number | null;
 *
 * type doTest = Assert<Has<typeof result, number>, true>;
 * ```
 *
 * @template T The type to assert is the expected boolean literal type.
 * @template Expected The expected boolean literal type.
 */
type Assert<T extends boolean, Expected extends T> = _typeAlias_Assert<T, Expected>
export type { Assert }

import type { Has as _typeAlias_Has } from "jsr:@std/testing@1.0.1/types"
/**
 * Checks if type `T` has the specified type `U`.
 *
 * @example Usage
 * ```ts
 * import { assertType, Has } from "@std/testing/types";
 *
 * assertType<Has<string | number, string>>(true);
 * assertType<Has<any, number>>(true);
 *
 * assertType<Has<string | number, Date>>(false);
 * assertType<Has<string, number>>(false);
 * assertType<Has<number, any>>(false);
 * ```
 *
 * @template T The type to check if it has the specified type `U`.
 * @template U The type to check if it is in the type `T`.
 */
type Has<T, U> = _typeAlias_Has<T, U>
export type { Has }

import type { NotHas as _typeAlias_NotHas } from "jsr:@std/testing@1.0.1/types"
/**
 * Checks if type `T` does not have the specified type `U`.
 *
 * @example Usage
 * ```ts
 * import { assertType, NotHas } from "@std/testing/types";
 *
 * assertType<NotHas<string | number, Date>>(true);
 * assertType<NotHas<string, number>>(true);
 * assertType<NotHas<number, any>>(true);
 *
 * assertType<NotHas<string | number, string>>(false);
 * assertType<NotHas<any, number>>(false);
 * ```
 *
 * @template T The type to check if it does not have the specified type `U`.
 * @template U The type to check if it is not in the type `T`.
 */
type NotHas<T, U> = _typeAlias_NotHas<T, U>
export type { NotHas }

import type { IsNullable as _typeAlias_IsNullable } from "jsr:@std/testing@1.0.1/types"
/**
 * Checks if type `T` is possibly null or undefined.
 *
 * @example Usage
 * ```ts
 * import { assertType, IsNullable } from "@std/testing/types";
 *
 * assertType<IsNullable<string | null>>(true);
 * assertType<IsNullable<string | undefined>>(true);
 * assertType<IsNullable<null | undefined>>(true);
 *
 * assertType<IsNullable<string>>(false);
 * assertType<IsNullable<any>>(false);
 * assertType<IsNullable<never>>(false);
 * ```
 *
 * @template T The type to check if it is nullable.
 */
type IsNullable<T> = _typeAlias_IsNullable<T>
export type { IsNullable }

import type { IsExact as _typeAlias_IsExact } from "jsr:@std/testing@1.0.1/types"
/**
 * Checks if type `T` exactly matches type `U`.
 *
 * @example Usage
 * ```ts
 * import { assertType, IsExact } from "@std/testing/types";
 *
 * assertType<IsExact<string | number, string | number>>(true);
 * assertType<IsExact<any, any>>(true); // ok to have any for both
 * assertType<IsExact<never, never>>(true);
 * assertType<IsExact<{ prop: string }, { prop: string }>>(true);
 *
 * assertType<IsExact<string | number | Date, string | number>>(false);
 * assertType<IsExact<string, string | number>>(false);
 * assertType<IsExact<string | undefined, string>>(false);
 * assertType<IsExact<string | undefined, any | string>>(false);
 * ```
 *
 * @template T The type to check if it exactly matches type `U`.
 * @template U The type to check if it exactly matches type `T`.
 */
type IsExact<T, U> = _typeAlias_IsExact<T, U>
export type { IsExact }

import type { DeepPrepareIsExact as _typeAlias_DeepPrepareIsExact } from "jsr:@std/testing@1.0.1/types"
/**
 * @internal
 */
type DeepPrepareIsExact<T, VisitedTypes = never> = _typeAlias_DeepPrepareIsExact<T, VisitedTypes>
export type { DeepPrepareIsExact }

import type { DeepPrepareIsExactProp as _typeAlias_DeepPrepareIsExactProp } from "jsr:@std/testing@1.0.1/types"
/**
 * @internal
 */
type DeepPrepareIsExactProp<Prop, Parent, VisitedTypes> = _typeAlias_DeepPrepareIsExactProp<Prop, Parent, VisitedTypes>
export type { DeepPrepareIsExactProp }

import type { IsAny as _typeAlias_IsAny } from "jsr:@std/testing@1.0.1/types"
/**
 * Checks if type `T` is the `any` type.
 *
 * @example Usage
 * ```ts
 * import { assertType, IsAny } from "@std/testing/types";
 *
 * assertType<IsAny<any>>(true);
 * assertType<IsAny<unknown>>(false);
 * ```
 *
 * @template T The type to check if it is the `any` type.
 */
type IsAny<T> = _typeAlias_IsAny<T>
export type { IsAny }

import type { IsNever as _typeAlias_IsNever } from "jsr:@std/testing@1.0.1/types"
/**
 * Checks if type `T` is the `never` type.
 *
 * @example Usage
 * ```ts
 * import { assertType, IsNever } from "@std/testing/types";
 *
 * assertType<IsNever<never>>(true);
 * assertType<IsNever<unknown>>(false);
 * ```
 *
 * @template T The type to check if it is the `never` type.
 */
type IsNever<T> = _typeAlias_IsNever<T>
export type { IsNever }

import type { IsUnknown as _typeAlias_IsUnknown } from "jsr:@std/testing@1.0.1/types"
/**
 * Checks if type `T` is the `unknown` type.
 *
 * @example Usage
 * ```ts
 * import { assertType, IsUnknown } from "@std/testing/types";
 *
 * assertType<IsUnknown<unknown>>(true);
 * assertType<IsUnknown<never>>(false);
 * ```
 *
 * @template T The type to check if it is the `unknown` type.
 */
type IsUnknown<T> = _typeAlias_IsUnknown<T>
export type { IsUnknown }

import type { ParametersAndReturnTypeMatches as _typeAlias_ParametersAndReturnTypeMatches } from "jsr:@std/testing@1.0.1/types"
/**
 * The internal utility type to match the given types as return types.
 *
 * @internal
 */
type ParametersAndReturnTypeMatches<T, U> = _typeAlias_ParametersAndReturnTypeMatches<T, U>
export type { ParametersAndReturnTypeMatches }

import type { TupleMatches as _typeAlias_TupleMatches } from "jsr:@std/testing@1.0.1/types"
/**
 * The internal utility type to match the given types as tuples.
 *
 * @internal
 */
type TupleMatches<T, U> = _typeAlias_TupleMatches<T, U>
export type { TupleMatches }

import type { Matches as _typeAlias_Matches } from "jsr:@std/testing@1.0.1/types"
/**
 * The internal utility type to match the given types.
 *
 * @internal
 */
type Matches<T, U> = _typeAlias_Matches<T, U>
export type { Matches }

import type { AnyToBrand as _typeAlias_AnyToBrand } from "jsr:@std/testing@1.0.1/types"
/**
 * The utility type to convert any to {@linkcode AnyBrand}.
 *
 * @internal
 */
type AnyToBrand<T> = _typeAlias_AnyToBrand<T>
export type { AnyToBrand }

import type { AnyBrand as _typeAlias_AnyBrand } from "jsr:@std/testing@1.0.1/types"
/**
 * The utility type to represent any type.
 *
 * @internal
 */
type AnyBrand = _typeAlias_AnyBrand
export type { AnyBrand }

import type { FlatType as _typeAlias_FlatType } from "jsr:@std/testing@1.0.1/types"
/**
 * The utility type to flatten record types.
 *
 * @internal
 */
type FlatType<T> = _typeAlias_FlatType<T>
export type { FlatType }
