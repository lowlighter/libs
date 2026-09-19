// Imports
import type { Hooks as QueryHooks } from "./fixtures/test_queries/queries.gen.ts"
import Prefault from "./fixtures/test_prefault/queries.gen.ts"
import Backends from "./fixtures/test_backends/queries.gen.ts"
import { expect } from "@libs/testing"
import { inspect } from "@libs/testing/highlight"
import { generate, generateTables } from "./generate/generator.ts"
import * as Models from "./fixtures/test_schema/models.ts"
import Expressions from "./fixtures/test_schema/expressions.gen.ts"
import { ddl } from "./is/_ddl.ts"
import { is as schema } from "./is/mod.ts"
import SchemaQuery from "./fixtures/test_schema/queries.gen.ts"
import Table from "./fixtures/test_schema/models.gen.ts"
import type { Summary, User as Model } from "./fixtures/test_schema/models.ts"
import type { is } from "./is/mod.ts"
import type { Hooks as SchemaHooks } from "./fixtures/test_schema/queries.gen.ts"
import { Database, Type } from "./database.ts"
import Query from "./fixtures/test_queries/queries.gen.ts"
import { hooks } from "./fixtures/test_queries/hooks.ts"
import Advanced from "./fixtures/test_hooks/hooks.gen.ts"
import { censor, normalize } from "./fixtures/test_hooks/hooks.ts"
import type { Hooks as AdvancedHooks } from "./fixtures/test_hooks/hooks.gen.ts"
import type { Context } from "./fixtures/test_hooks/types.ts"
import Bindings from "./fixtures/test_bindings/bindings.gen.ts"
import Literals from "./fixtures/test_literals/literals.gen.ts"
import Types from "./fixtures/test_types/types.gen.ts"
import PostgreSQL from "./fixtures/test_literals/postgres.gen.ts"
import type { Hooks } from "./fixtures/test_bindings/bindings.gen.ts"
import type { User } from "./fixtures/test_queries/types.ts"

// Select the local CI service or an explicitly configured PostgreSQL server
const postgres = Deno.env.get("DATABASE_TEST_POSTGRES") ?? (Deno.env.get("CI") === "1" ? "postgres://postgres:postgres@127.0.0.1:5432/postgres" : undefined)

