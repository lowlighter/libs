/**
 * Reactive contexts.
 *
 * ## Terminology
 *
 * ### Ancestor contexts
 * Any {@link Context} that is further up in the chain of creation of a given {@link Context}.
 * A "parent context" refers to the immediate ancestor context.
 *
 * ### Descendant contexts
 * Any new {@link Context} created from a given {@link Context}.
 * A "child context" refers to the immediate descendant context.
 *
 * ### Sibling contexts
 * Any child context that shares the same parent context.
 *
 * ## Concepts
 *
 * ### Isolated data
 *
 * Refers to properties that are explicitly (re)defined in a child context and do not affect nor inherit from ancestor contexts properties.
 * Changes made to isolated data in a child context do not propagate back to ancestor and sibling contexts.
 * Isolated data becomes shared data in all descendant contexts unless isolated again.
 *
 * ### Shared Data
 * Refers to properties that are inherited from ancestor contexts.
 * These properties can be accessed and modified by descendant contexts.
 * Changes made to shared data in a descendant context propagate back to ancestor contexts and vice-versa.
 *
 * ## Features
 *
 * ### Observable properties
 * {@link Context} implements `EventTarget` interface and accepts event listeners.
 * Properties in the {@link Context.target} can be tracked and reacted to via events like `get`, `set`, `delete`, and `call`.
 * A `change` event is also dispatched whenever a property is set, deleted, or called.
 *
 * ### Context inheritance
 * Child contexts inherit properties from their parent contexts, making it easy to share data across multiple related contexts.
 * Properties set in a child context can override parent context properties, but inherited properties are still accessible unless explicitly overridden.
 *
 * ### Handling of specific classes:
 * Classes listed in {@link Context.unproxyable} are not proxied by default to avoid proxy-related issues and allow reflection.
 * It includes various built-in such as `Map`, `Set`, `Promise`, etc. and can be modified to fit specific use cases.
 *
 * ### Bidirectional data flow
 * Inherited properties propagate down to descendant contexts, and changes to shared properties reflect back up to ancestor contexts.
 * Isolated properties remain unique to the child context.
 *
 * > [!NOTE]
 * >
 * > Properties specified in {@link Context.with} are automatically isolated from the parent and sibling contexts.
 *
 * @module
 */

// Imports
import type { callback, Nullable, record } from "@libs/typing"
import type { DeepMerge } from "@std/collections/deep-merge"
export type { DeepMerge, record }

// Polyfill for `CustomEvent`
let _ContextEvent = globalThis.CustomEvent
if (!_ContextEvent) {
  _ContextEvent = class CustomEvent extends Event {
    constructor(type: string, init: CustomEventInit) {
      super(type)
      Object.assign(this, { detail: init.detail })
    }
  } as typeof _ContextEvent
}

/**
 * Reactive context.
 *
 * Create an object where every `get`, `set`, `delete`, and `call` operations are observable.
 * These events can be tracked using the `EventTarget` interface.
 * Observability is applied recursively to all properties of the object, including functions and collections such as `Map`, `Set`, and `Array`.
 *
 * > [!WARNING]
 * >
 * > To improve performance, same object paths are cached and not proxied multiple times.
 * > Current implementation is not able to differentiate `Symbol` properties when they have the same description, which may result in unexpected behavior.
 *
 * @example Observing `get`, `set`, `delete`, and `call` operations
 * ```ts
 * import { Context } from "./context.ts"
 *
 * const context = new Context({ foo: "bar", bar: () => null })
 *
 * // Attach listeners
 * context.addEventListener("get", ({detail:{property}}: any) => console.log(`get: ${property}`))
 * context.addEventListener("set", ({detail:{property, value}}: any) => console.log(`set: ${property}: ${value.old} => ${value.new}`))
 * context.addEventListener("delete", ({detail:{property}}: any) => console.log(`delete: ${property}`))
 * context.addEventListener("call", ({detail:{property, args}}: any) => console.log(`call: ${property}(${args.join(", ")})`))
 * context.addEventListener("change", ({detail:{type}}: any) => console.log(`change: ${type}`))
 *
 * // Operate on the context
 * context.target.foo = "baz"  // Triggers the "set" and "change" events
 * context.target.bar()        // Triggers the "call" and "change" events
 * ```
 *
 * @example Understanding how properties inheritance work
 * ```ts
 * import { Context } from "./context.ts"
 *
 * const a = new Context({ foo: "a", bar: "a" })
 * const b = a.with({ bar: "b", baz: "b" })
 * const c = b.with({ baz: "c" })
 *
 * console.log(JSON.stringify(a.target)) // {"foo":"a","bar":"a"}
 * console.log(JSON.stringify(b.target)) // {"foo":"a","bar":"b","baz":"b"}
 * console.log(JSON.stringify(c.target)) // {"foo":"a","bar":"b","baz":"c"}
 *
 * a.target.foo = "A"
 * b.target.bar = "B"
 * c.target.baz = "C"
 *
 * console.log(JSON.stringify(a.target)) // {"foo":"A","bar":"a"}
 * console.log(JSON.stringify(b.target)) // {"foo":"A","bar":"B","baz":"b"}
 * console.log(JSON.stringify(c.target)) // {"foo":"A","bar":"B","baz":"C"}
 * ```
 *
 * @example Handling built-in classes like `Set` or `Map`
 * ```ts
 * import { Context } from "./context.ts"
 *
 * const context = new Context({
 *   set: new Set([1, 2, 3]),
 * })
 *
 * // Attach listeners
 * let detail = null
 * context.addEventListener("call", (event: any) => detail = event.detail)
 *
 * // Operate on the context
 * context.target.set.add(4)
 *
 * // Log details
 * console.log(detail)
 * ```
 * The `detail` object would contain the following information:
 * ```json
 * {
 *   "target": {}, // Reference to the target `Set`
 *   "path": [ "set", "add" ],
 *   "property": "add",
 *   "args": [ 4 ],
 *   "type": "call"
 * }
 * ```
 *
 * @author Simon Lecoq (lowlighter)
 * @license MIT
 */
