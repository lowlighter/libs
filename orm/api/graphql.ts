// Imports
import { toCamelCase } from "@std/text/to-camel-case"
import { toPascalCase as titleCase } from "@std/text/to-pascal-case"
import type { Arg, Arrayable, record, rw } from "@libs/typing"
import type { Resource } from "../resource.ts"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { printWithComments } from "@graphql-tools/utils"
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge"
import { GraphQLHTTP } from "@deno-libs/gql"
import { schema as json_schema } from "../is/is.ts"
export { type Arg, type Arrayable, GraphQLHTTP, makeExecutableSchema, mergeResolvers, mergeTypeDefs }

/** Convert a {@link Resource} to a GraphQL type definition. */
export function toGraphQLDefinition(resource: Arrayable<typeof Resource>): string
/** Convert a JSON schema to a GraphQL type definition. */
export function toGraphQLDefinition(name: string, schema: ReturnType<typeof json_schema>, options?: { type: "type" | "input" }): string
/** Convert a JSON schema or {@link Resource} to a GraphQL type definition. */
export function toGraphQLDefinition(name: string | Arrayable<typeof Resource>, schema?: ReturnType<typeof json_schema>, { type = "type" as "type" | "input" } = {}): string {
  if (typeof name !== "string") {
    const resources = name
    return toGraphQLSchema([resources].flat())
  }
  if ((typeof schema !== "object") || (!schema?.["$schema"])) {
    throw new TypeError("Expected object to be a JSON schema.")
  }
  return toGraphQLType(titleCase(name), structuredClone(schema), { type })
}

/**
 * Create a GraphQL schema and HTTP handler for a set of {@link Resource}.
 *
 * ```ts
 * import { graphql } from "./graphql.ts"
 * import { Store } from "./../store/kv.ts"
 * import { Resource } from "./../resource.ts"
 * import { is } from "./../is/is.ts"
 *
 * const store = await new Store().ready
 * const model = is.object({ foo: is.string() })
 * const MyResource = await Resource.with({ name: "MyResource", store, model }).ready
 * const { handler } = graphql([MyResource], {graphiql:true})
 *
 * Deno.serve({ port: 3000 }, async (request) => {
 *   const { pathname } = new URL(request.url)
 *   return pathname === "/graphql" ? await handler(request) : new Response("Not Found", { status: 404 })
 * })
 * ```
 */
export function graphql(
  resources: Arrayable<typeof Resource>,
  { graphiql = true, ...options } = {} as { graphiql?: boolean; typedefs?: string; resolvers?: record },
): { schema: ReturnType<typeof makeExecutableSchema>; handler: ReturnType<typeof GraphQLHTTP> } {
  const schema = makeExecutableSchema(toGraphQLSchema([resources].flat(), { raw: true, ...options }))
  return { schema, handler: GraphQLHTTP({ schema, graphiql }) }
}

/** Convert a {@link Resource} to a GraphQL schema. */
function toGraphQLSchema(resources: Array<typeof Resource>, options?: { raw?: false; typedefs?: string; resolvers?: record }): string
/** Convert a {@link Resource} to a GraphQL schema components. */
function toGraphQLSchema(resources: Array<typeof Resource>, options: { raw: true; typedefs?: string; resolvers?: record }): { typeDefs: ast; resolvers: resolvers }
/** Convert a {@link Resource} to a GraphQL schema or schema components. */
function toGraphQLSchema(resources: Array<typeof Resource>, { raw = false, typedefs: _typedefs = "", resolvers: _resolvers = {} } = {} as { raw?: boolean; typedefs?: string; resolvers?: record }): string | { typeDefs: ast; resolvers: resolvers } {
  const definitions = new Map<string, string>()
  const resolvers = new Map<string, resolvers>()
  for (const resource of resources) {
    const name = titleCase(resource.name)
    if (definitions.has(name)) {
      throw new TypeError(`Redefining resource "${name}". Each resource should have a unique name.`)
    }
    let definition = toGraphQLDefinition(name, resource.schema)
    definition += [
      `type Query {`,
      `  ${toCamelCase(pluralize(name))}: [${name}]`,
      `  ${toCamelCase(name)}(id: ID!): ${name}`,
      `}`,
      `type Mutation {`,
      `  create${name}(input: ${name}CreateInput): ${name}`,
      `  update${name}(id: ID!, input: ${name}UpdateInput): ${name}`,
      `  delete${name}(id: ID!): ${name}`,
      `}`,
      toGraphQLDefinition(`${name}CreateInput`, json_schema((resource as rw).model.omit({ id: true, created: true, updated: true })), { type: "input" }),
      toGraphQLDefinition(`${name}UpdateInput`, json_schema((resource as rw).model.omit({ id: true, created: true, updated: true, ...(resource as rw).readonly })), { type: "input" }),
    ].join("\n")
    definitions.set(name, definition)
    resolvers.set(name, {
      Query: {
        [`${toCamelCase(pluralize(name))}`]() {
          return resource.list([], { array: true, raw: true })
        },
        [`${toCamelCase(name)}`](_: unknown, { id }: { id: string }) {
          return resource.get(id, { raw: true })
        },
      },
      Mutation: {
        async [`create${name}`](_: unknown, { input }: { input: unknown }) {
          // deno-lint-ignore no-explicit-any
          const instance = await new resource(input as any).save()
          return instance.data
        },
        async [`update${name}`](_: unknown, { id, input }: { id: string; input: unknown }) {
          const instance = await resource.get(id)
          if (!instance) {
            return null
          }
          await instance.patch(input as rw)
          await instance.save()
          return instance.data
        },
        async [`delete${name}`](_: unknown, { id }: { id: string }) {
          const instance = await resource.delete(id)
          return instance?.data
        },
      },
    })
  }
  const result = {
    typeDefs: mergeTypeDefs([...definitions.values(), _typedefs]),
    resolvers: mergeResolvers([...resolvers.values(), _resolvers]),
  }
  return raw ? result : printWithComments(result.typeDefs)
}

