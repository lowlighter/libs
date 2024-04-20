/** Read-write accessor */
//deno-lint-ignore no-explicit-any
export type rw = any

/** Testing */
//deno-lint-ignore no-explicit-any
export type test = any

/** Callback */
// deno-lint-ignore ban-types
export type callback = Function

/** Record */
export type record<T = unknown> = Record<PropertyKey, T>

/** Extract key type from {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map | Map} */
export type MapKey<T> = T extends Map<infer U, unknown> ? U : never

/** Extract value type from {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map | Map} */
export type MapValue<T> = T extends Map<unknown, infer U> ? U : never

/** Extract value type from {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set | Set} */
export type SetValue<T> = T extends Set<infer U> ? U : never

/** Extract key type from {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap | WeakMap} */
export type WeakMapKey<T> = T extends WeakMap<infer U, unknown> ? U : never

/** Extract value type from {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap | WeakMap} */
export type WeakMapValue<T> = T extends WeakMap<WeakKey, infer U> ? U : never

/** Extract value type from {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet | WeakSet} */
export type WeakSetValue<T> = T extends WeakSet<infer U> ? U : never

/** Promisable type  */
export type Promisable<T> = T | Promise<T>

/** Optional type */
export type Optional<T> = T | undefined

/** Nullable type */
export type Nullable<T> = T | null

/** Arrayable type */
export type Arrayable<T> = T | Array<T>

/** Extract function argument */
export type Arg<T extends ((...args: unknown[]) => unknown), index extends number = 0, required extends boolean = false> = required extends true ? NonNullable<Parameters<T>[index]> : Parameters<T>[index]