// Run each isolated behavior against both backends
for (
  const backend of [
    { name: "SQLite", type: Type.SQLite, url: ":memory:" },
    { name: "PostgreSQL", type: Type.PostgreSQL, url: postgres },
  ]
) {
  for (
    const { name, run } of [
      {
        name: "prefault inputs remain optional while SQL uses validated output values",
        async run(database: Database) {
          expect(await database.query(Prefault.readValue(undefined))).toEqual({ value: 1 })
          expect(await database.query(Prefault.readValue({}))).toEqual({ value: 1 })
          expect(await database.query(Prefault.readValue({ value: 7 }))).toEqual({ value: 7 })
          expect(await database.query(Prefault.named(undefined))).toEqual({ value: 1 })
          expect(await database.query(Prefault.nested(undefined))).toEqual({ value: 1 })
          expect(await database.query(Prefault.explicit())).toEqual({ value: 1 })
          expect(await database.query(Prefault.converted({ value: "hello" }))).toEqual({ value: 5 })
          database.register("supply", (_event, options) => {
            expect(options).toBeUndefined()
            return Promise.resolve([{ value: 9 }])
          })
          expect(await database.query(Prefault.hooked(undefined))).toEqual({ value: 9 })
        },
      },
      {
        name: "schema expressions preserve binding and return types",
        async run(database: Database) {
          const id = "123e4567-e89b-42d3-a456-426614174000"
          expect(await database.query(Expressions.primitive({ id, count: 1, active: true, big: 1n, choice: "one" }))).toEqual({ id })
          expect(await database.query(Expressions.optional(undefined))).toEqual({ id })
          expect(await database.query(Expressions.nullable(null))).toEqual({ id })
          expect(await database.query(Expressions.readonly([id]))).toEqual([{ id }])
          expect(await database.query(Expressions.rest(id))).toEqual([{ id }])
          expect(await database.query(Expressions.arrayable({ id }))).toEqual([{ id }])
          expect(await database.query(Expressions.promised({ id }))).toEqual({ id })
          expect(await database.query(Expressions.parenthesized(id))).toEqual({ id })
          expect(await database.query(Expressions.dates({ id, date: new Date(0) }))).toEqual({ id, date: new Date(0) })
          expect(await database.query(Expressions.arrayPattern([id]))).toEqual({ id })
          expect(await database.query(Expressions.readonlyObject({ id }))).toEqual({ id })
          expect(await database.query(Expressions.readonlyRows(id))).toEqual([{ id }])
          expect(await database.query(Expressions.nullableRows())).toEqual([{ id }, { id }])
          expect(await database.query(Expressions.optionalRows())).toEqual([])
          const generic = await database.query(Expressions.generic({ id, extra: "kept" }))
          const extra: string = generic.extra
          expect(extra).toBe("kept")
          expect(generic).toEqual({ id, extra: "kept" })
          expect(await database.query(Expressions.objectRest({ id, active: true }))).toEqual({ id, active: true })
          expect(await database.query(Expressions.arrayRest([id, id]))).toEqual({ id })
          await expect(database.query(Expressions.objectRest({ id: "bad", active: true }))).rejects.toThrow()
        },
      },
      {
        name: "binary parameters round-trip as Uint8Array",
        async run(database: Database) {
          const input = new Uint8Array([0, 127, 128, 255])
          const statement = database.prepare<{ value: Uint8Array }>(database.type === Type.SQLite ? "SELECT CAST(? AS BLOB) AS value" : "SELECT CAST($1 AS BYTEA) AS value")
          const [result] = await statement.run(input)
          expect(result.value).toBeInstanceOf(Uint8Array)
          expect([...result.value]).toEqual([...input])
        },
      },
      {
        name: "enum codecs preserve numeric and mixed values",
        async run(database: Database) {
          const input: is.input<typeof Models.State> = Models.Status.Enabled
          const result: { value: Models.Status } = await database.query(Expressions.enumInteger(input))
          expect(result).toEqual({ value: Models.Status.Enabled })
          expect(await database.query(Expressions.enumInteger(Models.Status.Disabled))).toEqual({ value: 0 })
          expect(await database.query(Expressions.enumMixed(1))).toEqual({ value: 1 })
          expect(await database.query(Expressions.enumMixed("1"))).toEqual({ value: "1" })
        },
      },
      {
        name: "timestamp codecs retain integer milliseconds",
        async run(database: Database) {
          for (const time of [0, -1720000000123, 1720000000123, Number.MAX_SAFE_INTEGER])
            expect(await database.query(Expressions.timestamp(time))).toEqual({ time })
          await expect(database.query(Expressions.timestamp(1.5))).rejects.toThrow()
          for (const time of [0, 1720000000123, Number.MAX_SAFE_INTEGER])
            expect(await database.query(Expressions.sharedTimestamp(time))).toEqual({ time })
          const before = Date.now()
          const { time } = await database.query(Expressions.sharedTimestamp(undefined))
          expect(time).toBeGreaterThanOrEqual(before)
          expect(time).toBeLessThanOrEqual(Date.now())
        },
      },
      {
        name: "typeonly skips checks and defaults but retains codecs and hooks",
        async run(database: Database) {
          const input = { id: "invalid UUID", active: true, created: new Date(0) }
          const query = Expressions.typeonly(input)
          expect(query.precheck).toBeUndefined()
          expect(query.postcheck).toBeUndefined()
          expect(await database.query(query)).toEqual({ ...input, name: null })
          let calls = 0
          database.register("supply", () => {
            calls++
            return [{ name: "x", active: true }]
          })
          database.register("shorten", ({ result }) => {
            calls++
            expect(result).toEqual({ name: "x", active: true })
            return { name: "", active: true }
          })
          expect(await database.query(Expressions.uncheckedHooks({ name: "", active: true }))).toEqual({ name: "", active: true })
          expect(calls).toBe(2)
          await expect(database.query(Expressions.checked({ name: "", active: true }))).rejects.toThrow()
        },
      },
      {
        name: "raw skips codecs independently of validation",
        async run(database: Database) {
          const value = '{"theme":"dark","dates":[],"count":"1"}'
          const input = value as unknown as is.input<typeof Model>["settings"]
          expect(await database.query(Expressions.raw(input))).toEqual({ value })
          const query = Expressions.rawChecked({ name: "Valid", active: true })
          expect(query.precheck).toBeDefined()
          expect(query.postcheck).toBeDefined()
          await expect(database.query(query)).rejects.toThrow()
          await expect(database.query(Expressions.rawChecked({ name: "", active: true }))).rejects.toThrow()
          expect(await database.query(Expressions.afterRaw({ active: true }))).toEqual({ active: true })
        },
      },
      {
        name: "schema queries apply defaults and round-trip typed storage",
        async run(database: Database) {
          const input = await setupSchema(database)
          const expected = { ...input, name: "Default", active: true }
          const result: is.output<typeof Model> = await database.query(SchemaQuery.insert(input))
          expect(result).toEqual(expected)
          expect(await database.query(SchemaQuery.find(input.id))).toEqual(expected)
          expect(await database.query(SchemaQuery.list())).toEqual([expected])
          expect(await database.query(SchemaQuery.find("123e4567-e89b-42d3-a456-426614174001"))).toBeNull()
        },
      },
      {
        name: "schema queries decode projections, aliases, and intersections",
        async run(database: Database) {
          const input = await setupSchema(database)
          const { id, ...rest } = await database.query(SchemaQuery.insert(input))
          expect(await database.query(SchemaQuery.renamed(id))).toEqual({ ...rest, my_id: id })
          expect(await database.query(SchemaQuery.partial(id))).toEqual({ name: "Default", active: true })
          expect(await database.query(SchemaQuery.destructured(input))).toEqual({ id, theme: "dark" })
          expect(await database.query(SchemaQuery.restObject(input))).toEqual({ id, ...rest })
          expect(await database.query(SchemaQuery.readonlyModel(input))).toEqual({ id, ...rest })
          const generic = await database.query(SchemaQuery.generic({ ...input, extra: "kept" }))
          const extra: string = generic.extra
          expect(extra).toBe("kept")
          expect(generic).toEqual({ id, ...rest, extra: "kept" })
        },
      },
      {
        name: "composite primary keys enforce pair uniqueness and non-null columns",
        async run(database: Database) {
          const table = schema.table("schema_composite", { first: schema.int(), second: schema.int().optional() }).primary(["first", "second"])
          try {
            await database.run(ddl(table, database.type).join("\n"))
            await database.run("INSERT INTO schema_composite VALUES (1, 1), (1, 2), (2, 1)")
            await expect(database.run("INSERT INTO schema_composite VALUES (1, 1)")).rejects.toThrow()
            await expect(database.run("INSERT INTO schema_composite VALUES (3, NULL)")).rejects.toThrow()
          } finally {
            await database.run("DROP TABLE IF EXISTS schema_composite")
          }
        },
      },
      {
        name: "schema DDL enforces primary, unique, and foreign keys",
        async run(database: Database) {
          const input = await setupSchema(database)
          await database.query(SchemaQuery.insert(input))
          await expect(database.query(SchemaQuery.insert({ ...input, id: "invalid" }))).rejects.toThrow()
          await expect(database.query(SchemaQuery.insert(input))).rejects.toThrow()
          await expect(database.query(SchemaQuery.insert({ ...input, id: "123e4567-e89b-42d3-a456-426614174002" }))).rejects.toThrow()
          await expect(database.query(SchemaQuery.insert({ ...input, id: "123e4567-e89b-42d3-a456-426614174002", name: "Other", team: 999 }))).rejects.toThrow()
          await database.run("DELETE FROM schema_teams")
          expect((await database.query(SchemaQuery.find(input.id)))?.team).toBeNull()
        },
      },
      {
        name: "schema queries roll back failed postchecks without user hooks",
        async run(database: Database) {
          const input = await setupSchema(database)
          await expect(database.query(SchemaQuery.invalidOutput(input))).rejects.toThrow()
          expect(await database.query(SchemaQuery.find(input.id))).toBeNull()
        },
      },
      {
        name: "precheck runs after hooks and postcheck rolls back invalid results",
        async run(database: Database) {
          const input = await setupSchema(database)
          await database.query(SchemaQuery.insert(input))
          const normalize: SchemaHooks["pre"]["normalize"] = (_event, id, name) => Promise.resolve([id, name?.trim().toUpperCase()])
          const summarize: SchemaHooks["post"]["summarize"] = ({ result: user }) => {
            expect(user.created).toBeInstanceOf(Date)
            expect(typeof user.active).toBe("boolean")
            return Promise.resolve({ name: user.name, active: user.active })
          }
          database.register("normalize", normalize)
          database.register("summarize", summarize)
          const summary: is.output<typeof Summary> = await database.query(SchemaQuery.update(input.id, " updated "))
          expect(summary).toEqual({ name: "UPDATED", active: true })
          database.register("summarize", () => ({ name: "x", active: true }))
          await expect(database.query(SchemaQuery.update(input.id, " rollback "))).rejects.toThrow()
          expect((await database.query(SchemaQuery.find(input.id)))?.name).toBe("UPDATED")
        },
      },
      {
        name: "generated defaults preserve regular expressions and template literals",
        async run(database: Database) {
          expect(await database.query(Bindings.syntax())).toEqual({ value: "3" })
        },
      },
      {
        name: "supported typing helpers preserve result cardinality",
        async run(database: Database) {
          for (
            const { query, expected } of [
              { query: Types.optional(), expected: undefined },
              { query: Types.voidable(), expected: undefined },
              { query: Types.nullable(), expected: null },
              { query: Types.arrayable(), expected: [{ value: "value" }] },
              { query: Types.promisable(), expected: { value: "value" } },
              { query: Types.nonempty(), expected: [{ value: "value" }] },
              { query: Types.nonvoid(), expected: [{ value: "value" }] },
            ]
          ) {
            expect(await database.query<unknown, unknown, []>(query)).toEqual(expected)
          }
        },
      },
      {
        name: "test_bindings: destructuring, defaults, and rest arguments",
        async run(database: Database) {
          expect(await database.query(Bindings.renamed(undefined, undefined, "1"))).toEqual({ id: "1" })
          expect(await database.query(Bindings.renamed({ id: "2" }, undefined, "2"))).toEqual({ id: "2" })
        },
      },
      {
        name: "test_bindings: indexed paths and generic row types",
        async run(database: Database) {
          expect(await database.query(Bindings.indexed({ items: [{ id: "nested" }] }))).toEqual({ id: "nested" })
          const rows: { id: string }[] = await database.query(Bindings.generic([{ id: "typed" }]))
          expect(rows).toEqual([{ id: "typed" }])
        },
      },
      {
        name: "test_bindings: named and positional bindings agree",
        async run(database: Database) {
          expect(await database.query(Bindings.named("hello"))).toEqual({ value: "hello" })
        },
      },
      {
        name: "hooks enrich one context shared with all SQL aliases",
        async run(database: Database) {
          const contexts: Record<string, unknown>[] = []
          const enrich: Hooks["pre"]["enrich"] = ({ context }) => {
            expect(context).toEqual({})
            contexts.push(context)
            context.actor = "actor" + contexts.length
          }
          const inspect: Hooks["pre"]["inspect"] = ({ context }) => {
            expect(context).toBe(contexts.at(-1))
          }
          const inspectResult: Hooks["post"]["inspectResult"] = ({ context, result }) => {
            expect(context).toBe(contexts.at(-1))
            expect(result.zero).toBe(context.actor)
            context.finished = true
          }
          database.register("enrich", enrich)
          database.register("inspect", inspect)
          database.register("inspectResult", inspectResult)
          const query = Bindings.enriched()
          for (const actor of ["actor1", "actor2"]) {
            const record = JSON.stringify({ actor })
            expect(await database.query(query)).toEqual({ zero: actor, named: actor, record, alias: record })
          }
          expect(contexts[0]).not.toBe(contexts[1])
          const provided = {}
          await database.query(provided, query)
          expect(contexts[2]).toBe(provided)
          expect(provided).toEqual({ actor: "actor3", finished: true })
          expect(await database.query(Bindings.missingAlias())).toEqual({ value: null })
        },
      },
      {
        name: "test_bindings: context defaults to an empty record",
        async run(database: Database) {
          expect(await database.query(Bindings.context())).toEqual({ value: "{}" })
          expect(await database.query(Bindings.scoped())).toEqual({ value: null })
        },
      },
      {
        name: "test_bindings: reused queries bind independent context paths",
        async run(database: Database) {
          const query = Bindings.scoped()
          const results = await Promise.all([
            database.query({ profile: { items: [{ id: "first" }] } }, query),
            database.query({ profile: { items: [{ id: "second" }] } }, query),
            database.query(query),
          ])
          expect(results).toEqual([{ value: "first" }, { value: "second" }, { value: null }])
        },
      },
      {
        name: "test_bindings: bare braces remain SQL rather than bindings",
        async run(database: Database) {
          await expect(database.query(Bindings.braces("hello"))).rejects.toThrow()
        },
      },
      {
        name: "test_bindings: optional results",
        async run(database: Database) {
          expect(await database.query(Bindings.optional())).toBeUndefined()
        },
      },
      {
        name: "test_bindings: hook type transitions",
        async run(database: Database) {
          const text: Hooks["post"]["text"] = ({ result: row }) => Promise.resolve(row.value)
          const length: Hooks["post"]["length"] = ({ result: value }) => Promise.resolve(value.length)
          const observe: Hooks["post"]["observe"] = ({ result: value }) => {
            expect(value).toBe(5)
            return Promise.resolve()
          }
          database.register("text", text)
          database.register("length", length)
          database.register("observe", observe)
          const value: number = await database.query(Bindings.chain("hello"))
          expect(value).toBe(5)
        },
      },
      {
        name: "test_backends: inline SQL blocks preserve bindings and hooks",
        async run(database: Database) {
          expect(await database.query(Backends.search("two"))).toEqual([{ actor: "two" }])
          expect(await database.query(Backends.search("missing"))).toEqual([])
          expect(await database.query(Backends.ordered("a", "b"))).toEqual({ value: database.type === Type.SQLite ? "ab" : "bab" })
          expect(await database.query(Backends.common("common"))).toEqual({ value: "common" })
          expect(await database.query(Backends.quoted())).toEqual({ value: "-- <postgres>\n-- </sqlite>" })
          let calls = 0
          database.register("trim", (_event, value) => Promise.resolve([String(value).trim()]))
          database.register("observe", () => {
            calls++
            return Promise.resolve()
          })
          expect(await database.query(Backends.hooked(" value "))).toEqual({ value: "value" })
          expect(calls).toBe(1)
        },
      },
      {
        name: "test_literals: bindings leave SQL literals and comments untouched",
        async run(database: Database) {
          expect(await database.query(Literals.quoted("bound"))).toEqual({ literal: "it's ${not_a_binding}", value: "bound" })
        },
      },
      {
        name: "test_hooks: typed context reaches pre- and post-hooks",
        async run(database: Database) {
          database.register("normalize", normalize)
          database.register("censor", censor)
          const visible: string = await database.query({ censor: false, prefix: "Hi " }, Advanced.greet(" world "))
          expect(visible).toBe("Hi world")
          expect(await database.query({ censor: true, prefix: "" }, Advanced.greet("secret"))).toBe("[hidden]")
        },
      },
      {
        name: "test_hooks: calls without context retain their argument order",
        async run(database: Database) {
          const normalize: AdvancedHooks["pre"]["normalize"] = ({ context }, name, mode) => {
            expect(context).toEqual({})
            expect(mode).toBe("trim")
            return Promise.resolve([name.trim()])
          }
          const censor: AdvancedHooks["post"]["censor"] = ({ result: row }) => Promise.resolve(row.message)
          database.register("normalize", normalize)
          database.register("censor", censor)
          expect(await database.query(Advanced.greet(" world "))).toBe("world")
        },
      },
      {
        name: "test_hooks: independent contexts do not mutate a reused query",
        async run(database: Database) {
          database.register("normalize", normalize)
          database.register("censor", censor)
          const query = Advanced.greet("world")
          expect(await Promise.all([database.query({ prefix: "A ", censor: false }, query), database.query({ prefix: "B ", censor: false }, query)])).toEqual(["A world", "B world"])
          expect(await database.query(query)).toBe("world")
          expect(query.inputs).toEqual(["world"])
        },
      },
      {
        name: "test_hooks: pre-hooks chain and refresh post-hook arguments",
        async run(database: Database) {
          database.register("first", (_event, name: string) => [name + "1"])
          database.register("second", (_event, name: string) => [name + "2"])
          database.register("observe", ({ result: row }: { result: { message: string } }, name: string) => {
            expect(row.message).toBe(name)
          })
          expect(await database.query(Advanced.chained("value"))).toEqual({ message: "value12" })
        },
      },
      {
        name: "test_hooks: undefined preserves pre-hook inputs",
        async run(database: Database) {
          database.register("prepare", () => Promise.resolve())
          expect(await database.query(Advanced.plain("unchanged"))).toEqual({ message: "unchanged" })
        },
      },
      {
        name: "test_hooks: replacements preserve destructuring, defaults, and rest inputs",
        async run(database: Database) {
          const replace: AdvancedHooks["pre"]["replace"] = () => Promise.resolve([{ id: "new" }, undefined, "rest"])
          database.register("replace", replace)
          expect(await database.query(Advanced.rewrite({ id: "old" }, "?", "old"))).toEqual({ message: "new!rest" })
        },
      },
      {
        name: "test_hooks: rejects a replacement that is not an argument tuple",
        async run(database: Database) {
          database.register("prepare", () => null)
          await expect(database.query(Advanced.plain("value"))).rejects.toThrow("argument tuple")
        },
      },
      {
        name: "test_hooks: pre-hook failure prevents query execution",
        async run(database: Database) {
          await setup(database)
          database.register("before", () => {
            throw new Error("denied")
          })
          database.register("after", () => {})
          await expect(database.query(Advanced.beforeDelete("1"))).rejects.toThrow("denied")
          expect(await database.query(Query.user("1"))).toEqual({ id: "1", domain: "example.org" })
        },
      },
      {
        name: "test_hooks: pre-hook writes are outside the post-hook transaction",
        async run(database: Database) {
          await setup(database)
          database.register("before", async function (_event, id: string, event: string) {
            await this.query(Query.recordAudit(id, event))
            return [id]
          })
          database.register("after", () => {
            throw new Error("rollback")
          })
          await expect(database.query(Advanced.beforeDelete("1"))).rejects.toThrow("rollback")
          expect(await database.query(Query.user("1"))).toEqual({ id: "1", domain: "example.org" })
          expect(await database.query(Query.events())).toEqual([{ user_id: "1", event: "DELETE" }])
        },
      },
      {
        name: "test_hooks: nested pre-hooks see uncommitted parent changes",
        async run(database: Database) {
          await setup(database)
          database.register("prepare", async function (_event, name: string) {
            expect(await this.query(Query.user("1"))).toBeNull()
            return [name.toUpperCase()]
          })
          database.register("audit", async function () {
            expect(await this.query(Advanced.plain("nested"))).toEqual({ message: "NESTED" })
          })
          expect(await database.query(Query.deleteUser("1"))).toBe("1")
          expect(await database.query(Query.user("1"))).toBeNull()
        },
      },
      {
        name: "test_hooks: nested pre-hook writes roll back with the parent",
        async run(database: Database) {
          await setup(database)
          database.register("normalize", async function (_event, name: string) {
            await this.query(Query.recordAudit("1", "NESTED"))
            return [name.trim()]
          })
          database.register("censor", ({ result: row }: { result: { message: string } }) => row.message)
          database.register("audit", async function () {
            expect(await this.query(Advanced.greet(" nested "))).toBe("nested")
            expect(await this.query(Query.events())).toEqual([{ user_id: "1", event: "NESTED" }])
            throw new Error("parent failed")
          })
          await expect(database.query(Query.deleteUser("1"))).rejects.toThrow("parent failed")
          expect(await database.query(Query.user("1"))).toEqual({ id: "1", domain: "example.org" })
          expect(await database.query(Query.events())).toEqual([])
        },
      },
      {
        name: "test_hooks: missing post-hooks fail before pre-hooks run",
        async run(database: Database) {
          let called = false
          database.register("normalize", () => {
            called = true
          })
          await expect(database.query(Advanced.greet("world"))).rejects.toThrow(ReferenceError)
          expect(called).toBe(false)
        },
      },
      {
        name: "selects the backend from the URL",
        run(database: Database) {
          expect(database.type).toBe(backend.type)
          return Promise.resolve()
        },
      },
      {
        name: "executes a generated query through the public API",
        async run(database: Database) {
          const result = await database.query(Query.hello("world"))
          expect(result.message).toBe("Hello, world")
        },
      },
      {
        name: "returns typed prepared rows and reuses the cached statement",
        async run(database: Database) {
          await setup(database)
          const statement = database.prepare<User>("SELECT * FROM users")
          expect(database.prepare<User>("SELECT * FROM users")).toBe(statement)
          const rows: User[] = await statement.run()
          expect(rows).toEqual([{ id: "1", domain: "example.org" }])
        },
      },
      {
        name: "returns all matching rows",
        async run(database: Database) {
          await setup(database)
          expect(await database.query(Query.users())).toEqual([{ id: "1", domain: "example.org" }])
          expect(await database.query(Query.users("missing"))).toEqual([])
        },
      },
      {
        name: "returns null for a missing nullable row",
        async run(database: Database) {
          await setup(database)
          expect(await database.query(Query.user("missing"))).toBeNull()
        },
      },
      {
        name: "requires a row for a non-nullable result",
        async run(database: Database) {
          await setup(database)
          await expect(database.query(Query.requiredUser({ id: "missing" }))).rejects.toThrow(ReferenceError)
        },
      },
      {
        name: "post-hook arguments stay stable with and without context",
        async run(database: Database) {
          await setup(database)
          await database.run("INSERT INTO users VALUES('2', 'example.org')")
          let expected: { actor?: string } = {}
          let calls = 0
          const audit: QueryHooks<{ actor?: string }>["post"]["audit"] = function ({ context, result }, event) {
            expect(this).toBe(database)
            expect(context).toEqual(expected)
            expect(result.domain).toBe("example.org")
            expect(event).toBe("USER_DELETE")
            calls++
            return Promise.resolve()
          }
          const identifier: QueryHooks<{ actor?: string }>["post"]["identifier"] = ({ context, result }) => {
            expect(context).toEqual(expected)
            return Promise.resolve(result.id)
          }
          database.register("audit", audit)
          database.register("identifier", identifier)
          expect(await database.query(Query.deleteUser("1"))).toBe("1")
          expected = { actor: "admin" }
          expect(await database.query(expected, Query.deleteUser("2"))).toBe("2")
          expect(calls).toBe(2)
        },
      },
      {
        name: "awaits a hook and returns its declared replacement type",
        async run(database: Database) {
          database.register("message", hooks.post.message)
          const result: string = await database.query(Query.helloText("world"))
          expect(result).toBe("Hello, world")
        },
      },
      {
        name: "keeps the previous result when a hook returns undefined",
        async run(database: Database) {
          database.register("message", () => Promise.resolve())
          expect(await database.query(Query.helloText("world"))).toEqual({ message: "Hello, world" })
        },
      },
      {
        name: "replaces the result when a hook returns null",
        async run(database: Database) {
          database.register("message", () => Promise.resolve(null))
          expect(await database.query(Query.helloText("world"))).toBeNull()
        },
      },
      {
        name: "commits hooks and passes the previous result along the chain",
        async run(database: Database) {
          await setup(database)
          const result: string = await database.query(Query.deleteUser("1"))
          expect(result).toBe("1")
          expect(await database.query(Query.user("1"))).toBeNull()
          expect(await database.query(Query.events())).toEqual([{ user_id: "1", event: "USER_DELETE" }])
        },
      },
      {
        name: "rejects missing hooks before executing SQL",
        async run(database: Database) {
          await database.run("CREATE TEMP TABLE users(id TEXT, domain TEXT); INSERT INTO users VALUES('1', 'example.org')")
          await expect(database.query(Query.deleteUser("1"))).rejects.toThrow(ReferenceError)
          expect(await database.query(Query.user("1"))).toEqual({ id: "1", domain: "example.org" })
        },
      },
      {
        name: "rolls back SQL and hook writes when a hook fails",
        async run(database: Database) {
          await setup(database)
          database.register("audit", async function ({ result: user }: { result: User }) {
            await this.query(Query.recordAudit(user.id, "FAILED"))
            throw new Error("audit failed")
          })
          await expect(database.query(Query.deleteUser("1"))).rejects.toThrow("audit failed")
          expect(await database.query(Query.user("1"))).toEqual({ id: "1", domain: "example.org" })
          expect(await database.query(Query.events())).toEqual([])
        },
      },
      {
        name: "concurrent nested pre-hook queries keep independent transactions",
        async run(database: Database) {
          await setup(database)
          await database.run("INSERT INTO users(id, domain) VALUES ('2', 'example.org')")
          database.register("audit", ({ result: user }: { result: User }) => {
            if (user.id === "1")
              throw new Error("first failed")
          })
          database.register("prepare", async function () {
            const results = await Promise.allSettled([this.query(Query.deleteUser("1")), this.query(Query.deleteUser("2"))])
            expect(results.map((result) => result.status)).toEqual(["rejected", "fulfilled"])
          })
          await database.query(Advanced.plain("outer"))
          expect(await database.query(Query.user("1"))).toEqual({ id: "1", domain: "example.org" })
          expect(await database.query(Query.user("2"))).toBeNull()
        },
      },
      {
        name: "rollback waits for all concurrently started nested queries",
        async run(database: Database) {
          await setup(database)
          database.register("audit", async function () {
            await Promise.all([this.query(Query.requiredUser({ id: "missing" })), this.query(Query.recordAudit("nested", "ROLLBACK"))])
          })
          await expect(database.query(Query.deleteUser("1"))).rejects.toThrow()
          expect(await database.query(Query.user("1"))).toEqual({ id: "1", domain: "example.org" })
          expect(await database.query(Query.events())).toEqual([])
        },
      },
      {
        name: "allows nested hook queries within the transaction",
        async run(database: Database) {
          await setup(database)
          database.register("message", hooks.post.message)
          database.register("audit", async function () {
            expect(await this.query(Query.helloText("nested"))).toBe("Hello, nested")
          })
          expect(await database.query(Query.deleteUser("1"))).toBe("1")
        },
      },
      {
        name: "isolates queued work from a failing hook transaction",
        async run(database: Database) {
          await setup(database)
          const entered = Promise.withResolvers<void>()
          const release = Promise.withResolvers<void>()
          database.register("audit", async () => {
            entered.resolve()
            await release.promise
            throw new Error("rollback")
          })
          const failed = expect(database.query(Query.deleteUser("1"))).rejects.toThrow("rollback")
          await entered.promise
          const queued = database.query(Query.recordAudit("external", "KEEP"))
          release.resolve()
          await failed
          await queued
          expect(await database.query(Query.events())).toEqual([{ user_id: "external", event: "KEEP" }])
          expect(await database.query(Query.user("1"))).toEqual({ id: "1", domain: "example.org" })
        },
      },
      {
        name: "recovers after an SQL error",
        async run(database: Database) {
          await expect(database.run("INVALID SQL")).rejects.toThrow()
          expect(await database.query(Query.hello("world"))).toEqual({ message: "Hello, world" })
        },
      },
      {
        name: "refuses to close from an active hook",
        async run(database: Database) {
          database.register("message", function () {
            return this.close()
          })
          await expect(database.query(Query.helloText("world"))).rejects.toThrow("active query or hook")
        },
      },
      {
        name: "drains accepted work and closes idempotently",
        async run(database: Database) {
          const pending = database.query(Query.hello("world"))
          const closing = database.close()
          expect(database.close()).toBe(closing)
          expect(await pending).toEqual({ message: "Hello, world" })
          await closing
        },
      },
      {
        name: "rejects operations after closing",
        async run(database: Database) {
          const statement = database.prepare("SELECT 1")
          await database.close()
          expect(() => database.prepare("SELECT 1")).toThrow("closed")
          expect(() => database.register("message", hooks.post.message)).toThrow("closed")
          await expect(statement.run()).rejects.toThrow("closed")
          await expect(database.query(Query.hello("world"))).rejects.toThrow("closed")
        },
      },
    ]
  ) {
    Deno.test({
      name: `${backend.name}: ${name}`,
      permissions: { env: true, net: postgres ? [new URL(postgres).host] : [] },
      ignore: !backend.url,
      async fn() {
        await using database = new Database(backend.url!)
        try {
          await run(database)
        } finally {
          if (["schema queries", "schema DDL", "precheck runs"].some((prefix) => name.startsWith(prefix)))
            await database.run('DROP TABLE IF EXISTS "schema_users"; DROP TABLE IF EXISTS "schema_teams";')
        }
      },
    })
  }
}

