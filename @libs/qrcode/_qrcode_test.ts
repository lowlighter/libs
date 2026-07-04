// deno-lint-ignore-file no-console
import * as PNG from "./_png.ts"
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
  for (const ecl of ["LOW", "MEDIUM", "QUARTILE", "HIGH"] as const)
    expect(qrcode(content, { ecl })).toBeInstanceOf(Array)
  expect(qrcode(content, { ecl: "HIGH" }).length).toBeGreaterThan(qrcode(content, { ecl: "LOW" }).length)
})

Deno.test("`qrcode()` with png output", async () => {
  const png = qrcode("foo", { output: "png" })
  const size = (21 + 2 * 2) * 8 // (size + 2 * default border) * default scale
  expect(png).toBeInstanceOf(Uint8Array)
  expect([...png.subarray(0, 8)]).toEqual(PNG.signature)
  await expect(PNG.decode(png)).resolves.toMatchObject({ width: size, height: size, colorType: 6, bitDepth: 8 })
})

Deno.test("`qrcode()` png output honors the `border` and `scale` options", async () => {
  await expect(PNG.decode(qrcode("foo", { output: "png", border: 0, scale: 1 }))).resolves.toHaveProperty("width", 21)
  await expect(PNG.decode(qrcode("foo", { output: "png", border: 3, scale: 4 }))).resolves.toHaveProperty("width", (21 + 6) * 4)
})

Deno.test("`qrcode()` png output accepts `Uint8Array` content", () => {
  expect(qrcode(new TextEncoder().encode("foo"), { output: "png" })).toEqual(qrcode("foo", { output: "png" }))
})

Deno.test("`qrcode()` png output pixels match the module matrix", async () => {
  const matrix = qrcode("https://example.com", { output: "array" })
  const { width, pixel } = await PNG.decode(qrcode("https://example.com", { output: "png", border: 2, scale: 1 }))
  expect(width).toBe(matrix.length)
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix.length; x++)
      expect(pixel(x, y)).toEqual(matrix[y][x] ? [0, 0, 0, 255] : [255, 255, 255, 255])
  }
})

Deno.test("`qrcode()` png output honors custom `light` and `dark` colors", async () => {
  {
    const { pixel } = await PNG.decode(qrcode("foo", { output: "png", light: "#ffcc00", dark: "blue", scale: 1, border: 0 }))
    expect(pixel(0, 0)).toEqual([0, 0, 255, 255])
    expect(pixel(7, 7)).toEqual([255, 204, 0, 255])
  }
  {
    const { pixel } = await PNG.decode(qrcode("foo", { output: "png", light: "transparent", dark: "#00000080", scale: 1, border: 0 }))
    expect(pixel(0, 0)).toEqual([0, 0, 0, 128])
    expect(pixel(7, 7)).toEqual([0, 0, 0, 0])
  }
})

Deno.test("`qrcode()` png output throws on unsupported colors", () => {
  expect(() => qrcode("foo", { output: "png", dark: "cornflowerblue" })).toThrow("Unsupported color for png output")
  expect(() => qrcode("foo", { output: "png", light: "rgb(0,0,0)" })).toThrow("Unsupported color for png output")
})

Deno.test("`qrcode()` sanitizes options", async () => {
  {
    const side = (svg: string) => Number(svg.match(/viewBox="0 0 (\d+) \d+"/)![1])
    const cases = [
      [0, 0], // zero is kept
      [4, 4], // finite integer is kept
      [2.9, 2], // fractional is floored
      [-5, 0], // negative is clamped to 0
      [-0.5, 0], // negative fractional is clamped to 0
      [NaN, 0], // non-finite falls back to 0
      [Infinity, 0], // non-finite falls back to 0
      [-Infinity, 0], // non-finite falls back to 0
    ] as const
    for (const [border, sanitized] of cases)
      expect(side(qrcode("foo", { output: "svg", border }))).toBe(21 + sanitized * 2)
  }
  {
    const cases = [
      [1, 1], // minimum is kept
      [8, 8], // finite integer is kept
      [3.9, 3], // fractional is floored
      [0, 1], // zero is raised to 1
      [0.5, 1], // fractional below 1 is raised to 1
      [-3, 1], // negative is raised to 1
      [NaN, 1], // non-finite falls back to 1
      [Infinity, 1], // non-finite falls back to 1
      [-Infinity, 1], // non-finite falls back to 1
    ] as const
    for (const [scale, sanitized] of cases)
      await expect(PNG.decode(qrcode("foo", { output: "png", border: 0, scale }))).resolves.toHaveProperty("width", 21 * sanitized)
  }
})
