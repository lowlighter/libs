// deno-lint-ignore-file no-external-import
import { diff } from "./diff.ts"
import { expect, test } from "@libs/testing"
import { readFile } from "node:fs/promises"
import { stripAnsiCode } from "@std/fmt/colors"

async function read(test: string) {
  const a = await readFile(new URL(`testing/${test}/a`, import.meta.url), "utf-8")
  const b = await readFile(new URL(`testing/${test}/b`, import.meta.url), "utf-8")
  const c = await readFile(new URL(`testing/${test}/c`, import.meta.url), "utf-8")
  return { a: a.replaceAll("\r\n", "\n"), b: b.replaceAll("\r\n", "\n"), c: c.replaceAll("\r\n", "\n") }
}

test("`diff()` handles empty texts", async () => {
  const { a, b, c } = await read("empty")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("`diff()` handles identical texts", async () => {
  const { a, b, c } = await read("identical")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

for (const newline of ["both", "none", "atob", "atob_diff", "btoa", "btoa_diff"]) {
  test(`\`diff()\` handles final newline in texts (${newline})`, async () => {
    const { a, b, c } = await read(`newline/${newline}`)
    expect(diff(a, b)).toStrictEqual(c)
  }, { permissions: { read: true } })
}

for (const operation of ["addition", "deletion", "edition"]) {
  test(`\`diff()\` handles single ${operation}`, async () => {
    const { a, b, c } = await read(`single/${operation}`)
    expect(diff(a, b)).toStrictEqual(c)
  }, { permissions: { read: true } })
}

for (const operation of ["addition", "deletion", "edition"]) {
  test(`\`diff()\` handles ${operation}s`, async () => {
    const { a, b, c } = await read(`${operation}`)
    expect(diff(a, b)).toStrictEqual(c)
  }, { permissions: { read: true } })
}

test("`diff()` handles moved lines", async () => {
  const { a, b, c } = await read("moved")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

for (const {context, operation} of [{operation:"separate"}, {operation:"merged", context: 100}, {operation:"oneline", context: 0}, {operation:"twolines", context: 2}]) {
  test(`\`diff()\` handles ${operation} hunks`, async () => {
    const { a, b, c } = await read(`hunks/${operation}`)
    expect(diff(a, b, {context})).toStrictEqual(c)
  }, { permissions: { read: true } })
}

test("`diff()` handles complex texts", async () => {
  const { a, b, c } = await read("lorem")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

  test(`\`diff()\` supports colors options`, async () => {
    for (const colors of [false, true]) {
      const { a, b, c } = await read("colors")
      expect(stripAnsiCode(diff(a, b, {colors}))).toStrictEqual(c)
      if (colors) {
        // deno-lint-ignore no-control-regex
        expect(diff(a, b, {colors})).toMatch(/\x1b\[0m/)
      }
      else {
        // deno-lint-ignore no-control-regex
        expect(diff(a, b, {colors})).not.toMatch(/\x1b\[0m/)
      }
    }
  }, { permissions: { read: true } })