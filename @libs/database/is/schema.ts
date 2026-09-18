// Imports
import { is as z } from "@libs/is"
import { Inheritance, resolve } from "./_inherit.ts"
export type { Inheritance } from "./_inherit.ts"
import { decorate } from "./_metadata.ts"
import type { Schema } from "./_metadata.ts"
export type { Checks, Modifiers, ObjectModifiers, Primary, References, Schema } from "./_metadata.ts"

/** Inherit a shared column and optionally attach database constraints. */
export const inherit: Inheritance = new Inheritance()

/** Declare a database table and its column schemas. */
export function table<S extends z.ZodRawShape>(name: string, shape: S): Schema<z.ZodObject<S>>
/** Extend a shared object schema with column overrides and inherited constraints. */
export function table<S extends z.ZodRawShape, C extends z.core.$ZodObjectConfig, O extends Record<string, z.ZodType | Inheritance>>(
  name: string,
  schema: z.ZodObject<S, C>,
  overrides: O & { [K in keyof O]: O[K] extends Inheritance ? K extends keyof S ? O[K] : never : O[K] },
): Schema<z.ZodObject<inherited<S, O>, C>>
export function table(name: string, source: z.ZodRawShape | z.ZodObject, overrides?: Record<string, z.ZodType | Inheritance>): Schema<z.ZodObject> {
  if (!name || name.includes("\0"))
    throw new TypeError("Invalid table name " + JSON.stringify(name))
  // Keep shared object checks and policies while resolving each column independently
  if (source instanceof z.ZodObject) {
    const shape: Record<string, z.ZodType> = Object.fromEntries(Object.entries(source.shape).map(([key, value]) => [key, column(value as z.ZodType)]))
    for (const [key, value] of Object.entries(overrides ?? {})) {
      if (value instanceof Inheritance) {
        if (!Object.hasOwn(source.shape, key))
          throw new TypeError("Cannot inherit unknown column " + name + "." + key)
        shape[key] = resolve(source.shape[key], value)
      } else {
        shape[key] = value
      }
    }
    return decorate(source.safeExtend(shape), { table: name })
  }
  return decorate(z.object(source), { table: name })
}

/** Wrap an existing Zod schema with database modifiers without changing the original. */
export function column<T extends z.ZodType>(schema: T): Schema<T> {
  return decorate(schema.clone())
}

/** Validate an object stored as JSON when used as a column. */
export function object<S extends z.ZodRawShape>(shape: S): Schema<z.ZodObject<S>> {
  return decorate(z.object(shape))
}

/** Validate a string. */
export function string(...args: Parameters<typeof z.string>): Schema<z.ZodString> {
  return decorate(z.string(...args))
}

/** Validate a string matching a regular expression. */
export function regex(pattern: RegExp): Schema<z.ZodString> {
  return decorate(z.string().regex(pattern))
}

/** Validate a UUID string. */
export function uuid(...args: Parameters<typeof z.uuid>): Schema<z.ZodUUID> {
  return decorate(z.uuid(...args))
}

/** Validate a URL string. */
export function url(...args: Parameters<typeof z.url>): Schema<z.ZodURL> {
  return decorate(z.url(...args))
}

/** Validate a boolean. */
export function boolean(): Schema<z.ZodBoolean> {
  return decorate(z.boolean())
}

/** Validate a finite floating-point number. */
export function number(): Schema<z.ZodNumber> {
  return decorate(z.number())
}

/** Validate a safe integer. */
export function int(): Schema<z.ZodNumberFormat> {
  return decorate(z.int())
}

/** Validate a JavaScript bigint. */
export function bigint(): Schema<z.ZodBigInt> {
  return decorate(z.bigint())
}

/** Validate a JavaScript Date. */
export function date(): Schema<z.ZodDate> {
  return decorate(z.date())
}

/** Validate a safe integer Unix timestamp in milliseconds. */
export function timestamp(): Schema<z.ZodNumberFormat> {
  return decorate(z.int(), { timestamp: true })
}

/** Validate an array stored as JSON when used as a column. */
export function array<T extends z.core.$ZodType>(element: T): Schema<z.ZodArray<T>> {
  return decorate(z.array(element))
}

/** Validate a record stored as JSON when used as a column. */
export function record<K extends z.core.$ZodRecordKey, V extends z.core.$ZodType>(key: K, value: V): Schema<z.ZodRecord<K, V>> {
  return decorate(z.record(key, value))
}

/** Validate arbitrary JSON-compatible values. */
export function json(): Schema<ReturnType<typeof z.json>> {
  return decorate(z.json(), { json: true })
}

/** Validate a single primitive value. */
export function literal<const T extends z.core.util.Literal>(value: T): Schema<z.ZodLiteral<T>> {
  return decorate(z.literal(value))
}

/** Validate a string enumeration with named entries. */
function _enum<const T extends readonly string[]>(values: T): Schema<z.ZodEnum<{ [K in T[number]]: K }>>
/** Validate an enumeration of string or number values. */
function _enum<const T extends readonly (string | number)[]>(values: T): Schema<z.ZodEnum<Record<string, T[number]>>>
/** Validate an enum object, including native TypeScript enums. */
function _enum<const T extends Record<string, string | number>>(values: T): Schema<z.ZodEnum<T>>
function _enum(values: readonly (string | number)[] | Record<string, string | number>): Schema<z.ZodEnum<Record<string, string | number>>> {
  if (Array.isArray(values) && values.every((value) => typeof value === "string"))
    return decorate(z.enum(values as string[]))
  return decorate(z.enum(Array.isArray(values) ? Object.fromEntries(values.map((value, index) => [`value${index}`, value])) : values as Record<string, string | number>))
}

/** Validate null. */
function _null(): Schema<z.ZodNull> {
  return decorate(z.null())
}

export { _enum as enum, _null as null }

/** Validate ISO datetime strings without converting them to Date objects. */
export const iso: {
  /** Validate an ISO datetime string. */
  datetime(...args: Parameters<typeof z.iso.datetime>): Schema<z.ZodISODateTime>
} = {
  /** Validate an ISO datetime string. */
  datetime(...args: Parameters<typeof z.iso.datetime>): Schema<z.ZodISODateTime> {
    return decorate(z.iso.datetime(...args))
  },
}

/** Input accepted by a schema before defaults and validation. */
export type input<T extends z.core.$ZodType> = z.input<T>
/** Output produced by a schema after defaults and validation. */
export type output<T extends z.core.$ZodType> = z.output<T>

/** Resolve inherited fields and explicit overrides without widening column types. */
type inherited<S extends z.ZodRawShape, O extends Record<string, z.ZodType | Inheritance>> = {
  [K in keyof S | keyof O]: K extends keyof O ? O[K] extends Inheritance ? K extends keyof S ? S[K] extends z.ZodType ? Schema<S[K]> : S[K] : never : O[K] extends z.ZodType ? O[K] : never : K extends keyof S ? S[K] extends z.ZodType ? Schema<S[K]> : S[K]
  : never
}
