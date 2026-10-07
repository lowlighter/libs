// Imports
import { AssertionError } from "@std/assert/assertion-error"

/** Assert that an expression is truthy. */
export function assert(expression: unknown, message?: string): asserts expression
/** Assert that an expression is truthy, throwing the supplied error when it is false. */
export function assert(expression: unknown, error: Error): asserts expression
/** Assert that an expression is truthy, constructing the supplied error when it is false. */
export function assert(expression: unknown, constructor: new (message?: string) => Error, message?: string): asserts expression
export function assert(expression: unknown, error?: string | Error | (new (message?: string) => Error), message?: string): asserts expression {
  if (expression)
    return
  if (error instanceof Error)
    throw error
  if (typeof error === "function")
    throw new error(message)
  throw new AssertionError(error ?? "Assertion failed")
}
