// Imports
import { expect } from "@libs/testing"
import { is as z } from "@libs/is"
import * as is from "./schema.ts"
import { absent, decode, encode, field, intersect, loose, project, storage, unchecked, union, unwrap, validate } from "./_codec.ts"
import { Type } from "../database.ts"

for (const type of [Type.SQLite, Type.PostgreSQL]) {
  for (
    const { schema, value } of [
      { schema: is.boolean(), value: true },
      { schema: is.boolean(), value: false },
      { schema: is.date(), value: new Date(0) },
      { schema: is.timestamp(), value: 1720000000123 },
      { schema: is.timestamp().optional(), value: -1720000000123 },
      { schema: is.object({ time: is.timestamp() }), value: { time: 1720000000123 } },
      { schema: is.bigint(), value: 9007199254740993n },
      { schema: is.string(), value: "value" },
      { schema: is.enum(["a", "b"]), value: "a" },
      { schema: is.enum([0, 1]), value: 1 },
      { schema: is.enum([0.5, 1.5]), value: 0.5 },
      { schema: is.enum([1, "1"]), value: 1 },
      { schema: is.enum([1, "1"]), value: "1" },
      { schema: is.enum([Infinity, 1]), value: Infinity },
      { schema: is.literal(42), value: 42 },
      { schema: is.json(), value: "a JSON string" },
      { schema: is.object({ value: is.date(), count: is.bigint() }), value: { value: new Date(0), count: 999999999999999999999999n } },
      { schema: is.array(is.boolean()), value: [true, false] },
      { schema: is.record(is.string(), is.object({ value: is.boolean() })), value: { item: { value: true } } },
    ]
  ) {
    Deno.test(`${Type[type]} schema codec round-trips ${schema.type}`, () => {
      const encoded = encode(schema, value, type)
      expect(decode(is.object({ value: schema }), { value: encoded }, type)).toEqual({ value })
    })
  }
}

Deno.test("codecs preserve optional values and reject invalid boolean storage during validation", async () => {
  expect(encode(is.string().optional(), undefined, Type.SQLite)).toBeNull()
  expect(encode(is.null(), null, Type.SQLite)).toBeNull()
  expect(decode(is.string().optional(), null)).toBeUndefined()
  expect(decode(is.string().nullish(), null)).toBeNull()
  expect(decode(is.string().nullable(), null)).toBeNull()
  expect(decode(is.boolean(), 1n)).toBe(true)
  expect(decode(is.boolean(), 0n)).toBe(false)
  await expect(validate(is.boolean(), decode(is.boolean(), 2))).rejects.toThrow()
  expect(await validate(is.string().default("default"), undefined)).toBe("default")
  expect(unwrap(is.string().default("x").nullable().optional())._zod.def.type).toBe("string")
  expect(() => encode(is.bigint(), 2n ** 63n, Type.SQLite)).toThrow(RangeError)
  expect(() => storage(z.function())).toThrow(TypeError)
})

Deno.test("schema projections and intersections retain validation and fields", async () => {
  const left = is.object({ id: is.string(), active: is.boolean() })
  const right = is.object({ alias: is.string(), id: is.string().min(2) })
  const both = intersect(left, right)
  expect(await validate(both, { id: "ok", alias: "a", active: true })).toEqual({ id: "ok", alias: "a", active: true })
  await expect(validate(both, { id: "x", alias: "a", active: true })).rejects.toThrow()
  expect(decode(both, { id: "ok", alias: "a", active: 1 })).toEqual({ id: "ok", alias: "a", active: true })
  expect(field(both, "alias").parse("a")).toBe("a")
  expect(field(both, "active").parse(true)).toBe(true)
  expect(() => field(both, "id").parse("x")).toThrow()
  expect(field(is.array(is.string()), 0).parse("a")).toBe("a")
  expect(field(is.record(is.string(), is.boolean()), "key").parse(true)).toBe(true)
  expect(project(left, "pick", ["id"]).parse({ id: "ok", active: true })).toEqual({ id: "ok" })
  expect(project(left, "omit", ["id"]).parse({ id: "ok", active: true })).toEqual({ active: true })
  expect(project(left, "partial").parse({})).toEqual({})
  expect(() => project(left, "pick", ["missing"])).toThrow(TypeError)
  expect(() => project(is.string(), "partial")).toThrow(TypeError)
  expect(() => field(left, "missing")).toThrow(TypeError)
  expect(() => intersect(left, is.object({ id: is.boolean() }))).toThrow(TypeError)
  expect(() => intersect(is.string(), is.boolean())).toThrow(TypeError)
  expect(storage(intersect(is.string(), is.string().min(2)))).toBe("string")
})

Deno.test("schema unions handle nullability, arrays, and unchecked members", async () => {
  const model = is.object({ active: is.boolean() })
  const rows = union([model, model.array()])
  expect(decode(rows, [{ active: 1 }])).toEqual([{ active: true }])
  expect(decode(rows, { active: 0 })).toEqual({ active: false })
  expect(storage(rows)).toBe("json")
  expect(storage(union([model, is.null(), absent()]))).toBe("json")
  expect(await validate(absent(), undefined)).toBeUndefined()
  expect(decode(unchecked(), "raw")).toBe("raw")
  expect(() => storage(union([is.string(), is.boolean()]))).toThrow(TypeError)
})

Deno.test("nested intersection JSON columns revive all constituent fields", () => {
  const column = intersect(is.object({ date: is.date() }), is.object({ active: is.boolean() }))
  const value = { date: new Date(0), active: true }
  const encoded = encode(column, value, Type.SQLite)
  expect(decode(is.object({ column }), { column: encoded })).toEqual({ column: value })
  expect(storage(z.optional(is.json()))).toBe("json")
  expect(storage(is.literal(null))).toBe("null")
  expect(() => encode(is.bigint(), -(2n ** 63n) - 1n, Type.PostgreSQL)).toThrow(RangeError)
})

Deno.test("generic bounds preserve additional fields while validating known properties", async () => {
  const schema = loose(is.object({ id: is.string().min(2) }))
  expect(await validate(schema, { id: "ok", extra: true })).toEqual({ id: "ok", extra: true })
  await expect(validate(schema, { id: "x", extra: true })).rejects.toThrow()
  expect(field(schema, "extra").parse(true)).toBe(true)
  expect(loose(is.string()).parse("ok")).toBe("ok")
  const both = loose(z.intersection(z.object({ id: z.string() }), z.object({ active: z.boolean() })))
  expect(await validate(both, { id: "ok", active: true, extra: 1 })).toEqual({ id: "ok", active: true, extra: 1 })
})
