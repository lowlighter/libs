import { qrcode } from "./qrcode.ts"
import { expect } from "https://deno.land/std@0.217.0/expect/expect.ts"
import { fn } from "https://deno.land/std@0.217.0/expect/fn.ts"

Deno.test(`qrcode() for numeric mode`, { permissions: "none" }, () => {
  const expected = [
    "██████████████  ████████    ██████████████",
    "██          ██      ██  ██  ██          ██",
    "██  ██████  ██    ██  ██    ██  ██████  ██",
    "██  ██████  ██  ██    ████  ██  ██████  ██",
    "██  ██████  ██      ██      ██  ██████  ██",
    "██          ██    ██    ██  ██          ██",
    "██████████████  ██  ██  ██  ██████████████",
    "                  ██  ████                ",
    "    ██  ██████  ████  ██  ██      ██    ██",
    "██  ████████      ██████████  ██  ██    ██",
    "  ████████████  ██████    ██  ██    ██    ",
    "██    ████      ████  ██    ████████    ██",
    "██████████████    ████  ██  ████    ██████",
    "                ██                  ████  ",
    "██████████████      ████████    ██    ██  ",
    "██          ██  ████  ██  ████      ████  ",
    "██  ██████  ██  ██  ████        ██  ██  ██",
    "██  ██████  ██    ██████████████  ██  ██  ",
    "██  ██████  ██  ██████  ██    ██  ████  ██",
    "██          ██    ██  ████    ██████      ",
    "██████████████        ████  ████  ████  ██",
  ].map((line) => [...line].map((v, i) => !(i % 2) ? v : null).filter((v) => v).map((v) => v === "█"))
  expect(qrcode("123")).toEqual(expected)
})

Deno.test(`qrcode() for alphanumeric mode`, { permissions: "none" }, () => {
  const expected = [
    "██████████████  ████  ██    ██████████████",
    "██          ██    ████  ██  ██          ██",
    "██  ██████  ██      ██  ██  ██  ██████  ██",
    "██  ██████  ██  ████  ████  ██  ██████  ██",
    "██  ██████  ██    ██  ██    ██  ██████  ██",
    "██          ██        ██    ██          ██",
    "██████████████  ██  ██  ██  ██████████████",
    "                  ██                      ",
    "    ██  ██████  ████  ██████      ██    ██",
    "████  ████    ██      ██    ██          ██",
    "    ████████████    ██    ████  ██        ",
    "    ██    ██    ██████████████    ██    ██",
    "    ██  ██  ████  ████  ██████  ██  ██    ",
    "                ████      ██  ██  ██  ████",
    "██████████████          ████████    ██    ",
    "██          ██  ████          ██████      ",
    "██  ██████  ██  ██            ██    ██  ██",
    "██  ██████  ██    ████      ██      ████  ",
    "██  ██████  ██  ██  ████  ██    ██      ██",
    "██          ██    ████    ████      ██████",
    "██████████████    ████  ██      ██  ██  ██",
  ].map((line) => [...line].map((v, i) => !(i % 2) ? v : null).filter((v) => v).map((v) => v === "█"))
  expect(qrcode("FOO")).toEqual(expected)
})

Deno.test(`qrcode() for bytes mode`, { permissions: "none" }, () => {
  const expected = [
    "██████████████  ████        ██████████████",
    "██          ██    ██        ██          ██",
    "██  ██████  ██  ██  ████    ██  ██████  ██",
    "██  ██████  ██      ██  ██  ██  ██████  ██",
    "██  ██████  ██  ██      ██  ██  ██████  ██",
    "██          ██              ██          ██",
    "██████████████  ██  ██  ██  ██████████████",
    "                ████                      ",
    "          ████      ██      ██  ██  ██  ██",
    "  ████████            ████    ██████      ",
    "      ████████              ████  ██  ██  ",
    "    ██  ██    ██  ██  ████  ████  ████  ██",
    "████  ██    ██  ██████  ██    ██████    ██",
    "                ██████████        ██    ██",
    "██████████████          ██  ██  ████  ██  ",
    "██          ██  ████████  ██        ████  ",
    "██  ██████  ██    ██████████    ██  ██    ",
    "██  ██████  ██    ██      ██████  ██      ",
    "██  ██████  ██      ████  ██  ██████  ████",
    "██          ██              ████  ██      ",
    "██████████████      ████      ██    ████  ",
  ].map((line) => [...line].map((v, i) => !(i % 2) ? v : null).filter((v) => v).map((v) => v === "█"))
  expect(qrcode("foo")).toEqual(expected)
})

Deno.test(`qrcode() for empty content`, { permissions: "none" }, () => {
  const expected = [
    "██████████████    ██        ██████████████",
    "██          ██      ████    ██          ██",
    "██  ██████  ██  ██████████  ██  ██████  ██",
    "██  ██████  ██  ██████  ██  ██  ██████  ██",
    "██  ██████  ██    ██████    ██  ██████  ██",
    "██          ██    ██  ████  ██          ██",
    "██████████████  ██  ██  ██  ██████████████",
    "                                          ",
    "      ████  ████        ██        ████    ",
    "████      ██  ████    ████    ██████  ████",
    "████      ████████      ████████  ██    ██",
    "  ██  ████      ████████      ████    ██  ",
    "██  ████    ██  ██          ██████████████",
    "                ████      ██        ██████",
    "██████████████  ██████    ████    ████  ██",
    "██          ██    ██████  ████      ██    ",
    "██  ██████  ██  ████  ██    ██  ██  ████  ",
    "██  ██████  ██  ████    ██    ████        ",
    "██  ██████  ██    ██  ████    ██████  ████",
    "██          ██            ██  ██  ██  ████",
    "██████████████      ██████  ██████  ████  ",
  ].map((line) => [...line].map((v, i) => !(i % 2) ? v : null).filter((v) => v).map((v) => v === "█"))
  expect(qrcode("")).toEqual(expected)
})

Deno.test(`qrcode() with long content`, { permissions: "none" }, () => {
  expect(qrcode("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")).not.toThrow()
})

Deno.test(`qrcode() with oversize content`, { permissions: "none" }, () => {
  expect(() => qrcode("lorem ipsum".repeat(1000))).toThrow("Data too long")
})

Deno.test(`qrcode() with svg output`, { permissions: "none" }, () => {
  const svg = qrcode("foo", { output: "svg" })
  expect(typeof svg).toBe("string")
  expect(svg).toMatch(/<svg.*?>[\s\S]+<\/svg>/)
})

Deno.test(`qrcode() with console output`, { permissions: "none" }, () => {
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
