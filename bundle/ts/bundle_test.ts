import { bundle } from "./bundle.ts"
import { expect, test } from "@libs/testing"

const base = new URL("testing/", import.meta.url)
const config = new URL("deno.jsonc", base)

test("deno")("`bundle()` handles url", async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(url, { config })).resolves.toContain("success")
}, { permissions: { read: true, net: ["jsr.io"], env: true, run: true } })

test("deno")("`bundle()` handles raw typescript", async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(await Deno.readTextFile(url), { config })).resolves.toContain("success")
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true, run: true } })

test("deno")("`bundle()` handles debug option", async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(url, { config, debug: true })).resolves.toContain("//# sourceMappingURL=")
}, { permissions: { read: true, net: ["jsr.io"], env: true, run: true } })

test("deno")("`bundle()` handles banner option", async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(url, { config, banner: "license" })).resolves.toContain("// license")
  await expect(bundle(url, { config, banner: "license\ncopyright" })).resolves.toContain("/**\n * license\n * copyright\n */")
}, { permissions: { read: true, net: ["jsr.io"], env: true, run: true } })

test("deno")("`bundle()` handles minify option", async () => {
  const url = new URL("test_minify.ts", base)
  await expect(bundle(url, { config, minify: false })).not.resolves.toBe(`console.log("hello world");`)
  await expect(bundle(url, { config, minify: "basic" })).not.resolves.toContain("\n")
  await expect(bundle(url, { config, minify: "terser" })).resolves.toBe(`console.log("hello world");`)
  await expect(bundle(url, { config, minify: "terser", debug: true })).resolves.toMatch(/console\.log\("hello world"\);\n\/\/# sourceMappingURL=/)
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true, run: true } })

test("deno")("`bundle()` handles shadow option", async () => {
  const url = new URL("test_shadow.ts", base)
  await expect(bundle(url, { config, shadow: false })).not.resolves.toContain("file:///shadow/")
  await expect(bundle(url, { config, shadow: true })).resolves.toContain("file:///shadow/")
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true, run: true } })

test("deno")("`bundle()` handles deno config files", async () => {
  const url = new URL("test_config.ts", base)
  await expect(bundle(url, { config: new URL("deno.jsonc", base) })).resolves.toContain("success")
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true, run: true } })

test("deno")("`bundle()` handles errors", async () => {
  const url = new URL("test_bundle.css", base)
  await expect(bundle(url)).rejects.toThrow("Failed to bundle ts")
}, { permissions: { read: true, env: true, run: true } })

test("deno")("`bundle()` handles specifiers", async () => {
  const url = new URL("test_specifiers.ts", base)
  await expect(bundle(url)).resolves.toContain("success")
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true, run: true } })
