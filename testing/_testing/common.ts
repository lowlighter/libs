// Imports
import type { Nullable, Promisable } from "@libs/typing"
export type { Nullable, Promisable }
import { highlight } from "../highlight.ts"

/** Test options. */
export type options = {
  permissions?: Deno.TestDefinition["permissions"]
  sanitizeResources?: Deno.TestDefinition["sanitizeResources"]
  sanitizeOps?: Deno.TestDefinition["sanitizeOps"]
  sanitizeExit?: Deno.TestDefinition["sanitizeExit"]
  env?: Record<string, string>
  [key: PropertyKey]: unknown
}

/** Test runner method. */
export type runner_method = (name: string, fn: () => Promisable<unknown>, options?: options) => Promisable<unknown>

/** Test runner. */
export type runner = runner_method & { only: runner_method; skip: runner_method; todo: runner_method }

/** Test runner mode. */
export type mode = "test" | "skip" | "only" | "todo"

/** Format test name. */
export function format(name: string): string {
  return highlight(name, { underline: true })
}
