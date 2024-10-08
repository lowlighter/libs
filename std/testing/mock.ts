/**
 * A mocking and spying library.
 *
 * Test spies are function stand-ins that are used to assert if a function's
 * internal behavior matches expectations. Test spies on methods keep the original
 * behavior but allow you to test how the method is called and what it returns.
 * Test stubs are an extension of test spies that also replaces the original
 * methods behavior.
 *
 * ## Spying
 *
 * Say we have two functions, `square` and `multiply`, if we want to assert that
 * the `multiply` function is called during execution of the `square` function we
 * need a way to spy on the `multiply` function. There are a few ways to achieve
 * this with Spies, one is to have the `square` function take the `multiply`
 * multiply as a parameter.
 *
 * This way, we can call `square(multiply, value)` in the application code or wrap
 * a spy function around the `multiply` function and call
 * `square(multiplySpy, value)` in the testing code.
 *
 * ```ts
 * import {
 *   assertSpyCall,
 *   assertSpyCalls,
 *   spy,
 * } from "@std/testing/mock";
 * import { assertEquals } from "@std/assert";
 *
 * function multiply(a: number, b: number): number {
 *   return a * b;
 * }
 *
 * function square(
 *   multiplyFn: (a: number, b: number) => number,
 *   value: number,
 * ): number {
 *   return multiplyFn(value, value);
 * }
 *
 * Deno.test("square calls multiply and returns results", () => {
 *   const multiplySpy = spy(multiply);
 *
 *   assertEquals(square(multiplySpy, 5), 25);
 *
 *   // asserts that multiplySpy was called at least once and details about the first call.
 *   assertSpyCall(multiplySpy, 0, {
 *     args: [5, 5],
 *     returned: 25,
 *   });
 *
 *   // asserts that multiplySpy was only called once.
 *   assertSpyCalls(multiplySpy, 1);
 * });
 * ```
 *
 * If you prefer not adding additional parameters for testing purposes only, you
 * can use spy to wrap a method on an object instead. In the following example, the
 * exported `_internals` object has the `multiply` function we want to call as a
 * method and the `square` function calls `_internals.multiply` instead of
 * `multiply`.
 *
 * This way, we can call `square(value)` in both the application code and testing
 * code. Then spy on the `multiply` method on the `_internals` object in the
 * testing code to be able to spy on how the `square` function calls the `multiply`
 * function.
 *
 * ```ts
 * import {
 *   assertSpyCall,
 *   assertSpyCalls,
 *   spy,
 * } from "@std/testing/mock";
 * import { assertEquals } from "@std/assert";
 *
 * function multiply(a: number, b: number): number {
 *   return a * b;
 * }
 *
 * function square(value: number): number {
 *   return _internals.multiply(value, value);
 * }
 *
 * const _internals = { multiply };
 *
 * Deno.test("square calls multiply and returns results", () => {
 *   const multiplySpy = spy(_internals, "multiply");
 *
 *   try {
 *     assertEquals(square(5), 25);
 *   } finally {
 *     // unwraps the multiply method on the _internals object
 *     multiplySpy.restore();
 *   }
 *
 *   // asserts that multiplySpy was called at least once and details about the first call.
 *   assertSpyCall(multiplySpy, 0, {
 *     args: [5, 5],
 *     returned: 25,
 *   });
 *
 *   // asserts that multiplySpy was only called once.
 *   assertSpyCalls(multiplySpy, 1);
 * });
 * ```
 *
 * One difference you may have noticed between these two examples is that in the
 * second we call the `restore` method on `multiplySpy` function. That is needed to
 * remove the spy wrapper from the `_internals` object's `multiply` method. The
 * `restore` method is called in a finally block to ensure that it is restored
 * whether or not the assertion in the try block is successful. The `restore`
 * method didn't need to be called in the first example because the `multiply`
 * function was not modified in any way like the `_internals` object was in the
 * second example.
 *
 * Method spys are disposable, meaning that you can have them automatically restore
 * themselves with the `using` keyword. Using this approach is cleaner because you
 * do not need to wrap your assertions in a try statement to ensure you restore the
 * methods before the tests finish.
 *
 * ```ts
 * import {
 *   assertSpyCall,
 *   assertSpyCalls,
 *   spy,
 * } from "@std/testing/mock";
 * import { assertEquals } from "@std/assert";
 *
 * function multiply(a: number, b: number): number {
 *   return a * b;
 * }
 *
 * function square(value: number): number {
 *   return _internals.multiply(value, value);
 * }
 *
 * const _internals = { multiply };
 *
 * Deno.test("square calls multiply and returns results", () => {
 *   using multiplySpy = spy(_internals, "multiply");
 *
 *   assertEquals(square(5), 25);
 *
 *   // asserts that multiplySpy was called at least once and details about the first call.
 *   assertSpyCall(multiplySpy, 0, {
 *     args: [5, 5],
 *     returned: 25,
 *   });
 *
 *   // asserts that multiplySpy was only called once.
 *   assertSpyCalls(multiplySpy, 1);
 * });
 * ```
 *
 * ## Stubbing
 *
 * Say we have two functions, `randomMultiple` and `randomInt`, if we want to
 * assert that `randomInt` is called during execution of `randomMultiple` we need a
 * way to spy on the `randomInt` function. That could be done with either of the
 * spying techniques previously mentioned. To be able to verify that the
 * `randomMultiple` function returns the value we expect it to for what `randomInt`
 * returns, the easiest way would be to replace the `randomInt` function's behavior
 * with more predictable behavior.
 *
 * You could use the first spying technique to do that but that would require
 * adding a `randomInt` parameter to the `randomMultiple` function.
 *
 * You could also use the second spying technique to do that, but your assertions
 * would not be as predictable due to the `randomInt` function returning random
 * values.
 *
 * Say we want to verify it returns correct values for both negative and positive
 * random integers. We could easily do that with stubbing. The below example is
 * similar to the second spying technique example but instead of passing the call
 * through to the original `randomInt` function, we are going to replace
 * `randomInt` with a function that returns pre-defined values.
 *
 * The mock module includes some helper functions to make creating common stubs
 * easy. The `returnsNext` function takes an array of values we want it to return
 * on consecutive calls.
 *
 * ```ts
 * import {
 *   assertSpyCall,
 *   assertSpyCalls,
 *   returnsNext,
 *   stub,
 * } from "@std/testing/mock";
 * import { assertEquals } from "@std/assert";
 *
 * function randomInt(lowerBound: number, upperBound: number): number {
 *   return lowerBound + Math.floor(Math.random() * (upperBound - lowerBound));
 * }
 *
 * function randomMultiple(value: number): number {
 *   return value * _internals.randomInt(-10, 10);
 * }
 *
 * const _internals = { randomInt };
 *
 * Deno.test("randomMultiple uses randomInt to generate random multiples between -10 and 10 times the value", () => {
 *   const randomIntStub = stub(_internals, "randomInt", returnsNext([-3, 3]));
 *
 *   try {
 *     assertEquals(randomMultiple(5), -15);
 *     assertEquals(randomMultiple(5), 15);
 *   } finally {
 *     // unwraps the randomInt method on the _internals object
 *     randomIntStub.restore();
 *   }
 *
 *   // asserts that randomIntStub was called at least once and details about the first call.
 *   assertSpyCall(randomIntStub, 0, {
 *     args: [-10, 10],
 *     returned: -3,
 *   });
 *   // asserts that randomIntStub was called at least twice and details about the second call.
 *   assertSpyCall(randomIntStub, 1, {
 *     args: [-10, 10],
 *     returned: 3,
 *   });
 *
 *   // asserts that randomIntStub was only called twice.
 *   assertSpyCalls(randomIntStub, 2);
 * });
 * ```
 *
 * Like method spys, stubs are disposable, meaning that you can have them automatically
 * restore themselves with the `using` keyword. Using this approach is cleaner because
 * you do not need to wrap your assertions in a try statement to ensure you restore the
 * methods before the tests finish.
 *
 * ```ts
 * import {
 *   assertSpyCall,
 *   assertSpyCalls,
 *   returnsNext,
 *   stub,
 * } from "@std/testing/mock";
 * import { assertEquals } from "@std/assert";
 *
 * function randomInt(lowerBound: number, upperBound: number): number {
 *   return lowerBound + Math.floor(Math.random() * (upperBound - lowerBound));
 * }
 *
 * function randomMultiple(value: number): number {
 *   return value * _internals.randomInt(-10, 10);
 * }
 *
 * const _internals = { randomInt };
 *
 * Deno.test("randomMultiple uses randomInt to generate random multiples between -10 and 10 times the value", () => {
 *   using randomIntStub = stub(_internals, "randomInt", returnsNext([-3, 3]));
 *
 *   assertEquals(randomMultiple(5), -15);
 *   assertEquals(randomMultiple(5), 15);
 *
 *   // asserts that randomIntStub was called at least once and details about the first call.
 *   assertSpyCall(randomIntStub, 0, {
 *     args: [-10, 10],
 *     returned: -3,
 *   });
 *   // asserts that randomIntStub was called at least twice and details about the second call.
 *   assertSpyCall(randomIntStub, 1, {
 *     args: [-10, 10],
 *     returned: 3,
 *   });
 *
 *   // asserts that randomIntStub was only called twice.
 *   assertSpyCalls(randomIntStub, 2);
 * });
 * ```
 *
 * ## Faking time
 *
 * Say we have a function that has time based behavior that we would like to test.
 * With real time, that could cause tests to take much longer than they should. If
 * you fake time, you could simulate how your function would behave over time
 * starting from any point in time. Below is an example where we want to test that
 * the callback is called every second.
 *
 * With `FakeTime` we can do that. When the `FakeTime` instance is created, it
 * splits from real time. The `Date`, `setTimeout`, `clearTimeout`, `setInterval`
 * and `clearInterval` globals are replaced with versions that use the fake time
 * until real time is restored. You can control how time ticks forward with the
 * `tick` method on the `FakeTime` instance.
 *
 * ```ts
 * import {
 *   assertSpyCalls,
 *   spy,
 * } from "@std/testing/mock";
 * import { FakeTime } from "@std/testing/time";
 *
 * function secondInterval(cb: () => void): number {
 *   return setInterval(cb, 1000);
 * }
 *
 * Deno.test("secondInterval calls callback every second and stops after being cleared", () => {
 *   using time = new FakeTime();
 *
 *   const cb = spy();
 *   const intervalId = secondInterval(cb);
 *   assertSpyCalls(cb, 0);
 *   time.tick(500);
 *   assertSpyCalls(cb, 0);
 *   time.tick(500);
 *   assertSpyCalls(cb, 1);
 *   time.tick(3500);
 *   assertSpyCalls(cb, 4);
 *
 *   clearInterval(intervalId);
 *   time.tick(1000);
 *   assertSpyCalls(cb, 4);
 * });
 * ```
 *
 * @module
 */
