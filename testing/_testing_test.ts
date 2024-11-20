import { available, cache, install, paths, placeholder, type runtime, test, testcase } from "./_testing.ts"
import { expect, type testing } from "./mod.ts"
import { fromFileUrl } from "@std/path/from-file-url"

test()("`test()` use default runtimes when none is specified", () => void expect(true))

test("node", "bun")("`test()` use given runtimes when specified", () => void expect(true))

test("all")('`test()` use all supported runtimes when `"all"` is specified', () => void expect(true))

test("__unknown__" as testing)("`test()` ignores unknown runtimes", () => void expect(true))

test("deno")("`test()` supports test modifiers like `test.only()`, `test.skip()` and `test.todo()`", () => {
  expect(test.only()("Deno.only", () => void expect(true), { __norun: true } as testing))
  expect(test.skip()("Deno.ignore", () => void expect(true), { __norun: true } as testing))
  expect(test.todo()("Deno.ignore", () => void expect(true), { __norun: true } as testing))
  expect(test.todo()("Deno.ignore", undefined, { __norun: true } as testing))
})

for (const runtime of ["node", "bun"] as const) {
  test("deno")(`\`test()\` is able to detect ${runtime} runtime binary`, () => {
    const _paths = { ...paths }
    const _available = { ...available }
    try {
      Object.assign(available, { [runtime]: null })
      paths[runtime] = "deno" // Must be a resolvable binary, since run permission is not granted it'll throw a NotCapable error
      test(runtime)
      expect(available[runtime]).toBe(false)
    } finally {
      paths[runtime] = _paths[runtime]
      Object.assign(available, { [runtime]: _available[runtime] })
    }
  })
}

test("deno")("`test()` is able to detect bun runtime environment", async () => {
  try {
    Object.assign(globalThis, { Bun: true })
    const testcase = test("bun")
    expect(testcase).toBeInstanceOf(Function)
    await expect(testcase("", () => {}, { __dryrun: true } as testing)).rejects.toThrow(Error, "Not implemented")
  } finally {
    delete (globalThis as testing).Bun
  }
})

test("deno")("`test()` is able to detect node runtime environment", async () => {
  const _Deno = globalThis.Deno
  try {
    delete (globalThis as testing).Deno
    Object.assign(globalThis, { process: { versions: { node: true } } })
    const testcase = test("node")
    expect(testcase).toBeInstanceOf(Function)
    await expect(testcase("", () => {}, { __dryrun: true } as testing)).rejects.toThrow(Error, "Not implemented")
  } finally {
    Object.assign(globalThis, { Deno: _Deno })
  }
})

test("deno")("`install()` resolves and install dependencies", () => {
  for (const _ of [1, 2]) {
    expect(() => install([null as testing], import.meta.filename!)).not.toThrow()
  }
  expect(cache.has(`null:${import.meta.filename}`)).toBe(true)
}, { permissions: { run: ["deno"] } })

for (const runtime of Object.keys(available) as runtime[]) {
  test.skip("deno")(`\`testcase()\` is able to run tests on ${runtime} runtime`, async () => {
    const filename = fromFileUrl(import.meta.resolve("./_stub_test.ts"))
    await expect(testcase(runtime, filename, "test() stub throws error", () => {})).not.resolves.toThrow()
  }, { permissions: { run: "inherit" } })
}

if (globalThis.Deno) {
  Deno.env.set("TEST_BAR", "baz")
}

test("deno")("`test()` supports custom environment", () => {
  expect(Deno.env.get("TEST_FOO")).toBe("bar")
  expect(Deno.env.get("TEST_BAR")).toBe("qux")
}, { permissions: { env: ["TEST_FOO", "TEST_BAR"] }, env: { TEST_FOO: "bar", TEST_BAR: "qux" } })

test("deno")("`test()` restore environment after applying custom environment", () => {
  expect(Deno.env.get("TEST_FOO")).toBeUndefined()
  expect(Deno.env.get("TEST_BAR")).toBe("baz")
}, { permissions: { env: ["TEST_FOO", "TEST_BAR"] } })

test()("`placeholder()` use default runtimes when none is specified", () => void expect(placeholder).not.toThrow())
