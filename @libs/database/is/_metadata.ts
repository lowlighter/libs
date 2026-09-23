// Imports
import { is as z } from "@libs/is"

/** Schema-local storage metadata, never attached to global Zod prototypes. */
export const metadata = new WeakMap<object, Metadata>()

/** Attach immutable database modifiers while preserving native Zod methods. */
export function decorate<T extends z.ZodType>(schema: T, options: Metadata = {}): Schema<T> {
  const proxy = new Proxy(schema, {
    get(target, key) {
      if (key === "index" || key === "unique") {
        return (columns?: readonly string[], ...tuples: readonly string[][]) => {
          if ((columns || tuples.length) && (!options.table))
            throw new TypeError(`${String(key)} column lists require is.table()`)
          if (((columns !== undefined) && (!Array.isArray(columns))) || tuples.some((tuple) => !Array.isArray(tuple)))
            throw new TypeError(`${String(key)} expects column tuples, received ${JSON.stringify([columns, ...tuples])}`)
          return decorate(target.clone(), { ...options, indexes: [...options.indexes ?? [], { columns: columns?.slice(), unique: key === "unique", ...(tuples.length ? { tuples: tuples.map((tuple) => tuple.slice()) } : {}) }] })
        }
      }
      if (key === "primary")
        return (primary: Primary | string[] = {}) => decorate(target.clone(), { ...options, primary: Array.isArray(primary) ? { columns: primary } : primary })
      if (key === "references")
        return (table: string, column: string, actions: References = {}) => decorate(target.clone(), { ...options, references: { table, column, ...actions } })
      const value = Reflect.get(target, key, target)
      if (typeof value !== "function" || key === "constructor")
        return value
      return (...args: unknown[]) => {
        const result = Reflect.apply(value, target, args)
        return result instanceof z.ZodType ? decorate(result, options) : result
      }
    },
  })
  metadata.set(proxy, options)
  return proxy as unknown as Schema<T>
}

/** A Zod schema with chainable database constraints. */
export type Schema<T extends z.ZodType> =
  & Modifiers<T>
  & { [K in Exclude<Extract<keyof T, Checks>, "refine">]: T[K] extends (...args: infer A) => unknown ? (...args: A) => Schema<T> : T[K] }
  & (T extends { shape: infer S extends z.ZodRawShape } ? ObjectModifiers<S> : unknown)
  & T

/** Database modifiers shared by column schemas. */
export interface Modifiers<T extends z.ZodType> {
  /** Refine validation while preserving type predicates and database modifiers. */
  refine<C extends (value: z.output<T>) => unknown>(check: C, params?: Parameters<T["refine"]>[1]): C extends ((value: z.output<T>) => value is infer R extends z.output<T>) ? Schema<T & z.ZodType<R, z.input<T>>> : Schema<T>
  /** Index this column, or a table's named columns. */
  index(columns?: columns<T>): Schema<T>
  /** Index equivalent arrangements of a table's columns. */
  index<const C extends columns<T>>(columns: C, tuple: arrangement<NoInfer<C>>, ...tuples: arrangement<NoInfer<C>>[]): Schema<T>
  /** Require uniqueness for this column or a table's named columns. */
  unique(columns?: columns<T>): Schema<T>
  /** Require uniqueness across equivalent arrangements of a table's columns. */
  unique<const C extends columns<T>>(columns: C, tuple: arrangement<NoInfer<C>>, ...tuples: arrangement<NoInfer<C>>[]): Schema<T>
  /** Declare this column as the primary key. */
  primary(options?: Primary): Schema<T>
  /** Declare a composite primary key on a table. */
  primary(columns: T extends { shape: z.ZodRawShape } ? (keyof z.output<T> & string)[] : never): Schema<T>
  /** Reference a named column in another table. */
  references(table: string, column: string, options?: References): Schema<T>
  /** Accept undefined. */
  optional(): Schema<z.ZodOptional<T>>
  /** Accept null. */
  nullable(): Schema<z.ZodNullable<T>>
  /** Accept null and undefined. */
  nullish(): Schema<z.ZodOptional<z.ZodNullable<T>>>
  /** Reject undefined after an optional declaration. */
  nonoptional(): Schema<z.ZodNonOptional<T>>
  /** Freeze parsed output. */
  readonly(): Schema<z.ZodReadonly<T>>
  /** Apply an application-side default. */
  default(value: Exclude<z.output<T>, undefined> | (() => Exclude<z.output<T>, undefined>)): Schema<z.ZodDefault<T>>
  /** Parse a fallback input through the schema. */
  prefault(value: z.input<T> | (() => z.input<T>)): Schema<z.ZodPrefault<T>>
  /** Read native Zod metadata. */
  meta(): z.core.GlobalMeta | undefined
  /** Attach native Zod metadata without replacing database metadata. */
  meta(value: z.core.GlobalMeta): Schema<T>
  /** Validate an array of this schema. */
  array(): Schema<z.ZodArray<T>>
}

