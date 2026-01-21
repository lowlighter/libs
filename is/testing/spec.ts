// Imports
import type { testing } from "@libs/testing"
import { is } from "../is.ts"
import { pick } from "@std/collections"
import { expect, inspect, test } from "@libs/testing"

/** Test case definition. */
export type testcase = { a: unknown; b?: unknown; env?: Record<string, string> }

/** Configuration options for {@linkcode spec()}. */
export type SpecOptions = {
  /** Whether to perform a prefault check. */
  prefault?: boolean
  /** Whether to perform a strictness check. */
  strict?: boolean
  /** Setup function to run before tests. */
  setup?: () => void
}

/** Specification check helper. */
export const spec = Object.assign(
  function (name: string, schema: is.ZodType, testsuites: Array<testcase> | Record<PropertyKey, Array<testcase>>, { prefault = true, strict = true, setup }: SpecOptions = {}): void {
    if (Array.isArray(testsuites)) {
      testsuites = { "*": testsuites }
    }
    // Prefault check
    if (prefault) {
      test(`\`${name}.parse()\` has prefault`, () => expect(schema.parse(undefined)).toMatchObject({}))
    }
    // Strictness check
    if (strict) {
      test(`\`${name}.parse()\` is strict`, () => expect(() => schema.parse({ __strictness_test__: true })).toThrow())
    }
    // Parsing checks
    for (const [key, testcases] of Object.entries(testsuites)) {
      for (const testcase of testcases) {
        const a = key === "*" ? testcase.a : { [key]: testcase.a }
        const b = "b" in testcase ? testcase.b : testcase.a
        test(`\`${name}.parse(${inspect(a)})\` ${b === Error ? "throws error" : `is parsed${"b" in testcase ? ` as \`${inspect(b)}\`` : ""}`}${"env" in testcase ? ` with \`${inspect(testcase.env)}\`` : ""}`, () => {
          const env = {} as NonNullable<testcase["env"]>
          try {
            setup?.()

            // Apply environment variables
            if (testcase.env) {
              for (const [key, value] of Object.entries(testcase.env)) {
                if (Deno.env.has(key)) {
                  env[key] = Deno.env.get(key)!
                }
                Deno.env.set(key, value)
              }
            }
            // Apply test
            if (b === Error) {
              expect(() => schema.parse(a)).toThrow()
            } else {
              if ((key === "*") && ((typeof b !== "object") || (b === null))) {
                expect(schema.parse(a)).toEqual(b as Record<PropertyKey, unknown>)
                return
              }
              if ((b instanceof Date) || (b === "2024-01-01T00:00:00.000Z")) {
                const da = schema.parse(a) as Date
                expect((key === "*" ? da : (da as testing)[key]).getTime()).toBe(new Date(b).getTime())
                return
              }
              expect(schema.parse(a)).toMatchObject(key === "*" ? b as Record<PropertyKey, unknown> : { [key]: b })
            }
          } finally {
            for (const [key, value] of Object.entries(env)) {
              Deno.env.set(key, value)
            }
          }
        }, { permissions: { env: testcase.env ? true : false } })
      }
    }
  },
  {
    optional: [
      { a: undefined, b: undefined },
    ],
    nullable: [
      { a: null },
    ],
    primitive: [
      { a: "foo" },
      { a: 123 },
      { a: 123n },
      { a: true },
      { a: undefined },
      { a: null },
      { a: new Date("2024-01-01T00:00:00.000Z") },
      { a: new Error("Testing") },
      { a: Symbol.for("@@testing"), b: Error },
      { a: {}, b: Error },
      { a: [], b: Error },
      { a: function () {}, b: Error },
    ],
    boolean: [
      { a: true },
      { a: false },
    ],
    string: Object.assign([
      { a: "foo" },
    ], {
      arrayable: [
        { a: "a", b: ["a"] },
        { a: ["a", "b"], b: ["a", "b"] },
      ],
    }),
    positive: {
      int: [
        { a: 1 },
        { a: "1", b: 1 },
        { a: -1, b: Error },
        { a: "-1", b: Error },
        { a: "NaN", b: Error },
      ],
      finite: [
        { a: 1 },
        { a: NaN, b: Error },
        { a: Infinity, b: Error },
      ],
      infinity: [
        { a: Infinity },
        { a: "Infinity", b: Infinity },
      ],
    },
    record: Object.assign([
      { a: { foo: "bar", baz: 123 }, b: { foo: "bar", baz: 123 } },
      { a: "foo", b: Error },
    ], {
      primitive: [
        { a: { foo: "bar" } },
        { a: { foo: 123 } },
        { a: { foo: 123n } },
        { a: { foo: true } },
        { a: { foo: undefined } },
        { a: { foo: null } },
        { a: { foo: Symbol.for("@@testing") }, b: Error },
        { a: { foo: {} }, b: Error },
        { a: { foo: [] }, b: Error },
        { a: { foo: function () {} }, b: Error },
      ],
    }),
    array: {
      unique: [
        { a: ["a", "b", "b", "a", "c"], b: ["a", "b", "c"] },
      ],
    },
    ulid: [
      { a: "0".repeat(26) },
      { a: "TEST_INVALID_ULID", b: Error },
    ],
    url: [
      { a: "http://example.com" },
      { a: "https://example.com" },
      { a: "jsr:@scope/test" },
      { a: "npm:@scope/test" },
      { a: "file:///test/path" },
      { a: "data:application/test,null" },
      { a: "test_invalid_url", b: Error },
    ],
    date: [
      { a: new Date("2024-01-01T00:00:00.000Z") },
      { a: "test_invalid_date", b: Error },
    ],
    error: [
      { a: new Error("Test error") },
      { a: `${new Error("Test error")}`, b: Error },
    ],
    expression: [
      { a: "${foo + 1}" },
      { a: "foo + 1", b: Error },
    ],
    callable: [
      { a: () => {} },
      { a: async () => {} },
      { a: null, b: Error },
      { a: {}, b: Error },
    ],
    parser: [
      { a: Object.assign(is.object({ foo: is.string() }), { [Symbol.for("Deno.customInspect")]: () => "schema" }) },
      { a: { parse: () => ({}) } },
    ],
    unknown: [
      { a: null },
      { a: 123 },
      { a: "string" },
      { a: true },
      { a: [] },
      { a: {} },
      { a: { foo: "bar" } },
    ],
    meta(meta: ImportMeta) {
      return [
        { a: pick(meta, ["url", "dirname", "filename"]) },
        { a: {}, b: Error },
      ]
    },
    enum(values: readonly string[]) {
      return [
        ...values.map((a) => ({ a })),
        { a: "TEST_INVALID_ENUM_VALUE", b: Error },
      ]
    },
    default(b: unknown, options?: Omit<testcase, "a" | "b">) {
      return [
        { a: undefined, b, ...options },
      ]
    },
  },
) as ((name: string, schema: is.ZodType, testsuites: Array<testcase> | Record<PropertyKey, Array<testcase>>, options?: SpecOptions) => void) & {
  optional: Array<testcase>
  nullable: Array<testcase>
  primitive: Array<testcase>
  boolean: Array<testcase>
  string: {
    arrayable: Array<testcase>
  } & Array<testcase>
  positive: {
    int: Array<testcase>
    finite: Array<testcase>
    infinity: Array<testcase>
  }
  record: {
    primitive: Array<testcase>
  } & Array<testcase>
  array: {
    unique: Array<testcase>
  }
  ulid: Array<testcase>
  url: Array<testcase>
  date: Array<testcase>
  error: Array<testcase>
  expression: Array<testcase>
  callable: Array<testcase>
  parser: Array<testcase>
  unknown: Array<testcase>
  meta: (meta: ImportMeta) => Array<testcase>
  enum: (values: readonly string[]) => Array<testcase>
  default: (b: unknown, options?: Omit<testcase, "a" | "b">) => Array<testcase>
}
