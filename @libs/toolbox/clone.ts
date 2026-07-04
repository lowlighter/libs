/**
 * Clones a value deeply.
 *
 * If `structuredCloneable` is set, the clone will be compatible with `structuredClone` algorithm, meaning that:
 * - Proxy are unproxyed to plain objects
 * - Incompatible types are ignored
 */
export function clone<T>(value: T, options?: { structuredCloneable?: boolean }): T {
  return _clone(value, options, new WeakMap()) as T
}

/** {@linkcode clone()} implementation. */
function _clone(value: unknown, options: { structuredCloneable?: boolean } | undefined, seen: WeakMap<object, unknown>): unknown {
  if (Array.isArray(value)) {
    if (seen.has(value))
      return seen.get(value)
    const cloned: unknown[] = []
    seen.set(value, cloned)
    for (const item of value)
      cloned.push(_clone(item, options, seen))
    return cloned
  }
  if ([Date, Error, Map, Set, RegExp].some((type) => value instanceof type))
    return structuredClone(value)
  if ((typeof value === "object") && (value !== null)) {
    if (seen.has(value))
      return seen.get(value)
    const cloned = {} as Record<PropertyKey, unknown>
    seen.set(value, cloned)
    for (const [k, v] of Object.entries(value)) {
      if ((options?.structuredCloneable) && (typeof v === "symbol" || typeof v === "function"))
        continue
      cloned[k] = _clone(v, options, seen)
    }
    return cloned
  }
  return value
}
