import { test } from "./test.ts"
import { expect } from "./expect.ts"
import { highlight, inspect } from "./highlight.ts"
import { bgWhite, black, gray, green, stripAnsiCode, underline, yellow } from "@std/fmt/colors"
import { runtime } from "./runtime.ts"

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

if (runtime === "deno") {
  for (
    const { inspected, expected } of [
      { inspected: { foo: "bar" }, expected: '{ foo: "bar" }' },
      { inspected: function () {}, expected: "fn" },
      { inspected: AbortSignal.timeout(0), expected: "AbortSignal" },
      { inspected: [function foo() {}], expected: "[ Function ]" },
      { inspected: [function () {}], expected: "[ Function ]" },
      { inspected: [ReferenceError], expected: "[ ReferenceError ]" },
      {
        inspected: [
          class Foo {
            static bar = 1
          },
        ],
        expected: "[ Foo ]",
      },
      { inspected: [DOMException], expected: "[ DOMException ]" },
      { inspected: import.meta, expected: "import.meta" },
    ] as const
  ) {
    test(`\`inspect(${Deno.inspect(inspected)})\` returns \`${expected}\``, () => {
      expect(stripAnsiCode(inspect(inspected))).toBe(expected)
    })
  }
}
