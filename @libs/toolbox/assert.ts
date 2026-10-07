// Imports
import { AssertionError } from "@std/assert/assertion-error"

/** Assert that an expression is truthy. */
export function assert(expression: unknown, error?: string | Error): asserts expression {
  if (expression)
    return
  if (error instanceof Error)
    throw error
  throw new AssertionError(error ?? "Assertion failed")
}
