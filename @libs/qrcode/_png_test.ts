import { color, decode, png, signature } from "./_png.ts"
import { expect } from "@libs/testing"

Deno.test("`color()` parses named colors", () => {
  expect(color("white")).toEqual([0xFF, 0xFF, 0xFF, 0xFF])
  expect(color("WHITE")).toEqual([0xFF, 0xFF, 0xFF, 0xFF])
  expect(color("black")).toEqual([0x00, 0x00, 0x00, 0xFF])
  expect(color("blue")).toEqual([0x00, 0x00, 0xFF, 0xFF])
  expect(color("rebeccapurple")).toEqual([0x66, 0x33, 0x99, 0xFF])
  expect(color("transparent")).toEqual([0x00, 0x00, 0x00, 0x00])
})

Deno.test("`color()` parses hexadecimal notations", () => {
  expect(color("#ffcc00")).toEqual([0xFF, 0xCC, 0x00, 0xFF])
  expect(color("#00000080")).toEqual([0x00, 0x00, 0x00, 0x80])
  expect(color("#0af")).toEqual([0x00, 0xAA, 0xFF, 0xFF])
  expect(color("#0af8")).toEqual([0x00, 0xAA, 0xFF, 0x88])
  expect(color("#ABCDEF")).toEqual([0xAB, 0xCD, 0xEF, 0xFF])
})

Deno.test("`color()` throws on unsupported values without a DOM", () => {
  for (const value of ["cornflowerblue", "rgb(0,0,0)", "", "#", "#12", "#12345", "#1234567", "#123456789", "#xyzxyz"])
    expect(() => color(value)).toThrow(`Unsupported color for png output: "${value}"`)
})

Deno.test("`color()` resolves CSS colors and custom properties in a browser environment", () => {
  const computed = {
    cornflowerblue: "rgb(100, 149, 237)",
    "var(--brand)": "rgb(102, 51, 153)",
    "hsl(0 100% 50% / 0.5)": "rgba(255, 0, 0, 0.5)",
    unparseable: "none",
  } as Record<string, string>
  const view = globalThis as unknown as Record<string, unknown>
  const document = {
    createElement: () => {
      let stored = ""
      return {
        style: {
          get color() {
            return stored
          },
          set color(value: string) {
            stored = (value === "") || (value in computed) ? value : ""
          },
        },
        remove() {},
      }
    },
    documentElement: { appendChild() {} },
  }
  try {
    Object.assign(globalThis, { document, getComputedStyle: (element: { style: { color: string } }) => ({ color: computed[element.style.color] }) })
    expect(color("cornflowerblue")).toEqual([100, 149, 237, 0xFF])
    expect(color("var(--brand)")).toEqual([102, 51, 153, 0xFF])
    expect(color("hsl(0 100% 50% / 0.5)")).toEqual([255, 0, 0, 128])
    expect(() => color("chartreuse")).toThrow("Unsupported color for png output")
    expect(() => color("unparseable")).toThrow("Unsupported color for png output")
    delete view.getComputedStyle
    expect(() => color("cornflowerblue")).toThrow("Unsupported color for png output")
  } finally {
    delete view.document
    delete view.getComputedStyle
  }
})

Deno.test("`png()` encodes a matrix into a PNG decodable back to the same pixels", async () => {
  const pattern = [
    [true, false, true],
    [false, true, false],
    [true, true, false],
  ]
  const bytes = png({ get: (x, y) => pattern[y][x], size: 3, light: "white", dark: "black", scale: 2 })
  expect(bytes).toBeInstanceOf(Uint8Array)
  expect([...bytes.subarray(0, 8)]).toEqual(signature)
  const { width, height, colorType, bitDepth, pixel } = await decode(bytes)
  expect({ width, height, colorType, bitDepth }).toEqual({ width: 6, height: 6, colorType: 6, bitDepth: 8 }) // 3 modules * scale 2, RGBA 8-bit
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const expected = pattern[y][x] ? [0x00, 0x00, 0x00, 0xFF] : [0xFF, 0xFF, 0xFF, 0xFF]
      // Every pixel of the 2x2 block for module (x, y) carries the module color
      expect(pixel(x * 2, y * 2)).toEqual(expected)
      expect(pixel(x * 2 + 1, y * 2 + 1)).toEqual(expected)
    }
  }
})

Deno.test("`png()` applies custom `light` and `dark` colors with alpha", async () => {
  const dark = await decode(png({ get: () => true, size: 1, light: "transparent", dark: "#11223380", scale: 1 }))
  expect(dark.pixel(0, 0)).toEqual([0x11, 0x22, 0x33, 0x80])
  const light = await decode(png({ get: () => false, size: 1, light: "transparent", dark: "#000", scale: 1 }))
  expect(light.pixel(0, 0)).toEqual([0x00, 0x00, 0x00, 0x00])
})

Deno.test("`png()` throws on unsupported colors", () => {
  expect(() => png({ get: () => true, size: 1, light: "white", dark: "cornflowerblue", scale: 1 })).toThrow("Unsupported color for png output")
})

Deno.test("`png()` splits large images across multiple zlib blocks", async () => {
  // A 128px image (>65535 raw bytes) forces the stored DEFLATE stream to span more than one block
  const bytes = png({ get: (_, y) => y < 64, size: 128, light: "white", dark: "black", scale: 1 })
  const { width, height, pixel } = await decode(bytes)
  expect({ width, height }).toEqual({ width: 128, height: 128 })
  expect(pixel(0, 0)).toEqual([0x00, 0x00, 0x00, 0xFF])
  expect(pixel(127, 127)).toEqual([0xFF, 0xFF, 0xFF, 0xFF])
})

Deno.test("`decode()` rejects an invalid signature", async () => {
  await expect(decode(new Uint8Array(8))).rejects.toThrow("Invalid PNG signature")
})
