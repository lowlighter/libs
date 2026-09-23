// Imports
import { expect } from "@libs/testing"
import { is as z } from "@libs/is"
import { decorate, metadata } from "./_metadata.ts"

Deno.test("database metadata is immutable and survives schema chaining", () => {
  const base = decorate(z.string())
  const indexed = base.index().min(2).optional().meta({ description: "Indexed" })
  const primary = base.primary().describe("Primary")
  const reference = base.references("parent", "id", { delete: "cascade", update: "restrict" })
  expect(metadata.get(base)).toEqual({})
  expect(metadata.get(indexed)?.indexes).toEqual([{ unique: false, columns: undefined }])
  expect(metadata.get(primary)?.primary).toEqual({})
  expect(metadata.get(reference)?.references).toEqual({ table: "parent", column: "id", delete: "cascade", update: "restrict" })
  expect(indexed.meta()?.description).toBe("Indexed")
  expect(indexed.parse("ok")).toBe("ok")
  expect(indexed.constructor).toBe(z.ZodOptional)
  expect(z.string()).not.toHaveProperty("primary")
  expect(() => Reflect.apply(base.index, base, [["id"]])).toThrow(TypeError)
})

Deno.test("table metadata survives object operations", () => {
  const table = decorate(z.object({ id: z.string(), value: z.string() }), { table: "items" })
  const next = table.unique(["id"]).index(["value"]).primary(["id", "value"]).partial()
  expect(metadata.get(next)?.primary).toEqual({ columns: ["id", "value"] })
  expect(metadata.get(table)).toEqual({ table: "items" })
  expect(metadata.get(next)?.indexes).toEqual([{ columns: ["id"], unique: true }, { columns: ["value"], unique: false }])
})

for (const method of ["unique", "index"] as const) {
  Deno.test(`${method} tuple metadata is immutable and survives object chaining`, () => {
    const table = decorate(z.object({ first: z.int(), second: z.int(), third: z.int() }), { table: "pairs" })
    const columns: ["first", "second"] = ["first", "second"]
    const tuple: ["second", "first"] = ["second", "first"]
    const next = table[method](columns, tuple).describe("Pairs").extend({ value: z.string() })
    columns.reverse()
    tuple.reverse()
    expect(metadata.get(table)).toEqual({ table: "pairs" })
    expect(metadata.get(next)?.indexes).toEqual([{ columns: ["first", "second"], unique: method === "unique", tuples: [["second", "first"]] }])
    expect(metadata.get(table[method](["first", "second"], ["second", "first"]))?.indexes).toEqual(metadata.get(next)?.indexes)
    expect(() => Reflect.apply(table[method], table, ["first"])).toThrow("expects column tuples")
    // @ts-expect-error Column lists require a table.
    expect(() => decorate(z.int())[method](["first", "second"], ["second", "first"])).toThrow(TypeError)
    // @ts-expect-error Options objects were replaced by explicit tuples.
    expect(() => table[method](["first", "second"], { unordered: true })).toThrow("expects column tuples")
    // @ts-expect-error Arrangements must have the first tuple's length.
    table[method](["first", "second"], ["second"])
    // @ts-expect-error Arrangements must use the first tuple's columns.
    table[method](["first", "second"], ["third", "first"])
    // @ts-expect-error Tuples must name existing columns.
    table[method](["first", "missing"], ["missing", "first"])
    const triples = table[method](["first", "second", "third"], ["second", "third", "first"], ["third", "first", "second"])
    expect(metadata.get(triples)?.indexes?.[0].tuples).toHaveLength(2)
    expect(() => Reflect.apply(decorate(z.int())[method], null, [undefined, ["first"]])).toThrow(TypeError)
  })
}
