// Imports
import type { Hooks } from "./hooks.gen.ts"
import type { Context } from "./types.ts"

/** Normalize inputs using the request context before SQL executes. */
export const normalize: Hooks<Context>["pre"]["normalize"] = ({ context }, name, mode) => {
  if (mode !== "trim")
    throw new TypeError(`Expected trim mode, received ${String(mode)}`)
  return Promise.resolve([(context?.prefix ?? "") + name.trim()])
}

/** Censor the result according to the same request context. */
export const censor: Hooks<Context>["post"]["censor"] = ({ context, result }) => Promise.resolve(context?.censor ? "[hidden]" : result.message)
