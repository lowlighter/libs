import { functions } from "./_func.ts"
import { expect, test } from "@libs/testing"

test("all")("functions is a dictionary of functions", () => {
  expect(functions.async).toBeInstanceOf(Function)
  expect(functions.generator).toBeInstanceOf(Function)
  expect(functions.asyncGenerator).toBeInstanceOf(Function)
  expect(functions.async).not.toThrow()
  expect(functions.generator).not.toThrow()
  expect(functions.asyncGenerator).not.toThrow()
})
