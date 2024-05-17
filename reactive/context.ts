// Imports
import type { Nullable, record } from "@libs/typing"
import type { DeepMerge } from "@std/collections/deep-merge"

/**
 * Reactive context.
 *
 * Create an object where every get, set, delete and call operations are observable.
 * These events can be reacted using the `EventTarget` interface.
 * Observability is applied recursively to all properties of the object.
 *
 * Since it also tracks functions calls, it is possible to also tracks keyed collections updates such as `Map`, `Set` and `Array`.
 *
 * @example
 * ```ts
 * import { Context } from "./context.ts"
 *
 * const context = new Context({ foo: "bar", bar: () => null })
 *
 * // Attach listeners
 * context.addEventListener("get", ({detail:{property}}:any) => console.log(`get: ${property}`))
 * context.addEventListener("set", ({detail:{property, value}}:any) => console.log(`set: ${property}: ${value.old} => ${value.new}`))
 * context.addEventListener("delete", ({detail:{property}}:any) => console.log(`delete: ${property}`))
 * context.addEventListener("call", ({detail:{property, args}}:any) => console.log(`call: ${property}(${args.join(", ")})`))
 * context.addEventListener("change", ({detail:{type}}:any) => console.log(`change: ${type}`))
 *
 * // Operate on context
 * context.target.foo = "baz"
 * context.target.bar()
 * ```
 *
 * It is possible to create child contexts from a context.
 *
 * Child contexts inherit the parent context properties if they're left undefined.
 * In this case, changes will be effective bidirectionally (both the parent and child will have the same reference, meaning that
 * operations performed on parent value are applied on child value and vice-versa).
 *
 * If a property is defined in the child context, changes will only be effective in the child context.
 *
 * @example
 * ```ts
 * import { Context } from "./context.ts"
 *
 * const a = new Context({ foo: "bar" })
 * const b = a.with({ bar: "baz" })
 *
 * console.assert("foo" in a.target)
 * console.assert(!("bar" in a.target))
 * console.assert("foo" in b.target)
 * console.assert("bar" in b.target)
 * ```
 *
 * @author Simon Lecoq (lowlighter)
 * @license MIT
 */
export class Context<T extends record> extends EventTarget {
  /** Constructor. */
  constructor(target = {} as T, { parent = null as Nullable<Context<record>> } = {}) {
    super()
    this.#parent = parent
    this.#target = target
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
   * Actual target value.
   * This value is not proxified.
   */
  readonly #target

  /**
   * Observable target value.
   * This value is proxified.
   */
  readonly target: T

  /** Instantiate a new inherited {@link Context} with superseded value. */
  with<U extends record>(target: U): Context<DeepMerge<T, U>> {
    const context = new Context(target, { parent: this })
    this.#children.add(context)
    return context as Context<DeepMerge<T, U>>
  }

  /** Access target value from a property path. */
  #access(path = [] as PropertyKey[]) {
    return path.reduce((value, property) => (value as target)?.[property], this.#target)
  }

  /**
   * Proxified cache.
   * Used to avoid creating multiple proxies for the same object.
   */
  readonly #cache = new WeakMap()

  /** Proxify an object. */
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

  /** Trap function calls. */
  #trap_apply(path: PropertyKey[], callable: trap<"apply", 0>, that: trap<"apply", 1>, args: trap<"apply", 2>) {
    const target = this.#access(path.slice(0, -1))
    try {
      // Objects with internal slots such as Map and Set must use the unproxified target for reflection to work
      if ((that instanceof Map) || (that instanceof Set)) {
        return Reflect.apply(callable, target, args)
      }
      return Reflect.apply(callable, that, args)
    } finally {
      this.#dispatch("call", { path, target, property: path.at(-1)!, args })
    }
  }

