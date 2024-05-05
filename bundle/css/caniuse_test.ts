import { bundle } from "./bundle.ts"
import { caniuse } from "./caniuse.ts"
import { expect } from "jsr:@std/expect/expect"

const base = new URL("testing/", import.meta.url)

const css = await bundle(new URL("test_caniuse.css", base))

Deno.test("caniuse() detects features", { permissions: { read: true } }, () => {
  const result = caniuse("defaults, ie > 8", css)
  expect(result.features).toContain("css-backdrop-filter")
  expect(result.report.ie["9"].missing).toHaveProperty("css-backdrop-filter")
})

Deno.test("caniuse() supports table option", { permissions: { read: true } }, () => {
  // Summary
  let table = caniuse("defaults, ie > 8", css, { table: "summary" })
  expect(table).toMatch(/^<table.*?>[\s\S]+<\/table>$/)
  expect(table).not.toContain("100%")
  expect(table).not.toContain("css-backdrop-filter")
  expect(table).not.toContain("backdrop-filter: blur(1px)")
  // Details
  table = caniuse("defaults, ie > 8", css, { table: "details" })
  expect(table).toMatch(/^<table.*?>[\s\S]+<\/table>$/)
  expect(table).toContain("100%")
  expect(table).not.toContain("css-backdrop-filter")
  expect(table).not.toContain("backdrop-filter: blur(1px)")
  // Verbose
  table = caniuse("defaults, ie > 8", css, { table: "verbose" })
  expect(table).toMatch(/^<table.*?>[\s\S]+<\/table>$/)
  expect(table).toContain("100%")
  expect(table).toContain("css-backdrop-filter")
  expect(table).not.toContain("backdrop-filter: blur(1px)")
  // Verbose Plus
  table = caniuse("defaults, ie > 8", css, { table: "verbose-plus" })
  expect(table).toMatch(/^<table.*?>[\s\S]+<\/table>$/)
  expect(table).toContain("100%")
  expect(table).toContain("css-backdrop-filter")
  expect(table).toContain("backdrop-filter: blur(1px)")
})

Deno.test("caniuse() mimics upstream behaviour", { permissions: { read: true } }, async () => {
  for (const table of ["summary", "details", "verbose", "verbose-plus"] as const) {
    expect(caniuse("> 0%", await bundle(new URL("test_caniuse_complex.css", base)), { table })).not.toThrow()
  }
})
