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

/** Type alias for URLs with supported protocols. */
export const url = Object.assign(is.url({ protocol: /^https?|file|wasm|data|blob|jsr|npm$/, hostname: /.*/ }), {
  with(protocols: string[], { hostname = /.*/, ...options }: Exclude<is.z.core.$ZodURLParams, "protocol"> = {}) {
    return is.url({ protocol: new RegExp(`^https?|file|wasm|data|blob|jsr|npm|${protocols.join("|")}$`), hostname, ...options })
  },
}) as is.ZodURL & {
  /** Create a new type alias for URLs with additional custom supported protocols. */
  with(protocols: string[], params?: Exclude<is.z.core.$ZodURLParams, "protocol">): is.ZodURL
}

/** Type alias for expression strings. */
export const expression = is.string().regex(/\$\{.*\}/) as is.ZodString

/** Type alias for callable values. */
export const callable = is.unknown().refine((value) => typeof value === "function", { message: "Invalid input: Value must be callable" }) as is.ZodUnknown

/** Type alias for Zod schemas. */
export const parser = is.custom((value) => (value instanceof is.ZodType) || (value && (typeof value === "object") && (typeof (value as Record<PropertyKey, unknown>).parse === "function")), { message: "Invalid input: Value must be a Zod schema" }) as is.ZodCustom<unknown, unknown>

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
