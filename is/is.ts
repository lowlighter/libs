// Imports
// deno-lint-ignore-file no-explicit-any ban-types
import type { ParseOptions as ParseArgsOptions } from "@std/cli/parse-args"
import { parseArgs } from "@std/cli/parse-args"
import * as is from "@zod/zod"
export * as is from "@zod/zod"
export type * from "@zod/zod"

/** Coalesces a parsed value to `undefined` so schema defaults can be applied. */
export function coalesce<T extends is.ZodType>(schema: T): is.ZodPipe<is.ZodTransform<{} | undefined, unknown>, T> {
  return is.preprocess((value) => {
    return value ?? undefined
  }, schema)
}

/** Coerces a parsed value into `number` type when possible. */
export function coerce<T extends is.ZodType>(schema: T): is.ZodPipe<is.ZodTransform<unknown, unknown>, T> {
  return is.preprocess((value) => {
    if (typeof value === "string") {
      const coerced = Number(value)
      if ((!Number.isNaN(coerced)) || (value === "NaN")) {
        return coerced
      }
    }
    return value
  }, schema)
}

/** Allows the `null` value and makes it the default value in schemas. */
export function nullable<T extends is.ZodType>(schema: T): is.ZodDefault<is.ZodNullable<T>> {
  return schema.nullable().default(null)
}

/** Ensures a parsed value is compatible with `structuredClone` algorithm. */
export function clonable<T extends is.ZodType>(schema: T): is.ZodPipe<is.ZodTransform<any, unknown>, T> {
  return is.preprocess((value, context) => {
    try {
      structuredClone(value)
    } catch (error) {
      context.addIssue(`Invalid input: Value must be compatible with structuredClone algorithm: ${error}`)
    }
    return value
  }, schema)
}

/** Transforms a parsed value into an array if it is not already one. */
export function arrayable<T extends is.ZodType>(schema: T): is.ZodPipe<is.ZodTransform<any[], unknown>, T> {
  return is.preprocess((value) => {
    if (!Array.isArray(value)) {
      return [value]
    }
    return value
  }, schema)
}

/** Transforms a CLI arguments string into an object or array. */
export function cliable<T extends is.ZodType>(schema: T, options?: ParseArgsOptions): is.ZodPipe<is.ZodTransform<any, unknown>, T> {
  return is.preprocess((value, context) => {
    if (typeof value === "string") {
      const args = []
      let current = ""
      let quoted = ""
      let escape = false
      for (const char of value) {
        if (escape) {
          current += char
          escape = false
          continue
        }
        if ((quoted === '"') && (char === "\\")) {
          escape = true
          continue
        }
        if ((!quoted) && ((char === '"') || (char === "'"))) {
          quoted = char
          continue
        }
        if (quoted === char) {
          quoted = ""
          continue
        }
        if ((!quoted) && (char === " ")) {
          if (current) {
            args.push(current)
            current = ""
          }
          continue
        }
        current += char
      }
      if (quoted) {
        context.addIssue(`Unclosed quote: ${quoted}${current}`)
        return value
      }
      if (current) {
        args.push(current)
      }
      return options ? parseArgs(args, options) : args
    }
    return value
  }, schema)
}

/** Parses a regular expression back into a `RegExp`. */
export function regex<T extends is.ZodType>(schema: T): is.ZodPipe<is.ZodTransform<unknown, unknown>, T> {
  const definition = /^\/(?<pattern>.*?)\/(?<flags>[dgimsuvy]*)$/
  return is.preprocess((value) => {
    if ((typeof value === "string") && (definition.test(value))) {
      const groups = value.match(definition)?.groups
      if (groups) {
        const { pattern, flags } = groups
        try {
          return new RegExp(pattern, flags)
        } catch {
          return value
        }
      }
    }
    return value
  }, schema)
}

/** Parses a date string back into a `Date`. */
export function date<T extends is.ZodType>(schema: T): is.ZodPipe<is.ZodTransform<unknown, unknown>, T> {
  return is.preprocess((value) => {
    if (typeof value === "string") {
      const date = new Date(value)
      if (!Number.isNaN(date.getTime())) {
        return date
      }
    }
    return value
  }, schema)
}

