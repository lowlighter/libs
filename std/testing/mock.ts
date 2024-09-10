import { MockError as _class_MockError } from "jsr:@std/testing@1.0.2/mock"
/**
 * An error related to spying on a function or instance method.
 *
 * @example Usage
 * ```ts
 * import { MockError, spy } from "@std/testing/mock";
 * import { assertThrows } from "@std/assert";
 *
 * assertThrows(() => {
 *   spy({} as any, "no-such-method");
 * }, MockError);
 * ```
 */
class MockError extends _class_MockError {}
export { MockError }

import type { SpyCall as _interface_SpyCall } from "jsr:@std/testing@1.0.2/mock"
/**
 * Call information recorded by a spy.
 */
interface SpyCall<Self = any, Args extends unknown[] = any[], Return = any> extends _interface_SpyCall<Self, Args, Return> {}
export type { SpyCall }

import type { Spy as _interface_Spy } from "jsr:@std/testing@1.0.2/mock"
/**
 * A function or instance method wrapper that records all calls made to it.
 */
interface Spy<Self = any, Args extends unknown[] = any[], Return = any> extends _interface_Spy<Self, Args, Return> {}
export type { Spy }

import type { MethodSpy as _interface_MethodSpy } from "jsr:@std/testing@1.0.2/mock"
/**
 * An instance method wrapper that records all calls made to it.
 */
interface MethodSpy<Self = any, Args extends unknown[] = any[], Return = any> extends _interface_MethodSpy<Self, Args, Return> {}
export type { MethodSpy }

import { mockSession as _function_mockSession } from "jsr:@std/testing@1.0.2/mock"
/** UNDOCUMENTED */
const mockSession = _function_mockSession as typeof _function_mockSession
export { mockSession }

import { mockSessionAsync as _function_mockSessionAsync } from "jsr:@std/testing@1.0.2/mock"
/**
 * Creates an async session that tracks all mocks created before the promise resolves.
 *
 * @example Usage
 * ```ts
 * import { mockSessionAsync, restore, stub } from "@std/testing/mock";
 * import { assertEquals, assertNotEquals } from "@std/assert";
 *
 * const setTimeout = globalThis.setTimeout;
 * const session = mockSessionAsync(async () => {
 *   stub(globalThis, "setTimeout");
 *   assertNotEquals(globalThis.setTimeout, setTimeout);
 * });
 *
 * await session();
 *
 * assertEquals(globalThis.setTimeout, setTimeout); // stub is restored
 * ```
 * @template Self The self type of the function.
 * @template Args The arguments type of the function.
 * @template Return The return type of the function.
 * @param func The function.
 * @return The return value of the function.
 */
const mockSessionAsync = _function_mockSessionAsync as typeof _function_mockSessionAsync
export { mockSessionAsync }

import { restore as _function_restore } from "jsr:@std/testing@1.0.2/mock"
/**
 * Restores all mocks registered in the current session that have not already been restored.
 * If an id is provided, it will restore all mocks registered in the session associed with that id that have not already been restored.
 *
 * @example Usage
 * ```ts
 * import { mockSession, restore, stub } from "@std/testing/mock";
 * import { assertEquals, assertNotEquals } from "@std/assert";
 *
 * const setTimeout = globalThis.setTimeout;
 *
 * stub(globalThis, "setTimeout");
 *
 * assertNotEquals(globalThis.setTimeout, setTimeout);
 *
 * restore();
 *
 * assertEquals(globalThis.setTimeout, setTimeout);
 * ```
 *
 * @param id The id of the session to restore. If not provided, all mocks registered in the current session are restored.
 */
const restore = _function_restore as typeof _function_restore
export { restore }

import type { ConstructorSpy as _interface_ConstructorSpy } from "jsr:@std/testing@1.0.2/mock"
/**
 * A constructor wrapper that records all calls made to it.
 */
interface ConstructorSpy<Self = any, Args extends unknown[] = any[]> extends _interface_ConstructorSpy<Self, Args> {}
export type { ConstructorSpy }

import type { GetParametersFromProp as _typeAlias_GetParametersFromProp } from "jsr:@std/testing@1.0.2/mock"
/**
 * Utility for extracting the arguments type from a property
 *
 * @internal
 */
type GetParametersFromProp<Self, Prop extends keyof Self> = _typeAlias_GetParametersFromProp<Self, Prop>
export type { GetParametersFromProp }

import type { GetReturnFromProp as _typeAlias_GetReturnFromProp } from "jsr:@std/testing@1.0.2/mock"
/**
 * Utility for extracting the return type from a property
 *
 * @internal
 */
type GetReturnFromProp<Self, Prop extends keyof Self> = _typeAlias_GetReturnFromProp<Self, Prop>
export type { GetReturnFromProp }

import type { SpyLike as _typeAlias_SpyLike } from "jsr:@std/testing@1.0.2/mock"
/**
 * SpyLink object type.
 */
