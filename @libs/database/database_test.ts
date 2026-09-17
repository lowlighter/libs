// Imports
import { expect } from "@libs/testing"
import { inspect } from "@libs/testing/highlight"
import { generate } from "./generate/generator.ts"
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
        name: "test_bindings: context defaults to null",
        async run(database: Database) {
          expect(await database.query(Bindings.context())).toEqual({ value: null })
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
          const text: Hooks["post"]["text"] = (row) => Promise.resolve(row.value)
          const length: Hooks["post"]["length"] = (value) => Promise.resolve(value.length)
          const observe: Hooks["post"]["observe"] = (value) => {
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
          const normalize: AdvancedHooks["pre"]["normalize"] = (name, mode) => {
            expect(mode).toBe("trim")
            return Promise.resolve([name.trim()])
          }
          const censor: AdvancedHooks["post"]["censor"] = (row) => Promise.resolve(row.message)
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
          expect(query.inputs).toEqual(["world"])
        },
      },
      {
        name: "test_hooks: pre-hooks chain and refresh post-hook arguments",
        async run(database: Database) {
          database.register("first", (name: string) => [name + "1"])
          database.register("second", (name: string) => [name + "2"])
          database.register("observe", (row: { message: string }, name: string) => {
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
          database.register("before", async function (id: string, event: string) {
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
          database.register("prepare", async function (name: string) {
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
          database.register("normalize", async function (name: string) {
            await this.query(Query.recordAudit("1", "NESTED"))
            return [name.trim()]
          })
          database.register("censor", (row: { message: string }) => row.message)
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
          database.register("audit", async function (user: User) {
            await this.query(Query.recordAudit(user.id, "FAILED"))
            throw new Error("audit failed")
          })
          await expect(database.query(Query.deleteUser("1"))).rejects.toThrow("audit failed")
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
        await run(database)
      },
    })
  }
}

Deno.test("test_hooks: generated context and input types reject incompatible hooks", () => {
  // @ts-expect-error A pre-hook must return the original input tuple type.
  const input: AdvancedHooks<Context>["pre"]["normalize"] = () => Promise.resolve([123])
  // @ts-expect-error The generated context type includes a boolean censor field.
  const context: AdvancedHooks<Context>["post"]["censor"] = (_context: { censor: number }, row: { message: string }) => row.message
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
for (const name of ["index", "path", "duplicate", "hook", "quote", "pre_return"]) {
  Deno.test({
    name: `\`generate(${name}.sql)\` rejects invalid annotations`,
    permissions: { read: true },
    async fn() {
      const source = await Deno.readTextFile(new URL(`./fixtures/test_invalid/${name}.sql`, import.meta.url))
      expect(() => generate([source])).toThrow(SyntaxError)
    },
  })
}

Deno.test({
  name: "generated fixtures retain SQL documentation and file directives",
  permissions: { read: true },
  async fn() {
    const source = await Deno.readTextFile(new URL("./fixtures/test_queries/queries.gen.ts", import.meta.url))
    expect(source.startsWith("// deno-coverage-ignore-file\n// deno-fmt-ignore-file\n")).toBe(true)
    expect(source).toContain("-- deleteUser(id: string): User")
    expect(source).toContain('-- @audit("USER_DELETE")')
    expect(source).toContain("-- @identifier(): string")
    expect(source).toContain("DELETE FROM users WHERE id=$1 RETURNING *;")
    expect(source).not.toContain("/** Execute")
    expect(source).toContain('import{Type as _Type}from"@libs/database";')
  },
})
