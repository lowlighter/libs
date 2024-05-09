import { bundle } from "./bundle.ts"
import { compatibility, Report } from "./compatibility.ts"
import { expect, fn } from "jsr:@std/expect"
import type { test } from "jsr:@libs/typing@1"
;(Report as test).testing()

const base = new URL("testing/", import.meta.url)

Deno.test("report.for() detects features", { permissions: { read: true } }, async () => {
  const css = await bundle(new URL("test_compatibility.css", base))
  const result = new Report("defaults, ie > 8", { loglevel: -1 }).for(css)
  expect(result.features.list).toContain("properties/backdrop-filter")
  expect(result.browsers.ie["9"].support.unsupported).toHaveProperty("properties/backdrop-filter")
})

Deno.test("report.for() supports advanced usecases", { permissions: { read: true } }, async () => {
  const css = await bundle(new URL("test_compatibility_complex.css", base))
  expect(() => new Report("> 0%", { loglevel: -1 }).for(css)).not.toThrow()
})

Deno.test("report.print() formats and outputs results", { permissions: { read: true } }, async () => {
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
})

Deno.test("compatibility() supports printing reports", { permissions: { read: true } }, async () => {
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
})
