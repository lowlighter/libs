// deno-lint-ignore-file no-external-import
import { apply } from "./apply.ts"
import { diff } from "./diff.ts"
import { expect, throws } from "@libs/testing"
import { readFile } from "node:fs/promises"

async function read(test: string) {
  const a = await readFile(new URL(`testing/${test}/a`, import.meta.url), "utf-8")
  const b = await readFile(new URL(`testing/${test}/b`, import.meta.url), "utf-8")
  const c = await readFile(new URL(`testing/${test}/c`, import.meta.url), "utf-8")
  return { a: a.replaceAll("\r\n", "\n"), b: b.replaceAll("\r\n", "\n"), c: c.replaceAll("\r\n", "\n") }
}

Deno.test("`apply()` handles empty texts", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("empty")
  expect(apply(a, c)).toStrictEqual(b)
})

Deno.test("`apply()` handles identical texts", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("identical")
  expect(apply(a, c)).toStrictEqual(b)
})

for (const newline of ["both", "none", "none_diff", "none_diff_alt", "atob", "atob_diff", "btoa", "btoa_diff"]) {
  Deno.test(`\`apply()\` handles final newline in texts (${newline})`, { permissions: { read: true } }, async () => {
    const { a, b, c } = await read(`newline/${newline}`)
    expect(apply(a, c)).toStrictEqual(b)
  })
}

for (const operation of ["addition", "deletion", "edition"]) {
  Deno.test(`\`apply()\` handles single ${operation}`, { permissions: { read: true } }, async () => {
    const { a, b, c } = await read(`single/${operation}`)
    expect(apply(a, c)).toStrictEqual(b)
  })
}

for (const operation of ["addition", "deletion", "edition"]) {
  Deno.test(`\`apply()\` handles ${operation}s`, { permissions: { read: true } }, async () => {
    const { a, b, c } = await read(`${operation}`)
    expect(apply(a, c)).toStrictEqual(b)
  })
}

Deno.test("`apply()` handles moved lines", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("moved")
  expect(apply(a, c)).toStrictEqual(b)
})

for (
  const { operation } of [
    { operation: "separate" },
    { operation: "merged", context: 100 },
    { operation: "oneline", context: 0 },
    { operation: "twolines", context: 2 },
  ]
) {
  Deno.test(`\`apply()\` handles ${operation} hunks`, { permissions: { read: true } }, async () => {
    const { a, b, c } = await read(`hunks/${operation}`)
    expect(apply(a, c)).toStrictEqual(b)
  })
}

Deno.test("`apply()` handles complex texts", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("lorem")
  expect(apply(a, c)).toStrictEqual(b)
})

Deno.test("`apply()` handles edits whose context crosses a missing final newline", () => {
  const a = "a\na\na\nb"
  const b = "a\na\nb\na"
  expect(apply(a, diff(a, b, { context: 0 }))).toStrictEqual(b)
})

Deno.test("`apply()` validates hunk header for text b lines", { permissions: { read: true } }, async () => {
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
})

Deno.test("`apply()` validates hunk header for text a lines", { permissions: { read: true } }, async () => {
  const error = await new Promise<AggregateError>((resolve, reject) => {
    try {
      resolve(apply(
        "Lorem ipsum dolor sit amet",
        `
--- a
+++ b
@@ -1,999 +0,0 @@
-Lorem ipsum dolor sit amet
\\ No newline at end of file
`.trim(),
      ) as unknown as AggregateError)
    } catch (error) {
      reject(error)
    }
  }).catch((error) => error)
  expect(error).toBeInstanceOf(AggregateError)
  expect(error.errors).toHaveLength(1)
  expect(() => throws(error.errors[0])).toThrow(SyntaxError, "Patch 1: hunk header text a count mismatch (expected 999, actual 1)")
})

Deno.test("`apply()` validates deleted lines", { permissions: { read: true } }, async () => {
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
})

Deno.test("`apply()` validates context lines", { permissions: { read: true } }, async () => {
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
  expect(() => throws(error.errors[0])).toThrow(SyntaxError, `Patch 1: line 0 mismatch (expected "Consectetur adipiscing elit", actual "Lorem ipsum dolor sit amet")`)
})

Deno.test("`apply()` accepts empty context lines rendered as a bare newline", () => {
  expect(apply("a\n\nb\n", "--- a\n+++ b\n@@ -1,3 +1,3 @@\n a\n\n-b\n+c\n")).toStrictEqual("a\n\nc\n")
})

Deno.test("`apply()` validates empty context lines", () => {
  let error: AggregateError | undefined
  try {
    apply("hello\n", "--- a\n+++ b\n@@ -1 +1 @@\n\n")
  } catch (caught) {
    error = caught as AggregateError
  }
  expect(error).toBeInstanceOf(AggregateError)
  expect(error!.errors).toHaveLength(1)
  expect(() => throws(error!.errors[0])).toThrow(SyntaxError, `Patch 1: line 0 mismatch (expected "", actual "hello")`)
})

Deno.test("`apply()` inserts into an empty file without reversing lines", () => {
  expect(apply("", diff("", "a\nb\nc"))).toStrictEqual("a\nb\nc")
})

Deno.test("`apply()` keeps the trailing newline when a deletion at EOF drops a no-newline line", () => {
  expect(apply("a\nb\nc", diff("a\nb\nc", "a\nb\n"))).toStrictEqual("a\nb\n")
  expect(apply("a\na\na", diff("a\na\na", "a\na\n"))).toStrictEqual("a\na\n")
})

Deno.test("`diff()`/`apply()` round-trip previously broken edge cases", () => {
  const cases: Array<[string, string]> = [
    // append to a file without a final newline
    ["a\nb", "a\nb\nc"],
    // insert into an empty file, starting with a blank line
    ["", "\na\n"],
    // change preceding a trailing empty context line
    ["a\nb\n\n", "a\nc\n\n"],
    // duplicate lines with a leading change and no final newline
    ["a\na\na", "b\na\na"],
    // blank line kept as context between changes
    ["a\n\nb\n", "a\n\nc\n"],
  ]
  for (const [a, b] of cases) {
    for (const context of [0, 1, 3])
      expect(apply(a, diff(a, b, { context }))).toStrictEqual(b)
  }
})
