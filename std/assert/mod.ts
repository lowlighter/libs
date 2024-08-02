/**
 * A library of assertion functions.
 * If the assertion is false an `AssertionError` will be thrown which will
 * result in pretty-printed diff of failing assertion.
 *
 * This module is browser compatible, but do not rely on good formatting of
 * values for AssertionError messages in browsers.
 *
 * ```ts no-eval
 * import { assert } from "@std/assert";
 *
 * assert("I am truthy"); // Doesn't throw
 * assert(false); // Throws `AssertionError`
 * ```
 *
 * @module
 */
import { assertAlmostEquals as _function_assertAlmostEquals } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `actual` and `expected` are almost equal numbers
 * through a given tolerance. It can be used to take into account IEEE-754
 * double-precision floating-point representation limitations. If the values
 * are not almost equal then throw.
 *
 * The default tolerance is one hundred thousandth of a percent of the
 * expected value.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertAlmostEquals } from "@std/assert";
 *
 * assertAlmostEquals(0.01, 0.02); // Throws
 * assertAlmostEquals(1e-8, 1e-9); // Throws
 * assertAlmostEquals(1.000000001e-8, 1.000000002e-8); // Doesn't throw
 * assertAlmostEquals(0.01, 0.02, 0.1); // Doesn't throw
 * assertAlmostEquals(0.1 + 0.2, 0.3, 1e-16); // Doesn't throw
 * assertAlmostEquals(0.1 + 0.2, 0.3, 1e-17); // Throws
 * ```
 *
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param tolerance The tolerance to consider the values almost equal. The
 * default is one hundred thousandth of a percent of the expected value.
 * @param msg The optional message to include in the error.
 */
const assertAlmostEquals = _function_assertAlmostEquals
export { assertAlmostEquals }

import type { ArrayLikeArg as _typeAlias_ArrayLikeArg } from "jsr:@std/assert@1.0.2"
/**
 * An array-like object (`Array`, `Uint8Array`, `NodeList`, etc.) that is not a string
 */
type ArrayLikeArg<T> = _typeAlias_ArrayLikeArg<T>
export type { ArrayLikeArg }

import { assertArrayIncludes as _function_assertArrayIncludes } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `actual` includes the `expected` values. If not then
 * an error will be thrown.
 *
 * Type parameter can be specified to ensure values under comparison have the
 * same type.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertArrayIncludes } from "@std/assert";
 *
 * assertArrayIncludes([1, 2], [2]); // Doesn't throw
 * assertArrayIncludes([1, 2], [3]); // Throws
 * ```
 *
 * @template T The type of the elements in the array to compare.
 * @param actual The array-like object to check for.
 * @param expected The array-like object to check for.
 * @param msg The optional message to display if the assertion fails.
 */
const assertArrayIncludes = _function_assertArrayIncludes
export { assertArrayIncludes }

import { assertEquals as _function_assertEquals } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `actual` and `expected` are equal, deeply. If not
 * deeply equal, then throw.
 *
 * Type parameter can be specified to ensure values under comparison have the
 * same type.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals("world", "world"); // Doesn't throw
 * assertEquals("hello", "world"); // Throws
 * ```
 *
 * @template T The type of the values to compare. This is usually inferred.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
const assertEquals = _function_assertEquals
export { assertEquals }

import { assertExists as _function_assertExists } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that actual is not null or undefined.
 * If not then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertExists } from "@std/assert";
 *
 * assertExists("something"); // Doesn't throw
 * assertExists(undefined); // Throws
 * ```
 *
 * @template T The type of the actual value.
 * @param actual The actual value to check.
 * @param msg The optional message to include in the error if the assertion fails.
 */
const assertExists = _function_assertExists
export { assertExists }

import type { Falsy as _typeAlias_Falsy } from "jsr:@std/assert@1.0.2"
/**
 * Assertion condition for {@linkcode assertFalse}.
 */
type Falsy = _typeAlias_Falsy
export type { Falsy }

