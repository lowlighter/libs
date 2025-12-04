/**
 * Reads an environment variable.
 *
 * An empty string is returned if the variable is unreadable.
 *
 * ```ts
 * env("ENV_VAR", { default: "foo" })
 * ```
 */
export function env(key: string, options?: { boolean?: false; default?: string }): string
/**
 * Reads an environment variable and converts it to a boolean.
 *
 * Any non-empty string is considered truthy, except for:
 * - Values matching falsy definition in {@link https://yaml.org/type/bool.html | YAML 1.1 specification}
 * - Zero-valued strings after a number conversion
 *
 * A falsy value is returned if the variable is unreadable.
 *
 * ```ts
 * env("ENV_VAR", { boolean: true, default: "false" })
 * ```
 */
export function env(key: string, options: { boolean: true; default?: string }): boolean
export function env(key: string, { boolean = false, default: _default = "" } = {}) {
  if (boolean) {
    const value = env(key, { boolean: false, default: _default })
    if (+value === 0) {
      return false
    }
    return !/^([Nn]o?|NO|[Oo]ff|OFF|[Ff]alse|FALSE)$/.test(value)
  }
  try {
    if (Deno.permissions.querySync({ name: "env", variable: key }).state !== "granted") {
      return _default
    }
    return Deno.env.get(key) || _default
  } catch {
    return _default
  }
}