Deno.test("test_hooks: generated context and input types reject incompatible hooks", () => {
  // @ts-expect-error A pre-hook must return the original input tuple type.
  const input: AdvancedHooks<Context>["pre"]["normalize"] = () => Promise.resolve([123])
  // @ts-expect-error The generated context type includes a boolean censor field.
  const context: AdvancedHooks<Context>["post"]["censor"] = ({ result: row }: { context?: { censor: number }; result: { message: string } }) => row.message
  void [input, context]
  return Promise.resolve()
})

for (const [input, expected] of [[null, null], ["text", "text"], [1, 1], [1n, 1], [true, 1], [new Date(0), new Date(0).toISOString()], [new Uint8Array([1]), new Uint8Array([1])]]) {
  Deno.test(`\`Statement.run(${inspect(input)})\` returns ${inspect(expected)}`, async () => {
    await using database = new Database()
    const statement = database.prepare<{ value: unknown }>("SELECT ? AS value")
    expect((await statement.run(input))[0].value).toEqual(expected)
  })
}

Deno.test("SQLite: rejects unsupported parameter values", async () => {
  await using database = new Database(":memory:")
  await expect(database.prepare("SELECT ?").run({})).rejects.toThrow(TypeError)
})

Deno.test("database instances have independent caches and results", async () => {
  await using first = new Database(":memory:")
  await using second = new Database(":memory:")
  expect(first.prepare("SELECT 1")).not.toBe(second.prepare("SELECT 1"))
  expect(await Promise.all([first.query(Query.hello("first")), second.query(Query.hello("second"))])).toEqual([{ message: "Hello, first" }, { message: "Hello, second" }])
})