import { assertFalse as _function_assertFalse } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion, error will be thrown if `expr` have truthy value.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertFalse } from "@std/assert";
 *
 * assertFalse(false); // Doesn't throw
 * assertFalse(true); // Throws
 * ```
 *
 * @param expr The expression to test.
 * @param msg The optional message to display if the assertion fails.
 */
const assertFalse = _function_assertFalse
export { assertFalse }

import { assertGreaterOrEqual as _function_assertGreaterOrEqual } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `actual` is greater than or equal to `expected`.
 * If not then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertGreaterOrEqual } from "@std/assert";
 *
 * assertGreaterOrEqual(2, 1); // Doesn't throw
 * assertGreaterOrEqual(1, 1); // Doesn't throw
 * assertGreaterOrEqual(0, 1); // Throws
 * ```
 *
 * @template T The type of the values to compare.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
const assertGreaterOrEqual = _function_assertGreaterOrEqual
export { assertGreaterOrEqual }

import { assertGreater as _function_assertGreater } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `actual` is greater than `expected`.
 * If not then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertGreater } from "@std/assert";
 *
 * assertGreater(2, 1); // Doesn't throw
 * assertGreater(1, 1); // Throws
 * assertGreater(0, 1); // Throws
 * ```
 *
 * @template T The type of the values to compare.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
const assertGreater = _function_assertGreater
export { assertGreater }

import type { AnyConstructor as _typeAlias_AnyConstructor } from "jsr:@std/assert@1.0.2"
/**
 * Any constructor
 */
type AnyConstructor = _typeAlias_AnyConstructor
export type { AnyConstructor }

import type { GetConstructorType as _typeAlias_GetConstructorType } from "jsr:@std/assert@1.0.2"
/**
 * Gets constructor type
 */
type GetConstructorType<T extends AnyConstructor> = _typeAlias_GetConstructorType<T>
export type { GetConstructorType }

import { assertInstanceOf as _function_assertInstanceOf } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `obj` is an instance of `type`.
 * If not then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertInstanceOf } from "@std/assert";
 *
 * assertInstanceOf(new Date(), Date); // Doesn't throw
 * assertInstanceOf(new Date(), Number); // Throws
 * ```
 *
 * @template T The expected type of the object.
 * @param actual The object to check.
 * @param expectedType The expected class constructor.
 * @param msg The optional message to display if the assertion fails.
 */
const assertInstanceOf = _function_assertInstanceOf
export { assertInstanceOf }

import { assertIsError as _function_assertIsError } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `error` is an `Error`.
 * If not then an error will be thrown.
 * An error class and a string that should be included in the
 * error message can also be asserted.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertIsError } from "@std/assert";
 *
 * assertIsError(null); // Throws
 * assertIsError(new RangeError("Out of range")); // Doesn't throw
 * assertIsError(new RangeError("Out of range"), SyntaxError); // Throws
 * assertIsError(new RangeError("Out of range"), SyntaxError, "Out of range"); // Doesn't throw
 * assertIsError(new RangeError("Out of range"), SyntaxError, "Within range"); // Throws
 * ```
 *
 * @template E The type of the error to assert.
 * @param error The error to assert.
 * @param ErrorClass The optional error class to assert.
 * @param msgMatches The optional string or RegExp to assert in the error message.
 * @param msg The optional message to display if the assertion fails.
 */
const assertIsError = _function_assertIsError
export { assertIsError }

import { assertLessOrEqual as _function_assertLessOrEqual } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `actual` is less than or equal to `expected`.
 * If not then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertLessOrEqual } from "@std/assert";
 *
 * assertLessOrEqual(1, 2); // Doesn't throw
 * assertLessOrEqual(1, 1); // Doesn't throw
 * assertLessOrEqual(1, 0); // Throws
 * ```
 *
 * @template T The type of the values to compare.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
const assertLessOrEqual = _function_assertLessOrEqual
export { assertLessOrEqual }

