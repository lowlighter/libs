// Imports
import type { Nullable, Promisable, rw } from "@libs/typing"
import { command } from "@libs/run/command"
export type { Nullable, Promisable }

/** Alias for `any` that can be used for testing. */
//deno-lint-ignore no-explicit-any
export type testing = any

/** TestingError can be used to test expected error behaviours in tests. */
export class TestingError extends Error {}

/**
 * Available runtimes.
 *
 * Either:
 * - `null` if not checked yet (it is checked the first time a test is run with the corresponding runtime)
 * - `true` if available
 * - `false` if unavailable
 */
export const available = {
  deno: true,
  bun: null,
  node: null,
} as Readonly<Record<runtime, Nullable<boolean>>>

/** Paths to runtimes. */
export const paths = {
  deno: "deno",
  bun: "bun",
  node: "node",
  npx: "npx",
}

/** Runtime. */
export type runtime = "deno" | "bun" | "node"

/** Test options. */
export type options = {
  ignore?: Deno.TestDefinition["ignore"]
  only?: Deno.TestDefinition["only"]
  permissions?: Deno.TestDefinition["permissions"]
  sanitizeResources?: Deno.TestDefinition["sanitizeResources"]
  sanitizeOps?: Deno.TestDefinition["sanitizeOps"]
  sanitizeExit?: Deno.TestDefinition["sanitizeExit"]
  env?: Record<string, string>
}

/** Test runner. */
export type tester = (...runtimes: Array<runtime | "all">) => (name: string, fn: () => Promisable<void>, options?: options) => Promisable<void>

/**
 * Run a test case with selected runtimes using their own test engine.
 *
 * The following runtimes can be used:
 * - `deno` which will use `Deno.test` directly
 * - `bun` which will call `bun test`
 * - `node` which will call `npx tsx --test`
 *
 * All runtimes mentioned above can be selected at once using the `all` keyword.
 *
 * If a runtime is not available on current system, the test will be skipped so developpers do not need to install all runtimes.
 *
 * Dependencies are resolved from `deno info` and are installed using the adequate package manager.
 * This is done only once per test file.
 *
 * When a test case is run on `deno`, default permissions are set to `none` rather than `"inherit"` (they can still be set using the {@link options} parameter).
 *
 * > [!WARNING]
 * > Since runtimes are executed using `Deno.command`, `--allow-run` permission must be specified:
 * > - `deno` is always required
 * > - `bun` is required when `bun` runtime is used
 * > - `node,npx` are required when `node` runtime is used
 *
 * > [!WARNING]
 * > It is currently not possible to use `jsr:` specifiers in runtime other than deno, which is why it is advised to use an import map to alias dependencies.
 * > When publishing on {@link https://jsr.io | jsr.io}, these will be rewritten into fully qualified specifiers (see {@link https://jsr.io/docs/publishing-packages#dependency-manifest | dependency manifest}).
 *
 * @example
 * ```ts
 * import { test, expect } from "./mod.ts"
 *
 * // Run tests on specified runtimes
 * test("all")(name, () => void expect(true))
 * test("deno", "bun", "node")(name, () => void expect(true))
 *
 * // Using custom permissions for deno runtime
 * test("deno")(name, () => expect(globalThis.Deno).toBeDefined(), { permissions: "inherit" })
 *
 * // Using custom environment variables for deno runtime (this requires `--allow-env` permissions)
 * test("deno")(name, () => expect(globalThis.Deno.env.get("MY_ENV")).toBe("value"), { permissions: { env: [ "MY_ENV" ] },  env: { MY_ENV: "value" } })
 * ```
 *
 * @example
 * ```ts
 * import { test, expect } from "./mod.ts"
 *
 * // `skip` and `only` can be used to respectively ignore or restrict a test run to specific cases
 * test.skip()(name, () => void null)
 * ```
 */
export const test = Object.assign(_test.bind(null, "test"), { skip: _test.bind(null, "skip"), only: _test.bind(null, "only") }) as (tester & { skip: tester; only: tester })

/**
 * Run a single test case in multiple runtimes using their own test engine within Deno.
 *
 * If the runtime is not available, the test will be skipped.
 */
