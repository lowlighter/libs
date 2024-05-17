import { available, paths, test } from "./_test.ts"
import { expect, type testing } from "./mod.ts"

test()("test() use default runtimes when none is specified", () => void expect(true))

test("node", "bun")("test() use given runtimes when specified", () => void expect(true))

test("all")("test() use all supported runtimes when `all` is specified", () => void expect(true))

for (const runtime of ["node", "bun"] as const) {
  test("deno")(`test() is able to detect ${runtime} runtime binary`, () => {
    const _paths = { ...paths }
    const _available = { ...available }
    try {
      Object.assign(available, { [runtime]: null })
      paths[runtime] = "invalid_path"
      test(runtime)
      expect(available[runtime]).toBe(false)
      Object.assign(available, { [runtime]: null })
      paths[runtime] = "forbidden_path"
      expect(() => test(runtime)).toThrow()
    } finally {
      paths[runtime] = _paths[runtime]
      Object.assign(available, { [runtime]: _available[runtime] })
    }
  }, { permissions: { run: ["invalid_path"] } })
}

test("deno")("test() is able to detect bun runtime environment", async () => {
  try {
    Object.assign(globalThis, { Bun: true })
    const testcase = test("bun")
    expect(testcase).toBeInstanceOf(Function)
    await expect(testcase(null as testing, null as testing)).rejects.toThrow()
  } finally {
    delete (globalThis as testing).Bun
  }
})

test("deno")("test() is able to detect node runtime environment", async () => {
  try {
    Object.assign(globalThis, { process: { versions: { node: true } } })
    const testcase = test("node")
    expect(testcase).toBeInstanceOf(Function)
    await expect(testcase(null as testing, null as testing)).resolves.toBeUndefined()
  } finally {
    delete (globalThis as testing).process
  }
})

/*
test("deno")("bun", () => {

})

test("deno")("node", () => {
  try {
    Object.assign(globalThis, { process: { versions: { node: true } } })
    test("node")
  } finally {
    delete (globalThis as testing).process
  }
})

/*

52 |   const extension = global.Deno?.build.os === "windows" ? ".cmd" : ""
-----|-----
  56 |   if (!runtimes.length) {
  57 |     runtimes = ["deno"]
  58 |   }
-----|-----
  64 |     } catch (error) {
  65 |       if (error instanceof Deno.errors.NotFound) {
  66 |         available.bun = false
  67 |       }
  68 |       throw error
  69 |     }
-----|-----
  71 |   if (global.Bun) {
  72 |     return async function (name: string, fn: () => unknown) {
  73 |       try {
  74 |         const { test } = await import(`${"bun"}:test`)
  75 |         test(name, fn)
  76 |       } catch (error) {
  77 |         throw error
  78 |       }
  79 |     }
  80 |   }
-----|-----
  87 |     } catch (error) {
  88 |       if (error instanceof Deno.errors.NotFound) {
  89 |         available.node = false
  90 |       }
  91 |       throw error
  92 |     }
-----|-----
  94 |   if (global.process?.versions?.node) {
  95 |     return async function (name: string, fn: () => unknown) {
  96 |       try {
  97 |         const { test } = await import("node:test")
  98 |         test(name, fn)
  99 |       } catch (error) {
 100 |         throw error
 101 |       }
 102 |     }
 103 |   }
-----|-----
 139 |   if (!success) {
 140 |     throw Object.assign(new Error(`${runtime} exited with code ${code}:\n${stdout}\n${stderr}`), { stack: null })
 141 |   }
 */
