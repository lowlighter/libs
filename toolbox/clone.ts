/**
 * Clones a value deeply.
 *
 * If `structuredCloneable` is set, the clone will be compatible with `structuredClone` algorithm, meaning that:
 * - Proxy are unproxyed to plain objects
 * - Incompatible types are ignored
 */
export function clone<T>(value: T, options?: { structuredCloneable?: boolean }): T {
  if (Array.isArray(value)) {
    return value.map((item) => clone(item)) as T
  }
  if ([Date, Error, Map, Set, RegExp].some((type) => value instanceof type)) {
    return structuredClone(value) as T
  }
  if ((typeof value === "object") && (value !== null)) {
    const cloned = {} as Record<PropertyKey, unknown>
    for (const [k, v] of Object.entries(value)) {
      if ((options?.structuredCloneable) && (typeof v === "symbol" || typeof v === "function")) {
        continue
      }
      cloned[k] = clone(v, options)
    }
    return cloned as T
  }
  return value as T
}
