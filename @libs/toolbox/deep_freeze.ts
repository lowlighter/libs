/** Freeze a value and every nested own data property. */
export function deepFreeze<Value>(value: Value): DeepReadonly<Value> {
  return freeze(value, new WeakSet()) as DeepReadonly<Value>
}

/** Recursively readonly representation of a deeply frozen value. */
export type DeepReadonly<Value> = Value extends (...args: never[]) => unknown ? Value : Value extends object ? { readonly [Key in keyof Value]: DeepReadonly<Value[Key]> } : Value

/** Recursively freeze an object graph while preserving cycles. */
function freeze(value: unknown, seen: WeakSet<object>): unknown {
  if (((typeof value !== "object") && (typeof value !== "function")) || (value === null) || seen.has(value))
    return value
  seen.add(value)
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor && ("value" in descriptor))
      freeze(descriptor.value, seen)
  }
  return Object.freeze(value)
}
