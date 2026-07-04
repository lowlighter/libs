// deno-lint-ignore-file no-external-import
import { diff } from "./diff.ts"
import { expect } from "@libs/testing"
import { readFile } from "node:fs/promises"
import { stripAnsiCode } from "@std/fmt/colors"

async function read(test: string) {
  const a = await readFile(new URL(`testing/${test}/a`, import.meta.url), "utf-8")
  const b = await readFile(new URL(`testing/${test}/b`, import.meta.url), "utf-8")
  const c = await readFile(new URL(`testing/${test}/c`, import.meta.url), "utf-8")
  return { a: a.replaceAll("\r\n", "\n"), b: b.replaceAll("\r\n", "\n"), c: c.replaceAll("\r\n", "\n") }
}

Deno.test("`diff()` handles empty texts", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("empty")
  expect(diff(a, b)).toStrictEqual(c)
})

Deno.test("`diff()` handles identical texts", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("identical")
  expect(diff(a, b)).toStrictEqual(c)
})

for (const newline of ["both", "none", "none_diff", "none_diff_alt", "atob", "atob_diff", "btoa", "btoa_diff"]) {
  Deno.test(`\`diff()\` handles final newline in texts (${newline})`, { permissions: { read: true } }, async () => {
    const { a, b, c } = await read(`newline/${newline}`)
    expect(diff(a, b)).toStrictEqual(c)
  })
}

for (const operation of ["addition", "deletion", "edition"]) {
  Deno.test(`\`diff()\` handles single ${operation}`, { permissions: { read: true } }, async () => {
    const { a, b, c } = await read(`single/${operation}`)
    expect(diff(a, b)).toStrictEqual(c)
  })
}

for (const operation of ["addition", "deletion", "edition"]) {
  Deno.test(`\`diff()\` handles ${operation}s`, { permissions: { read: true } }, async () => {
    const { a, b, c } = await read(`${operation}`)
    expect(diff(a, b)).toStrictEqual(c)
  })
}

Deno.test("`diff()` handles moved lines", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("moved")
  expect(diff(a, b)).toStrictEqual(c)
})

for (const { context, operation } of [{ operation: "separate" }, { operation: "merged", context: 100 }, { operation: "oneline", context: 0 }, { operation: "twolines", context: 2 }]) {
  Deno.test(`\`diff()\` handles ${operation} hunks`, { permissions: { read: true } }, async () => {
    const { a, b, c } = await read(`hunks/${operation}`)
    expect(diff(a, b, { context })).toStrictEqual(c)
  })
}

Deno.test("`diff()` handles complex texts", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("lorem")
  expect(diff(a, b)).toStrictEqual(c)
})

Deno.test("`diff()` handles edits whose context crosses a missing final newline", () => {
  expect(diff("a\na\na\nb", "a\na\nb\na", { context: 0 })).toStrictEqual(
    "--- a\n+++ b\n@@ -3 +2,0 @@\n-a\n@@ -4,0 +4 @@\n+a\n\\ No newline at end of file",
  )
})

Deno.test(`\`diff()\` supports colors options`, { permissions: { read: true } }, async () => {
  for (const colors of [false, true]) {
    const { a, b, c } = await read("colors")
    expect(stripAnsiCode(diff(a, b, { colors }))).toStrictEqual(c)
    if (colors) {
      // deno-lint-ignore no-control-regex
      expect(diff(a, b, { colors })).toMatch(/\x1b\[0m/)
    } else {
      // deno-lint-ignore no-control-regex
      expect(diff(a, b, { colors })).not.toMatch(/\x1b\[0m/)
    }
  }
})
