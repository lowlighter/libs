import { bundle } from "./bundle.ts"
import { expect } from "jsr:@std/expect/expect"

const base = new URL("testing/", import.meta.url)

Deno.test("bundle() handles url", { permissions: { read: true } }, async () => {
  const url = new URL("test_bundle.css", base)
  await expect(bundle(url)).resolves.toContain("salmon")
})

Deno.test("bundle() handles raw css", { permissions: { read: true } }, async () => {
  const url = new URL("test_bundle.css", base)
  await expect(bundle(await Deno.readTextFile(url))).resolves.toContain("salmon")
})

Deno.test("bundle() handles banner option", { permissions: { read: true } }, async () => {
  const url = new URL("test_bundle.css", base)
  await expect(bundle(url, { banner: "license" })).resolves.toContain("/**\n * license\n */")
})

Deno.test("bundle() handles minify option", { permissions: { read: true } }, async () => {
  const url = new URL("test_minify.css", base)
  await expect(bundle(url, { minify: false })).resolves.toContain("#ffffff")
  await expect(bundle(url, { minify: true })).not.resolves.toContain("#ffffff")
})

Deno.test("bundle() handles errors", { permissions: { read: true } }, async () => {
  await expect(bundle(import.meta.url)).rejects.toThrow("Failed to bundle css")
})
