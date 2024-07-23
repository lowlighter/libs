import { assertAlmostEquals as _function_assertAlmostEquals } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `actual` and `expected` are almost equal numbers
 * through a given tolerance. It can be used to take into account IEEE-754
 * double-precision floating-point representation limitations. If the values
 * are not almost equal then throw.
 *
 * @example ```ts
 * import { assertAlmostEquals } from "@std/testing/asserts";
 *
 * assertAlmostEquals(0.01, 0.02, 0.1); // Doesn't throw
 * assertAlmostEquals(0.01, 0.02); // Throws
 * assertAlmostEquals(0.1 + 0.2, 0.3, 1e-16); // Doesn't throw
 * assertAlmostEquals(0.1 + 0.2, 0.3, 1e-17); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertAlmostEquals = _function_assertAlmostEquals
export { assertAlmostEquals }

import type { ArrayLikeArg as _typeAlias_ArrayLikeArg } from "jsr:@std/testing@0.225.3/asserts"
/**
 * An array-like object (`Array`, `Uint8Array`, `NodeList`, etc.) that is not a string.
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
type ArrayLikeArg<T> = _typeAlias_ArrayLikeArg<T>
export type { ArrayLikeArg }

import { assertArrayIncludes as _function_assertArrayIncludes } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `actual` includes the `expected` values. If not then
 * an error will be thrown.
 *
 * Type parameter can be specified to ensure values under comparison have the
 * same type.
 *
 * @example ```ts
 * import { assertArrayIncludes } from "@std/testing/asserts";
 *
 * assertArrayIncludes([1, 2], [2]); // Doesn't throw
 * assertArrayIncludes([1, 2], [3]); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertArrayIncludes = _function_assertArrayIncludes
export { assertArrayIncludes }

import { assertEquals as _function_assertEquals } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `actual` and `expected` are equal, deeply. If not
 * deeply equal, then throw.
 *
 * Type parameter can be specified to ensure values under comparison have the
 * same type.
 *
 * @example ```ts
 * import { assertEquals } from "@std/testing/asserts";
 *
 * assertEquals("world", "world"); // Doesn't throw
 * assertEquals("hello", "world"); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertEquals = _function_assertEquals
export { assertEquals }

import { assertExists as _function_assertExists } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that actual is not null or undefined.
 * If not then throw.
 *
 * @example ```ts
 * import { assertExists } from "@std/testing/asserts";
 *
 * assertExists("something"); // Doesn't throw
 * assertExists(undefined); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertExists = _function_assertExists
export { assertExists }

import type { Falsy as _typeAlias_Falsy } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Assertion condition for {@linkcode assertFalse}.
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
type Falsy = _typeAlias_Falsy
export type { Falsy }

import { assertFalse as _function_assertFalse } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion, error will be thrown if `expr` have truthy value.
 *
 * @example ```ts
 * import { assertFalse } from "@std/testing/asserts";
 *
 * assertFalse(false); // Doesn't throw
 * assertFalse(true); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertFalse = _function_assertFalse
export { assertFalse }

import { assertGreaterOrEqual as _function_assertGreaterOrEqual } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `actual` is greater than or equal to `expected`.
 * If not then throw.
 *
 * @example ```ts
 * import { assertGreaterOrEqual } from "@std/testing/asserts";
 *
 * assertGreaterOrEqual(2, 1); // Doesn't throw
 * assertGreaterOrEqual(1, 1); // Doesn't throw
 * assertGreaterOrEqual(0, 1); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertGreaterOrEqual = _function_assertGreaterOrEqual
export { assertGreaterOrEqual }

