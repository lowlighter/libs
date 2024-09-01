import { available, cache, install, paths, type runtime, test, testcase } from "./_testing.ts"
import { expect, type testing } from "./mod.ts"
import { fromFileUrl } from "@std/path/from-file-url"

test()("test() use default runtimes when none is specified", () => void expect(true))

test("node", "bun")("test() use given runtimes when specified", () => void expect(true))

test("all")("test() use all supported runtimes when `all` is specified", () => void expect(true))

test("__unknown__" as testing)("test() ignores unknown runtimes", () => void expect(true))

test("deno")("test() supports test modifiers", () => {
  expect(test.only()("Deno.only", () => void expect(true), { __norun: true } as testing))
  expect(test.skip()("Deno.ignore", () => void expect(true), { __norun: true } as testing))
})

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
    await expect(testcase("", () => {}, { __dryrun: true } as testing)).rejects.toThrow(Error)
  } finally {
    delete (globalThis as testing).Bun
  }
})

test("deno")("test() is able to detect node runtime environment", async () => {
  try {
    Object.assign(globalThis, { process: { versions: { node: true } } })
    const testcase = test("node")
    expect(testcase).toBeInstanceOf(Function)
    await expect(testcase("", () => {}, { __dryrun: true } as testing)).rejects.toThrow(Error)
  } finally {
    delete (globalThis as testing).process
  }
})

test("deno")("install() resolves and install dependencies", () => {
  for (const _ of [1, 2]) {
    expect(() => install([null as testing], import.meta.filename!)).not.toThrow()
  }
  expect(cache.has(`null:${import.meta.filename}`)).toBe(true)
}, { permissions: { run: ["deno"] } })

for (const runtime of Object.keys(available) as runtime[]) {
  test("deno")(`testcase() is able to run tests on ${runtime} runtime`, async () => {
    const filename = fromFileUrl(import.meta.resolve("./_stub_test.ts"))
    await expect(testcase(runtime, filename, "test() stub throws error", () => {})).not.resolves.toThrow()
  }, { permissions: { run: "inherit" } })
}