Deno.test({
  name: "SQLite: persists rows at a filesystem path",
  permissions: { read: true, write: true },
  async fn() {
    const directory = await Deno.makeTempDir()
    try {
      const path = `${directory}/database.sqlite`
      await write(path)
      await using database = new Database(path)
      expect(await database.prepare<{ id: number }>("SELECT * FROM items").run()).toEqual([{ id: 7 }])
    } finally {
      await Deno.remove(directory, { recursive: true })
    }
  },
})

/** Initialize a fresh connection with the example schema and hooks.post. */
async function setup(database: Database): Promise<void> {
  await database.run("CREATE TEMP TABLE users(id TEXT, domain TEXT); CREATE TEMP TABLE audit(user_id TEXT, event TEXT); INSERT INTO users VALUES('1', 'example.org')")
  database.register("audit", hooks.post.audit)
  database.register("identifier", hooks.post.identifier)
}

/** Create a persistent row and release its connection before reopening. */
async function write(path: string): Promise<void> {
  await using database = new Database(path)
  await database.run("CREATE TABLE items(id INTEGER); INSERT INTO items VALUES(7)")
}

Deno.test({
  name: "test_literals: PostgreSQL escape strings and dollar quotes",
  permissions: { env: true, net: postgres ? [new URL(postgres).host] : [] },
  ignore: !postgres,
  async fn() {
    await using database = new Database(postgres!)
    expect(await database.query(PostgreSQL.quoted("bound"))).toEqual({ literal: "it's {not_a_binding}", value: "bound" })
    expect(await database.query(PostgreSQL.dollars())).toEqual({ literal: " ${not_a_binding} " })
  },
})