export class Context<T extends record = record> extends EventTarget {
  /** Constructor. */
  constructor(target = {} as T, { parent = null as Nullable<Context<record>> } = {}) {
    super()
    this.#parent = parent
    this.#target = target
    this.#own = new Set(Object.keys(this.#target))
    this.target = this.#proxify(this.#target)
  }

  /**
   * Parent {@link Context}.
   * Properties not found in the current context will be searched in the parent context.
   */
  readonly #parent: Nullable<Context<record>>

  /**
   * Children {@link Context | Contexts}.
   * Any property change in the parent context will be dispatched to the children contexts.
   */
  readonly #children = new Set<Context<record>>()

  /**
   * Properties owned by the current {@link Context}.
   * These were explicitly redefined with {@link Context.with} and thus are not inherited from the parent context.
   */
  readonly #own: Set<PropertyKey>

  /**
   * Actual target value.
   * This value is not proxied.
   */
  readonly #target

  /**
   * Observable target value.
   * This value is proxied.
   */
  readonly target: T

  /**
   * Instantiate a new inherited {@link Context} with superseded value.
   *
   * ```ts
   * import { Context } from "./context.ts"
   *
   * const parent = new Context({ foo: true })
   * const child = parent.with({ bar: true })
   *
   * console.assert(child.target.foo)
   * console.assert(child.target.bar)
   * ```
   */
  with<U extends record>(target: U): Context<DeepMerge<T, U>> {
    const context = new Context(target, { parent: this })
    this.#children.add(context)
    return context as Context<DeepMerge<T, U>>
  }

