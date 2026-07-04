/** Read-write accessor. */
// deno-lint-ignore no-explicit-any
export type rw = any

/** Callback function. */
// deno-lint-ignore ban-types
export type Callback = Function

/** Class constructor. */
// deno-lint-ignore no-explicit-any
export type Constructor<T = unknown> = new (...args: any[]) => T

/** Extract value type from Record. */
export type RecordValue<T> = T extends Record<PropertyKey, infer U> ? U : never

/** Extract key type from {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map | Map}. */
export type MapKey<T> = T extends Map<infer U, unknown> ? U : never

/** Extract value type from {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map | Map}. */
export type MapValue<T> = T extends Map<unknown, infer U> ? U : never

/** Extract value type from {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array | Array}. */
export type ArrayValue<T> = T extends Array<infer U> ? U : never

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

/** Voidable type. */
export type Voidable<T> = T | void

/** Nullable type. */
export type Nullable<T> = T | null

/** Promisable type.  */
export type Promisable<T> = T | Promise<T>

/** Arrayable type. */
export type Arrayable<T> = T | Array<T>

/** Non-empty {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array | Array} type. */
export type NonEmptyArray<T> = [T, ...T[]]

/** Flatten intersections into a single mapped type for improved readability. */
// deno-lint-ignore ban-types
export type Prettify<T> = { [P in keyof T]: T[P] } & {}

/** Non `void` type. */
export type NonVoid<T> = T extends void ? never : T

/** Extract function argument. */
// deno-lint-ignore no-explicit-any
export type Arg<T extends ((...args: any[]) => any), index extends number = 0, required extends boolean = false> = required extends true ? NonNullable<Parameters<T>[index]> : Parameters<T>[index]

/** Omit first argument from a function. */
// deno-lint-ignore no-explicit-any
export type OmitFirstArg<F> = F extends (_0: any, ...args: infer T) => infer ReturnedType ? (...args: T) => ReturnedType : never

/** Deep partial type. */
export type DeepPartial<T> = T extends Callback ? T : T extends Array<infer U> ? (number extends T["length"] ? Array<DeepPartial<U>> : { [P in keyof T]?: DeepPartial<T[P]> }) : T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

/** Deep readonly type. */
export type DeepReadonly<T> = T extends Callback ? T : T extends object ? { readonly [P in keyof T]: DeepReadonly<T[P]> } : T

/** Deep non nullable type. */
export type DeepNonNullable<T> = T extends Callback ? T : T extends object ? { [P in keyof T]: DeepNonNullable<NonNullable<T[P]>> } : T

/** Typed array type. */
export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float16Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array

/** Possible values to `typeof` operator. */
export type TypeOfEnum = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"

/** Check if a type is `any`. */
export type IsAny<T> = boolean extends (T extends never ? true : false) ? true : false

/** Check if a type is not `any`. */
export type IsNotAny<T> = IsAny<T> extends true ? false : true

/** Check if a type is `never`. */
export type IsNever<T> = [T] extends [never] ? true : false
