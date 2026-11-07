/**
 * Reads an environment variable.
 *
 * An empty string is returned if the variable is unreadable (or null when `nullable: true`).
 *
 * ```ts
 * env("ENV_VAR", { default: "foo" })
 * ```
 */
export function env<IsNullable extends boolean = false>(key: string, options?: { boolean?: false; default?: string; nullable?: IsNullable }): IsNullable extends true ? Nullable<string, IsNullable> : string
/**
 * Reads an environment variable and converts it to a boolean.
 *
 * Any non-empty string is considered truthy, except for:
 * - Values matching falsy definition in {@link https://yaml.org/type/bool.html | YAML 1.1 specification}
 * - Zero-valued strings after a number conversion
 *
 * A falsy value is returned if the variable is unreadable (or null when `nullable: true`).
 *
 * ```ts
 * env("ENV_VAR", { boolean: true, default: "false" })
 * ```
 */
export function env<IsNullable extends boolean = false>(key: string, options: { boolean: true; default?: string; nullable?: IsNullable }): IsNullable extends true ? Nullable<boolean, IsNullable> : boolean
/**
 * Reads an environment variable and converts it to a number.
 *
 * The default value is returned if the variable is unreadable (or null when `nullable: true`).
 * If no default value is provided, `NaN` is used as the fallback.
 *
 * ```ts
 * env("ENV_VAR", { number: true, default: 42 })
 * ```
 */
export function env<IsNullable extends boolean = false>(key: string, options: { number: true; default?: number; nullable?: IsNullable }): IsNullable extends true ? Nullable<number, IsNullable> : number
/**
 * Reads an environment variable and ensure it matches one of the provided values.
 *
 * The default value is returned if the variable is unreadable (or null when `nullable: true`).
 *
 * ```ts
 * env("ENV_VAR", { enum: ["development", "production"], default: "development" })
 * ```
 */
export function env<const Values extends readonly string[], IsNullable extends boolean = false>(key: string, options: { enum: Values; default: NoInfer<Values[number]>; nullable?: IsNullable }): Values[number] | (IsNullable extends true ? null : never)
/** Reads and converts an environment variable, applying the requested fallback. */
export function env(key: string, { boolean = false, number = false, enum: values, nullable = false, default: _default }: { boolean?: boolean; number?: boolean; enum?: readonly string[]; nullable?: boolean; default?: string | number } = {}) {
  const fallback = number ? (_default ?? NaN) : values ? _default : (_default ?? "")
  let value
  try {
    if (Deno.permissions.querySync({ name: "env", variable: key }).state === "granted")
      value = Deno.env.get(key)
  } catch {
    // Unavailable environment APIs are treated as unreadable variables
  }
  if ((value === undefined) && nullable)
    return null
  if (number) {
    if (nullable && (!String(value ?? "").length))
      return null
    return Number.isNaN(Number(value)) ? fallback : Number(value)
  }
  if (values)
    return values.includes(value as string) ? value : fallback
  const text = String(value || fallback)
  if (boolean) {
    if (+text === 0)
      return false
    return !/^([Nn]o?|NO|[Oo]ff|OFF|[Ff]alse|FALSE)$/.test(text)
  }
  return text
}

/** Nullable type. */
export type Nullable<T, N extends boolean> = N extends true ? T | null : T
