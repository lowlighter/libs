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

Deno.test("unordered uniqueness is immutable and survives object chaining", () => {
  const table = decorate(z.object({ first: z.int(), second: z.int() }), { table: "pairs" })
  const columns: ["first", "second"] = ["first", "second"]
  const next = table.unique(columns, { unordered: true }).describe("Pairs").extend({ value: z.string() })
  columns.reverse()
  expect(metadata.get(table)).toEqual({ table: "pairs" })
  expect(metadata.get(next)?.indexes).toEqual([{ columns: ["first", "second"], unique: true, unordered: true }])
  expect(metadata.get(table.unique(["first", "second"], { unordered: false }))?.indexes).toEqual([{ columns: ["first", "second"], unique: true }])
  expect(() => Reflect.apply(decorate(z.int()).unique, null, [undefined, { unordered: true }])).toThrow(TypeError)
  expect(() => Reflect.apply(table.index, null, [["first", "second"], { unordered: true }])).toThrow(TypeError)
  // @ts-expect-error Unordered uniqueness is only available on tables.
  expect(() => decorate(z.int()).unique(["first", "second"], { unordered: true })).toThrow(TypeError)
  // @ts-expect-error Unordered pairs require two columns.
  table.unique(["first"], { unordered: true })
  // @ts-expect-error Unordered pairs must name existing columns.
  table.unique(["first", "missing"], { unordered: true })
})