/** Shape-preserving object operations. */
export interface ObjectModifiers<S extends z.ZodRawShape> {
  /** Make every property optional. */
  partial(): Schema<z.ZodObject<{ [K in keyof S]: z.ZodOptional<S[K]> }>>
  /** Make selected properties optional. */
  partial<K extends keyof S>(mask: Record<K, true>): Schema<z.ZodObject<Omit<S, K> & { [P in K]: z.ZodOptional<S[P]> }>>
  /** Keep selected properties. */
  pick<K extends keyof S>(mask: Record<K, true>): Schema<z.ZodObject<Pick<S, K>>>
  /** Remove selected properties. */
  omit<K extends keyof S>(mask: Record<K, true>): Schema<z.ZodObject<Omit<S, K>>>
  /** Require every object property. */
  required(): Schema<z.ZodObject<{ [K in keyof S]: z.ZodNonOptional<S[K]> }>>
  /** Reject unknown object properties. */
  strict(): Schema<z.ZodObject<S, z.core.$strict>>
  /** Strip unknown object properties. */
  strip(): Schema<z.ZodObject<S, z.core.$strip>>
  /** Preserve unknown object properties. */
  passthrough(): Schema<z.ZodObject<S, z.core.$loose>>
  /** Preserve unknown object properties. */
  loose(): Schema<z.ZodObject<S, z.core.$loose>>
  /** Extend an object with additional properties. */
  extend<A extends z.ZodRawShape>(shape: A): Schema<z.ZodObject<Omit<S, keyof A> & A>>
}

/** Primary-key configuration. */
export interface Primary {
  /** Generate an integer identity when the column is omitted from an insert. */
  identity?: boolean
}

/** Referential actions supported by both backends. */
export interface References {
  /** Action when a referenced row is deleted. */
  delete?: "cascade" | "null" | "restrict" | "nothing"
  /** Action when a referenced key changes. */
  update?: "cascade" | "null" | "restrict" | "nothing"
}

/** Internal database schema metadata. */
export interface Metadata {
  /** SQL table name. */
  table?: string
  /** Application-defined JSON values. */
  json?: boolean
  /** Store integer Unix milliseconds without losing PostgreSQL precision. */
  timestamp?: boolean
  /** Index declarations. */
  indexes?: { columns?: string[]; unique: boolean; tuples?: string[][] }[]
  /** Primary key declaration. */
  primary?: Primary & { columns?: string[] }
  /** Foreign key declaration. */
  references?: References & { table: string; column: string }
}

/** Zod validation methods that preserve database modifiers when chained. */
export type Checks = "min" | "max" | "length" | "regex" | "trim" | "toLowerCase" | "toUpperCase" | "refine" | "superRefine" | "check" | "describe" | "positive" | "negative" | "nonnegative" | "nonpositive" | "multipleOf" | "int" | "safe"

/** Column names available to table-level index modifiers. */
type columns<T extends z.ZodType> = T extends { shape: z.ZodRawShape } ? readonly (keyof z.output<T> & string)[] : never

/** A tuple of equal length drawn from the first tuple's columns. */
type arrangement<T extends readonly string[]> = { readonly [K in keyof T]: T[number] }
