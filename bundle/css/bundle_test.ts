import { bundle } from "./bundle.ts"
import { expect, test } from "@libs/testing"

const base = new URL("testing/", import.meta.url)

test("`bundle()` handles url", async () => {
  const url = new URL("test_bundle.css", base)
  await expect(bundle(url)).resolves.toContain("salmon")
}, { permissions: { read: true } })

test("`bundle()` handles raw css", async () => {
  const url = new URL("test_bundle.css", base)
  await expect(bundle(await Deno.readTextFile(url))).resolves.toContain("salmon")
}, { permissions: { read: true } })

test("`bundle()` handles banner option", async () => {
  const url = new URL("test_bundle.css", base)
  await expect(bundle(url, { banner: "license" })).resolves.toContain("/**\n * license\n */")
}, { permissions: { read: true } })

test("`bundle()` handles minify option", async () => {
  const url = new URL("test_minify.css", base)
  await expect(bundle(url, { minify: false })).resolves.toContain("#ffffff")
  await expect(bundle(url, { minify: true })).not.resolves.toContain("#ffffff")
}, { permissions: { read: true } })

test("`bundle()` handles errors", async () => {
  await expect(bundle(import.meta.url)).rejects.toThrow("Failed to bundle css")
}, { permissions: { read: true } })