// Invalid annotations are read directly rather than launching the CLI
for (const name of ["backend_header", "backend_mismatch", "backend_unclosed", "backend_nested", "backend_closing", "backend_empty", "index", "path", "duplicate", "hook", "quote", "pre_return", "typeonly", "raw", "schema_expression", "schema_import", "schema_keys"]) {
  Deno.test({
    name: `\`generate(${name}.sql)\` rejects invalid annotations`,
    permissions: { read: true, run: true, env: true },
    async fn() {
      const source = await Deno.readTextFile(new URL(`./fixtures/test_invalid/${name}.sql`, import.meta.url))
      await expect(generate([source])).rejects.toThrow(SyntaxError)
    },
  })
}

Deno.test({
  name: "generated fixtures retain SQL documentation and file directives",
  permissions: { read: true },
  async fn() {
    const source = await Deno.readTextFile(new URL("./fixtures/test_queries/queries.gen.ts", import.meta.url))
    expect(source.startsWith("/**\n * Generated by @libs/database/generate.")).toBe(true)
    expect(source).toContain(" */\n// deno-coverage-ignore-file\n// deno-fmt-ignore-file\n// deno-lint-ignore-file no-unused-vars")
    const table = await Deno.readTextFile(new URL("./fixtures/test_schema/models.gen.ts", import.meta.url))
    expect(table.startsWith("/**\n * Generated by @libs/database/generate.")).toBe(true)
    expect(table).toContain(" */\n// deno-coverage-ignore-file\n// deno-fmt-ignore-file\n")
    expect(source).toContain("-- deleteUser(id: string): User")
    expect(source).toContain('-- @audit("USER_DELETE")')
    expect(source).toContain("-- @identifier(): string")
    expect(source).toContain("DELETE FROM users WHERE id=$1 RETURNING *;")
    expect(source).not.toContain("/** Execute")
    expect(source).toContain('import{Type as _Type}from"@libs/database";')
  },
})

