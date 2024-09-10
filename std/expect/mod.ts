/**
 * This module provides Jest compatible expect assertion functionality.
 *
 * ```ts no-assert
 * import { expect } from "@std/expect";
 *
 * const x = 6 * 7;
 * expect(x).toEqual(42);
 * expect(x).not.toEqual(0);
 *
 * await expect(Promise.resolve(x)).resolves.toEqual(42);
 * ```
 *
 * Currently this module supports the following functions:
 * - Common matchers:
 *   - {@linkcode Expected.toBe | toBe}
 *   - {@linkcode Expected.toEqual | toEqual}
 *   - {@linkcode Expected.toStrictEqual | toStrictEqual}
 *   - {@linkcode Expected.toMatch | toMatch}
 *   - {@linkcode Expected.toMatchObject | toMatchObject}
 *   - {@linkcode Expected.toBeDefined | toBeDefined}
 *   - {@linkcode Expected.toBeUndefined | toBeUndefined}
 *   - {@linkcode Expected.toBeNull | toBeNull}
 *   - {@linkcode Expected.toBeNaN | toBeNaN}
 *   - {@linkcode Expected.toBeTruthy | toBeTruthy}
 *   - {@linkcode Expected.toBeFalsy | toBeFalsy}
 *   - {@linkcode Expected.toContain | toContain}
 *   - {@linkcode Expected.toContainEqual | toContainEqual}
 *   - {@linkcode Expected.toHaveLength | toHaveLength}
 *   - {@linkcode Expected.toBeGreaterThan | toBeGreaterThan}
 *   - {@linkcode Expected.toBeGreaterThanOrEqual | toBeGreaterThanOrEqual}
 *   - {@linkcode Expected.toBeLessThan | toBeLessThan}
 *   - {@linkcode Expected.toBeLessThanOrEqual | toBeLessThanOrEqual}
 *   - {@linkcode Expected.toBeCloseTo | toBeCloseTo}
 *   - {@linkcode Expected.toBeInstanceOf | toBeInstanceOf}
 *   - {@linkcode Expected.toThrow | toThrow}
 *   - {@linkcode Expected.toHaveProperty | toHaveProperty}
 * - Mock related matchers:
 *   - {@linkcode Expected.toHaveBeenCalled | toHaveBeenCalled}
 *   - {@linkcode Expected.toHaveBeenCalledTimes | toHaveBeenCalledTimes}
 *   - {@linkcode Expected.toHaveBeenCalledWith | toHaveBeenCalledWith}
 *   - {@linkcode Expected.toHaveBeenLastCalledWith | toHaveBeenLastCalledWith}
 *   - {@linkcode Expected.toHaveBeenNthCalledWith | toHaveBeenNthCalledWith}
 *   - {@linkcode Expected.toHaveReturned | toHaveReturned}
 *   - {@linkcode Expected.toHaveReturnedTimes | toHaveReturnedTimes}
 *   - {@linkcode Expected.toHaveReturnedWith | toHaveReturnedWith}
 *   - {@linkcode Expected.toHaveLastReturnedWith | toHaveLastReturnedWith}
 *   - {@linkcode Expected.toHaveNthReturnedWith | toHaveNthReturnedWith}
 * - Asymmetric matchers:
 *   - {@linkcode expect.anything}
 *   - {@linkcode expect.any}
 *   - {@linkcode expect.arrayContaining}
 *   - {@linkcode expect.closeTo}
 *   - {@linkcode expect.stringContaining}
 *   - {@linkcode expect.stringMatching}
 * - Utilities:
 *   - {@linkcode expect.addEqualityTester}
 *   - {@linkcode expect.extend}
 *
 * Only these functions are still not available:
 * - Matchers:
 *   - `toMatchSnapShot`
 *   - `toMatchInlineSnapShot`
 *   - `toThrowErrorMatchingSnapShot`
 *   - `toThrowErrorMatchingInlineSnapShot`
 * - Asymmetric matchers:
 *   - `expect.objectContaining`
 *   - `expect.not.objectContaining`
 * - Utilities:
 *   - `expect.assertions`
 *   - `expect.hasAssertions`
 *   - `expect.addSnapshotSerializer`
 *
 * The tracking issue to add support for unsupported parts of the API is
 * {@link https://github.com/denoland/std/issues/3964}.
 *
 * This module is largely inspired by
 * {@link https://github.com/allain/expect | x/expect} module by
 * {@link https://github.com/allain | Allain Lalonde}.
 *
 * @module
 */
import type { AnyConstructor as _typeAlias_AnyConstructor } from "jsr:@std/expect@1.0.2"
/**
 * A constructor that accepts any args and returns any value
 */
type AnyConstructor = _typeAlias_AnyConstructor
export type { AnyConstructor }

import type { Async as _typeAlias_Async } from "jsr:@std/expect@1.0.2"
/**
 * converts all the methods in an interface to be async functions
 */
type Async<T> = _typeAlias_Async<T>
export type { Async }

import type { Expected as _interface_Expected } from "jsr:@std/expect@1.0.2"
/**
 * The Expected interface defines the available assertion methods.
 */
interface Expected<IsAsync = false> extends _interface_Expected<IsAsync> {}
export type { Expected }

import { expect as _namespace_expect } from "jsr:@std/expect@1.0.2"
/**
 * Additional properties on the `expect` function.
 */
const expect = _namespace_expect as typeof _namespace_expect
export { expect }

import { fn as _function_fn } from "jsr:@std/expect@1.0.2"
/**
 * Creates a mock function that can be used for testing and assertions.
 *
 * @param stubs Functions to be used as stubs for different calls.
 * @return A mock function that keeps track of calls and returns values based on the provided stubs.
 *
 * @example Usage
 * ```ts no-assert
 * import { fn, expect } from "@std/expect";
 *
 * Deno.test("example", () => {
 *   const mockFn = fn(
 *     (a: number, b: number) => a + b,
 *     (a: number, b: number) => a - b
 *   );
 *   const result = mockFn(1, 2);
 *   expect(result).toEqual(3);
 *   expect(mockFn).toHaveBeenCalledWith(1, 2);
 *   expect(mockFn).toHaveBeenCalledTimes(1);
 *
 *   const result2 = mockFn(3, 2);
 *   expect(result2).toEqual(1);
 *   expect(mockFn).toHaveBeenCalledWith(3, 2);
 *   expect(mockFn).toHaveBeenCalledTimes(2);
 * });
 * ```
 */
const fn = _function_fn as typeof _function_fn
export { fn }
