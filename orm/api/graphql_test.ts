import { expect, fn, test, type testing } from "@libs/testing"
import { Resource } from "../resource.ts"
import { Store } from "../store/kv.ts"
import { Logger } from "@libs/logger"
import { is, schema } from "../is/is.ts"
import { graphql, toGraphQLDefinition } from "./graphql.ts"
import { delay } from "@std/async/delay"

test("deno")(`toGraphQLDefinition() supports primitive types`, () => {
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.number().int() })))).toMatch(/foo: Float!\n/)
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.number().int().nullable() })))).toMatch(/foo: Float\n/)
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.number() })))).toMatch(/foo: Float!\n/)
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.number().nullable() })))).toMatch(/foo: Float\n/)
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.boolean() })))).toMatch(/foo: Boolean!\n/)
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.boolean().nullable() })))).toMatch(/foo: Boolean\n/)
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.string() })))).toMatch(/foo: String!\n/)
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.string().nullable() })))).toMatch(/foo: String\n/)
})

test("deno")(`toGraphQLDefinition() supports enum types`, () => {
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.literal("foo") })))).toMatch(/foo: SchemaFoo!\n[\s\S]+enum SchemaFoo/)
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.literal("foo").nullable() })))).toMatch(/foo: SchemaFoo\n[\s\S]+enum SchemaFoo/)
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.enum(["foo", "bar", "baz"]) })))).toMatch(/foo: SchemaFoo!\n[\s\S]+enum SchemaFoo/)
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.enum(["foo", "bar", "baz"]).nullable() })))).toMatch(/foo: SchemaFoo\n[\s\S]+enum SchemaFoo/)
})

test("deno")(`toGraphQLDefinition() supports array types`, () => {
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.array(is.boolean()) })))).toMatch(/foo: \[Boolean!\]!\n/)
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.array(is.boolean()).nullable() })))).toMatch(/foo: \[Boolean!\]\n/)
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.array(is.boolean().nullable()) })))).toMatch(/foo: \[Boolean\]!\n/)
})

test("deno")(`toGraphQLDefinition() supports object types`, () => {
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.object({ bar: is.boolean() }) })))).toMatch(/foo: SchemaFoo!\n[\s\S]+bar: Boolean!/)
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.object({ bar: is.boolean() }).nullable() })))).toMatch(/foo: SchemaFoo\n[\s\S]+bar: Boolean!/)
})

test("deno")(`toGraphQLDefinition() converts string named "id" to ID type`, () => {
  expect(toGraphQLDefinition("Schema", schema(is.object({ id: is.string() })))).toMatch(/id: ID!\n/)
  expect(toGraphQLDefinition("Schema", schema(is.object({ id: is.string().nullable() })))).toMatch(/id: ID\n/)
})

test("deno")(`toGraphQLDefinition() keeps descriptions`, () => {
  expect(toGraphQLDefinition("Schema", schema(is.object({}).describe("foobar")))).toMatch(/"""\s*foobar\s*"""\s*type Schema/)
  expect(toGraphQLDefinition("Schema", schema(is.object({ foo: is.boolean().describe("foobar") })))).toMatch(/"""\s*foobar\s*"""\s*foo:/)
})

test("deno")(`toGraphQLDefinition() throws on invalid types`, () => {
  expect(() => toGraphQLDefinition("Schema", null as testing)).toThrow(TypeError)
  expect(() => toGraphQLDefinition("Schema", schema(is.number()))).toThrow(TypeError)
  expect(() => toGraphQLDefinition("Schema", schema(is.object({ foo: is.null() })))).toThrow(TypeError)
  expect(() => toGraphQLDefinition("Schema", schema(is.object({ foo: is.union([is.number(), is.string()]) })))).toThrow(TypeError)
})

test("deno")(`graphql() returns an executable graphql schema`, async () => {
  await using store = await new Store({ path: ":memory:", log: new Logger({ level: Logger.level.disabled }) }).ready
  const TestResource = await Resource.with({
    name: "TestResource",
    store,
    model: is.object({
      foo: is.string().describe("@readonly"),
      bar: is.boolean().nullable().default(null),
    }),
  }).ready
  const resources = []
  for (const foo of ["bar", "baz", "qux"]) {
    resources.push(await new TestResource({ foo }).save())
    await delay(1)
  }
  const resolver = fn(() => "ok")
  const { handler } = graphql([TestResource], { typedefs: `type Query { test: String! }`, resolvers: { Query: { test: resolver } } })
  const gql = (query: string) => handler(new Request("https://example.invalid/graphql", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query }) })).then((response) => response.json()).then((json) => json.data ?? json)
  await expect(gql(`{ testResources { foo } }`)).resolves.toEqual({ testResources: [{ foo: "bar" }, { foo: "baz" }, { foo: "qux" }] })
  await expect(gql(`{ testResource(id: "${resources[0].id}") { foo } }`)).resolves.toEqual({ testResource: { foo: "bar" } })
  await expect(gql(`{ test }`)).resolves.toEqual({ test: "ok" })
  expect(resolver).toBeCalledTimes(1)
  expect(() => graphql([TestResource, TestResource])).toThrow(TypeError)
  await expect(gql(`mutation { updateTestResource(id: "<invalid>", input: { bar: true }) { id, created } }`)).resolves.toMatchObject({ updateTestResource: null })
  const { createTestResource: resource } = await gql(`mutation { createTestResource(input: { foo: "bar", bar: false }) { id, created, foo, bar } }`)
  expect(resource.id).toBeType("string")
  expect(resource.created).toBeType("number")
  expect(resource).toMatchObject({ foo: "bar", bar: false })
  await expect(gql(`mutation { updateTestResource(id: "${resource.id}", input: { bar: true }) { foo, bar } }`)).resolves.toMatchObject({ updateTestResource: { foo: "bar", bar: true } })
  await expect(gql(`mutation { updateTestResource(id: "${resource.id}", input: { foo: "baz" }) { foo, bar } }`)).resolves.toMatchObject({ errors: [] })
  await expect(gql(`mutation { deleteTestResource(id: "${resource.id}") { id, created } }`)).resolves.toEqual({ deleteTestResource: { id: resource.id, created: null } })
  await expect(gql(`mutation { deleteTestResource(id: "${resource.id}") { id, created } }`)).resolves.toEqual({ deleteTestResource: null })
})
