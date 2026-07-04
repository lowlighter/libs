import { apply, diff } from "./json.ts"
import { expect } from "@libs/testing"

Deno.test.each([
  { name: "primitives", a: 1, b: 2 },
  { name: "strings", a: "foo", b: "bar" },
  { name: "booleans", a: true, b: false },
  { name: "null to value", a: null, b: { a: 1 } },
  { name: "flat objects", a: { name: "foo", version: 1 }, b: { name: "foo", version: 2 } },
  { name: "nested objects", a: { a: { b: { c: 1 } }, keep: true }, b: { a: { b: { c: 2 } }, keep: true } },
  { name: "arrays", a: { list: [1, 2, 3] }, b: { list: [1, 4, 3, 5] } },
  { name: "added keys", a: { a: 1 }, b: { a: 1, b: 2, c: 3 } },
  { name: "removed keys", a: { a: 1, b: 2, c: 3 }, b: { a: 1 } },
  { name: "reordered nested", a: { users: [{ id: 1, name: "a" }, { id: 2, name: "b" }] }, b: { users: [{ id: 2, name: "b" }, { id: 1, name: "a" }] } },
])("`diff()`/`apply()` round-trips $name", ({ a, b }) => {
  const patch = diff(a, b)
  expect(apply(a, patch)).toEqual(b)
})

Deno.test("`diff()` returns an empty patch for identical values", () => {
  expect(diff({ a: 1 }, { a: 1 })).toStrictEqual("")
})

Deno.test("`apply()` is the identity when given an empty patch", () => {
  expect(apply({ a: 1, b: [2, 3] }, "")).toEqual({ a: 1, b: [2, 3] })
})

Deno.test("`diff()` produces a valid unified patch consumable by the text `apply()`", async () => {
  const { apply: applyText } = await import("./apply.ts")
  const a = { name: "foo", version: 1 }
  const b = { name: "foo", version: 2 }
  const patch = diff(a, b)
  expect(patch).toMatch(/^--- a\n\+\+\+ b\n/)
  expect(JSON.parse(applyText(JSON.stringify(a, null, 2), patch))).toEqual(b)
})

Deno.test("`diff()` forwards options (custom names and header)", () => {
  const patch = diff({ a: 1 }, { a: 2 }, { a: "a/data.json", b: "b/data.json", header: "diff --git a/data.json b/data.json" })
  expect(patch).toMatch(/^diff --git a\/data\.json b\/data\.json\n--- a\/data\.json\n\+\+\+ b\/data\.json\n/)
  expect(apply({ a: 1 }, patch)).toEqual({ a: 2 })
})

Deno.test("`apply()` preserves the input type", () => {
  const a = { count: 1 }
  const patched: typeof a = apply(a, diff(a, { count: 2 }))
  expect(patched.count).toBe(2)
})
