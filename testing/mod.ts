// Re-exports
export { expect, fn } from "@std/expect"
export { test } from "./_testing.ts"

/** Alias for `any` that can be used for testing. */
//deno-lint-ignore no-explicit-any
export type testing = any

/** TestingError can be used to test expected error behaviours in tests. */
export class TestingError extends Error {}
