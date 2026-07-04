import { blame } from "./blame.ts"
import { diff } from "./diff.ts"
import { expect, throws } from "@libs/testing"

function trap(patches: string[]) {
  let error: AggregateError | undefined
  try {
    blame(patches)
  } catch (caught) {
    error = caught as AggregateError
  }
  expect(error).toBeInstanceOf(AggregateError)
  expect(error!.errors).toHaveLength(1)
  return error!.errors[0]
}

Deno.test("`blame()` attributes lines to their originating patch", () => {
  const a = "foo\nbar\n"
  const b = "foo\nbaz\nqux\n"
  expect(blame([
    diff("", a, { header: "first" }),
    diff(a, b, { header: "second" }),
  ])).toStrictEqual([
    ["foo\n", "first"],
    ["baz\n", "second"],
    ["qux\n", "second"],
  ])
})

Deno.test("`blame()` handles empty and blank patches", () => {
  expect(blame([])).toStrictEqual([])
  expect(blame([""])).toStrictEqual([])
  expect(blame([diff("foo\n", "foo\n")])).toStrictEqual([])
})

Deno.test("`blame()` defaults metadata to the patch index when the header is absent", () => {
  const a = "foo\n"
  const b = "foo\nbar\n"
  expect(blame([
    diff("", a),
    diff(a, b),
  ])).toStrictEqual([
    ["foo\n", "0"],
    ["bar\n", "1"],
  ])
})

Deno.test("`blame()` keeps the trailing newline state of lines", () => {
  const a = "foo\nbar"
  expect(blame([diff("", a)]).map(([line]) => line).join("")).toStrictEqual(a)
  expect(blame([diff("", a)])).toStrictEqual([
    ["foo\n", "0"],
    ["bar", "0"],
  ])
})

Deno.test("`blame()` supports custom metadata parsers", () => {
  const a = "foo\n"
  const b = "foo\nbar\n"
  expect(blame([
    diff("", a),
    diff(a, b),
  ], { parser: (_, index) => ({ index }) })).toStrictEqual([
    ["foo\n", { index: 0 }],
    ["bar\n", { index: 1 }],
  ])
})

Deno.test("`blame()` replaces string metadata of moved lines", () => {
  const a = "foo\nbar\nbaz\n"
  const b = "baz\nfoo\nbar\nqux\n"
  expect(blame([
    diff("", a, { header: "first" }),
    diff(a, b, { header: "second" }),
  ])).toStrictEqual([
    ["baz\n", "second"],
    ["foo\n", "first"],
    ["bar\n", "first"],
    ["qux\n", "second"],
  ])
})

Deno.test("`blame()` replaces only the moving properties of object metadata of moved lines", () => {
  const a = "foo\nbar\nbaz\n"
  const b = "baz\nfoo\nbar\nqux\n"
  expect(blame<{ index: number; author?: string }>([
    diff("", a),
    diff(a, b),
  ], { parser: (_, index) => index ? { index } : { index, author: "alice" } })).toStrictEqual([
    ["baz\n", { index: 1, author: "alice" }],
    ["foo\n", { index: 0, author: "alice" }],
    ["bar\n", { index: 0, author: "alice" }],
    ["qux\n", { index: 1 }],
  ])
})

Deno.test("`blame()` gives each line its own copy of object metadata", () => {
  const [[, x], [, y]] = blame([diff("", "foo\nbar\n")], { parser: (_, index) => ({ index }) })
  expect(x).not.toBe(y)
  expect(x).toStrictEqual(y)
})

Deno.test("`blame()` reconstructs the patched text", () => {
  const versions = ["", "foo\nbar\n", "foo\nbaz\nqux\n", "qux\nfoo\nbaz"]
  const patches = versions.slice(1).map((version, i) => diff(versions[i], version))
  expect(blame(patches).map(([line]) => line).join("")).toStrictEqual(versions.at(-1)!)
})

Deno.test("`blame()` handles empty context lines", () => {
  expect(blame([
    diff("", "\nfoo\n"),
    "--- a\n+++ b\n@@ -1,2 +1,2 @@\n\n-foo\n+bar\n",
  ])).toStrictEqual([
    ["\n", "0"],
    ["bar\n", "1"],
  ])
})

Deno.test("`blame()` validates removed lines", () => {
  expect(() => throws(trap(["--- a\n+++ b\n@@ -1 +1 @@\n-foo\n+bar"]))).toThrow(SyntaxError, `Patch 1: line 0 mismatch (expected "foo", actual "")`)
  expect(() => throws(trap([diff("", "foo\n"), "--- a\n+++ b\n@@ -1 +1 @@\n-bar\n+baz\n"]))).toThrow(SyntaxError, `Patch 1: line 0 mismatch (expected "bar", actual "foo")`)
})

Deno.test("`blame()` validates context lines", () => {
  expect(() => throws(trap([diff("", "foo\nbar\n"), "--- a\n+++ b\n@@ -1,2 +1,2 @@\n qux\n-bar\n+baz\n"]))).toThrow(SyntaxError, `Patch 1: line 0 mismatch (expected "qux", actual "foo")`)
  expect(() => throws(trap(["--- a\n+++ b\n@@ -1 +1 @@\n foo\n"]))).toThrow(SyntaxError, `Patch 1: line 0 mismatch (expected "foo", actual "")`)
})

Deno.test("`blame()` validates empty context lines", () => {
  expect(() => throws(trap([diff("", "foo\n"), "--- a\n+++ b\n@@ -1,2 +1,2 @@\n\n-foo\n+bar\n"]))).toThrow(SyntaxError, `Patch 1: line 0 mismatch (expected "", actual "foo")`)
  expect(() => throws(trap(["--- a\n+++ b\n@@ -1 +1 @@\n\n"]))).toThrow(SyntaxError, `Patch 1: line 0 mismatch (expected "", actual "")`)
})

Deno.test("`blame()` validates hunk header counts", () => {
  expect(() => throws(trap([diff("", "foo\n"), "--- a\n+++ b\n@@ -1,2 +1 @@\n-foo\n+bar\n"]))).toThrow(SyntaxError, "Patch 1: hunk header text a count mismatch (expected 2, actual 1)")
  expect(() => throws(trap([diff("", "foo\n"), "--- a\n+++ b\n@@ -1 +1,2 @@\n-foo\n+bar\n"]))).toThrow(SyntaxError, "Patch 1: hunk header text b count mismatch (expected 2, actual 1)")
})