import { assertLess as _function_assertLess } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `actual` is less than `expected`.
 * If not then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertLess } from "@std/assert";
 *
 * assertLess(1, 2); // Doesn't throw
 * assertLess(2, 1); // Throws
 * ```
 *
 * @template T The type of the values to compare.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
const assertLess = _function_assertLess
export { assertLess }

import { assertMatch as _function_assertMatch } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `actual` match RegExp `expected`. If not
 * then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertMatch } from "@std/assert";
 *
 * assertMatch("Raptor", /Raptor/); // Doesn't throw
 * assertMatch("Denosaurus", /Raptor/); // Throws
 * ```
 *
 * @param actual The actual value to be matched.
 * @param expected The expected pattern to match.
 * @param msg The optional message to display if the assertion fails.
 */
const assertMatch = _function_assertMatch
export { assertMatch }

import { assertNotEquals as _function_assertNotEquals } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `actual` and `expected` are not equal, deeply.
 * If not then throw.
 *
 * Type parameter can be specified to ensure values under comparison have the same type.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertNotEquals } from "@std/assert";
 *
 * assertNotEquals(1, 2); // Doesn't throw
 * assertNotEquals(1, 1); // Throws
 * ```
 *
 * @template T The type of the values to compare.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
const assertNotEquals = _function_assertNotEquals
export { assertNotEquals }

import { assertNotInstanceOf as _function_assertNotInstanceOf } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `obj` is not an instance of `type`.
 * If so, then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertNotInstanceOf } from "@std/assert";
 *
 * assertNotInstanceOf(new Date(), Number); // Doesn't throw
 * assertNotInstanceOf(new Date(), Date); // Throws
 * ```
 *
 * @template A The type of the object to check.
 * @template T The type of the class to check against.
 * @param actual The object to check.
 * @param unexpectedType The class constructor to check against.
 * @param msg The optional message to display if the assertion fails.
 */
const assertNotInstanceOf = _function_assertNotInstanceOf
export { assertNotInstanceOf }

import { assertNotMatch as _function_assertNotMatch } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `actual` not match RegExp `expected`. If match
 * then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertNotMatch } from "@std/assert";
 *
 * assertNotMatch("Denosaurus", /Raptor/); // Doesn't throw
 * assertNotMatch("Raptor", /Raptor/); // Throws
 * ```
 *
 * @param actual The actual value to match.
 * @param expected The expected value to not match.
 * @param msg The optional message to display if the assertion fails.
 */
const assertNotMatch = _function_assertNotMatch
export { assertNotMatch }

import { assertNotStrictEquals as _function_assertNotStrictEquals } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `actual` and `expected` are not strictly equal, using
 * {@linkcode Object.is} for equality comparison. If the values are strictly
 * equal then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertNotStrictEquals } from "@std/assert";
 *
 * assertNotStrictEquals(1, 1); // Throws
 * assertNotStrictEquals(1, 2); // Doesn't throw
 *
 * assertNotStrictEquals(0, 0); // Throws
 * assertNotStrictEquals(0, -0); // Doesn't throw
 * ```
 *
 * @template T The type of the values to compare.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
const assertNotStrictEquals = _function_assertNotStrictEquals
export { assertNotStrictEquals }

import { assertObjectMatch as _function_assertObjectMatch } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `expected` object is a subset of `actual` object,
 * deeply. If not, then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertObjectMatch } from "@std/assert";
 *
 * assertObjectMatch({ foo: "bar" }, { foo: "bar" }); // Doesn't throw
 * assertObjectMatch({ foo: "bar" }, { foo: "baz" }); // Throws
 * ```
 *
 * @example Usage with nested objects
 * ```ts no-eval
 * import { assertObjectMatch } from "@std/assert";
 *
 * assertObjectMatch({ foo: { bar: 3, baz: 4 } }, { foo: { bar: 3 } }); // Doesn't throw
 * assertObjectMatch({ foo: { bar: 3 } }, { foo: { bar: 3, baz: 4 } }); // Throws
 * ```
 *
 * @param actual The actual value to be matched.
 * @param expected The expected value to match.
 * @param msg The optional message to display if the assertion fails.
 */
const assertObjectMatch = _function_assertObjectMatch
export { assertObjectMatch }

import { assertRejects as _function_assertRejects } from "jsr:@std/assert@1.0.2"
/** UNDOCUMENTED */
const assertRejects = _function_assertRejects
export { assertRejects }

import { assertStrictEquals as _function_assertStrictEquals } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that `actual` and `expected` are strictly equal, using
 * {@linkcode Object.is} for equality comparison. If not, then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertStrictEquals } from "@std/assert";
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
 * @template T The type of the expected value.
 * @param actual The actual value to compare.
 * @param expected The expected value to compare.
 * @param msg The optional message to display if the assertion fails.
 */
const assertStrictEquals = _function_assertStrictEquals
export { assertStrictEquals }

import { assertStringIncludes as _function_assertStringIncludes } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion that actual includes expected. If not
 * then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertStringIncludes } from "@std/assert";
 *
 * assertStringIncludes("Hello", "ello"); // Doesn't throw
 * assertStringIncludes("Hello", "world"); // Throws
 * ```
 *
 * @param actual The actual string to check for inclusion.
 * @param expected The expected string to check for inclusion.
 * @param msg The optional message to display if the assertion fails.
 */
