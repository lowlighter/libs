// Imports
import type { options, Promisable, runner } from "./common.ts"
import { format } from "./common.ts"

/** Deno test runner. */
export const test = Object.assign(function (name: string, fn: () => Promisable<void>, options?: options) {
  options ??= {}
  options.permissions ??= "none"
  return globalThis.Deno.test({ name: format(name), fn, ...options })
}, {
  only: function (name: string, fn: () => Promisable<void>, options?: options) {
    return globalThis.Deno.test.only({ name: format(name), fn, ...options })
  },
  skip: function (name: string, fn: () => Promisable<void>, options?: options) {
    return globalThis.Deno.test.ignore({ name: format(name), fn, ...options })
  },
  todo: function (name: string, fn: () => Promisable<void>, options?: options) {
    return globalThis.Deno.test.ignore({ name: format(name), fn, ...options })
  },
}) as runner
