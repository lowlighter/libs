import { AssertionError } from "@std/assert"
import { expect } from "@libs/testing/expect"
import { assert } from "./assert.ts"

Deno.test("assert() accepts truthy expressions", () => {
  assert(true)
  assert(1)
  assert("value")
  assert({})
})

Deno.test("assert() narrows the expression type", () => {
  const value: string | undefined = "value"
  assert(value)
  expect(value.length).toBe(5)
})

Deno.test("assert() throws AssertionError with an optional message", () => {
  expect(() => assert(false)).toThrow(AssertionError)
  expect(() => assert(false, "expected value")).toThrow(AssertionError, "expected value")
})

Deno.test("assert() rethrows an Error unchanged", () => {
  const error = new Error("expected value")
  try {
    assert(false, error)
  } catch (caught) {
    expect(caught).toBe(error)
  }
})