/** Create generated schema fixtures and return a valid input without application defaults. */
async function setupSchema(database: Database): Promise<is.input<typeof Model>> {
  await database.run('DROP TABLE IF EXISTS "schema_users"; DROP TABLE IF EXISTS "schema_teams";')
  await database.query(Table.create())
  const [team] = await database.prepare<{ id: number }>("INSERT INTO schema_teams(name) VALUES ('Team') RETURNING id").run()
  return {
    id: "123e4567-e89b-42d3-a456-426614174000",
    team: team.id,
    created: new Date("2020-01-01T00:00:00Z"),
    settings: { theme: "dark", dates: [new Date(0)], count: 999999999999999999999999n },
    tags: ["one", "two"],
    flags: { test: true },
    payload: "a JSON string",
    count: 9007199254740993n,
  }
}

// Compare source fixtures to build artifacts without invoking the CLI
for (
  const name of ["test_prefault/queries", "test_backends/queries", "example/example", "test_queries/queries", "test_bindings/bindings", "test_hooks/hooks", "test_literals/literals", "test_literals/postgres", "test_types/types", "test_schema/queries", "test_schema/expressions"]
) {
  Deno.test({
    name: `generate preserves the built ${name} fixture`,
    permissions: { read: true, run: true, env: true },
    async fn() {
      const source = await Deno.readTextFile(new URL(`./fixtures/${name}.sql`, import.meta.url))
      const built = await Deno.readTextFile(new URL(`./fixtures/${name}.gen.ts`, import.meta.url))
      const timestamp = /Last generated: [^\n]+/g
      expect((await generate([source])).replace(timestamp, "Last generated:")).toBe(built.replace(timestamp, "Last generated:"))
    },
  })
}

Deno.test({
  name: "generateTables preserves the built dependency-ordered DDL fixture",
  permissions: { read: true, run: true, env: true },
  async fn() {
    const built = await Deno.readTextFile(new URL("./fixtures/test_schema/models.gen.ts", import.meta.url))
    const timestamp = /Last generated: [^\n]+/g
    expect((await generateTables(Models)).replace(timestamp, "Last generated:")).toBe(built.replace(timestamp, "Last generated:"))
  },
})

for (
  const { name, declarations } of [
    { name: "no table exports", declarations: { Value: schema.string() } },
    { name: "reserved export", declarations: { create: schema.table("items", { id: schema.int() }) } },
    { name: "duplicate table", declarations: { One: schema.table("items", { id: schema.int() }), Two: schema.table("items", { id: schema.int() }) } },
    { name: "cyclic references", declarations: { One: schema.table("one", { id: schema.int().references("two", "id") }), Two: schema.table("two", { id: schema.int().references("one", "id") }) } },
  ]
) {
  Deno.test(`generateTables rejects ${name}`, async () => {
    await expect(generateTables(declarations)).rejects.toThrow()
  })
}
