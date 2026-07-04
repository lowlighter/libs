// deno-lint-ignore-file no-console
import { qrcode } from "./_qrcode.ts"
import { expect, fn } from "@libs/testing"

Deno.test("`qrcode()` for numeric mode", () => {
  const expected = [
    "                                                  ",
    "                                                  ",
    "    ██████████████  ████████    ██████████████    ",
    "    ██          ██      ██  ██  ██          ██    ",
    "    ██  ██████  ██    ██  ██    ██  ██████  ██    ",
    "    ██  ██████  ██  ██    ████  ██  ██████  ██    ",
    "    ██  ██████  ██      ██      ██  ██████  ██    ",
    "    ██          ██    ██    ██  ██          ██    ",
    "    ██████████████  ██  ██  ██  ██████████████    ",
    "                      ██  ████                    ",
    "        ██  ██████  ████  ██  ██      ██    ██    ",
    "    ██  ████████      ██████████  ██  ██    ██    ",
    "      ████████████  ██████    ██  ██    ██        ",
    "    ██    ████      ████  ██    ████████    ██    ",
    "    ██████████████    ████  ██  ████    ██████    ",
    "                    ██                  ████      ",
    "    ██████████████      ████████    ██    ██      ",
    "    ██          ██  ████  ██  ████      ████      ",
    "    ██  ██████  ██  ██  ████        ██  ██  ██    ",
    "    ██  ██████  ██    ██████████████  ██  ██      ",
    "    ██  ██████  ██  ██████  ██    ██  ████  ██    ",
    "    ██          ██    ██  ████    ██████          ",
    "    ██████████████        ████  ████  ████  ██    ",
    "                                                  ",
    "                                                  ",
  ].map((line) => [...line].map((v, i) => !(i % 2) ? v : null).filter((v) => v).map((v) => v === "█"))
  expect(qrcode("123")).toEqual(expected)
})

Deno.test("`qrcode()` for alphanumeric mode", () => {
  const expected = [
    "                                                  ",
    "                                                  ",
    "    ██████████████  ████  ██    ██████████████    ",
    "    ██          ██    ████  ██  ██          ██    ",
    "    ██  ██████  ██      ██  ██  ██  ██████  ██    ",
    "    ██  ██████  ██  ████  ████  ██  ██████  ██    ",
    "    ██  ██████  ██    ██  ██    ██  ██████  ██    ",
    "    ██          ██        ██    ██          ██    ",
    "    ██████████████  ██  ██  ██  ██████████████    ",
    "                      ██                          ",
    "        ██  ██████  ████  ██████      ██    ██    ",
    "    ████  ████    ██      ██    ██          ██    ",
    "        ████████████    ██    ████  ██            ",
    "        ██    ██    ██████████████    ██    ██    ",
    "        ██  ██  ████  ████  ██████  ██  ██        ",
    "                    ████      ██  ██  ██  ████    ",
    "    ██████████████          ████████    ██        ",
    "    ██          ██  ████          ██████          ",
    "    ██  ██████  ██  ██            ██    ██  ██    ",
    "    ██  ██████  ██    ████      ██      ████      ",
    "    ██  ██████  ██  ██  ████  ██    ██      ██    ",
    "    ██          ██    ████    ████      ██████    ",
    "    ██████████████    ████  ██      ██  ██  ██    ",
    "                                                  ",
    "                                                  ",
  ].map((line) => [...line].map((v, i) => !(i % 2) ? v : null).filter((v) => v).map((v) => v === "█"))
  expect(qrcode("FOO")).toEqual(expected)
})

Deno.test("`qrcode()` for bytes mode", () => {
  const expected = [
    "                                                  ",
    "                                                  ",
    "    ██████████████  ████        ██████████████    ",
    "    ██          ██    ██        ██          ██    ",
    "    ██  ██████  ██  ██  ████    ██  ██████  ██    ",
    "    ██  ██████  ██      ██  ██  ██  ██████  ██    ",
    "    ██  ██████  ██  ██      ██  ██  ██████  ██    ",
    "    ██          ██              ██          ██    ",
    "    ██████████████  ██  ██  ██  ██████████████    ",
    "                    ████                          ",
    "              ████      ██      ██  ██  ██  ██    ",
    "      ████████            ████    ██████          ",
    "          ████████              ████  ██  ██      ",
    "        ██  ██    ██  ██  ████  ████  ████  ██    ",
    "    ████  ██    ██  ██████  ██    ██████    ██    ",
    "                    ██████████        ██    ██    ",
    "    ██████████████          ██  ██  ████  ██      ",
    "    ██          ██  ████████  ██        ████      ",
    "    ██  ██████  ██    ██████████    ██  ██        ",
    "    ██  ██████  ██    ██      ██████  ██          ",
    "    ██  ██████  ██      ████  ██  ██████  ████    ",
    "    ██          ██              ████  ██          ",
    "    ██████████████      ████      ██    ████      ",
    "                                                  ",
    "                                                  ",
  ].map((line) => [...line].map((v, i) => !(i % 2) ? v : null).filter((v) => v).map((v) => v === "█"))
  expect(qrcode("foo")).toEqual(expected)
})