import { MockError as _class_MockError } from "jsr:@std/testing@1.0.3/mock"
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

import type { SpyCall as _interface_SpyCall } from "jsr:@std/testing@1.0.3/mock"
/**
 * Call information recorded by a spy.
 */
interface SpyCall<Self = any, Args extends unknown[] = any[], Return = any> extends _interface_SpyCall<Self, Args, Return> {}
export type { SpyCall }

import type { Spy as _interface_Spy } from "jsr:@std/testing@1.0.3/mock"
/**
 * A function or instance method wrapper that records all calls made to it.
 */
interface Spy<Self = any, Args extends unknown[] = any[], Return = any> extends _interface_Spy<Self, Args, Return> {}
export type { Spy }

import type { MethodSpy as _interface_MethodSpy } from "jsr:@std/testing@1.0.3/mock"
/**
 * An instance method wrapper that records all calls made to it.
 */
interface MethodSpy<Self = any, Args extends unknown[] = any[], Return = any> extends _interface_MethodSpy<Self, Args, Return> {}
export type { MethodSpy }

import { mockSession as _function_mockSession } from "jsr:@std/testing@1.0.3/mock"
/** UNDOCUMENTED */
const mockSession = _function_mockSession as typeof _function_mockSession
export { mockSession }

import { mockSessionAsync as _function_mockSessionAsync } from "jsr:@std/testing@1.0.3/mock"
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