  /** Trap property access. */
  #trap_get(path: PropertyKey[], target: trap<"get", 0>, property: trap<"get", 1>) {
    let value = Reflect.get(target, property)
    if ((this.#parent) && (!path.length)) {
      value ??= Reflect.get(this.#parent.#target, property)
    }
    try {
      if (value) {
        let proxify = false
        if (typeof value === "function") {
          // Skip and constructors
          if ((property === "constructor") && (value !== Object.prototype.constructor)) {
            return value
          }
          proxify = true
        } else if (typeof value === "object") {
          // Skip some built-in objects
          if ((value instanceof WeakMap) || (value instanceof WeakSet) || (value instanceof WeakRef) || (value instanceof Promise) || (value instanceof Error) || (value instanceof RegExp)) {
            return value
          }
          proxify = true
        }
        if (proxify) {
          if (!this.#cache.has(value)) {
            this.#cache.set(value, this.#proxify(value, { path: [...path, property] }))
          }
          return this.#cache.get(value)
        }
      }
      return value
    } finally {
      this.#dispatch("get", { path, target, property, value })
    }
  }

  /** Trap property assignment. */
  #trap_set(path: PropertyKey[], target: trap<"set", 0>, property: trap<"set", 1>, value: trap<"set", 2>) {
    if ((this.#parent) && (!path.length) && (!Reflect.has(this.#target, property)) && (Reflect.has(this.#parent.#target, property))) {
      return Reflect.set(this.#parent.target, property, value)
    }
    const old = Reflect.get(target, property)
    try {
      return Reflect.set(target, property, value)
    } finally {
      this.#dispatch("set", { path, target, property, value: { old, new: value } })
    }
  }

  /** Trap property deletion. */
  #trap_delete(path: PropertyKey[], target: trap<"deleteProperty", 0>, property: trap<"deleteProperty", 1>) {
    const deleted = Reflect.get(target, property)
    try {
      return Reflect.deleteProperty(target, property)
    } finally {
      this.#dispatch("delete", { path, target, property, value: deleted })
    }
  }

  /** Trap property keys. */
  #trap_keys(target: trap<"ownKeys", 0>) {
    return [...new Set(Reflect.ownKeys(this.#parent!.#target).concat(Reflect.ownKeys(target)))]
  }

  /** Trap property descriptors. */
  #trap_descriptors(target: trap<"getOwnPropertyDescriptor", 0>, property: trap<"getOwnPropertyDescriptor", 1>) {
    return Reflect.getOwnPropertyDescriptor(target, property) ?? Reflect.getOwnPropertyDescriptor(this.#parent!.#target, property)
  }

  /** Trap property existence tests. */
  #trap_has(target: trap<"has", 0>, property: trap<"has", 1>) {
    return Reflect.has(target, property) || Reflect.has(this.#parent!.#target, property)
  }

  /** Dispatch event. */
  #dispatch(type: string, detail: Omit<detail, "type">) {
    Object.assign(detail, { type })
    this.dispatchEvent(new Context.Event(type, { detail }))
    if ((type === "set") || (type === "delete") || (type === "call")) {
      this.dispatchEvent(new Context.Event("change", { detail }))
    }
    for (const child of this.#children) {
      if (!Reflect.has(child.#target, detail.path[0] ?? detail.property)) {
        child.#dispatch(type, detail)
      }
    }
  }

  /** Context event. */
  static readonly Event = class ContextEvent extends CustomEvent<detail> {} as typeof CustomEvent
}

/** Context target. */
// deno-lint-ignore no-explicit-any
export type target = any

/** Context event detail. */
type detail = { type: string; path: PropertyKey[]; target: target; property: PropertyKey; value?: unknown; args?: unknown[] }

/** Trap arguments. */
// deno-lint-ignore ban-types
type trap<K extends keyof ProxyHandler<object>, I extends number> = K extends "apply" ? Parameters<NonNullable<ProxyHandler<Function>[K]>>[I] : Parameters<NonNullable<ProxyHandler<object>[K]>>[I]