type SpyLike<Self = any, Args extends unknown[] = any[], Return = any> = _typeAlias_SpyLike<Self, Args, Return>
export type { SpyLike }

import { spy as _function_spy } from "jsr:@std/testing@1.0.2/mock"
/** UNDOCUMENTED */
const spy = _function_spy as typeof _function_spy
export { spy }

import type { Stub as _interface_Stub } from "jsr:@std/testing@1.0.2/mock"
/**
 * An instance method replacement that records all calls made to it.
 */
interface Stub<Self = any, Args extends unknown[] = any[], Return = any> extends _interface_Stub<Self, Args, Return> {}
export type { Stub }

import { stub as _function_stub } from "jsr:@std/testing@1.0.2/mock"
/** UNDOCUMENTED */
const stub = _function_stub as typeof _function_stub
export { stub }

import { assertSpyCalls as _function_assertSpyCalls } from "jsr:@std/testing@1.0.2/mock"
/**
 * Asserts that a spy is called as much as expected and no more.
 *
 * @example Usage
 * ```ts
 * import { assertSpyCalls, spy } from "@std/testing/mock";
 *
 * const func = spy();
 *
 * func();
 * func();
 *
 * assertSpyCalls(func, 2);
 * ```
 *
 * @template Self The self type of the spy function.
 * @template Args The arguments type of the spy function.
 * @template Return The return type of the spy function.
 * @param spy The spy to check
 * @param expectedCalls The number of the expected calls.
 */
const assertSpyCalls = _function_assertSpyCalls as typeof _function_assertSpyCalls
export { assertSpyCalls }

import type { ExpectedSpyCall as _interface_ExpectedSpyCall } from "jsr:@std/testing@1.0.2/mock"
/**
 * Call information recorded by a spy.
 */
interface ExpectedSpyCall<Self = any, Args extends unknown[] = any[], Return = any> extends _interface_ExpectedSpyCall<Self, Args, Return> {}
export type { ExpectedSpyCall }

import { assertSpyCall as _function_assertSpyCall } from "jsr:@std/testing@1.0.2/mock"
/**
 * Asserts that a spy is called as expected.
 *
 * @example Usage
 * ```ts
 * import { assertSpyCall, spy } from "@std/testing/mock";
 *
 * const func = spy((a: number, b: number) => a + b);
 *
 * func(3, 4);
 * func(5, 6);
 *
 * // asserts each call made to the spy function.
 * assertSpyCall(func, 0, { args: [3, 4], returned: 7 });
 * assertSpyCall(func, 1, { args: [5, 6], returned: 11 });
 * ```
 *
 * @template Self The self type of the spy function.
 * @template Args The arguments type of the spy function.
 * @template Return The return type of the spy function.
 * @param spy The spy to check
 * @param callIndex The index of the call to check
 * @param expected The expected spy call.
 */
const assertSpyCall = _function_assertSpyCall as typeof _function_assertSpyCall
export { assertSpyCall }

import { assertSpyCallAsync as _function_assertSpyCallAsync } from "jsr:@std/testing@1.0.2/mock"
/**
 * Asserts that an async spy is called as expected.
 *
 * @example Usage
 * ```ts
 * import { assertSpyCallAsync, spy } from "@std/testing/mock";
 *
 * const func = spy((a: number, b: number) => new Promise((resolve) => {
 *   setTimeout(() => resolve(a + b), 100)
 * }));
 *
 * await func(3, 4);
 * await func(5, 6);
 *
 * // asserts each call made to the spy function.
 * await assertSpyCallAsync(func, 0, { args: [3, 4], returned: 7 });
 * await assertSpyCallAsync(func, 1, { args: [5, 6], returned: 11 });
 * ```
 *
 * @template Self The self type of the spy function.
 * @template Args The arguments type of the spy function.
 * @template Return The return type of the spy function.
 * @param spy The spy to check
 * @param callIndex The index of the call to check
 * @param expected The expected spy call.
 */
const assertSpyCallAsync = _function_assertSpyCallAsync as typeof _function_assertSpyCallAsync
export { assertSpyCallAsync }

import { assertSpyCallArg as _function_assertSpyCallArg } from "jsr:@std/testing@1.0.2/mock"
/**
 * Asserts that a spy is called with a specific arg as expected.
 *
 * @example Usage
 * ```ts
 * import { assertSpyCallArg, spy } from "@std/testing/mock";
 *
 * const func = spy((a: number, b: number) => a + b);
 *
 * func(3, 4);
 * func(5, 6);
 *
 * // asserts each call made to the spy function.
 * assertSpyCallArg(func, 0, 0, 3);
 * assertSpyCallArg(func, 0, 1, 4);
 * assertSpyCallArg(func, 1, 0, 5);
 * assertSpyCallArg(func, 1, 1, 6);
 * ```
 *
 * @template Self The self type of the spy function.
 * @template Args The arguments type of the spy function.
 * @template Return The return type of the spy function.
 * @template ExpectedArg The expected type of the argument for the spy to be called.
 * @param spy The spy to check.
 * @param callIndex The index of the call to check.
 * @param argIndex The index of the arguments to check.
 * @param expected The expected argument.
 * @return The actual argument.
 */
