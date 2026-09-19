// Imports
import { expect } from "@libs/testing"
import { deepFreeze } from "./deep_freeze.ts"

Deno.test("deepFreeze freezes nested objects without copying them", () => {
  const value = { object: { value: 1 }, array: [{ value: 2 }] }
  const frozen = deepFreeze(value)
  expect(frozen).toBe(value)
  expect(Object.isFrozen(frozen)).toBe(true)
  expect(Object.isFrozen(frozen.object)).toBe(true)
  expect(Object.isFrozen(frozen.array)).toBe(true)
  expect(Object.isFrozen(frozen.array[0])).toBe(true)
  expect(Reflect.set(value.object, "value", 2)).toBe(false)
  expect(value.object.value).toBe(1)
  const check = () => {
    // @ts-expect-error Deeply frozen properties are readonly.
    frozen.object.value = 2
  }
  void check
})

Deno.test("deepFreeze handles cycles, symbols, and non-enumerable properties", () => {
  const symbol = Symbol("child")
  const child = { value: 1 }
  const value = { self: undefined as unknown, [symbol]: child }
  value.self = value
  Object.defineProperty(value, "hidden", { value: { nested: true } })
  const frozen = deepFreeze(value)
  expect(frozen.self).toBe(frozen)
  expect(Object.isFrozen(frozen[symbol])).toBe(true)
  expect(Object.isFrozen(Reflect.get(frozen, "hidden"))).toBe(true)
  expect(deepFreeze(frozen)).toBe(frozen)
})

Deno.test("deepFreeze preserves primitives and does not invoke accessors", () => {
  let accessed = false
  const value = Object.defineProperty({}, "computed", {
    get() {
      accessed = true
      return {}
    },
  })
  expect(deepFreeze(null)).toBeNull()
  expect(deepFreeze(1)).toBe(1)
  expect(deepFreeze("value")).toBe("value")
  expect(deepFreeze(value)).toBe(value)
  expect(accessed).toBe(false)
  const callable = Object.assign(() => 1, { child: {} })
  expect(deepFreeze(callable)).toBe(callable)
  expect(Object.isFrozen(callable)).toBe(true)
  expect(Object.isFrozen(callable.child)).toBe(true)
})
