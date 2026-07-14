import { expect } from "@libs/testing"
import { shade, toRgb } from "./colors.ts"

Deno.test("`shade()` mixes the colour toward white when ratio is positive", () => {
  expect(shade("#000000", 0.5)).toBe("rgb(128,128,128)")
  expect(shade("#ff0000", 0.5)).toBe("rgb(255,128,128)")
  expect(shade("rgb(10,20,30)", 1)).toBe("rgb(255,255,255)")
})

Deno.test("`shade()` mixes the colour toward black when ratio is negative", () => {
  expect(shade("#ffffff", -0.5)).toBe("rgb(128,128,128)")
  expect(shade("#ff0000", -0.5)).toBe("rgb(128,0,0)")
  expect(shade("rgb(10,20,30)", -1)).toBe("rgb(0,0,0)")
})

Deno.test("`shade()` leaves the colour unchanged when ratio is zero", () => {
  expect(shade("#ff8040", 0)).toBe("rgb(255,128,64)")
  expect(shade("rgb(12,34,56)", 0)).toBe("rgb(12,34,56)")
})

Deno.test("`shade()` returns the colour as-is when it cannot be parsed", () => {
  expect(shade("rgb()", 0.5)).toBe("rgb()")
})

Deno.test("`toRgb()` parses 6-digit hex colours", () => {
  expect(toRgb("#000000")).toEqual([0, 0, 0])
  expect(toRgb("#ffffff")).toEqual([255, 255, 255])
  expect(toRgb("#ff8040")).toEqual([255, 128, 64])
})

Deno.test("`toRgb()` expands and parses 3-digit hex colours", () => {
  expect(toRgb("#000")).toEqual([0, 0, 0])
  expect(toRgb("#fff")).toEqual([255, 255, 255])
  expect(toRgb("#f80")).toEqual([255, 136, 0])
})

Deno.test("`toRgb()` parses rgb colours", () => {
  expect(toRgb("rgb(12,34,56)")).toEqual([12, 34, 56])
  expect(toRgb("rgb(12, 34, 56)")).toEqual([12, 34, 56])
})

Deno.test("`toRgb()` parses rgba colours and discards the alpha channel", () => {
  expect(toRgb("rgba(12,34,56,0.5)")).toEqual([12, 34, 56])
  expect(toRgb("rgba(255, 255, 255, 1)")).toEqual([255, 255, 255])
})

Deno.test("`toRgb()` returns null when the colour cannot be parsed", () => {
  expect(toRgb("rgb()")).toBeNull()
})