import { assertGreater as _function_assertGreater } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `actual` is greater than `expected`.
 * If not then throw.
 *
 * @example ```ts
 * import { assertGreater } from "@std/testing/asserts";
 *
 * assertGreater(2, 1); // Doesn't throw
 * assertGreater(1, 1); // Throws
 * assertGreater(0, 1); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertGreater = _function_assertGreater
export { assertGreater }

import type { AnyConstructor as _typeAlias_AnyConstructor } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Any constructor
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
type AnyConstructor = _typeAlias_AnyConstructor
export type { AnyConstructor }

import type { GetConstructorType as _typeAlias_GetConstructorType } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Gets constructor type
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
type GetConstructorType<T extends AnyConstructor> = _typeAlias_GetConstructorType<T>
export type { GetConstructorType }

import { assertInstanceOf as _function_assertInstanceOf } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `obj` is an instance of `type`.
 * If not then throw.
 *
 * @example ```ts
 * import { assertInstanceOf } from "@std/testing/asserts";
 *
 * assertInstanceOf(new Date(), Date); // Doesn't throw
 * assertInstanceOf(new Date(), Number); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertInstanceOf = _function_assertInstanceOf
export { assertInstanceOf }

import { assertIsError as _function_assertIsError } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `error` is an `Error`.
 * If not then an error will be thrown.
 * An error class and a string that should be included in the
 * error message can also be asserted.
 *
 * @example ```ts
 * import { assertIsError } from "@std/testing/asserts";
 *
 * assertIsError(null); // Throws
 * assertIsError(new RangeError("Out of range")); // Doesn't throw
 * assertIsError(new RangeError("Out of range"), SyntaxError); // Throws
 * assertIsError(new RangeError("Out of range"), SyntaxError, "Out of range"); // Doesn't throw
 * assertIsError(new RangeError("Out of range"), SyntaxError, "Within range"); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertIsError = _function_assertIsError
export { assertIsError }

import { assertLessOrEqual as _function_assertLessOrEqual } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `actual` is less than or equal to `expected`.
 * If not then throw.
 *
 * @example ```ts
 * import { assertLessOrEqual } from "@std/testing/asserts";
 *
 * assertLessOrEqual(1, 2); // Doesn't throw
 * assertLessOrEqual(1, 1); // Doesn't throw
 * assertLessOrEqual(1, 0); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertLessOrEqual = _function_assertLessOrEqual
export { assertLessOrEqual }

import { assertLess as _function_assertLess } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `actual` is less than `expected`.
 * If not then throw.
 *
 * @example ```ts
 * import { assertLess } from "@std/testing/asserts";
 *
 * assertLess(1, 2); // Doesn't throw
 * assertLess(2, 1); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertLess = _function_assertLess
export { assertLess }

import { assertMatch as _function_assertMatch } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `actual` match RegExp `expected`. If not
 * then throw.
 *
 * @example ```ts
 * import { assertMatch } from "@std/testing/asserts";
 *
 * assertMatch("Raptor", RegExp(/Raptor/)); // Doesn't throw
 * assertMatch("Denosaurus", RegExp(/Raptor/)); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertMatch = _function_assertMatch
export { assertMatch }

import { assertNotEquals as _function_assertNotEquals } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `actual` and `expected` are not equal, deeply.
 * If not then throw.
 *
 * Type parameter can be specified to ensure values under comparison have the same type.
 *
 * @example ```ts
 * import { assertNotEquals } from "@std/testing/asserts";
 *
 * assertNotEquals(1, 2); // Doesn't throw
 * assertNotEquals(1, 1); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertNotEquals = _function_assertNotEquals
export { assertNotEquals }

import { assertNotInstanceOf as _function_assertNotInstanceOf } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `obj` is not an instance of `type`.
 * If so, then throw.
 *
 * @example ```ts
 * import { assertNotInstanceOf } from "@std/testing/asserts";
 *
 * assertNotInstanceOf(new Date(), Number); // Doesn't throw
 * assertNotInstanceOf(new Date(), Date); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertNotInstanceOf = _function_assertNotInstanceOf
export { assertNotInstanceOf }

import { assertNotMatch as _function_assertNotMatch } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `actual` not match RegExp `expected`. If match
 * then throw.
 *
 * @example ```ts
 * import { assertNotMatch } from "@std/testing/asserts";
 *
 * assertNotMatch("Denosaurus", RegExp(/Raptor/)); // Doesn't throw
 * assertNotMatch("Raptor", RegExp(/Raptor/)); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertNotMatch = _function_assertNotMatch
export { assertNotMatch }

import { assertNotStrictEquals as _function_assertNotStrictEquals } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `actual` and `expected` are not strictly equal.
 * If the values are strictly equal then throw.
 *
 * @example ```ts
 * import { assertNotStrictEquals } from "@std/testing/asserts";
 *
 * assertNotStrictEquals(1, 1); // Doesn't throw
 * assertNotStrictEquals(1, 2); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertNotStrictEquals = _function_assertNotStrictEquals
