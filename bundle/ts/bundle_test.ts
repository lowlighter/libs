import { bundle } from "./bundle.ts"
import { expect, test, type testing } from "@libs/testing"
import { fromFileUrl } from "jsr:@std/path@^1.1.2"

const base = new URL("testing/", import.meta.url)
const config = new URL("deno.jsonc", base)

test("`bundle()` handles url", async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(url, { config })).resolves.toContain("success")
}, { permissions: { read: true, net: ["jsr.io"], env: true, run: true } })

test("`bundle()` handles raw typescript", async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(await Deno.readTextFile(url), { config })).resolves.toContain("success")
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true, run: true } })

test("`bundle()` handles debug option", async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(url, { config, debug: true })).resolves.toContain("//# sourceMappingURL=")
}, { permissions: { read: true, net: ["jsr.io"], env: true, run: true } })

test("`bundle()` handles banner option", async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(url, { config, banner: "license" })).resolves.toContain("// license")
  await expect(bundle(url, { config, banner: "license\ncopyright" })).resolves.toContain("/**\n * license\n * copyright\n */")
}, { permissions: { read: true, net: ["jsr.io"], env: true, run: true } })

test("`bundle()` handles builder version", async () => {
  const { Worker } = globalThis
  try {
    delete (globalThis as testing).Worker
    const url = new URL("test_bundle.ts", base)
    for (let i = 0; i < 2; i++) {
      await expect(bundle(url, { config, builder: "wasm" })).resolves.toContain("success")
    }
  } finally {
    globalThis.Worker = Worker
  }
}, { permissions: { read: true, run: ["deno"] } })

test("`bundle()` handles minify option", async () => {
  const url = new URL("test_minify.ts", base)
  await expect(bundle(url, { config, minify: false })).not.resolves.toBe(`console.log("hello world");`)
  await expect(bundle(url, { config, minify: "basic" })).not.resolves.toContain("\n")
  await expect(bundle(url, { config, minify: "terser" })).resolves.toBe(`console.log("hello world");`)
  await expect(bundle(url, { config, minify: "terser", debug: true })).resolves.toMatch(/console\.log\("hello world"\);\n\/\/# sourceMappingURL=/)
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true, run: true } })

test("`bundle()` handles shadow option", async () => {
  const url = new URL("test_shadow.ts", base)
  await expect(bundle(url, { config, shadow: false })).not.resolves.toContain("file:///shadow/")
  await expect(bundle(url, { config, shadow: true })).resolves.toContain("file:///shadow/")
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true, run: true } })

test("`bundle()` handles deno config files", async () => {
  const url = new URL("test_config.ts", base)
  await expect(bundle(url, { config: new URL("deno.jsonc", base) })).resolves.toContain("success")
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true, run: true } })

test("`bundle()` handles errors", async () => {
  const url = new URL("test_bundle.css", base)
  await expect(bundle(url)).rejects.toThrow("Failed to bundle ts")
}, { permissions: { read: true, env: true, run: true } })

test("`bundle()` handles specifiers", async () => {
  const url = new URL("test_specifiers.ts", base)
  await expect(bundle(url)).resolves.toContain("success")
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true, run: true } })

test("`bundle()` handles imports replacements (file scheme)", async () => {
  const url = new URL("test_overrides_imports.ts", base)
  const replaced = import.meta.resolve("./testing/test_overrides_imports_func_success.ts")
  await expect(bundle(url, { overrides: { imports: { "./test_overrides_imports_func_failure.ts": replaced } } })).resolves.toContain("success")
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true, run: true } })

test("`bundle()` handles imports replacements (non-file scheme)", async () => {
  const url = new URL("test_overrides_imports.ts", base)
  const replaced = `data:text/typescript;base64,${btoa(await Deno.readTextFile(fromFileUrl(import.meta.resolve("./testing/test_overrides_imports_func_success.ts"))))}`
  await expect(bundle(url, { overrides: { imports: { "./test_overrides_imports_func_failure.ts": replaced } } })).resolves.toContain("success")
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true, run: true } })
