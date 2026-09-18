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
