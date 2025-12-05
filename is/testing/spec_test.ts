import type { testing } from "@libs/testing"
import { spec } from "./spec.ts"
import { arrayable, callable, coerce, expression, is, parser, primitive, url } from "../is.ts"
import { env } from "@libs/toolbox/env"

for (
  const { name, schema, testcases, ...options } of [
    // Spec
    {
      name: "spec.generic",
      schema: is.object({ foo: is.literal("bar") }).strict().prefault(() => ({ foo: "bar" })),
      testcases: {
        foo: [
          { a: "bar" },
          { a: "baz", b: Error },
        ],
        "*": [
          { a: { foo: "bar" } },
          { a: { foo: "baz" }, b: Error },
          { a: { foo: "bar", extra: 123 }, b: Error },
        ],
      },
      prefault: true,
      strict: true,
    },
    { name: "spec.generic+env", schema: is.string().default(() => env("TEST_ENV")), testcases: [{ a: undefined, b: "foobar", env: { TEST_ENV: "foobar" } }], setup: () => Deno.env.set("TEST_ENV", "testing") },
    // Optionals
    { name: "spec.optional", schema: is.string().optional(), testcases: spec.optional },
    { name: "spec.nullable", schema: is.null(), testcases: spec.nullable },
    // Primitives
    { name: "spec.primitive", schema: primitive, testcases: spec.primitive },
    { name: "spec.boolean", schema: is.boolean(), testcases: spec.boolean },
    { name: "spec.string", schema: is.string(), testcases: spec.string },
    { name: "spec.string.arrayable", schema: arrayable(is.array(is.string())), testcases: spec.string.arrayable },
    { name: "spec.positive.int", schema: coerce(is.int().min(0)), testcases: spec.positive.int },
    { name: "spec.positive.finite", schema: coerce(is.number().min(0)), testcases: spec.positive.finite },
    { name: "spec.positive.infinity", schema: coerce(is.literal(Infinity)), testcases: spec.positive.infinity },
    // Records and arrays
    { name: "spec.record", schema: is.record(is.string(), is.unknown()), testcases: spec.record },
    { name: "spec.record.primitive", schema: is.record(is.string(), primitive), testcases: spec.record.primitive },
    { name: "spec.array.unique", schema: is.array(is.string()).transform((value) => [...new Set(value)]), testcases: spec.array.unique },
    // Extras
    { name: "spec.ulid", schema: is.ulid(), testcases: spec.ulid },
    { name: "spec.url", schema: url, testcases: spec.url },
    { name: "spec.date", schema: is.date().or(is.object({ foo: is.date() })), testcases: { "*": [...spec.date], foo: [...spec.date] } },
    { name: "spec.expression", schema: expression, testcases: spec.expression },
    { name: "spec.callable", schema: callable, testcases: spec.callable },
    { name: "spec.parser", schema: parser, testcases: spec.parser },
    { name: "spec.unknown", schema: is.unknown(), testcases: spec.unknown },
    // Enum
    { name: "spec.enum()", schema: is.enum(["FOO", "BAR"]), testcases: spec.enum(["FOO", "BAR"]) },
    // Default
    { name: "spec.default()", schema: is.string().default("FOO"), testcases: spec.default("FOO") },
  ] as const
) {
  spec(name, schema, testcases as testing, { strict: false, prefault: false, ...options })
}
