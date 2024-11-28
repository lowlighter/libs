// Imports
import type { options, Promisable, runner } from "./common.ts"
import { format } from "./common.ts"

/** Deno test runner. */
export const test = Object.assign(function (name: string, fn: () => Promisable<void>, options?: options) {
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

/*
const original = { env: {} as NonNullable<typeof options["env"]> }
        try {
          if ((runtime === "deno") && options.env) {
            for (const [key, value] of Object.entries(options.env)) {
              if (Deno.env.has(key)) {
                original.env[key] = Deno.env.get(key)!
              }
              Deno.env.set(key, value)
            }
          }
          return testcase(runtime, filename, name, fn, (options as { __dryrun?: boolean })?.__dryrun)
        } finally {
          if ((runtime === "deno") && options.env) {
            for (const key of Object.keys(options.env)) {
              Deno.env.delete(key)
              if (original.env[key] !== undefined) {
                Deno.env.set(key, original.env[key])
              }
            }
          }
        }
          */