function _test(mode: mode, ...runtimes: Array<runtime | "all">): (name: string, fn: () => Promisable<void>, options?: options) => Promisable<void> {
  const global = globalThis as rw
  if (runtimes.includes("all")) {
    runtimes = Object.keys(available) as runtime[]
  }
  if (!runtimes.length) {
    runtimes = ["deno"]
  }
  // Bun runtime
  if ((global.Deno) && (runtimes.includes("bun")) && (available.bun === null)) {
    try {
      command(paths.bun, ["--version"], { stdout: null, stderr: null, sync: true, throw: true })
      Object.assign(available, { bun: true })
    } catch (error) {
      if ((error instanceof Deno.errors.NotFound) || (error instanceof Deno.errors.NotCapable)) {
        Object.assign(available, { bun: false })
      } else {
        throw error
      }
    }
  }
  if (global.Bun) {
    return async function (name: string, fn: () => Promisable<void>) {
      try {
        const { test } = await import(`${"bun"}:test`)
        test(name, fn)
      } catch (error) {
        throw error
      }
    }
  }
  // Node runtime
  if ((global.Deno) && (runtimes.includes("node")) && (available.node === null)) {
    try {
      command(paths.node, ["--version"], { stdout: null, stderr: null, sync: true, throw: true })
      command(paths.npx, ["tsx", "--version"], { stdout: null, stderr: null, sync: true, throw: true, winext: ".cmd" })
      Object.assign(available, { node: true })
    } catch (error) {
      if ((error instanceof Deno.errors.NotFound) || (error instanceof Deno.errors.NotCapable)) {
        Object.assign(available, { node: false })
      } else {
        throw error
      }
    }
  }
  if ((!global.Deno) && (global.process?.versions?.node)) {
    return async function (name: string, fn: () => Promisable<void>) {
      try {
        const { test } = await import(`${"node"}:test`)
        test(name, fn)
      } catch (error) {
        throw error
      }
    }
  }
  // Deno runtime
  const filename = caller()
  return function (name: string, fn: () => Promisable<void>, options = { permissions: "none" } as options) {
    for (const runtime of runtimes as runtime[]) {
      const runner = { test: Deno.test, skip: Deno.test.ignore, only: Deno.test.only }[available[runtime as runtime] ? mode : "skip"]
      if ((options as { __norun?: boolean })?.__norun) {
        continue
      }
      runner(`[${runtime.padEnd(4)}] ${name}`, runtime === "deno" ? options : {}, function () {
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
      })
    }
  }
}

/** Install cache (skip install for tests within the same file).*/
export const cache = new Set<string>() as Set<string>

/** Resolve dependencies using `deno info` and install packages using the adequate package manager. */
export function install([bin, ...args]: string[], filename: string, { winext = "" } = {}) {
  if (cache.has(`${bin}:${filename}`)) {
    return
  }
  const { stdout } = command(paths.deno, ["info", "--json", filename], { stdout: "piped", stderr: null, sync: true, throw: true })
  const { packages, npmPackages: _ } = JSON.parse(stdout)
  command(bin, [...args, ...Object.keys(packages)], { stdout: null, stderr: null, sync: true, throw: true, winext, dryrun: !bin })
  cache.add(`${bin}:${filename}`)
}

/** Run test function for given filename on the specified runtime. */
export async function testcase(runtime: runtime, filename: string, name: string, fn: () => Promisable<void>, dryrun = false) {
  switch (runtime) {
    case "node":
      install([paths.npx, "jsr", "add"], filename, { winext: ".cmd" })
      await command(paths.npx, ["tsx", "--test-reporter", "spec", "--test-name-pattern", name, "--test", filename], { stdout: "piped", stderr: "piped", throw: true, env: { FORCE_COLOR: "true" }, winext: ".cmd", dryrun })
      break
    case "bun":
      install([paths.bun, "x", "jsr", "add"], filename)
      await command(paths.bun, ["test", "--test-name-pattern", name, filename], { stdout: "piped", stderr: "piped", throw: true, env: { FORCE_COLOR: "1" }, dryrun })
      break
    case "deno":
      await fn()
      break
  }
}

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

/** Test runner mode. */
type mode = "test" | "skip" | "only"
