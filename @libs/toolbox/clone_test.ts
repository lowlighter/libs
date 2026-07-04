import { expect } from "@libs/testing"
import { inspect } from "@libs/testing/highlight"
import { clone } from "./clone.ts"

for (
  const { value, cloned = value, cloneable = true, structuredCloneable = false } of [
    { value: 1 },
    { value: "foo" },
    { value: true },
    { value: null },
    { value: undefined },
    { value: Symbol("foo"), cloneable: false },
    { value: () => "foo", cloneable: false },
    { value: [1, 2, 3] },
    { value: { foo: "bar", baz: 42 } },
    { value: { foo: { bar: { baz: [1, 2, 3] } } } },
    { value: /foo/g },
    { value: new Error("foo") },
    { value: new Date("2020-01-01T00:00:00Z"), cloned: new Date("2020-01-01T00:00:00Z") },
    { value: new Map([["foo", "bar"]]) },
    { value: new Set([["foo", "bar"]]) },
    { value: new Proxy({ foo: "bar" }, {}), cloned: { foo: "bar" } },
    { value: { foo: "bar", symbol: Symbol("foo"), fn: () => "foo" }, cloned: { foo: "bar" }, structuredCloneable: true },
    { value: [{ foo: "bar", symbol: Symbol("foo"), fn: () => "foo" }], cloned: [{ foo: "bar" }], structuredCloneable: true },
  ]
) {
  Deno.test(`\`clone(${inspect(value)})\` returns a cloned value`, () => {
    const result = clone(value, { structuredCloneable })
    expect(result).toEqual(cloned)
    if (cloneable)
      structuredClone(result)
  })
}

Deno.test("`clone()` preserves circular references", () => {
  const object = { foo: "bar" } as { foo: string; self?: unknown; array?: unknown[] }
  object.self = object
  object.array = [object]
  const result = clone(object)
  expect(result).not.toBe(object)
  expect(result.foo).toBe("bar")
  expect(result.self).toBe(result)
  expect(result.array![0]).toBe(result)
})

Deno.test("`clone()` preserves circular references in arrays", () => {
  const array = ["foo"] as unknown[]
  array.push(array)
  const result = clone(array)
  expect(result).not.toBe(array)
  expect(result[0]).toBe("foo")
  expect(result[1]).toBe(result)
})
