// Re-exports
export { test } from "./_testing.ts"
export { AssertionError, expect, fn } from "./expect.ts"

/** Alias for `any` that can be used for testing. */
//deno-lint-ignore no-explicit-any
export type testing = any

/** TestingError can be used to test expected error behaviours in tests. */
export class TestingError extends Error {}
