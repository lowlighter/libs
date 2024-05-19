import { bundle } from "./bundle.ts"
import { compatibility, Report } from "./compatibility.ts"
import { expect, fn, test, type testing } from "@libs/testing"
import { encodeBase64 } from "@std/encoding/base64"
;(Report as testing).testing()

const base = new URL("testing/", import.meta.url)

test("deno")("report.for() detects features", async () => {
  const css = await bundle(new URL("test_compatibility.css", base))
  const result = new Report("defaults, ie > 8", { loglevel: -1 }).for(css)
  expect(result.features.list).toContain("properties/backdrop-filter")
  expect(result.browsers.ie["9"].support.unsupported).toHaveProperty("properties/backdrop-filter")
}, { permissions: { read: true } })

test("deno")("report.for() supports advanced usecases", async () => {
  const css = await bundle(new URL("test_compatibility_complex.css", base))
  expect(() => new Report("> 0%", { loglevel: -1 }).for(css)).not.toThrow()
}, { permissions: { read: true } })

test("deno")("report.print() formats and outputs results", async () => {
  const report = new Report("> 0%", { loglevel: -1 })
  const _ = console.log
  try {
    const css = await bundle(new URL("test_compatibility.css", base))
    let text = ""
    const log = fn((message: string) => text = message)
    Object.assign(console, { log })
    for (const output of ["console", "html"] as const) {
      // Summary
      text = report.for(css).print({ output, view: "browsers", verbose: false, style: false })
      if (output === "html") {
        expect(text).toMatch(/^<table.*?>[\s\S]+<\/table>$/)
      }
      if (output === "console") {
        expect(log).toBeCalledTimes(1)
      }
      expect(text).toContain("100%")
      expect(text).not.toContain("backdrop-filter: blur()")
      // Details
      text = report.for(css).print({ output, view: "browsers", verbose: true, style: false })
      if (output === "html") {
        expect(text).toMatch(/^<table.*?>[\s\S]+<\/table>$/)
      }
      if (output === "console") {
        expect(log).toBeCalledTimes(2)
      }
      expect(text).toContain("100%")
      expect(text).toContain("backdrop-filter: blur()")
    }
    // Force coverage of colors
    for (const pass of [7, 8, 9, 10, NaN]) {
      const css = Number.isNaN(pass) ? await bundle(new URL("test_compatibility_print.css", base)) : `:root { ${new Array(pass).fill(null).map((_, i) => `-debug-pass-${i}: 1px`).join(";")}; ${new Array(10 - pass).fill(null).map((_, i) => `-debug-fail-${i}: 1px`).join(";")} }`
      for (const output of ["console", "html"] as const) {
        const report = new Report(Number.isNaN(pass) ? "> 0%" : "last 2 chrome versions", { loglevel: -1 })
        report.for(css).print({ output, view: "browsers", verbose: true })
      }
    }
  } finally {
    Object.assign(console, { log: _ })
  }
}, { permissions: { read: true } })

test("deno")("compatibility() supports printing reports", async () => {
  const input = "body { color: salmon; }"
  await expect(compatibility(input, { output: "html", style: false })).resolves.toMatch(/^<table.*?>[\s\S]+<\/table>$/)
  await expect(compatibility(new URL(`data:text/css;base64,${encodeBase64(input)}`), { output: "html", style: false })).resolves.toMatch(/^<table.*?>[\s\S]+<\/table>$/)
  const _ = console.log
  try {
    const log = fn()
    Object.assign(console, { log })
    await compatibility(input, { output: "console" })
    expect(log).toBeCalledTimes(1)
  } finally {
    Object.assign(console, { log: _ })
  }
}, { permissions: { read: true } })