const assertStringIncludes = _function_assertStringIncludes
export { assertStringIncludes }

import { assertThrows as _function_assertThrows } from "jsr:@std/assert@1.0.2"
/** UNDOCUMENTED */
const assertThrows = _function_assertThrows
export { assertThrows }

import { assert as _function_assert } from "jsr:@std/assert@1.0.2"
/**
 * Make an assertion, error will be thrown if `expr` does not have truthy value.
 *
 * @example Usage
 * ```ts no-eval
 * import { assert } from "@std/assert";
 *
 * assert("hello".includes("ello")); // Doesn't throw
 * assert("hello".includes("world")); // Throws
 * ```
 *
 * @param expr The expression to test.
 * @param msg The optional message to display if the assertion fails.
 */
const assert = _function_assert
export { assert }

import { AssertionError as _class_AssertionError } from "jsr:@std/assert@1.0.2"
/**
 * Error thrown when an assertion fails.
 *
 * @example Usage
 * ```ts no-eval
 * import { AssertionError } from "@std/assert";
 *
 * try {
 *   throw new AssertionError("foo", { cause: "bar" });
 * } catch (error) {
 *   if (error instanceof AssertionError) {
 *     error.message === "foo"; // true
 *     error.cause === "bar"; // true
 *   }
 * }
 * ```
 */
class AssertionError extends _class_AssertionError {}
export { AssertionError }

import { equal as _function_equal } from "jsr:@std/assert@1.0.2"
/**
 * Deep equality comparison used in assertions
 *
 * @param c The actual value
 * @param d The expected value
 * @return `true` if the values are deeply equal, `false` otherwise
 *
 * @example Usage
 * ```ts
 * import { equal } from "@std/assert";
 *
 * equal({ foo: "bar" }, { foo: "bar" }); // Returns `true`
 * equal({ foo: "bar" }, { foo: "baz" }); // Returns `false
 * ```
 */
const equal = _function_equal
export { equal }

import { fail as _function_fail } from "jsr:@std/assert@1.0.2"
/**
 * Forcefully throws a failed assertion.
 *
 * @example Usage
 * ```ts no-eval
 * import { fail } from "@std/assert";
 *
 * fail("Deliberately failed!"); // Throws
 * ```
 *
 * @param msg Optional message to include in the error.
 * @return Never returns, always throws.
 */
const fail = _function_fail
export { fail }

import { unimplemented as _function_unimplemented } from "jsr:@std/assert@1.0.2"
/**
 * Use this to stub out methods that will throw when invoked.
 *
 * @example Usage
 * ```ts no-eval
 * import { unimplemented } from "@std/assert";
 *
 * unimplemented(); // Throws
 * ```
 *
 * @param msg Optional message to include in the error.
 * @return Never returns, always throws.
 */
const unimplemented = _function_unimplemented
export { unimplemented }

import { unreachable as _function_unreachable } from "jsr:@std/assert@1.0.2"
/**
 * Use this to assert unreachable code.
 *
 * @example Usage
 * ```ts no-eval
 * import { unreachable } from "@std/assert";
 *
 * unreachable(); // Throws
 * ```
 *
 * @param msg Optional message to include in the error.
 * @return Never returns, always throws.
 */
const unreachable = _function_unreachable
export { unreachable }
