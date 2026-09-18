// Imports
import { is as z } from "@libs/is"
import { Type } from "../database.ts"
import { metadata } from "./_metadata.ts"

/** Validate application values, including asynchronous refinements and defaults. */
export async function validate(schema: z.core.$ZodType, value: unknown): Promise<unknown> {
  return await z.core.parseAsync(schema, value)
}

/** Resolve a schema property without evaluating input values. */
export function field(schema: z.core.$ZodType, key: PropertyKey): z.ZodType {
  const current = unwrap(schema)
  const definition = current._zod.def as definition
  if (definition.type === "intersection") {
    const a = properties(definition.left!)
    const b = properties(definition.right!)
    if (a && b && !a.has(String(key)))
      return field(definition.right!, key)
    if (a && b && !b.has(String(key)))
      return field(definition.left!, key)
    return intersect(field(definition.left!, key), field(definition.right!, key))
  }
  const child = definition.type === "object" ? (definition.shape?.[String(key)] ?? definition.catchall) : definition.type === "array" ? definition.element : definition.type === "record" ? definition.valueType : undefined
  if (!child)
    throw new TypeError(`Schema ${definition.type} has no property ${String(key)}`)
  return child as z.ZodType
}

/** Combine object schemas while retaining validation for overlapping fields. */
export function intersect<A extends z.core.$ZodType, B extends z.core.$ZodType>(left: A, right: B): z.ZodIntersection<A, B> {
  const a = unwrap(left)._zod.def as definition
  const b = unwrap(right)._zod.def as definition
  if (a.type === "object" && b.type === "object") {
    for (const key of Object.keys(a.shape!)) {
      if (b.shape![key] && storage(a.shape![key]) !== storage(b.shape![key]))
        throw new TypeError(`Incompatible storage schemas for intersection property ${key}`)
    }
  } else if (storage(left) !== storage(right)) {
    throw new TypeError(`Incompatible intersection schemas: ${a.type} and ${b.type}`)
  }
  return z.intersection(left, right)
}

/** Apply a TypeScript object combinator to a runtime schema. */
export function project(schema: z.core.$ZodType, operation: "pick" | "omit" | "partial", keys: readonly string[] = []): z.ZodType {
  const definition = unwrap(schema)._zod.def as definition
  if (definition.type !== "object")
    throw new TypeError(`${operation} requires an object schema; received ${definition.type}`)
  const object = unwrap(schema) as z.ZodObject
  if (operation === "partial")
    return object.partial()
  for (const key of keys) {
    if (!(key in object.shape))
      throw new TypeError(`Unknown ${operation} property ${key}`)
  }
  return object[operation](Object.fromEntries(keys.map((key) => [key, true])) as never)
}

/** Validate a generic model bound without discarding additional properties. */
export function loose(schema: z.core.$ZodType): z.ZodType {
  const current = unwrap(schema)
  const definition = current._zod.def as definition
  if (definition.type === "object")
    return (current as z.ZodObject).loose()
  if (definition.type === "intersection")
    return intersect(loose(definition.left!), loose(definition.right!))
  return schema as z.ZodType
}

/** Encode a validated binding using its schema and backend. */
export function encode(schema: z.core.$ZodType, value: unknown, type: Type): unknown {
  if ((value === null) || (value === undefined))
    return null
  const kind = storage(schema)
  if (kind === "json") {
    const output = convert(schema, value, false)
    return type === Type.SQLite ? JSON.stringify(output) : output
  }
  const current = unwrap(schema)
  if (current._zod.def.type === "enum" && kind === "string" && [...current._zod.values!].some((value) => typeof value === "number"))
    return typeof value === "string" ? JSON.stringify(value) : String(value)
  if (kind === "boolean")
    return type === Type.SQLite ? Number(value) : value
  if (kind === "timestamp")
    return type === Type.SQLite ? value : String(value)
  if (kind === "date")
    return (value as Date).toISOString()
  if (kind === "bigint") {
    if ((value as bigint) < -(2n ** 63n) || (value as bigint) >= 2n ** 63n)
      throw new RangeError("SQL bigint bindings must fit in a signed 64-bit integer")
    return type === Type.SQLite ? value : String(value)
  }
  return value
}

