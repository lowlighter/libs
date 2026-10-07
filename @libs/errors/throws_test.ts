// Imports
import { expect } from "@libs/testing/expect"
import { throws } from "./throws.ts"

Deno.test("throws creates a default Error", () => {
  expect(() => throws()).toThrow(Error)
})

Deno.test("throws turns a string into an Error message", () => {
  expect(() => throws("missing")).toThrow(Error, "missing")
})

Deno.test("throws preserves an existing Error", () => {
  const error = new RangeError("outside range")
  let caught: unknown
  try {
    throws(error)
  } catch (value) {
    caught = value
  }
  expect(caught).toBe(error)
})

Deno.test("throws can be used inside an expression", () => {
  const choose = (enabled: boolean) => enabled ? throws("missing") : 42
  expect(choose(false)).toBe(42)
  expect(() => choose(true)).toThrow(Error, "missing")
})
