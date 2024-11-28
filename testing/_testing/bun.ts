// Imports
import type { Promisable, runner } from "./common.ts"
import { format } from "./common.ts"
const bun = await import(`${"bun"}:test`)

/** Bun test runner. */
export const test = Object.assign(function (name: string, fn: () => Promisable<void>) {
  return bun.test(format(name), fn)
}, {
  only: function (name: string, fn: () => Promisable<void>) {
    return bun.test.only(format(name), fn)
  },
  skip: function (name: string, fn: () => Promisable<void>) {
    return bun.test.skip(format(name), fn)
  },
  todo: function (name: string, fn: () => Promisable<void>) {
    return bun.test.todo(format(name), fn)
  },
}) as runner
