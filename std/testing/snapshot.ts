/**
 * A snapshotting library.
 *
 * The `assertSnapshot` function will create a snapshot of a value and compare it
 * to a reference snapshot, which is stored alongside the test file in the
 * `__snapshots__` directory.
 *
 * ```ts
 * // example_test.ts
 * import { assertSnapshot } from "@std/testing/snapshot";
 *
 * Deno.test("isSnapshotMatch", async function (t): Promise<void> {
 *   const a = {
 *     hello: "world!",
 *     example: 123,
 *   };
 *   await assertSnapshot(t, a);
 * });
 * ```
 *
 * ```ts no-assert
 * // __snapshots__/example_test.ts.snap
 * export const snapshot: Record<string, string> = {};
 *
 * snapshot["isSnapshotMatch 1"] = `
 * {
 *   example: 123,
 *   hello: "world!",
 * }
 * `;
 * ```
 *
 * Calling `assertSnapshot` in a test will throw an `AssertionError`, causing the
 * test to fail, if the snapshot created during the test does not match the one in
 * the snapshot file.
 *
 * ## Updating Snapshots:
 *
 * When adding new snapshot assertions to your test suite, or when intentionally
 * making changes which cause your snapshots to fail, you can update your snapshots
 * by running the snapshot tests in update mode. Tests can be run in update mode by
 * passing the `--update` or `-u` flag as an argument when running the test. When
 * this flag is passed, then any snapshots which do not match will be updated.
 *
 * ```sh
 * deno test --allow-all -- --update
 * ```
 *
 * Additionally, new snapshots will only be created when this flag is present.
 *
 * ## Permissions:
 *
 * When running snapshot tests, the `--allow-read` permission must be enabled, or
 * else any calls to `assertSnapshot` will fail due to insufficient permissions.
 * Additionally, when updating snapshots, the `--allow-write` permission must also
 * be enabled, as this is required in order to update snapshot files.
 *
 * The `assertSnapshot` function will only attempt to read from and write to
 * snapshot files. As such, the allow list for `--allow-read` and `--allow-write`
 * can be limited to only include existing snapshot files, if so desired.
 *
 * ## Options:
 *
 * The `assertSnapshot` function optionally accepts an options object.
 *
 * ```ts
 * // example_test.ts
 * import { assertSnapshot } from "@std/testing/snapshot";
 *
 * Deno.test("isSnapshotMatch", async function (t): Promise<void> {
 *   const a = {
 *     hello: "world!",
 *     example: 123,
 *   };
 *   await assertSnapshot(t, a, {
 *     // options
 *   });
 * });
 * ```
 *
 * You can also configure default options for `assertSnapshot`.
 *
 * ```ts
 * // example_test.ts
 * import { createAssertSnapshot } from "@std/testing/snapshot";
 *
 * const assertSnapshot = createAssertSnapshot({
 *   // options
 * });
 * ```
 *
 * When configuring default options like this, the resulting `assertSnapshot`
 * function will function the same as the default function exported from the
 * snapshot module. If passed an optional options object, this will take precedence
 * over the default options, where the value provided for an option differs.
 *
 * It is possible to "extend" an `assertSnapshot` function which has been
 * configured with default options.
 *
 * ```ts
 * // example_test.ts
 * import { createAssertSnapshot } from "@std/testing/snapshot";
 * import { stripAnsiCode } from "@std/fmt/colors";
 *
 * const assertSnapshot = createAssertSnapshot({
 *   dir: ".snaps",
 * });
 *
 * const assertMonochromeSnapshot = createAssertSnapshot<string>(
 *   { serializer: stripAnsiCode },
 *   assertSnapshot,
 * );
 *
 * Deno.test("isSnapshotMatch", async function (t): Promise<void> {
 *   const a = "\x1b[32mThis green text has had its colors stripped\x1b[39m";
 *   await assertMonochromeSnapshot(t, a);
 * });
 * ```
 *
 * ```ts no-assert
 * // .snaps/example_test.ts.snap
 * export const snapshot: Record<string, string> = {};
 *
 * snapshot["isSnapshotMatch 1"] = "This green text has had its colors stripped";
 * ```
 *
 * ## Version Control:
 *
 * Snapshot testing works best when changes to snapshot files are committed
 * alongside other code changes. This allows for changes to reference snapshots to
 * be reviewed along side the code changes that caused them, and ensures that when
 * others pull your changes, their tests will pass without needing to update
 * snapshots locally.
 *
 * @module
 */
import type { SnapshotMode as _typeAlias_SnapshotMode } from "jsr:@std/testing@1.0.3/snapshot"
/**
 * The mode of snapshot testing.
 */
type SnapshotMode = _typeAlias_SnapshotMode
export type { SnapshotMode }

import type { SnapshotOptions as _typeAlias_SnapshotOptions } from "jsr:@std/testing@1.0.3/snapshot"
/**
 * The options for {@linkcode assertSnapshot}.
 */
type SnapshotOptions<T = unknown> = _typeAlias_SnapshotOptions<T>
export type { SnapshotOptions }

import { serialize as _function_serialize } from "jsr:@std/testing@1.0.3/snapshot"
/**
 * Default serializer for `assertSnapshot`.
 *
 * @example Usage
 * ```ts
 * import { serialize } from "@std/testing/snapshot";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(serialize({ foo: 42 }), "{\n  foo: 42,\n}")
 * ```
 *
 * @param actual The value to serialize
 * @return The serialized string
 */
const serialize = _function_serialize as typeof _function_serialize
export { serialize }

import { assertSnapshot as _function_assertSnapshot } from "jsr:@std/testing@1.0.3/snapshot"
/** UNDOCUMENTED */
const assertSnapshot = _function_assertSnapshot as typeof _function_assertSnapshot
export { assertSnapshot }

import { createAssertSnapshot as _function_createAssertSnapshot } from "jsr:@std/testing@1.0.3/snapshot"
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
const createAssertSnapshot = _function_createAssertSnapshot as typeof _function_createAssertSnapshot
export { createAssertSnapshot }
