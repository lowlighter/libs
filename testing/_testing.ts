// Imports
import type { Nullable, Promisable, record, rw } from "@libs/typing"
import { fromFileUrl } from "@std/path/from-file-url"

/** Text decoder. */
const decoder = new TextDecoder()

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
type runtime = "deno" | "bun" | "node"

/** Test options. */
type options = {
  ignore?: Deno.TestDefinition["ignore"]
  only?: Deno.TestDefinition["only"]
  permissions?: Deno.TestDefinition["permissions"]
  sanitizeResources?: Deno.TestDefinition["sanitizeResources"]
  sanitizeOps?: Deno.TestDefinition["sanitizeOps"]
  sanitizeExit?: Deno.TestDefinition["sanitizeExit"]
}

/** Test runner. */
type tester = (...runtimes: Array<runtime | "all">) => (name: string, fn: () => Promisable<void>, options?: options) => Promisable<void>

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
 * If a runtime is not available, the test will be skipped meaning that it is not necessary to install all runtimes on the system for development.
 *
 * Dependencies are resolved from `deno info` and are installed using the adequate package manager.
 * This is done only once per test file.
 *
 * When a test case is run on `deno`, default permissions are set to `none` rather than `"inherit"` (they can still be set using the {@link options} parameter).
 *
 * > [!IMPORTANT]
 * > Since runtimes are executed using `Deno.command`, `--allow-run` permission must be specified:
 * > - `deno` is always required
 * > - `bun` is required when `bun` runtime is used
 * > - `node,npx` are required when `node` runtime is used
 *
 * > [!IMPORTANT]
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
  let extension = ""
  if (global.Deno?.build.os === "windows") {
    extension = ".cmd"
  }
  if (runtimes.includes("all")) {
    runtimes = Object.keys(available) as runtime[]
  }
  if (!runtimes.length) {
    runtimes = ["deno"]
  }
  // Bun runtime
  if ((global.Deno) && (runtimes.includes("bun")) && (available.bun === null)) {
    try {
      run(paths.bun, { args: ["--version"] })
      Object.assign(available, { bun: true })
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
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
      run(paths.node, { args: ["--version"] })
      run(`${paths.npx}${extension}`, { args: ["tsx", "--version"] })
      Object.assign(available, { node: true })
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        Object.assign(available, { node: false })
      } else {
        throw error
      }
    }
  }
  if (global.process?.versions?.node) {
    return async function (name: string, fn: () => Promisable<void>) {
      try {
        const { test } = await import("node:test")
        test(name, fn)
      } catch (error) {
        throw error
      }
    }
  }
  // Deno runtime
  const filename = caller()
  return function (name: string, fn: () => Promisable<void>, options = { permissions: "none" } as options) {
    for (const runtime of runtimes) {
      ;({ test: Deno.test, skip: Deno.test.ignore, only: Deno.test.only }[available[runtime as runtime] ? mode : "skip"])(`[${runtime.padEnd(4)}] ${name}`, runtime === "deno" ? options : {}, async function () {
        switch (runtime) {
          case "node":
            install([`${paths.npx}${extension}`, "jsr", "add"], filename)
            run(`${paths.npx}${extension}`, { args: ["tsx", "--test-reporter", "spec", "--test-name-pattern", name, "--test", filename], env: { FORCE_COLOR: "true" } })
            break
          case "bun":
            install([paths.bun, "x", "jsr", "add"], filename)
            run(paths.bun, { args: ["test", "--test-name-pattern", name, filename], env: { FORCE_COLOR: "1" } })
            break
          case "deno":
            await fn()
            break
        }
      })
    }
  }
}

/** Spawn runtime with specified args and environment. */
export function run(runtime: string, { args, env }: { args: string[]; env?: record<string> }) {
  const command = new Deno.Command(runtime, { args, env, stdout: "piped", stderr: "piped" })
  const { success, code, ...stdio } = command.outputSync()
  const stdout = decoder.decode(stdio.stdout)
  const stderr = decoder.decode(stdio.stderr)
  if (!success) {
    throw Object.assign(new Error(`${runtime} exited with code ${code}:\n${stdout}\n${stderr}`), { stack: null })
  }
  return { success, code, stdout, stderr }
}

/** Install cache (skip install for tests within the same file).*/
const cache = new Set<string>()

/** Resolve dependencies using `deno info` and install packages using the adequate package manager. */
function install([bin, ...args]: string[], filename: string) {
  if (cache.has(`${bin}:${filename}`)) {
    return
  }
  const { stdout } = run(paths.deno, { args: ["info", "--json", filename] })
  const { packages, npmPackages: _ } = JSON.parse(stdout)
  run(bin, { args: [...args, ...Object.keys(packages)] })
  cache.add(`${bin}:${filename}`)
}

/** Retrieve caller test file. */
function caller() {
  const Trace = Error as unknown as { prepareStackTrace: (error: Error, stack: CallSite[]) => unknown }
  const _ = Trace.prepareStackTrace
  Trace.prepareStackTrace = (_, stack) => stack
  const { stack } = new Error()
  Trace.prepareStackTrace = _
  const caller = (stack as unknown as CallSite[])[2]
  return fromFileUrl(caller.getFileName()).replaceAll("\\", "/")
}

/** V8 CallSite (subset). */
type CallSite = { getFileName: () => string }

/** Test runner mode. */
type mode = "test" | "skip" | "only"
