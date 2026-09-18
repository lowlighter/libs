// Imports
import { expect } from "@libs/testing"
import { Status } from "../fixtures/test_schema/models.ts"
import * as is from "./schema.ts"

for (
  const { name, schema, valid, invalid } of [
    { name: "string", schema: is.string().min(2), valid: "ok", invalid: "x" },
    { name: "regex", schema: is.regex(/^ok$/), valid: "ok", invalid: "no" },
    { name: "uuid", schema: is.uuid(), valid: "123e4567-e89b-42d3-a456-426614174000", invalid: "id" },
    { name: "enum", schema: is.enum(["one", "two"]), valid: "one", invalid: "three" },
    { name: "numeric enum", schema: is.enum([0, 1]), valid: 1, invalid: "1" },
    { name: "enum object", schema: is.enum({ Off: 0, On: 1 }), valid: 0, invalid: 2 },
    { name: "url", schema: is.url(), valid: "https://example.com", invalid: "url" },
    { name: "datetime", schema: is.iso.datetime(), valid: "2020-01-01T00:00:00Z", invalid: "date" },
    { name: "boolean", schema: is.boolean(), valid: true, invalid: 1 },
    { name: "null", schema: is.null(), valid: null, invalid: undefined },
    { name: "number", schema: is.number(), valid: 1.5, invalid: Infinity },
    { name: "int", schema: is.int(), valid: 1, invalid: 1.5 },
    { name: "bigint", schema: is.bigint(), valid: 1n, invalid: 1 },
    { name: "timestamp", schema: is.timestamp(), valid: 1720000000123, invalid: 1.5 },
    { name: "date", schema: is.date(), valid: new Date(0), invalid: "1970-01-01" },
    { name: "literal", schema: is.literal("one"), valid: "one", invalid: "two" },
    { name: "json", schema: is.json(), valid: { nested: [1, true, null] }, invalid: 1n },
    { name: "array", schema: is.array(is.string()), valid: ["one"], invalid: [1] },
    { name: "record", schema: is.record(is.string(), is.boolean()), valid: { one: true }, invalid: { one: 1 } },
    { name: "object", schema: is.object({ id: is.string() }), valid: { id: "one" }, invalid: {} },
  ]
) {
  Deno.test(`is.${name} preserves Zod validation`, () => {
    expect(schema.parse(valid)).toEqual(valid)
    expect(() => schema.parse(invalid)).toThrow()
  })
}

Deno.test("schema modifiers preserve defaults, metadata, shapes, and input/output types", () => {
  const model = is.table("users", { id: is.string(), active: is.boolean().default(true) }).meta({ description: "Users" })
  const input: is.input<typeof model> = { id: "one" }
  const output: is.output<typeof model> = model.parse(input)
  expect(output).toEqual({ id: "one", active: true })
  expect(model.meta()).toEqual({ description: "Users" })
  expect(model.partial().parse({})).toEqual({ active: true })
  expect(model.pick({ id: true }).parse(input)).toEqual(input)
  expect(model.omit({ id: true }).parse({})).toEqual({ active: true })
  expect(model.extend({ value: is.string().nullish() }).parse(input)).toEqual(output)
  expect(is.string().nullable().parse(null)).toBeNull()
  expect(is.string().optional().parse(undefined)).toBeUndefined()
  expect(is.string().nullish().parse(null)).toBeNull()
  expect(is.string().default(() => "generated").parse(undefined)).toBe("generated")
  expect(is.string().array().parse(["one"])).toEqual(["one"])
  // @ts-expect-error Defaults remain required in the parsed output.
  const invalid: is.output<typeof model> = { id: "one" }
  void invalid
})

for (const name of ["", "bad\0name"]) {
  Deno.test(`is.table rejects ${JSON.stringify(name)}`, () => {
    expect(() => is.table(name, {})).toThrow(TypeError)
  })
}

Deno.test("object policy and wrapper modifiers remain chainable", () => {
  const object = is.object({ id: is.string().optional(), value: is.string() })
  expect(() => object.required().parse({ value: "value" })).toThrow()
  expect(object.partial({ value: true }).parse({})).toEqual({})
  expect(() => object.strict().parse({ value: "value", extra: 1 })).toThrow()
  expect(object.strip().parse({ value: "value", extra: 1 })).toEqual({ value: "value" })
  expect(object.passthrough().parse({ value: "value", extra: 1 })).toEqual({ value: "value", extra: 1 })
  expect(object.loose().parse({ value: "value", extra: 1 })).toEqual({ value: "value", extra: 1 })
  expect(() => is.string().optional().nonoptional().parse(undefined)).toThrow()
  expect(Object.isFrozen(is.object({ value: is.string() }).readonly().parse({ value: "value" }))).toBe(true)
  expect(is.string().trim().prefault(" value ").unique().parse(undefined)).toBe("value")
})

Deno.test("native TypeScript enums retain their type and reject reverse mapping names", () => {
  const schema = is.enum(Status)
  const input: is.input<typeof schema> = Status.Enabled
  const output: Status = schema.parse(input)
  expect(output).toBe(Status.Enabled)
  expect(schema.parse(Status.Disabled)).toBe(Status.Disabled)
  expect(() => schema.parse("Enabled")).toThrow()
  expect(() => schema.parse("1")).toThrow()
  expect(() => schema.parse(2)).toThrow()
  // @ts-expect-error Numeric enum schemas do not accept reverse mapping names.
  const invalid: is.input<typeof schema> = "Enabled"
  void invalid
})
