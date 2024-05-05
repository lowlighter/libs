import { bundle } from "./bundle.ts"
import { expect } from "jsr:@std/expect/expect"

const base = new URL("testing/", import.meta.url)

Deno.test("bundle() handles url", { permissions: { read: true, net: ["jsr.io"], env: true } }, async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(url)).resolves.toContain("success")
})

Deno.test("bundle() handles raw typescript", { permissions: { read: true, net: ["jsr.io"], env: true, write: true } }, async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(await Deno.readTextFile(url))).resolves.toContain("success")
})

Deno.test("bundle() handles debug option", { permissions: { read: true, net: ["jsr.io"], env: true } }, async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(url, { debug: true })).resolves.toContain("//# sourceMappingURL=")
})

Deno.test("bundle() handles banner option", { permissions: { read: true, net: ["jsr.io"], env: true } }, async () => {
  const url = new URL("test_bundle.ts", base)
  await expect(bundle(url, { banner: "license" })).resolves.toContain("// license")
  await expect(bundle(url, { banner: "license\ncopyright" })).resolves.toContain("/**\n * license\n * copyright\n */")
})

Deno.test("bundle() handles minify option", { permissions: { read: true, net: ["jsr.io"], env: true, write: true } }, async () => {
  const url = new URL("test_minify.ts", base)
  await expect(bundle(url, { minify: false })).not.resolves.toBe(`console.log("hello world");`)
  await expect(bundle(url, { minify: "basic" })).not.resolves.toContain("\n")
  await expect(bundle(url, { minify: "terser" })).resolves.toBe(`console.log("hello world");`)
  await expect(bundle(url, { minify: "terser", debug: true })).resolves.toMatch(/console\.log\("hello world"\);\n\/\/# sourceMappingURL=/)
})

Deno.test("bundle() handles import maps", { permissions: { read: true, net: ["jsr.io"], env: true, write: true } }, async () => {
  const url = new URL("test_import_map.ts", base)
  await expect(bundle(url, { map: new URL("deno.jsonc", base) })).resolves.toContain("success")
})

Deno.test("bundle() handles errors", { permissions: { read: true, env: true } }, async () => {
  const url = new URL("test_bundle.css", base)
  await expect(bundle(url)).rejects.toThrow("Failed to bundle ts")
})
