import { available, paths, run, test } from "./_testing.ts"
import { expect, type testing } from "./mod.ts"

test("deno")("run() is able to spawn runtime subprocesses", () => {
  expect(() => run("deno", { args: ["--version"] })).not.toThrow()
  expect(() => run("deno", { args: ["--error"] })).toThrow()
}, { permissions: { run: ["deno"] } })

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
    await expect(testcase(null as testing, null as testing)).rejects.toThrow()
  } finally {
    delete (globalThis as testing).process
  }
})