/** Decode database rows before application post-hooks and final validation. */
export function decode(schema: z.core.$ZodType, value: unknown, type: Type = Type.SQLite): unknown {
  return convert(schema, value, true, false, type)
}

/** Accept values with compile-time-only type information. */
export function unchecked(): z.ZodUnknown {
  return z.unknown()
}

/** Represent an absent result in a schema-backed union. */
export function absent(): z.ZodUndefined {
  return z.undefined()
}

/** Represent optional and alternative schema-backed result types. */
export function union<T extends readonly z.core.$ZodType[]>(schemas: T): z.ZodUnion<T> {
  return z.union(schemas)
}

/** Resolve wrapper schemas without running validators or default factories. */
export function unwrap(schema: z.core.$ZodType): z.core.$ZodType {
  const definition = schema._zod.def as definition
  if (["optional", "nullable", "default", "prefault", "readonly", "nonoptional", "catch"].includes(definition.type))
    return unwrap(definition.innerType!)
  return schema
}

/** Select a portable storage family, rejecting unsupported transformations. */
export function storage(schema: z.core.$ZodType): string {
  if (metadata.get(schema)?.json)
    return "json"
  const current = unwrap(schema)
  if (metadata.get(current)?.json || json(current))
    return "json"
  if (metadata.get(schema)?.timestamp || metadata.get(current)?.timestamp)
    return "timestamp"
  const definition = current._zod.def as definition
  if (["object", "array", "record"].includes(definition.type))
    return "json"
  if (definition.type === "intersection")
    return storage(definition.left!)
  if (definition.type === "union") {
    const candidates = definition.options!.filter((schema) => !["null", "undefined", "void"].includes(schema._zod.def.type))
    const kinds = new Set(candidates.map(storage))
    if (kinds.size !== 1)
      throw new TypeError("Schema union members must share a storage family")
    return storage(candidates[0])
  }
  if (definition.type === "unknown")
    return "unchecked"
  if (definition.type === "literal")
    return definition.values![0] === null ? "null" : typeof definition.values![0]
  if (definition.type === "enum") {
    const values = [...current._zod.values!]
    return values.length && values.every((value) => typeof value === "number" && Number.isInteger(value)) ? "number" : "string"
  }
  if (["string", "boolean", "date", "bigint", "number", "null", "undefined", "void"].includes(definition.type))
    return definition.type
  throw new TypeError(`Unsupported database schema ${definition.type}; use a supported storage schema`)
}

/** Convert structured values recursively without applying validation twice. */
function convert(schema: z.core.$ZodType, value: unknown, reading: boolean, column = true, type = Type.SQLite, document = false): unknown {
  if ((value === null) || (value === undefined)) {
    if (reading && value === null && optional(schema) && !nullable(schema))
      return undefined
    return value
  }
  const current = unwrap(schema)
  const definition = current._zod.def as definition
  if (metadata.get(schema)?.json || metadata.get(current)?.json || json(current))
    return reading && column && !document && type === Type.SQLite && typeof value === "string" ? JSON.parse(value) : value
  if (definition.type === "union") {
    const candidate = definition.options!.find((schema) => {
      const kind = unwrap(schema)._zod.def.type
      return Array.isArray(value) ? kind === "array" : typeof value === "object" ? kind === "object" || kind === "record" : kind === typeof value || kind === "literal" || kind === "enum"
    })
    return convert(candidate ?? definition.options![0], value, reading, column, type, document)
  }
  if (definition.type === "intersection") {
    const keys = properties(schema)
    if (keys) {
      if (reading && column && !document && type === Type.SQLite && typeof value === "string")
        value = JSON.parse(value)
      const output = { ...value as Record<string, unknown> }
      for (const key of keys) {
        if (Object.hasOwn(output, key))
          output[key] = convert(field(schema, key), output[key], reading, true, type, document || column)
      }
      return output
    }
    return convert(definition.left!, value, reading, column, type, document)
  }
  const structured = ["object", "array", "record"].includes(definition.type)
  if (structured && reading && column && !document && type === Type.SQLite && typeof value === "string")
    value = JSON.parse(value)
  document ||= structured && column
  if (definition.type === "object" && typeof value === "object" && !Array.isArray(value)) {
    const output = { ...value as Record<string, unknown> }
    for (const [key, child] of Object.entries(definition.shape!)) {
      if (Object.hasOwn(output, key))
        output[key] = convert(child, output[key], reading, true, type, document)
    }
    return output
  }
  if (definition.type === "array" && Array.isArray(value))
    return value.map((item) => convert(definition.element!, item, reading, column, type, document))
  if (definition.type === "record" && typeof value === "object")
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, convert(definition.valueType!, item, reading, true, type, document)]))
  const kind = storage(schema)
  if (definition.type === "enum" && reading && !document) {
    const values = [...current._zod.values!]
    if (kind === "number")
      return Number(value)
    if (values.some((value) => typeof value === "number"))
      return values.find((entry) => (typeof entry === "string" ? JSON.stringify(entry) : String(entry)) === value) ?? value
  }
  if (kind === "timestamp")
    return reading ? Number(value) : value
  if (kind === "date")
    return reading ? (value instanceof Date ? value : new Date(value as string)) : (value as Date).toISOString()
  if (kind === "bigint")
    return reading ? BigInt(value as string) : String(value)
  if (kind === "boolean" && reading && (value === 0 || value === 1 || value === 0n || value === 1n))
    return value === 1 || value === 1n
  return value
}

