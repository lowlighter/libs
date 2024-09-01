import type { DescribeDefinition as _interface_DescribeDefinition } from "jsr:@std/testing@1.0.1/bdd"
/**
 * The options for creating a test suite with the describe function.
 */
interface DescribeDefinition<T> extends _interface_DescribeDefinition<T> {}
export type { DescribeDefinition }

import type { ItDefinition as _interface_ItDefinition } from "jsr:@std/testing@1.0.1/bdd"
/**
 * The options for creating an individual test case with the it function.
 */
interface ItDefinition<T> extends _interface_ItDefinition<T> {}
export type { ItDefinition }

import type { TestSuite as _interface_TestSuite } from "jsr:@std/testing@1.0.1/bdd"
/**
 * A group of tests.
 */
interface TestSuite<T> extends _interface_TestSuite<T> {}
export type { TestSuite }

import type { ItArgs as _typeAlias_ItArgs } from "jsr:@std/testing@1.0.1/bdd"
/**
 * The arguments for an ItFunction.
 */
type ItArgs<T> = _typeAlias_ItArgs<T>
export type { ItArgs }

import { it as _namespace_it } from "jsr:@std/testing@1.0.1/bdd"
/**
 * Additional properties on the `it` function.
 */
const it = _namespace_it as typeof _namespace_it
export { it }

import { test as _function_test } from "jsr:@std/testing@1.0.1/bdd"
/**
 * Alias of {@linkcode it}
 *
 * Registers an individual test case.
 *
 * @example Usage
 * ```ts
 * import { test } from "@std/testing/bdd";
 * import { assertEquals } from "@std/assert";
 *
 * test("a test case", () => {
 *   // test case
 *   assertEquals(2 + 2, 4);
 * });
 * ```
 *
 * @template T The self type of the function to implement the test case
 * @param args The test case
 */
const test = _function_test as typeof _function_test
export { test }

import { beforeAll as _function_beforeAll } from "jsr:@std/testing@1.0.1/bdd"
/**
 * Run some shared setup before all of the tests in the suite.
 *
 * @example Usage
 * ```ts
 * import { describe, it, beforeAll } from "@std/testing/bdd";
 * import { assertEquals } from "@std/assert";
 *
 * beforeAll(() => {
 *  console.log("beforeAll");
 * });
 *
 * describe("example", () => {
 *   it("should pass", () => {
 *     // test case
 *     assertEquals(2 + 2, 4);
 *   });
 * });
 * ```
 *
 * @template T The self type of the function
 * @param fn The function to implement the setup behavior.
 */
const beforeAll = _function_beforeAll as typeof _function_beforeAll
export { beforeAll }

import { before as _function_before } from "jsr:@std/testing@1.0.1/bdd"
/**
 * Alias of {@linkcode beforeAll}
 *
 * Run some shared setup before all of the tests in the suite.
 *
 * @example Usage
 * ```ts
 * import { describe, it, before } from "@std/testing/bdd";
 * import { assertEquals } from "@std/assert";
 *
 * before(() => {
 *  console.log("before");
 * });
 *
 * describe("example", () => {
 *   it("should pass", () => {
 *     // test case
 *     assertEquals(2 + 2, 4);
 *   });
 * });
 * ```
 *
 * @template T The self type of the function
 * @param fn The function to implement the setup behavior.
 */
const before = _function_before as typeof _function_before
export { before }

import { afterAll as _function_afterAll } from "jsr:@std/testing@1.0.1/bdd"
/**
 * Run some shared teardown after all of the tests in the suite.
 *
 * @example Usage
 * ```ts
 * import { describe, it, afterAll } from "@std/testing/bdd";
 * import { assertEquals } from "@std/assert";
 *
 * afterAll(() => {
 *  console.log("afterAll");
 * });
 *
 * describe("example", () => {
 *   it("should pass", () => {
 *     // test case
 *     assertEquals(2 + 2, 4);
 *   });
 * });
 * ```
 *
 * @template T The self type of the function
 * @param fn The function to implement the teardown behavior.
 */
const afterAll = _function_afterAll as typeof _function_afterAll
export { afterAll }

import { after as _function_after } from "jsr:@std/testing@1.0.1/bdd"
/**
 * Alias of {@linkcode afterAll}.
 *
 * Run some shared teardown after all of the tests in the suite.
 *
 * @example Usage
 * ```ts
 * import { describe, it, after } from "@std/testing/bdd";
 * import { assertEquals } from "@std/assert";
 *
 * after(() => {
 *  console.log("after");
 * });
 *
 * describe("example", () => {
 *   it("should pass", () => {
 *     // test case
 *     assertEquals(2 + 2, 4);
 *   });
 * });
 * ```
 *
 * @template T The self type of the function
 * @param fn The function to implement the teardown behavior.
 */
const after = _function_after as typeof _function_after
export { after }

import { beforeEach as _function_beforeEach } from "jsr:@std/testing@1.0.1/bdd"
/**
 * Run some shared setup before each test in the suite.
 *
 * @example Usage
 * ```ts
 * import { describe, it, beforeEach } from "@std/testing/bdd";
 * import { assertEquals } from "@std/assert";
 *
 * beforeEach(() => {
 *  console.log("beforeEach");
 * });
 *
 * describe("example", () => {
 *   it("should pass", () => {
 *     // test case
 *     assertEquals(2 + 2, 4);
 *   });
 * });
 * ```
 *
 * @template T The self type of the function
 * @param fn The function to implement the shared setup behavior
 */
const beforeEach = _function_beforeEach as typeof _function_beforeEach
export { beforeEach }

import { afterEach as _function_afterEach } from "jsr:@std/testing@1.0.1/bdd"
/**
 * Run some shared teardown after each test in the suite.
 *
 * @example Usage
 * ```ts
 * import { describe, it, afterEach } from "@std/testing/bdd";
 * import { assertEquals } from "@std/assert";
 *
 * afterEach(() => {
 *  console.log("afterEach");
 * });
 *
 * describe("example", () => {
 *   it("should pass", () => {
 *     // test case
 *     assertEquals(2 + 2, 4);
 *   });
 * });
 * ```
 *
 * @template T The self type of the function
 * @param fn The function to implement the shared teardown behavior
 */
const afterEach = _function_afterEach as typeof _function_afterEach
export { afterEach }

import type { DescribeArgs as _typeAlias_DescribeArgs } from "jsr:@std/testing@1.0.1/bdd"
/**
 * The arguments for a DescribeFunction.
 */
type DescribeArgs<T> = _typeAlias_DescribeArgs<T>
export type { DescribeArgs }

import { describe as _namespace_describe } from "jsr:@std/testing@1.0.1/bdd"
/**
 * Additional properties on the `describe` function.
 */
const describe = _namespace_describe as typeof _namespace_describe
export { describe }