import { restore as _function_restore } from "jsr:@std/testing@1.0.3/mock"
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

import type { ConstructorSpy as _interface_ConstructorSpy } from "jsr:@std/testing@1.0.3/mock"
/**
 * A constructor wrapper that records all calls made to it.
 */
interface ConstructorSpy<Self = any, Args extends unknown[] = any[]> extends _interface_ConstructorSpy<Self, Args> {}
export type { ConstructorSpy }

import type { GetParametersFromProp as _typeAlias_GetParametersFromProp } from "jsr:@std/testing@1.0.3/mock"
/**
 * Utility for extracting the arguments type from a property
 *
 * @internal
 */
type GetParametersFromProp<Self, Prop extends keyof Self> = _typeAlias_GetParametersFromProp<Self, Prop>
export type { GetParametersFromProp }

import type { GetReturnFromProp as _typeAlias_GetReturnFromProp } from "jsr:@std/testing@1.0.3/mock"
/**
 * Utility for extracting the return type from a property
 *
 * @internal
 */
type GetReturnFromProp<Self, Prop extends keyof Self> = _typeAlias_GetReturnFromProp<Self, Prop>
export type { GetReturnFromProp }

import type { SpyLike as _typeAlias_SpyLike } from "jsr:@std/testing@1.0.3/mock"
/**
 * SpyLink object type.
 */
