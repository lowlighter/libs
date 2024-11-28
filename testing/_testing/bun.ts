// Imports
import type { Promisable, runner } from "./common.ts"
import { format } from "./common.ts"

// deno-lint-ignore no-explicit-any
const bun = (globalThis as any).Bun

/** Bun test runner. */
export const test = Object.assign(function (name: string, fn: () => Promisable<void>) {
  return bun.jest(caller()).test(format(name), fn)
}, {
  only: function (name: string, fn: () => Promisable<void>) {
    return bun.jest(caller()).test.only(format(name), fn)
  },
  skip: function (name: string, fn: () => Promisable<void>) {
    return bun.jest(caller()).test.skip(format(name), fn)
  },
  todo: function (name: string, fn: () => Promisable<void>) {
    return bun.jest(caller()).test.todo(format(name), fn)
  },
}) as runner

/** Retrieve caller test file. */
function caller() {
  const Trace = Error as unknown as { prepareStackTrace: (error: Error, stack: CallSite[]) => unknown }
  const _ = Trace.prepareStackTrace
  Trace.prepareStackTrace = (_, stack) => stack
  const { stack } = new Error()
  Trace.prepareStackTrace = _
  const caller = (stack as unknown as CallSite[])[2]
  return caller.getFileName().replaceAll("\\", "/")
}

/** V8 CallSite (subset). */
type CallSite = { getFileName: () => string }
