import { expect, inspect, test } from "@libs/testing"
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
  ]
) {
  test(`\`clone(${inspect(value)})\` returns a cloned value`, () => {
    const result = clone(value, { structuredCloneable })
    expect(result).toEqual(cloned)
    if (cloneable) {
      structuredClone(result)
    }
  })
}