/** Parses a duration string into milliseconds. */
export function duration<T extends is.ZodType>(schema: T): is.ZodPipe<is.ZodTransform<any, unknown>, T> {
  return is.preprocess((value) => {
    if (typeof value === "string") {
      const groups = value.match(/^\s*(?:(?<days>\d+)d(?:ays?)?)?\s*(?:(?<hours>\d+)h(?:(?:ou)?rs?)?)?\s*(?:(?<minutes>\d+)m(?:in(?:ute)?s?)?)?\s*(?:(?<seconds>\d+)s(?:ec(?:ond)?s?)?)?\s*(?:(?<milliseconds>\d+)(?:m(?:illi)?s(?:ec(?:ond)?s?)?)?)?\s*$/)?.groups
      if (groups) {
        let { days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = Object.fromEntries(Object.entries(groups).map(([key, value]) => [key, Number(value)]).filter(([_, value]) => Number.isFinite(value)))
        hours += days * 24
        minutes += hours * 60
        seconds += minutes * 60
        milliseconds += seconds * 1000
        return milliseconds
      }
    }
    return value
  }, schema)
}

/** Type alias for primitive values. */
export const primitive = is.union([is.string(), is.number(), is.bigint(), is.boolean(), is.undefined(), is.null(), is.date(), is.instanceof(Error)]) as is.ZodUnion<
  readonly [is.ZodString, is.ZodNumber, is.ZodBigInt, is.ZodBoolean, is.ZodUndefined, is.ZodNull, is.ZodDate, is.ZodCustom<Error, Error>]
>

/** Type alias for typed arrays. */
export const typedArray = is.union([
  is.instanceof(Int8Array),
  is.instanceof(Uint8Array),
  is.instanceof(Uint8ClampedArray),
  is.instanceof(Int16Array),
  is.instanceof(Uint16Array),
  is.instanceof(Int32Array),
  is.instanceof(Uint32Array),
  is.instanceof(Float16Array),
  is.instanceof(Float32Array),
  is.instanceof(Float64Array),
  is.instanceof(BigInt64Array),
  is.instanceof(BigUint64Array),
]) as is.ZodUnion<
  readonly [
    is.ZodCustom<Int8Array, Int8Array>,
    is.ZodCustom<Uint8Array, Uint8Array>,
    is.ZodCustom<Uint8ClampedArray, Uint8ClampedArray>,
    is.ZodCustom<Int16Array, Int16Array>,
    is.ZodCustom<Uint16Array, Uint16Array>,
    is.ZodCustom<Int32Array, Int32Array>,
    is.ZodCustom<Uint32Array, Uint32Array>,
    is.ZodCustom<Float16Array, Float16Array>,
    is.ZodCustom<Float32Array, Float32Array>,
    is.ZodCustom<Float64Array, Float64Array>,
    is.ZodCustom<BigInt64Array, BigInt64Array>,
    is.ZodCustom<BigUint64Array, BigUint64Array>,
  ]
>

/** Type alias for URLs with supported protocols. */
export const url = Object.assign(is.url({ protocol: /^https?|file|wasm|data|blob|jsr|npm$/, hostname: /.*/ }), {
  with(protocols: string[], { hostname = /.*/, ...options }: Exclude<is.z.core.$ZodURLParams, "protocol"> = {}) {
    return is.url({ protocol: new RegExp(`^https?|file|wasm|data|blob|jsr|npm|${protocols.join("|")}$`), hostname, ...options })
  },
}) as is.ZodURL & {
  /** Create a new type alias for URLs with additional custom supported protocols. */
  with(protocols: string[], params?: Exclude<is.z.core.$ZodURLParams, "protocol">): is.ZodURL
}

/** Type alias for body init. */
export const bodyInit = is.union([
  is.string(),
  is.instanceof(String),
  is.instanceof(Blob),
  is.instanceof(ArrayBuffer),
  is.instanceof(DataView),
  is.instanceof(FormData),
  is.instanceof(ReadableStream),
  is.instanceof(URLSearchParams),
  typedArray,
]).nullable() as is.ZodNullable<
  is.ZodUnion<
    readonly [
      is.ZodString,
      is.ZodCustom<String, String>,
      is.ZodCustom<Blob, Blob>,
      is.ZodCustom<ArrayBuffer, ArrayBuffer>,
      is.ZodCustom<DataView, DataView>,
      is.ZodCustom<FormData, FormData>,
      is.ZodCustom<ReadableStream, ReadableStream>,
      is.ZodCustom<URLSearchParams, URLSearchParams>,
      typeof typedArray,
    ]
  >
>

/**
 * System permissions flags.
 *
 * See {@link https://docs.deno.com/runtime/fundamentals/security/#system-information}.
 */
const sysflags = ["hostname", "osRelease", "osUptime", "loadavg", "networkInterfaces", "systemMemoryInfo", "uid", "gid"] as const

/** Type alias factory for permission descriptors. */
function permission({ expand = false, urls = false, sys = false } = {}) {
  return is.preprocess((value) => {
    if (value === "inherit") {
      return value
    }
    if (typeof value === "string") {
      value = [value]
    }
    if (expand) {
      if ((value === undefined) || (value === false)) {
        value = []
      }
    }
    if (urls && Array.isArray(value)) {
      value = value.map((value) => value instanceof URL ? value.href : value)
    }
    return value
  }, is.union([is.literal("inherit"), is.boolean(), is.array(sys ? is.enum(sysflags) : is.string())]))
}

/** Type alias factory for permissions object. */
export function permissions<T extends keyof Deno.PermissionOptionsObject>(options?: { set?: T[]; expand?: false }): is.ZodObject<Record<T, is.ZodOptional<is.ZodUnion<[is.ZodLiteral<"inherit">, is.ZodBoolean, is.ZodArray<is.ZodString>]>>>>
/** Type alias factory for permissions object. */
export function permissions<T extends keyof Deno.PermissionOptionsObject>(options: { set?: T[]; expand: true }): is.ZodObject<Record<T, is.ZodUnion<[is.ZodLiteral<"inherit">, is.ZodLiteral<true>, is.ZodArray<is.ZodString>]>>>
export function permissions<T extends keyof Deno.PermissionOptionsObject>({ set = ["read", "write", "net", "env", "run", "sys", "ffi", "import"] as T[], expand = false }: { set?: T[]; expand?: boolean } = {}) {
  const validator = is.object({
    read: permission({ expand, urls: true }),
    write: permission({ expand, urls: true }),
    net: permission({ expand }),
    env: permission({ expand }),
    sys: permission({ expand, sys: true }),
    run: permission({ expand, urls: true }),
    ffi: permission({ expand, urls: true }),
    import: permission({ expand }),
  }).pick<any>(Object.fromEntries(set.map((key) => [key, true]))).strict()

  // Return either the compact or expanded version
  if (!expand) {
    return validator.partial().or(is.union([is.literal("inherit"), is.literal("none")]))
  }
  return is.preprocess((value) => {
    if ((value === "inherit") || (value === "none")) {
      return Object.fromEntries(set.map((key) => [key, value === "none" ? [] : value]))
    }
    if (typeof value === "string") {
      value = [value]
    }
    if (Array.isArray(value)) {
      return { ...Object.fromEntries(set.map((permission) => [permission, false])), ...Object.fromEntries(value.map((permission) => [permission, "inherit"])) }
    }
    return value
  }, validator) as unknown
}

/** Type alias for expression strings. */
export const expression = is.string().regex(/\$\{.*\}/) as is.ZodString

/** Type alias for callable values. */
export const callable = is.unknown().refine((value) => typeof value === "function", { message: "Invalid input: Value must be callable" }) as unknown as is.ZodCustom<Function, unknown>

/** Type alias for Zod schemas. */
export const parser = is.custom((value) => (value instanceof is.ZodType) || (value && (typeof value === "object") && (typeof (value as Record<PropertyKey, unknown>).parse === "function")), { message: "Invalid input: Value must be a Zod schema" }) as is.ZodCustom<
  is.ZodType,
  unknown
>

/** Object that ressemble a ZodError. */
type ZodErrorLike = { path?: PropertyKey[]; message: string; errors?: ZodErrorLike[][] }

/** Convert a property key path to a string. */
function toPath(path: PropertyKey[] = []): string {
  const segments = []
  for (const segment of path) {
    if (typeof segment === "number") {
      segments.push(`[${segment}]`)
    } else if (typeof segment === "symbol" || /[^\w$]/.test(String(segment))) {
      segments.push(`[${JSON.stringify(String(segment))}]`)
    } else {
      segments.push(`.${segment}`)
    }
  }
  return segments.join("")
}

/** Prettify validation issues in a more detailed way. */
function prettifyIssue(errors: ZodErrorLike | ZodErrorLike[], { indent = "" } = {}): string {
  const lines = []
  if (!Array.isArray(errors)) {
    errors = [errors]
  }
  errors.sort((a, b) => (a.path ?? []).length - (b.path ?? []).length)
  for (const error of errors) {
    lines.push(`${indent}✘ ${error.message}`)
    if (error.path?.length) {
      lines.push(`${indent}  → at ${toPath(error.path)}`)
    }
    if (error.errors?.length) {
      lines.push(`${indent}  → tried to fit into one of the allowed types:`)
      for (const suberror of error.errors) {
        lines.push(prettifyIssue(suberror, { indent: `${indent}      ` }).replace("  ✘", "- ✘"))
      }
    }
  }
  return lines.join("\n")
}

/** Options for {@linkcode parse()}. */
export type ParseOptions = {
  /** Whether to parse asynchronously. */
  async?: boolean
  /** Whether to throw a `ZodError` rather than a `TypeError` in case of failure */
  zodError?: boolean
}

/** Parse a schema synchronously. */
export function parse<T extends is.ZodType>(schema: T, values: unknown, options?: Exclude<ParseOptions, "async"> & { async?: false }): is.infer<T>
/** Parse a schema asynchronously. */
export function parse<T extends is.ZodType>(schema: T, values: unknown, options?: Exclude<ParseOptions, "async"> & { async?: true }): Promise<is.infer<T>>
export function parse<T extends is.ZodType>(schema: T, values: unknown, { async = false, zodError }: ParseOptions = {}) {
  try {
    return async
      ? schema.parseAsync(values).catch((error) => {
        if ((!(error instanceof is.ZodError)) || zodError) {
          throw error
        }
        throw new TypeError(`Validation failed: \n${prettifyIssue(error.issues)}`)
      })
      : schema.parse(values)
  } catch (error) {
    if ((!(error instanceof is.ZodError)) || zodError) {
      throw error
    }
    throw new TypeError(`Validation failed: \n${prettifyIssue(error.issues)}`)
  }
}
