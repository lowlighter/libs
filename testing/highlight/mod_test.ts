import { expect } from "../expect.ts"
import { highlight, inspect } from "./mod.ts"
import { cyan, gray, green, red, stripAnsiCode, underline, yellow } from "@std/fmt/colors"

Deno.test("`highlight()` colors code string within backticks with ansi", () => {
  expect(highlight("`// foo`")).toBe(gray("// foo"))
  expect(highlight("`'foo'` and `'bar'`")).toBe(`${green("'foo'")} and ${green("'bar'")}`)
  expect(highlight("foo")).toBe("foo")
})

Deno.test("`highlight()` supports underline option", () => {
  expect(highlight("`// foo`", { underline: true })).toBe(underline(gray("// foo")))
})

Deno.test("`highlight()` supports raw option", () => {
  expect(highlight("// foo", { raw: true })).toBe(gray("// foo"))
  expect(highlight("// foo", { raw: true, underline: true })).toBe(underline(gray("// foo")))
})

Deno.test("`highlight()` supports language option", () => {
  expect(highlight("// foo", { raw: true, language: "typescript" })).toBe(gray("// foo"))
  expect(highlight("color: red", { raw: true, language: "css" })).toBe(`${cyan("color")}: red`)
  expect(highlight("> foo", { raw: true, language: "markdown" })).toBe(gray("> foo"))
  expect(highlight("<!-- foo -->", { raw: true, language: "html" })).toBe(gray("<!-- foo -->"))
  expect(highlight("+foo\n-bar", { raw: true, language: "diff" })).toBe(`${green("+foo")}\n${red("-bar")}`)
  expect(highlight("foo: bar", { raw: true, language: "yaml" })).toBe(`${cyan("foo:")} ${green("bar")}`)
  expect(highlight('{"foo": 1}', { raw: true, language: "json" })).toBe(`{${cyan('"foo"')}: ${yellow("1")}}`)
  expect(() => highlight("foo", { raw: true, language: "<unknown>" })).toThrow("Unknown language")
})

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
  Deno.test(`\`inspect(${Deno.inspect(inspected)})\` returns \`${expected}\``, () => {
    expect(stripAnsiCode(inspect(inspected))).toBe(expected)
  })
}