type SpyLike<Self = any, Args extends unknown[] = any[], Return = any> = _typeAlias_SpyLike<Self, Args, Return>
export type { SpyLike }

import { spy as _function_spy } from "jsr:@std/testing@1.0.3/mock"
/** UNDOCUMENTED */
const spy = _function_spy as typeof _function_spy
export { spy }

import type { Stub as _interface_Stub } from "jsr:@std/testing@1.0.3/mock"
/**
 * An instance method replacement that records all calls made to it.
 */
interface Stub<Self = any, Args extends unknown[] = any[], Return = any> extends _interface_Stub<Self, Args, Return> {}
export type { Stub }

import { stub as _function_stub } from "jsr:@std/testing@1.0.3/mock"
/** UNDOCUMENTED */
const stub = _function_stub as typeof _function_stub
export { stub }

import { assertSpyCalls as _function_assertSpyCalls } from "jsr:@std/testing@1.0.3/mock"
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

import type { ExpectedSpyCall as _interface_ExpectedSpyCall } from "jsr:@std/testing@1.0.3/mock"
/**
 * Call information recorded by a spy.
 */
interface ExpectedSpyCall<Self = any, Args extends unknown[] = any[], Return = any> extends _interface_ExpectedSpyCall<Self, Args, Return> {}
export type { ExpectedSpyCall }

import { assertSpyCall as _function_assertSpyCall } from "jsr:@std/testing@1.0.3/mock"
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

import { assertSpyCallAsync as _function_assertSpyCallAsync } from "jsr:@std/testing@1.0.3/mock"
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

import { assertSpyCallArg as _function_assertSpyCallArg } from "jsr:@std/testing@1.0.3/mock"
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

import { assertSpyCallArgs as _function_assertSpyCallArgs } from "jsr:@std/testing@1.0.3/mock"
/** UNDOCUMENTED */
const assertSpyCallArgs = _function_assertSpyCallArgs as typeof _function_assertSpyCallArgs
export { assertSpyCallArgs }

import { returnsThis as _function_returnsThis } from "jsr:@std/testing@1.0.3/mock"
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

import { returnsArg as _function_returnsArg } from "jsr:@std/testing@1.0.3/mock"
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

import { returnsArgs as _function_returnsArgs } from "jsr:@std/testing@1.0.3/mock"
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

import { returnsNext as _function_returnsNext } from "jsr:@std/testing@1.0.3/mock"
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

import { resolvesNext as _function_resolvesNext } from "jsr:@std/testing@1.0.3/mock"
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
