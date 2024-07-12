// Imports
import { toCamelCase, toPascalCase as titleCase } from "@std/text/case"
import type { record } from "@libs/typing"
import type { Resource } from "../resource.ts"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge"
import { GraphQLHTTP } from "@lowlighter/gql"
import type { schema as json_schema } from "../is/is.ts"
export { GraphQLHTTP, makeExecutableSchema, mergeResolvers, mergeTypeDefs }

/** Convert a JSON schema to a GraphQL type definition. */
export function toGraphQLDefinition(name: string, schema: ReturnType<typeof json_schema>): string {
  if ((typeof schema !== "object") || (!schema?.["$schema"])) {
    throw new TypeError("Expected object to be a JSON schema.")
  }
  return toGraphQLType(titleCase(name), structuredClone(schema))
}

/** Create a comment for documentation. */
function comment(description = "", { indent = "" } = {}) {
  return [
    `${indent}"""`,
    ...description.split("\n").map((line: string) => `${indent}${line}`),
    `${indent}"""`,
    "",
  ].join("\n")
}

/** Convert object typings from a JSON schema to a GraphQL type definition. */
function toGraphQLType(name: string, schema: json_schema, { definitions = [] as string[] } = {}) {
  if (schema.type !== "object") {
    throw new TypeError(`Schema must be of type "object", not "${schema.type}"`)
  }
  let output = ""
  if (schema.description) {
    output += comment(schema.description)
  }
  output += `type ${name} {\n`
  for (const property in schema.properties) {
    if (schema.properties[property].description) {
      output += comment(schema.properties[property].description, { indent: "  " })
    }
    output += toGraphQLPrimitive(name, property, schema.properties[property], { definitions })
  }
  output += "}\n"
  for (const definition of definitions) {
    output += `\n${definition}\n`
  }
  return output
}

/** Convert primitives typing from a JSON schema to a GraphQL type definition. */
function toGraphQLPrimitive(name: string, property: string, schema: json_schema, { subtype = false, definitions = [] as string[] }) {
  if (Array.isArray(schema.type)) {
    return toGraphQLPrimitive(name, property, { anyOf: schema.type.map((type: string) => ({ type })) }, { subtype, definitions })
  }
  if (!schema.anyOf) {
    return toGraphQLPrimitive(name, property, { anyOf: [schema] }, { subtype, definitions })
  }
  const nullable = schema.anyOf.some(({ type }: { type: string }) => type === "null")
  const types = new Set<string>()
  const namepath = titleCase(`${name} ${property}`)
  schema.anyOf.forEach((validation: json_schema_type) => {
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
  resources: Array<typeof Resource>,
  { graphiql = true, typedefs: _typedefs = "", resolvers: _resolvers = {} } = {} as { graphiql?: boolean; typedefs?: string; resolvers?: record },
): { schema: ReturnType<typeof makeExecutableSchema>; handler: ReturnType<typeof GraphQLHTTP> } {
  const definitions = new Map<string, string>()
  const resolvers = new Map<string, resolvers>()
  for (const resource of resources) {
    const name = titleCase(resource.name)
    if (definitions.has(name)) {
      throw new ReferenceError(`Redefining resource "${name}". Each resource should have a unique name.`)
    }
    let definition = toGraphQLDefinition(name, resource.schema)
    definition += [
      `type Query {`,
      `  ${toCamelCase(pluralize(name))}: [${name}]`,
      `  ${toCamelCase(name)}(id: ID!): ${name}`,
      `}`,
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
      //Mutation: {},
    })
  }
  const schema = makeExecutableSchema({ typeDefs: mergeTypeDefs([...definitions.values(), _typedefs]), resolvers: mergeResolvers([...resolvers.values(), _resolvers]) })
  return {
    schema,
    handler: GraphQLHTTP({ schema, graphiql }),
  }
}

/** JSON schema. */
// deno-lint-ignore no-explicit-any
type json_schema = any

/** JSON schema type. */
// deno-lint-ignore no-explicit-any
type json_schema_type = any

/** GraphQL resolvers. */
// deno-lint-ignore no-explicit-any
type resolvers = any

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
