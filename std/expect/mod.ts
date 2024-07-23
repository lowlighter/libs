import { expect as _namespace_expect } from "jsr:@std/expect@0.224.5"
/**
 * Additional properties on the `expect` function.
 */
const expect = _namespace_expect
export { expect }

import type { AnyConstructor as _typeAlias_AnyConstructor } from "jsr:@std/expect@0.224.5"
/**
 * A constructor that accepts any args and returns any value
 */
type AnyConstructor = _typeAlias_AnyConstructor
export type { AnyConstructor }

import type { Async as _typeAlias_Async } from "jsr:@std/expect@0.224.5"
/**
 * converts all the methods in an interface to be async functions
 */
type Async<T> = _typeAlias_Async<T>
export type { Async }

import type { Expected as _interface_Expected } from "jsr:@std/expect@0.224.5"
/**
 * The Expected interface defines the available assertion methods.
 */
interface Expected extends _interface_Expected {}
export type { Expected }

import { fn as _function_fn } from "jsr:@std/expect@0.224.5"
/**
 * Creates a mock function that can be used for testing and assertions.
 *
 * @param stubs - functions to be used as stubs for different calls.
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
const fn = _function_fn
export { fn }
