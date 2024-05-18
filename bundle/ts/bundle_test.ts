import { bundle } from "./bundle.ts"
import { expect, test } from "@libs/testing"

const base = new URL("testing/", import.meta.url)

test("deno")("bundle() handles url", async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(url)).resolves.toContain("success")
}, { permissions: { read: true, net: ["jsr.io"], env: true } })

test("deno")("bundle() handles raw typescript", async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(await Deno.readTextFile(url))).resolves.toContain("success")
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true } })

test("deno")("bundle() handles debug option", async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(url, { debug: true })).resolves.toContain("//# sourceMappingURL=")
}, { permissions: { read: true, net: ["jsr.io"], env: true } })

test("deno")("bundle() handles banner option", async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(url, { banner: "license" })).resolves.toContain("// license")
  await expect(bundle(url, { banner: "license\ncopyright" })).resolves.toContain("/**\n * license\n * copyright\n */")
}, { permissions: { read: true, net: ["jsr.io"], env: true } })

test("deno")("bundle() handles minify option", async () => {
  const url = new URL("test_minify.ts", base)
  await expect(bundle(url, { minify: false })).not.resolves.toBe(`console.log("hello world");`)
  await expect(bundle(url, { minify: "basic" })).not.resolves.toContain("\n")
  await expect(bundle(url, { minify: "terser" })).resolves.toBe(`console.log("hello world");`)
  await expect(bundle(url, { minify: "terser", debug: true })).resolves.toMatch(/console\.log\("hello world"\);\n\/\/# sourceMappingURL=/)
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true } })

test("deno")("bundle() handles shadow option", async () => {
  const url = new URL("test_shadow.ts", base)
  await expect(bundle(url, { shadow: false })).not.resolves.toContain("file:///shadow/")
  await expect(bundle(url, { shadow: true })).resolves.toContain("file:///shadow/")
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true } })

test("deno")("bundle() handles import maps", async () => {
  const url = new URL("test_import_map.ts", base)
  await expect(bundle(url, { map: new URL("deno.jsonc", base) })).resolves.toContain("success")
}, { permissions: { read: true, net: ["jsr.io"], env: true, write: true } })

test("deno")("bundle() handles errors", async () => {
  const url = new URL("test_bundle.css", base)
  await expect(bundle(url)).rejects.toThrow("Failed to bundle ts")
}, { permissions: { read: true, env: true } })
