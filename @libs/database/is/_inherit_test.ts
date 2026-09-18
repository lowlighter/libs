// Imports
import { expect } from "@libs/testing"
import { is as z } from "@libs/is"
import { Inheritance, resolve } from "./_inherit.ts"
import { metadata } from "./_metadata.ts"

Deno.test("inheritance chains are immutable and preserve shared validation", () => {
  const base = new Inheritance()
  const indexed = base.index().unique().index()
  const options = { identity: true }
  const primary = base.primary(options)
  options.identity = false
  const actions = { delete: "cascade" } as const
  const reference = indexed.references("parent", "id", actions)
  const shared = z.int().positive().optional()
  const first = resolve(shared, primary)
  const second = resolve(shared, reference)
  expect(metadata.get(base)).toEqual({})
  expect(metadata.get(first)?.primary).toEqual({ identity: true })
  expect(metadata.get(second)?.indexes).toEqual([{ unique: false }, { unique: true }, { unique: false }])
  expect(metadata.get(second)?.references).toEqual({ table: "parent", column: "id", delete: "cascade" })
  expect(metadata.get(resolve(shared, base.primary()))?.primary).toEqual({})
  expect(metadata.get(resolve(shared, base.references("parent", "id")))?.references).toEqual({ table: "parent", column: "id" })
  expect(metadata.has(shared)).toBe(false)
  expect(first.parse(undefined)).toBeUndefined()
  expect(() => second.parse(-1)).toThrow()
})