  /** Access target value from a property path. */
  #access(path = [] as PropertyKey[], target: record = this.#target) {
    return path.reduce((value, property) => (value as target)?.[property], target)
  }

  /**
   * Proxied cache.
   * Used to avoid creating multiple proxies for the same object.
   */
  readonly #cache = new WeakMap()

  /** Proxify an object while handling special cases to avoid proxy-related issues. */
  #proxify(target: target, { path = [] as PropertyKey[] } = {}) {
    return new Proxy(target, this.#trap(target, path))
  }

  /**
   * Generate trap handlers.
   * Handlers are different depending on whether the target is a function or an object at root path.
   */
  #trap(target: target, path: PropertyKey[] = []) {
    if (typeof target === "function") {
      return { apply: this.#trap_apply.bind(this, path) }
    }
    const traps = {
      get: this.#trap_get.bind(this, path),
      set: this.#trap_set.bind(this, path),
      deleteProperty: this.#trap_delete.bind(this, path),
    }
    if ((this.#parent) && (!path.length)) {
      Object.assign(traps, {
        has: this.#trap_has.bind(this),
        ownKeys: this.#trap_keys.bind(this),
        getOwnPropertyDescriptor: this.#trap_descriptors.bind(this),
      })
    }
    return traps
  }

  /**
   * Trap function calls.
   * Objects from {@link Context.unproxyable} are not proxied to avoid issues with internal slots and allow reflection.
   */
  #trap_apply(path: PropertyKey[], callable: trap<"apply", 0>, _that: trap<"apply", 1>, args: trap<"apply", 2>) {
    const target = this.#access(path.slice(0, -1), this.#target)
    try {
      return Reflect.apply(callable, target, args)
    } finally {
      if (Context.mutable(target, path.at(-1)!.toString())) {
        this.#dispatch("set", { path: path.slice(0, -2), target, property: path.at(-2)!, value: null })
      }
      this.#dispatch("call", { path: path.slice(0, -1), target, property: path.at(-1)!, args })
    }
  }

  /** Trap property access. */
  #trap_get(path: PropertyKey[], target: trap<"get", 0>, property: trap<"get", 1>) {
    // Reflect on parent root property if current context does not own it
    if ((this.#parent) && (!path.length) && (!this.#own.has(property)) && (!Reflect.has(target, property))) {
      return Reflect.get(this.#parent.target, property)
    }

    // Reflect on target property
    const value = Reflect.get(target, property)
    try {
      if (value) {
        const proxify = (typeof value === "object") || (typeof value === "function")
        if (proxify && (Context.#unproxyable(value))) {
          return value
        }
        if (proxify) {
          if (!this.#cache.has(value)) {
            this.#cache.set(value, new Map())
          }
          const keypath = [...path, property].map(String).join(".")
          if (!this.#cache.get(value)?.has(keypath)) {
            this.#cache.get(value).set(keypath, this.#proxify(value, { path: [...path, property] }))
          }
          return this.#cache.get(value).get(keypath)
        }
      }
      return value
    } finally {
      if (Reflect.has(target, property)) {
        this.#dispatch("get", { path, target, property, value })
      }
    }
  }

  /** Trap property assignment. */
  #trap_set(path: PropertyKey[], target: trap<"set", 0>, property: trap<"set", 1>, value: trap<"set", 2>) {
    // Reflect on parent root property if current context does not own it
    if ((this.#parent) && (!path.length) && (!Reflect.has(this.#target, property)) && (Reflect.has(this.#parent.target, property)) && (!this.#own.has(property))) {
      return Reflect.set(this.#parent.target, property, value)
    }

    // Reflect on target property
    const old = Reflect.get(target, property)
    try {
      return Reflect.set(target, property, value)
    } finally {
      this.#dispatch("set", { path, target, property, value: { old, new: value } })
    }
  }

  /** Trap property deletion. */
  #trap_delete(path: PropertyKey[], target: trap<"deleteProperty", 0>, property: trap<"deleteProperty", 1>) {
    if ((this.#parent) && (!path.length) && (!Reflect.has(this.#target, property)) && (Reflect.has(this.#parent.target, property)) && (!this.#own.has(property))) {
      return Reflect.deleteProperty(this.#parent.target, property)
    }

    // Reflect on target property
    const deleted = Reflect.get(target, property)
    try {
      return Reflect.deleteProperty(target, property)
    } finally {
      this.#dispatch("delete", { path, target, property, value: deleted })
    }
  }

  /**
   * Trap property keys.
   * Keys are kept if:
   * - They are not owned by current context (i.e. inherited from parent context)
   * - They are owned by current context and defined in the target
   */
  #trap_keys(target: trap<"ownKeys", 0>) {
    const inherited = Reflect.ownKeys(this.#parent!.target)
    const defined = Reflect.ownKeys(target)
    return Array
      .from(new Set(inherited.concat(defined)))
      .filter((key) => (this.#own.has(key) && defined.includes(key)) || !this.#own.has(key))
  }

  /** Trap property descriptors. */
  #trap_descriptors(target: trap<"getOwnPropertyDescriptor", 0>, property: trap<"getOwnPropertyDescriptor", 1>) {
    return this.#own.has(property) ? Reflect.getOwnPropertyDescriptor(target, property) : Reflect.getOwnPropertyDescriptor(this.#parent!.target, property)
  }

  /** Trap property existence tests. */
  #trap_has(target: trap<"has", 0>, property: trap<"has", 1>) {
    return this.#own.has(property) ? Reflect.has(target, property) : Reflect.has(this.#parent!.target, property)
  }

  /** Dispatch event. */
  #dispatch(type: string, detail: Omit<detail, "type">) {
    Object.assign(detail, { type })
    this.dispatchEvent(new Context.Event(type, { detail }))
    if (((type === "set") && (detail.value !== null)) || (type === "delete") || (type === "call")) {
      this.dispatchEvent(new Context.Event("change", { detail }))
    }
    for (const child of this.#children) {
      const property = detail.path[0] ?? detail.property
      if ((!child.#own.has(property)) && (!Reflect.has(child.#target, property))) {
        child.#dispatch(type, detail)
      }
    }
  }

  /** Check if object should not be proxied. */
  static #unproxyable(object: unknown): boolean {
    return Context.unproxyable.some((type) => (typeof type === "function") && (object instanceof type))
  }

  /**
   * List of classes that should not be proxied.
   *
   * The following built-in are avoided by default for the following reasons:
   * - `Map`, `Set`: Prevent interference with internal data structures and iteration.
   * - `Date`: Prevent interference with methods like `Date.getTime()` and `Date.toISOString()` which are tightly coupled to internal state.
   * - `RegExp`: Prevent interference with internal optimizations and state.
   * - `Promise`: Prevent interference with state management and chaining.
   * - `Error`: Prevent interference with stack traces and error handling mechanisms.
   * - `WeakMap`, `WeakSet` and `WeakRef`: Prevent interference with garbage collection.
   * - `ArrayBuffer`, `TypedArray`, `ReadableStream`, `WritableStream`, `TransformStream`: Prevent interference with stream data flow and handling.
   * - `Worker`, `SharedWorker`, `MessageChannel`, `MessagePort`: Prevent interference with message-passing mechanisms.
   * - `ImageBitmap`, `OffscreenCanvas`, `AudioData`, `VideoFrame`: Prevent interference with media real-time processing and rendering operations.
   * - `Intl.*`: Prevent interference with locale-aware formatting that should not be altered.
   *
   * You can add additional classes to this list to prevent them from being proxied.
   *
   * You can also remove classes from this list if you know what you are doing or if you are sure to never work with them to increase performance.
   */
  static unproxyable = [
    RegExp,
    Promise,
    Error,
    WeakMap,
    WeakSet,
    WeakRef,
    globalThis.ArrayBuffer,
    globalThis.Int8Array,
    globalThis.Uint8Array,
    globalThis.Uint8ClampedArray,
    globalThis.Int16Array,
    globalThis.Uint16Array,
    globalThis.Int32Array,
    globalThis.Uint32Array,
    globalThis.Float16Array,
    globalThis.Float32Array,
    globalThis.Float64Array,
    globalThis.BigInt64Array,
    globalThis.BigUint64Array,
    globalThis.ReadableStream,
    globalThis.WritableStream,
    globalThis.TransformStream,
    (globalThis as unknown as record<callback>).Worker,
    (globalThis as unknown as record<callback>).SharedWorker,
    (globalThis as unknown as record<callback>).MessageChannel,
    (globalThis as unknown as record<callback>).MessagePort,
    (globalThis as unknown as record<callback>).ImageBitmap,
    (globalThis as unknown as record<callback>).OffscreenCanvas,
    (globalThis as unknown as record<callback>).AudioData,
    (globalThis as unknown as record<callback>).VideoFrame,
    globalThis.Intl?.Collator,
    globalThis.Intl?.DisplayNames,
    globalThis.Intl?.DateTimeFormat,
    globalThis.Intl?.ListFormat,
    globalThis.Intl?.Locale,
    globalThis.Intl?.NumberFormat,
    globalThis.Intl?.PluralRules,
    globalThis.Intl?.RelativeTimeFormat,
    globalThis.Intl?.Segmenter,
  ] as Array<callback | undefined>

  /**
   * Test if a property mutates the object.
   *
   * It is used to track inplace changes to objects like `Array`, `Map`, `Set`, `Date`.
   */
  static mutable(object: unknown, property: string): boolean {
    if (typeof object !== "object") {
      return false
    }
    if (Array.isArray(object)) {
      return ["push", "pop", "shift", "unshift", "splice", "sort", "reverse", "fill", "copyWithin"].includes(property)
    }
    if (object instanceof Map) {
      return ["set", "delete", "clear"].includes(property)
    }
    if (object instanceof Set) {
      return ["add", "delete", "clear"].includes(property)
    }
    if (object instanceof Date) {
      return /^set(?:(?:(?:UTC)?(Date|FullYear|Month|Hours|Minutes|Seconds|Milliseconds))|(?:Year|Time|UTCDate))$/.test(property)
    }
    return false
  }

  /** Context event. */
  static readonly Event = class ContextEvent extends _ContextEvent<detail> {} as typeof CustomEvent
}

/** Context target. */
// deno-lint-ignore no-explicit-any
export type target = any

/** Context event detail. */
type detail = { type: string; path: PropertyKey[]; target: target; property: PropertyKey; value?: unknown; args?: unknown[] }

/** Trap arguments. */
// deno-lint-ignore ban-types
type trap<K extends keyof ProxyHandler<object>, I extends number> = K extends "apply" ? Parameters<NonNullable<ProxyHandler<Function>[K]>>[I] : Parameters<NonNullable<ProxyHandler<object>[K]>>[I]
