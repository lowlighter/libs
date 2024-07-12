import { mirror } from "./jsr.ts"
import { expect, test } from "@libs/testing"
import { Logger } from "@libs/logger"
import { STATUS_CODE as StatusCode } from "@std/http/status"
import { resolve } from "@std/path"

test("deno")("mirror() generates a dictionary with everything necessary to create a mirrored jsr.io repo", async () => {
  const items = [
    { name: "multi_exports", latestVersion: "0.0.0" },
    { name: "single_export", latestVersion: "0.0.0" },
    { name: "json_export", latestVersion: "0.0.0" },
    { name: "empty_export", latestVersion: "0.0.0" },
    { name: "ignore", latestVersion: null },
  ]
  await using server = Deno.serve({ onListen: () => null }, (request) => {
    const url = new URL(request.url)
    switch (true) {
      case new URLPattern("/scopes/:scope/packages", url.origin).test(url): {
        return new Response(JSON.stringify({ items }))
      }
      case new URLPattern("/:scope/multi_exports/:version/deno.jsonc", url.origin).test(url): {
        return new Response(JSON.stringify({ exports: { ".": "./mod.ts", "./foo": "./src/foo.ts", "./bar": "./src/bar.ts" } }))
      }
      case new URLPattern("/:scope/single_export/:version/deno.jsonc", url.origin).test(url): {
        return new Response(JSON.stringify({ exports: "./foo.ts" }))
      }
      case new URLPattern("/:scope/json_export/:version/deno.jsonc", url.origin).test(url): {
        return new Response(JSON.stringify({ exports: "./foo.json" }))
      }
      case new URLPattern("/:scope/json_export/:version/foo.json", url.origin).test(url): {
        return new Response(JSON.stringify({ foo: true }))
      }
      case new URLPattern("/:scope/empty_export/:version/deno.jsonc", url.origin).test(url): {
        return new Response(JSON.stringify({}))
      }
      case new URLPattern("/:scope/ignore/:version/deno.jsonc", url.origin).test(url): {
        return new Response(JSON.stringify({ exports: "./foo.ts" }))
      }
    }
    return new Response(null, { status: StatusCode.NotFound })
  })
  const registry = `http://${server.addr.hostname}:${server.addr.port}`
  const { files: _files, exports } = await mirror({
    scope: "foo",
    packages: items.filter(({ name }) => name !== "ignore").map(({ name }) => name),
    mod: true,
    registry,
    registryApi: registry,
    cwd: import.meta.dirname!,
    logger: new Logger({ level: Logger.level.disabled }),
    config: "testing/deno.jsonc",
  })
  const files = Object.fromEntries(Object.entries(_files).map(([key, value]) => [`.${key.replace(resolve(import.meta.dirname!), "").replaceAll("\\", "/")}`, value]))

  expect(exports).toHaveProperty(["./multi_exports"], "./multi_exports/mod.ts")
  expect(exports).toHaveProperty(["./multi_exports/foo"], "./multi_exports/src/foo.ts")
  expect(exports).toHaveProperty(["./multi_exports/bar"], "./multi_exports/src/bar.ts")
  expect(exports).toHaveProperty(["./single_export"], "./single_export/foo.ts")
  expect(exports).toHaveProperty(["./json_export"], "./json_export/foo.json")
  expect(exports).toHaveProperty(["."], "./mod.ts")
  expect(exports).not.toHaveProperty(["./ignore"])

  expect(files["./multi_exports/mod.ts"]).toMatch(/"jsr:@std\/multi_exports@0.0.0"/)
  expect(files["./multi_exports/src/foo.ts"]).toMatch(/"jsr:@std\/multi_exports@0.0.0\/foo"/)
  expect(files["./multi_exports/src/bar.ts"]).toMatch(/"jsr:@std\/multi_exports@0.0.0\/bar"/)
  expect(files["./mod.ts"]).toMatch(/\/\/ multi_exports@0.0.0/)
  expect(files["./single_export/foo.ts"]).toMatch(/"jsr:@std\/single_export@0.0.0"/)
  expect(files["./mod.ts"]).toMatch(/\/\/ single_export@0.0.0/)
  expect(files["./json_export/foo.json"]).toBe(`{"foo":true}`)
  expect(files["./mod.ts"]).toMatch(/\/\/ json_export@0.0.0/)
  expect(files["./mod.ts"]).toMatch(/import .* with \{ type: "json" \}/)
  expect(files["./mod.ts"]).toMatch(/\/\*\* Re-exports from .*json/)
  expect(JSON.parse(files["./testing/deno.jsonc"])).toEqual({
    exports: {
      "./multi_exports": "./multi_exports/mod.ts",
      "./multi_exports/foo": "./multi_exports/src/foo.ts",
      "./multi_exports/bar": "./multi_exports/src/bar.ts",
      "./single_export": "./single_export/foo.ts",
      "./json_export": "./json_export/foo.json",
      ".": "./mod.ts",
    },
    version: `${new Date().getFullYear()}.${new Date().getMonth() + 1}.${new Date().getDate()}`,
  })
}, { permissions: { read: true, net: true } })
