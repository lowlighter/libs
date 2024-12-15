// deno-lint-ignore-file no-external-import
import { apply } from "./apply.ts"
import { expect, test, throws } from "@libs/testing"
import { readFile } from "node:fs/promises"

async function read(test: string) {
  const a = await readFile(new URL(`testing/${test}/a`, import.meta.url), "utf-8")
  const b = await readFile(new URL(`testing/${test}/b`, import.meta.url), "utf-8")
  const c = await readFile(new URL(`testing/${test}/c`, import.meta.url), "utf-8")
  return { a: a.replaceAll("\r\n", "\n"), b: b.replaceAll("\r\n", "\n"), c: c.replaceAll("\r\n", "\n") }
}

test("`apply()` handles empty texts", async () => {
  const { a, b, c } = await read("empty")
  expect(apply(a, c)).toStrictEqual(b)
}, { permissions: { read: true } })

test("`apply()` handles identical texts", async () => {
  const { a, b, c } = await read("identical")
  expect(apply(a, c)).toStrictEqual(b)
}, { permissions: { read: true } })

for (const newline of ["both", "none", "none_diff", "none_diff_alt", "atob", "atob_diff", "btoa", "btoa_diff"]) {
  test(`\`apply()\` handles final newline in texts (${newline})`, async () => {
    const { a, b, c } = await read(`newline/${newline}`)
    expect(apply(a, c)).toStrictEqual(b)
  }, { permissions: { read: true } })
}

for (const operation of ["addition", "deletion", "edition"]) {
  test(`\`apply()\` handles single ${operation}`, async () => {
    const { a, b, c } = await read(`single/${operation}`)
    expect(apply(a, c)).toStrictEqual(b)
  }, { permissions: { read: true } })
}

for (const operation of ["addition", "deletion", "edition"]) {
  test(`\`apply()\` handles ${operation}s`, async () => {
    const { a, b, c } = await read(`${operation}`)
    expect(apply(a, c)).toStrictEqual(b)
  }, { permissions: { read: true } })
}

test("`apply()` handles moved lines", async () => {
  const { a, b, c } = await read("moved")
  expect(apply(a, c)).toStrictEqual(b)
}, { permissions: { read: true } })

for (
  const { operation } of [
    { operation: "separate" },
    { operation: "merged", context: 100 },
    { operation: "oneline", context: 0 },
    { operation: "twolines", context: 2 },
  ]
) {
  test(`\`apply()\` handles ${operation} hunks`, async () => {
    const { a, b, c } = await read(`hunks/${operation}`)
    expect(apply(a, c)).toStrictEqual(b)
  }, { permissions: { read: true } })
}

test("`apply()` handles complex texts", async () => {
  const { a, b, c } = await read("lorem")
  expect(apply(a, c)).toStrictEqual(b)
}, { permissions: { read: true } })

test("`apply()` validates hunk header for text b lines", async () => {
  const error = await new Promise<AggregateError>((resolve, reject) => {
    try {
      resolve(apply(
        "",
        `
--- a
+++ b
@@ -0,0 +1,999 @@
+Lorem ipsum dolor sit amet
`.trim(),
      ) as unknown as AggregateError)
    } catch (error) {
      reject(error)
    }
  }).catch((error) => error)
  expect(error).toBeInstanceOf(AggregateError)
  expect(error.errors).toHaveLength(1)
  expect(() => throws(error.errors[0])).toThrow(SyntaxError, "Patch 1: hunk header text b count mismatch (expected 999, actual 1)")
}, { permissions: { read: true } })

test("`apply()` validates hunk header for text a lines", async () => {
  const error = await new Promise<AggregateError>((resolve, reject) => {
    try {
      resolve(apply(
        "Lorem ipsum dolor sit amet",
        `
--- a
+++ b
@@ -1,999 +0,0 @@
-Lorem ipsum dolor sit amet
`.trim(),
      ) as unknown as AggregateError)
    } catch (error) {
      reject(error)
    }
  }).catch((error) => error)
  expect(error).toBeInstanceOf(AggregateError)
  expect(error.errors).toHaveLength(1)
  expect(() => throws(error.errors[0])).toThrow(SyntaxError, "Patch 1: hunk header text a count mismatch (expected 999, actual 1)")
}, { permissions: { read: true } })

test("`apply()` validates deleted lines", async () => {
  const error = await new Promise<AggregateError>((resolve, reject) => {
    try {
      resolve(apply(
        "Lorem ipsum dolor sit amet",
        `
--- a
+++ b
@@ -1 +0,0 @@
-Consectetur adipiscing elit
`.trim(),
      ) as unknown as AggregateError)
    } catch (error) {
      reject(error)
    }
  }).catch((error) => error)
  expect(error).toBeInstanceOf(AggregateError)
  expect(error.errors).toHaveLength(1)
  expect(() => throws(error.errors[0])).toThrow(SyntaxError, `Patch 1: line 0 mismatch (expected "Consectetur adipiscing elit", actual "Lorem ipsum dolor sit amet")`)
}, { permissions: { read: true } })

test("`apply()` validates context lines", async () => {
  const error = await new Promise<AggregateError>((resolve, reject) => {
    try {
      resolve(apply(
        "Lorem ipsum dolor sit amet",
        `
--- a
+++ b
@@ -0,0 +0,0 @@
 Consectetur adipiscing elit
`.trim(),
      ) as unknown as AggregateError)
    } catch (error) {
      reject(error)
    }
  }).catch((error) => error)
  expect(error).toBeInstanceOf(AggregateError)
  expect(error.errors).toHaveLength(1)
  expect(() => throws(error.errors[0])).toThrow(SyntaxError, `Patch 1: line -1 mismatch (expected "Consectetur adipiscing elit", actual "")`)
}, { permissions: { read: true } })
