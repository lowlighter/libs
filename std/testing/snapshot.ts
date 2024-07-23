import type { SnapshotMode as _typeAlias_SnapshotMode } from "jsr:@std/testing@0.225.3/snapshot"
/**
 * The mode of snapshot testing.
 */
type SnapshotMode = _typeAlias_SnapshotMode
export type { SnapshotMode }

import type { SnapshotOptions as _typeAlias_SnapshotOptions } from "jsr:@std/testing@0.225.3/snapshot"
/**
 * The options for {@linkcode assertSnapshot}.
 */
type SnapshotOptions<T = unknown> = _typeAlias_SnapshotOptions<T>
export type { SnapshotOptions }

import { serialize as _function_serialize } from "jsr:@std/testing@0.225.3/snapshot"
/**
 * Default serializer for `assertSnapshot`.
 *
 * @example Usage
 * ```ts
 * import { serialize } from "@std/testing/snapshot";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * assertEquals(serialize({ foo: 42 }), "{\n  foo: 42,\n}")
 * ```
 *
 * @param actual The value to serialize
 * @return The serialized string
 */
const serialize = _function_serialize
export { serialize }

import { assertSnapshot as _function_assertSnapshot } from "jsr:@std/testing@0.225.3/snapshot"
/** UNDOCUMENTED */
const assertSnapshot = _function_assertSnapshot
export { assertSnapshot }

import { createAssertSnapshot as _function_createAssertSnapshot } from "jsr:@std/testing@0.225.3/snapshot"
/**
 * Create {@linkcode assertSnapshot} function with the given options.
 *
 * The specified option becomes the default for returned {@linkcode assertSnapshot}
 *
 * @example Usage
 * ```ts
 * import { createAssertSnapshot } from "@std/testing/snapshot";
 *
 * const assertSnapshot = createAssertSnapshot({
 *   // Uses the custom directory for saving snapshot files.
 *   dir: "my_snapshot_dir",
 * });
 *
 * Deno.test("a snapshot test case", async (t) => {
 *   await assertSnapshot(t, {
 *     foo: "Hello",
 *     bar: "World",
 *   });
 * })
 * ```
 *
 * @template T The type of the snapshot
 * @param options The options
 * @param baseAssertSnapshot {@linkcode assertSnapshot} function implementation. Default to the original {@linkcode assertSnapshot}
 * @return function with the given default options.
 */
const createAssertSnapshot = _function_createAssertSnapshot
export { createAssertSnapshot }
