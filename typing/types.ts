/** Read-write accessor. */
//deno-lint-ignore no-explicit-any
export type rw = any

/** Callback function. */
// deno-lint-ignore ban-types
export type callback = Function

/** Record. */
export type record<T = unknown> = Record<PropertyKey, T>

/** Extract value type from Record. */
export type RecordValue<T> = T extends Record<PropertyKey, infer U> ? U : never

/** Extract key type from {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map | Map}. */
export type MapKey<T> = T extends Map<infer U, unknown> ? U : never

/** Extract value type from {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map | Map}. */
export type MapValue<T> = T extends Map<unknown, infer U> ? U : never

/** Extract value type from {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set | Set}. */
export type SetValue<T> = T extends Set<infer U> ? U : never

/** Extract key type from {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakMap | WeakMap}. */
export type WeakMapKey<T> = T extends WeakMap<infer U, unknown> ? U : never

/** Extract value type from {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakMap | WeakMap}. */
export type WeakMapValue<T> = T extends WeakMap<WeakKey, infer U> ? U : never

/** Extract value type from {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakSet | WeakSet}. */
export type WeakSetValue<T> = T extends WeakSet<infer U> ? U : never

/** Optional type. */
export type Optional<T> = T | undefined

/** Nullable type. */
export type Nullable<T> = T | null

/** Promisable type.  */
export type Promisable<T> = T | Promise<T>

/** Arrayable type. */
export type Arrayable<T> = T | Array<T>

/** Extract function argument. */
// deno-lint-ignore no-explicit-any
export type Arg<T extends ((...args: any[]) => any), index extends number = 0, required extends boolean = false> = required extends true ? NonNullable<Parameters<T>[index]> : Parameters<T>[index]

/** Deep partial type. */
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

/** Typed array type. */
export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float16Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array