Deno.test("`qrcode()` for empty content", () => {
  const expected = [
    "                                                  ",
    "                                                  ",
    "    ██████████████    ██        ██████████████    ",
    "    ██          ██      ████    ██          ██    ",
    "    ██  ██████  ██  ██████████  ██  ██████  ██    ",
    "    ██  ██████  ██  ██████  ██  ██  ██████  ██    ",
    "    ██  ██████  ██    ██████    ██  ██████  ██    ",
    "    ██          ██    ██  ████  ██          ██    ",
    "    ██████████████  ██  ██  ██  ██████████████    ",
    "                                                  ",
    "          ████  ████        ██        ████        ",
    "    ████      ██  ████    ████    ██████  ████    ",
    "    ████      ████████      ████████  ██    ██    ",
    "      ██  ████      ████████      ████    ██      ",
    "    ██  ████    ██  ██          ██████████████    ",
    "                    ████      ██        ██████    ",
    "    ██████████████  ██████    ████    ████  ██    ",
    "    ██          ██    ██████  ████      ██        ",
    "    ██  ██████  ██  ████  ██    ██  ██  ████      ",
    "    ██  ██████  ██  ████    ██    ████            ",
    "    ██  ██████  ██    ██  ████    ██████  ████    ",
    "    ██          ██            ██  ██  ██  ████    ",
    "    ██████████████      ██████  ██████  ████      ",
    "                                                  ",
    "                                                  ",
  ].map((line) => [...line].map((v, i) => !(i % 2) ? v : null).filter((v) => v).map((v) => v === "█"))
  expect(qrcode("")).toEqual(expected)
})

Deno.test("`qrcode()` with long content", () => {
  expect(qrcode("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")).not.toThrow()
})

Deno.test("`qrcode()` with oversized content", () => {
  expect(() => qrcode("lorem ipsum".repeat(1000))).toThrow("Data too long")
})

Deno.test("`qrcode()` returns consistant results across all input types", () => {
  const test = new URL("https://example.com")
  const url = qrcode(test)
  const string = qrcode(test.href)
  const buffer = qrcode(new TextEncoder().encode(test.href))
  expect(url).toEqual(string)
  expect(url).toEqual(buffer)
  expect(string).toEqual(buffer)
})

Deno.test("`qrcode()` with svg output", () => {
  const svg = qrcode("foo", { output: "svg" })
  expect(typeof svg).toBe("string")
  expect(svg).toMatch(/<svg.*?>[\s\S]+<\/svg>/)
})

Deno.test("`qrcode()` with console output", () => {
  const mock = fn()
  const unmocked = console.log
  Object.assign(console, { log: mock })
  try {
    expect(qrcode("foo", { output: "console" })).toBe(undefined)
    expect(mock).toHaveBeenCalledTimes(qrcode("foo").length)
  } finally {
    Object.assign(console, { log: unmocked })
  }
})

Deno.test("`qrcode()` with array output", () => {
  const array = qrcode("foo", { output: "array" })
  expect(array).toBeInstanceOf(Array)
  expect(array.length).toEqual(array[0].length)
})

Deno.test("`qrcode()` svg output honors the `border` option", () => {
  const border = (svg: string) => svg.match(/viewBox="0 0 (\d+) \d+"/)![1]
  expect(border(qrcode("foo", { output: "svg", border: 0 }))).toBe("21")
  expect(border(qrcode("foo", { output: "svg", border: 4 }))).toBe("29")
})

Deno.test("`qrcode()` svg output sanitizes invalid `border` values", () => {
  const border = (svg: string) => svg.match(/viewBox="0 0 (\d+) \d+"/)![1]
  expect(border(qrcode("foo", { output: "svg", border: -5 }))).toBe("21") // negative is clamped to 0
  expect(border(qrcode("foo", { output: "svg", border: NaN }))).toBe("21") // non-finite falls back to 0
  expect(border(qrcode("foo", { output: "svg", border: 2.9 }))).toBe("25") // fractional is floored to 2
})

Deno.test("`qrcode()` svg output honors custom `light` and `dark` colors", () => {
  const svg = qrcode("foo", { output: "svg", light: "#eee", dark: "#123" })
  expect(svg).toContain(`fill="#eee"`)
  expect(svg).toContain(`fill="#123"`)
})

Deno.test("`qrcode()` svg output escapes colors to prevent markup injection", () => {
  const svg = qrcode("foo", { output: "svg", dark: `"><script>alert(1)</script>` })
  expect(svg).not.toContain("<script>")
  expect(svg).toContain("&lt;script&gt;")
})

Deno.test("`qrcode()` svg output accepts `Uint8Array` content", () => {
  const svg = qrcode(new TextEncoder().encode("foo"), { output: "svg" })
  expect(typeof svg).toBe("string")
  expect(svg).toEqual(qrcode("foo", { output: "svg" }))
})

Deno.test("`qrcode()` honors the `ecl` option", () => {
  const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
  for (const ecl of ["LOW", "MEDIUM", "QUARTILE", "HIGH"] as const) {
    expect(qrcode(content, { ecl })).toBeInstanceOf(Array)
  }
  expect(qrcode(content, { ecl: "HIGH" }).length).toBeGreaterThan(qrcode(content, { ecl: "LOW" }).length)
})