const assertSpyCallArg = _function_assertSpyCallArg as typeof _function_assertSpyCallArg
export { assertSpyCallArg }

import { assertSpyCallArgs as _function_assertSpyCallArgs } from "jsr:@std/testing@1.0.2/mock"
/** UNDOCUMENTED */
const assertSpyCallArgs = _function_assertSpyCallArgs as typeof _function_assertSpyCallArgs
export { assertSpyCallArgs }

import { returnsThis as _function_returnsThis } from "jsr:@std/testing@1.0.2/mock"
/**
 * Creates a function that returns the instance the method was called on.
 *
 * @example Usage
 * ```ts
 * import { returnsThis } from "@std/testing/mock";
 * import { assertEquals } from "@std/assert";
 *
 * const func = returnsThis();
 * const obj = { func };
 * assertEquals(obj.func(), obj);
 * ```
 *
 * @template Self The self type of the returned function.
 * @template Args The arguments type of the returned function.
 * @return A function that returns the instance the method was called on.
 */
const returnsThis = _function_returnsThis as typeof _function_returnsThis
export { returnsThis }

import { returnsArg as _function_returnsArg } from "jsr:@std/testing@1.0.2/mock"
/**
 * Creates a function that returns one of its arguments.
 *
 * @example Usage
 * ```ts
 * import { returnsArg } from "@std/testing/mock";
 * import { assertEquals } from "@std/assert";
 *
 * const func = returnsArg(1);
 * assertEquals(func(1, 2, 3), 2);
 * ```
 *
 * @template Arg The type of returned argument.
 * @template Self The self type of the returned function.
 * @param idx The index of the arguments to use.
 * @return A function that returns one of its arguments.
 */
const returnsArg = _function_returnsArg as typeof _function_returnsArg
export { returnsArg }

import { returnsArgs as _function_returnsArgs } from "jsr:@std/testing@1.0.2/mock"
/**
 * Creates a function that returns its arguments or a subset of them. If end is specified, it will return arguments up to but not including the end.
 *
 * @example Usage
 * ```ts
 * import { returnsArgs } from "@std/testing/mock";
 * import { assertEquals } from "@std/assert";
 *
 * const func = returnsArgs();
 * assertEquals(func(1, 2, 3), [1, 2, 3]);
 * ```
 *
 * @template Args The arguments type of the returned function
 * @template Self The self type of the returned function
 * @param start The start index of the arguments to return. Default is 0.
 * @param end The end index of the arguments to return.
 * @return A function that returns its arguments or a subset of them.
 */
const returnsArgs = _function_returnsArgs as typeof _function_returnsArgs
export { returnsArgs }

import { returnsNext as _function_returnsNext } from "jsr:@std/testing@1.0.2/mock"
/**
 * Creates a function that returns the iterable values. Any iterable values that are errors will be thrown.
 *
 * @example Usage
 * ```ts
 * import { returnsNext } from "@std/testing/mock";
 * import { assertEquals, assertThrows } from "@std/assert";
 *
 * const func = returnsNext([1, 2, new Error("foo"), 3]);
 * assertEquals(func(), 1);
 * assertEquals(func(), 2);
 * assertThrows(() => func(), Error, "foo");
 * assertEquals(func(), 3);
 * ```
 *
 * @template Return The type of each item of the iterable
 * @template Self The self type of the returned function
 * @template Args The arguments type of the returned function
 * @param values The iterable values
 * @return A function that returns the iterable values
 */
const returnsNext = _function_returnsNext as typeof _function_returnsNext
export { returnsNext }

import { resolvesNext as _function_resolvesNext } from "jsr:@std/testing@1.0.2/mock"
/**
 * Creates a function that resolves the awaited iterable values. Any awaited iterable values that are errors will be thrown.
 *
 * @example Usage
 * ```ts
 * import { resolvesNext } from "@std/testing/mock";
 * import { assertEquals, assertRejects } from "@std/assert";
 *
 * const func = resolvesNext([1, 2, new Error("foo"), 3]);
 * assertEquals(await func(), 1);
 * assertEquals(await func(), 2);
 * assertRejects(() => func(), Error, "foo");
 * assertEquals(await func(), 3);
 * ```
 *
 * @template Return The type of each item of the iterable
 * @template Self The self type of the returned function
 * @template Args The type of arguments of the returned function
 * @param iterable The iterable to use
 * @return A function that resolves the awaited iterable values
 */
const resolvesNext = _function_resolvesNext as typeof _function_resolvesNext
export { resolvesNext }
