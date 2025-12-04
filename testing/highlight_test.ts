import { test } from "./test.ts"
import { expect } from "./expect.ts"
import { highlight, inspect } from "./highlight.ts"
import { bgWhite, black, gray, green, stripAnsiCode, underline, yellow } from "@std/fmt/colors"

test("`highlight()` colors code string with ansi", () => {
  expect(highlight("`// foo`")).toBe(gray("// foo"))
  expect(highlight("`'foo'` and `'bar'`")).toBe(`${green("'foo'")} and ${green("'bar'")}`)
})

test("`highlight()` supports header option", () => {
  expect(highlight("foo", { header: "TAG" })).toBe(`${bgWhite(black(" TAG "))} foo`)
})

test("`highlight()` supports underline option", () => {
  expect(highlight("`// foo`", { underline: true })).toBe(underline(gray("// foo")))
})

test("`highlight()` supports type option", () => {
  expect(highlight("`'foo'`", { type: "warn" })).toBe(yellow("'foo'"))
  expect(highlight("`'foo'`", { type: "debug" })).toBe(gray("'foo'"))
})

for (
  const { inspected, expected } of [
    { inspected: { foo: "bar" }, expected: '{ foo: "bar" }' },
    { inspected: function () {}, expected: "fn" },
  ] as const
) {
  test(`\`inspect(${Deno.inspect(inspected)})\` returns \`${expected}\``, () => {
    expect(stripAnsiCode(inspect(inspected))).toBe(expected)
  })
}
