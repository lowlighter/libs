/**
 * Cross-platform testing for Deno, Node.js and Bun runtimes.
 * @module
 */
// Imports
import type { runner } from "./_testing/common.ts"
import { runtime } from "./runtime.ts"
import { test as noop } from "./_testing/noop.ts"
export type * from "./_testing/common.ts"

/** Alias for `any` that can be used for testing. */
//deno-lint-ignore no-explicit-any
export type testing = any

/** TestingError can be used to test expected error behaviours in tests. */
export class TestingError extends Error {}

/** Throws back an error (can be used where statements are not allowed in syntax). */
export function throws(error: Error | string): never {
  if (typeof error === "string") {
    error = new TestingError(error)
  }
  throw error
}

/**
 * A test runner for current runtime.
 *
 * Use the following commands to run your tests:
 * - `deno`: `deno test`
 * - `bun`: `bun test`
 * - `node`: `npx tsx --test`
 *
 * > [!WARNING]
 * > Depencies must be installed prior to running tests.
 *
 * > [!NOTE]
 * > On Deno runtime, the default permissions are set to `none` rather than `"inherit"` (they can still be set using the {@link options} parameter).
 *
 * ```ts
 * import { test, expect, runtime } from "./mod.ts"
 *
 * // Run tests on specified runtimes
 * test("test name", () => expect(true))
 * if (runtime === "node") {
 *   test("test name", () => expect(true))
 * }
 *
 * // Using custom permissions
 * test("test name", () => expect(globalThis.Deno).toBeDefined(), { permissions: "inherit" })
 *
 * // Using custom environment variables (requires `--allow-env` permissions)
 * test("test name", () => expect(globalThis.Deno.env.get("MY_ENV")).toBe("value"), { env: { MY_ENV: "value" } })
 * ```
 *
 * ```ts
 * import { test, expect } from "./mod.ts"
 *
 * // `skip` and `only` can be used to respectively ignore or restrict a test run to specific cases
 * test.skip("test name", () => null)
 *
 * // `todo` can be used to mark a test as a work in progress
 * test.todo("test name", () => null)
 * ```
 */
let test = noop as runner
switch (runtime) {
  case "deno":
    ;({ test } = await import("./_testing/deno.ts"))
    break
  case "bun":
    ;({ test } = await import("./_testing/bun.ts"))
    break
  case "node":
    ;({ test } = await import("./_testing/node.ts"))
    break
}
export { test }