export { assertNotStrictEquals }

import { assertObjectMatch as _function_assertObjectMatch } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `actual` object is a subset of `expected` object,
 * deeply. If not, then throw.
 *
 * @example ```ts
 * import { assertObjectMatch } from "@std/testing/asserts";
 *
 * assertObjectMatch({ foo: "bar" }, { foo: "bar" }); // Doesn't throw
 * assertObjectMatch({ foo: "bar" }, { foo: "baz" }); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertObjectMatch = _function_assertObjectMatch
export { assertObjectMatch }

import { assertRejects as _function_assertRejects } from "jsr:@std/testing@0.225.3/asserts"
/** UNDOCUMENTED */
const assertRejects = _function_assertRejects
export { assertRejects }

import { assertStrictEquals as _function_assertStrictEquals } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that `actual` and `expected` are strictly equal. If
 * not then throw.
 *
 * @example ```ts
 * import { assertStrictEquals } from "@std/testing/asserts";
 *
 * const a = {};
 * const b = a;
 * assertStrictEquals(a, b); // Doesn't throw
 *
 * const c = {};
 * const d = {};
 * assertStrictEquals(c, d); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertStrictEquals = _function_assertStrictEquals
export { assertStrictEquals }

import { assertStringIncludes as _function_assertStringIncludes } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion that actual includes expected. If not
 * then throw.
 *
 * @example ```ts
 * import { assertStringIncludes } from "@std/testing/asserts";
 *
 * assertStringIncludes("Hello", "ello"); // Doesn't throw
 * assertStringIncludes("Hello", "world"); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assertStringIncludes = _function_assertStringIncludes
export { assertStringIncludes }

import { assertThrows as _function_assertThrows } from "jsr:@std/testing@0.225.3/asserts"
/** UNDOCUMENTED */
const assertThrows = _function_assertThrows
export { assertThrows }

import { assert as _function_assert } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Make an assertion, error will be thrown if `expr` does not have truthy value.
 *
 * @example ```ts
 * import { assert } from "@std/testing/asserts";
 *
 * assert("hello".includes("ello")); // Doesn't throw
 * assert("hello".includes("world")); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const assert = _function_assert
export { assert }

import { AssertionError as _class_AssertionError } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Error thrown when an assertion fails.
 *
 * @example ```ts
 * import { AssertionError } from "@std/testing/asserts";
 *
 * throw new AssertionError("Assertion failed");
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
class AssertionError extends _class_AssertionError {}
export { AssertionError }

import { equal as _function_equal } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Deep equality comparison used in assertions
 * @param c actual value
 * @param d expected value
 *
 * @example ```ts
 * import { equal } from "@std/testing/asserts";
 *
 * equal({ foo: "bar" }, { foo: "bar" }); // Returns `true`
 * equal({ foo: "bar" }, { foo: "baz" }); // Returns `false
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const equal = _function_equal
export { equal }

import { fail as _function_fail } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Forcefully throws a failed assertion.
 *
 * @example ```ts
 * import { fail } from "@std/testing/asserts";
 *
 * fail("Deliberately failed!"); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const fail = _function_fail
export { fail }

import { unimplemented as _function_unimplemented } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Use this to stub out methods that will throw when invoked.
 *
 * @example ```ts
 * import { unimplemented } from "@std/testing/asserts";
 *
 * unimplemented(); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const unimplemented = _function_unimplemented
export { unimplemented }

import { unreachable as _function_unreachable } from "jsr:@std/testing@0.225.3/asserts"
/**
 * Use this to assert unreachable code.
 *
 * @example ```ts
 * import { unreachable } from "@std/testing/asserts";
 *
 * unreachable(); // Throws
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Import from
 * {@link https://jsr.io/@std/assert | @std/assert} instead.
 */
const unreachable = _function_unreachable
export { unreachable }
