// deno-lint-ignore-file no-console
import { qrcode } from "./_qrcode.ts"
import { expect, fn, test } from "@libs/testing"

test("`qrcode()` for numeric mode", () => {
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

test("`qrcode()` for alphanumeric mode", () => {
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

test("`qrcode()` for bytes mode", () => {
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

test("`qrcode()` for empty content", () => {
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

test("`qrcode()` with long content", () => {
  expect(qrcode("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")).not.toThrow()
})

test("`qrcode()` with oversized content", () => {
  expect(() => qrcode("lorem ipsum".repeat(1000))).toThrow("Data too long")
})

test("`qrcode()` returns consistant results across all input types", () => {
  const test = new URL("https://example.com")
  const url = qrcode(test)
  const string = qrcode(test.href)
  const buffer = qrcode(new TextEncoder().encode(test.href))
  expect(url).toEqual(string)
  expect(url).toEqual(buffer)
  expect(string).toEqual(buffer)
})

test("`qrcode()` with svg output", () => {
  const svg = qrcode("foo", { output: "svg" })
  expect(typeof svg).toBe("string")
  expect(svg).toMatch(/<svg.*?>[\s\S]+<\/svg>/)
})

test("`qrcode()` with console output", () => {
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

test("`qrcode()` with array output", () => {
  const array = qrcode("foo", { output: "array" })
  expect(array).toBeInstanceOf(Array)
  expect(array.length).toEqual(array[0].length)
})