/** Recognize native Zod JSON without treating arbitrary lazy schemas as JSON. */
function json(schema: z.core.$ZodType): boolean {
  if (schema._zod.def.type !== "lazy")
    return false
  const cached = jsons.get(schema)
  if (cached !== undefined)
    return cached
  // Native JSON is a recursive union of primitives, arrays, and string-keyed records
  const getter = (schema._zod.def as definition).getter!
  const definition = getter()._zod.def as definition
  const options = definition.options ?? []
  const kinds = new Set<string>(options.map((option) => option._zod.def.type))
  const result = definition.type === "union" && options.length === 6 && ["string", "number", "boolean", "null", "array", "record"].every((kind) => kinds.has(kind)) && options.every((option) => {
    const child = option._zod.def as definition
    if (child.type === "array")
      return (child.element!._zod.def as definition).getter === getter
    if (child.type === "record")
      return child.keyType!._zod.def.type === "string" && (child.valueType!._zod.def as definition).getter === getter
    return true
  })
  jsons.set(schema, result)
  return result
}

/** Cache JSON recognition for immutable schema instances. */
const jsons = new WeakMap<object, boolean>()
/** Determine whether null is an explicitly accepted storage value. */
function nullable(schema: z.core.$ZodType): boolean {
  const definition = schema._zod.def as definition
  return definition.type === "nullable" || definition.type === "null" || Boolean(definition.innerType && nullable(definition.innerType))
}

/** Detect optional inputs beneath readonly and default wrappers. */
function optional(schema: z.core.$ZodType): boolean {
  const definition = schema._zod.def as definition
  return definition.type === "optional" || Boolean(definition.innerType && optional(definition.innerType))
}

/** Collect fields of composed object schemas for unambiguous result decoding. */
function properties(schema: z.core.$ZodType): Set<string> | undefined {
  const definition = unwrap(schema)._zod.def as definition
  if (definition.type === "object")
    return new Set(Object.keys(definition.shape!))
  if (definition.type === "intersection") {
    const left = properties(definition.left!)
    const right = properties(definition.right!)
    if (left && right)
      return new Set([...left, ...right])
  }
}

/** The structural schema definitions used for storage traversal. */
type definition = {
  type: string
  getter?: () => z.core.$ZodType
  keyType?: z.core.$ZodType
  innerType?: z.core.$ZodType
  shape?: Record<string, z.core.$ZodType>
  catchall?: z.core.$ZodType
  element?: z.core.$ZodType
  valueType?: z.core.$ZodType
  left?: z.core.$ZodType
  right?: z.core.$ZodType
  values?: unknown[]
  options?: z.core.$ZodType[]
}
