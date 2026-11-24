// deno-lint-ignore-file no-external-import
import { diff, DiffLimitExceededError, tokenize } from "./diff.ts"
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

Deno.test("`diff()` minimally diffs regions of duplicate lines (matching the `diff` command line tool)", () => {
  // No unique line to anchor on: the Myers fallback keeps common lines as context instead of deleting then re-adding them
  expect(diff("a\na\na", "b\na\na")).toStrictEqual("--- a\n+++ b\n@@ -1,3 +1,3 @@\n-a\n+b\n a\n a\n\\ No newline at end of file\n")
  // Common lines kept in the interior of the region (Myers snake) as well as at its boundaries
  expect(diff("a\na\na\na\n", "a\nb\na\nb\n")).toStrictEqual("--- a\n+++ b\n@@ -1,4 +1,4 @@\n a\n+b\n a\n-a\n-a\n+b\n")
  expect(diff("x\na\na\nx", "x\nb\na\nx")).toStrictEqual("--- a\n+++ b\n@@ -1,4 +1,4 @@\n x\n-a\n+b\n a\n x\n\\ No newline at end of file\n")
})

Deno.test("`diff()` handles edits whose context crosses a missing final newline", () => {
  expect(diff("a\na\na\nb", "a\na\nb\na", { context: 0 })).toStrictEqual("--- a\n+++ b\n@@ -3,2 +3,2 @@\n-a\n-b\n\\ No newline at end of file\n+b\n+a\n\\ No newline at end of file\n")
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

Deno.test("`tokenize()` preserves carriage returns and escape sequences", () => {
  expect(tokenize("\r\nfoo\r\n\x1b[31mbar\x1b[0m\r")).toStrictEqual(["\r\n", "foo\r\n", "\x1b[31mbar\x1b[0m\r"])
})

Deno.test("`diff()` detects line ending changes and preserves literal ANSI content", () => {
  expect(diff("foo\r\n", "foo\n", { normalizeCarriageReturn: false })).toStrictEqual("--- a\n+++ b\n@@ -1 +1 @@\n-foo\r\n+foo\n")
  expect(diff("\x1b[31mfoo\x1b[0m\n", "\x1b[32mfoo\x1b[0m\n")).toStrictEqual("--- a\n+++ b\n@@ -1 +1 @@\n-\x1b[31mfoo\x1b[0m\n+\x1b[32mfoo\x1b[0m\n")
})

Deno.test("`diff()` optionally normalizes CRLF line endings", () => {
  expect(diff("foo\r\n", "foo\n", { normalizeCarriageReturn: true })).toStrictEqual("")
  expect(diff("foo\r\n", "foo\n")).toStrictEqual("")
  expect(diff("foo\r\n", "bar\r\n", { normalizeCarriageReturn: true })).toStrictEqual(diff("foo\n", "bar\n"))
  expect(diff("foo\r", "foo", { normalizeCarriageReturn: true })).toStrictEqual(diff("foo\r", "foo"))
})

Deno.test("`diff()` validates maximum edit distances", () => {
  for (const limit of [-1, -0.5, -Infinity])
    expect(() => diff("", "", { limit })).toThrow(TypeError, `Invalid limit ${limit}: expected a non-negative limit`)
})

Deno.test("`diff()` counts inserted and deleted lines against an inclusive limit", () => {
  for (const [a, b, distance] of [["", "", 0], ["a\n", "a\n", 0], ["", "a\nb\n", 2], ["a\nb\n", "", 2], ["a\n", "b\n", 2], ["a\n", "a", 2]] as const) {
    expect(diff(a, b, { limit: distance })).toStrictEqual(diff(a, b))
    if (distance)
      expect(() => diff(a, b, { limit: distance - 1 })).toThrow(DiffLimitExceededError)
  }
  expect(() => diff("a\n", "b\n", { limit: 0 })).toThrow(DiffLimitExceededError, "Diff exceeds limit 0")
  expect(diff("a\r\n", "a\n", { limit: 0 })).toStrictEqual("")
})

Deno.test("`diff()` shares the edit budget across recursive regions", () => {
  const a = "old\nanchor\na\na\nnext\nend\n"
  const b = "new\nanchor\nb\na\nnext\nfinish\n"
  expect(diff(a, b, { limit: 6 })).toStrictEqual(diff(a, b))
  for (const limit of [0, 2, 4, 5])
    expect(() => diff(a, b, { limit })).toThrow(DiffLimitExceededError)
})

Deno.test("`diff()` bounds duplicate-line searches with a small remaining budget", () => {
  const a = "a\n".repeat(20000)
  const b = "b\n".repeat(20000)
  expect(() => diff(a, b, { limit: 2 })).toThrow(DiffLimitExceededError)
  expect(diff("a\na\na\n", "b\na\nb\n", { limit: 4 })).toStrictEqual(diff("a\na\na\n", "b\na\nb\n"))
})

Deno.test("`diff()` rejects an imbalanced later region before allocating its search trace", () => {
  const a = "old\nanchor\ntail\n"
  const b = "new\nanchor\nextra\ntail\n"
  expect(diff(a, b, { limit: 3 })).toStrictEqual(diff(a, b))
  expect(() => diff(a, b, { limit: 2 })).toThrow(DiffLimitExceededError)
})

Deno.test("`diff()` accepts an explicit infinite limit", () => {
  const a = "old\nanchor\na\na\n"
  const b = "new\nanchor\nb\na\nextra\n"
  expect(diff(a, b, { limit: Infinity })).toStrictEqual(diff(a, b))
})
