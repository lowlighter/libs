// deno-lint-ignore-file no-external-import
// Imports
import type { Promisable, runner } from "./common.ts"
import { format } from "./common.ts"
import * as node from "node:test"

/** Node test runner. */
export const test = Object.assign(function (name: string, fn: () => Promisable<void>) {
  return node.test(format(name), fn)
}, {
  only: function (name: string, fn: () => Promisable<void>) {
    return node.test.only(format(name), fn)
  },
  skip: function (name: string, fn: () => Promisable<void>) {
    return node.test.skip(format(name), fn)
  },
  todo: function (name: string, fn: () => Promisable<void>) {
    return node.test.todo(format(name), fn)
  },
}) as runner