/** Document a field. */
function documentation(description = "", { indent = "" } = {}) {
  return [
    `${indent}"""`,
    ...description.split("\n").map((line: string) => `${indent}${line}`),
    `${indent}"""`,
    "",
  ].join("\n")
}

/** Convert object typings from a JSON schema to a GraphQL type definition. */
function toGraphQLType(name: string, schema: rw, { type = "type" as string, definitions = [] as string[] } = {}) {
  if (schema.type !== "object") {
    throw new TypeError(`Schema must be of type "object", not "${schema.type}"`)
  }
  let output = ""
  if (schema.description) {
    output += documentation(schema.description)
  }
  output += `${type} ${name} {\n`
  for (const property in schema.properties) {
    if (schema.properties[property].description) {
      output += documentation(schema.properties[property].description, { indent: "  " })
    }
    output += toGraphQLPrimitive(name, property, schema.properties[property], { definitions })
  }
  if (!Object.keys(schema.properties).length) {
    output += `  """\n  This field has no effect.\n  """\n  _: Boolean\n`
  }
  output += "}\n"
  for (const definition of definitions) {
    output += `\n${definition}\n`
  }
  return output
}

/** Convert primitives typing from a JSON schema to a GraphQL type definition. */
function toGraphQLPrimitive(name: string, property: string, schema: rw, { subtype = false, definitions = [] as string[] }) {
  if (Array.isArray(schema.type)) {
    return toGraphQLPrimitive(name, property, { anyOf: schema.type.map((type: string) => ({ type })) }, { subtype, definitions })
  }
  if (!schema.anyOf) {
    return toGraphQLPrimitive(name, property, { anyOf: [schema] }, { subtype, definitions })
  }
  const nullable = schema.anyOf.some(({ type }: { type: string }) => type === "null")
  const types = new Set<string>()
  const namepath = titleCase(`${name} ${property}`)
  schema.anyOf.forEach((validation: rw) => {
    if ((validation.enum) || (validation.const)) {
      definitions.push(`enum ${namepath} {\n${(validation.enum ?? [validation.const]).map((choice: string) => `  ${choice}`).join("\n")}\n}`)
      return types.add(namepath)
    }
    if ((validation.type === "string") && (property === "id")) {
      return types.add("ID")
    }
    switch (validation.type) {
      case "integer":
      case "number":
        return types.add("Float")
      case "string":
        return types.add("String")
      case "boolean":
        return types.add("Boolean")
      case "array":
        return types.add(`[${toGraphQLPrimitive(name, property, validation.items, { subtype: true, definitions })}]`)
      case "object": {
        definitions.push(toGraphQLType(namepath, validation))
        return types.add(namepath)
      }
    }
  })
  if (!types.size) {
    throw new TypeError(`Unsupported type: ${name}.${property}`)
  }
  if (types.size > 1) {
    throw new TypeError(`Union types are not supported: ${name}.${property}`)
  }
  return subtype ? `${[...types][0]}${nullable ? "" : "!"}` : `  ${property}: ${[...types][0]}${nullable ? "" : "!"}\n`
}

/** GraphQL resolvers. */
// deno-lint-ignore no-explicit-any
type resolvers = any

/** GraphQL AST. */
// deno-lint-ignore no-explicit-any
type ast = any

/** Pluralize a word. */
function pluralize(word: string) {
  if (/(?:s|x|ch|sh)$/.test(word)) {
    return `${word}es`
  }
  if (/(?:[^aeiou])y$/.test(word)) {
    return `${word.slice(0, -1)}ies`
  }
  if (/o$/.test(word)) {
    return `${word}es`
  }
  if (/f$/.test(word)) {
    return `${word.slice(0, -1)}ves`
  }
  return `${word}s`
}
