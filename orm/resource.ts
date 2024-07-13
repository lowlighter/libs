// Imports
import type { key, Store, version } from "./store/store.ts"
import type { Logger } from "@libs/logger"
import { ulid } from "@std/ulid"
import type { Arg, Arrayable, callback, DeepPartial, Nullable, record, rw } from "@libs/typing"
import { is, schema } from "./is/mod.ts"
export type { _model, DeepPartial, Logger, Nullable, ulid }

/** Resource identifier. */
export type id = ReturnType<typeof ulid>

/** Resource shape. */
export type shape = is.ZodRawShape

/** Resource minimal model. */
const _model = {
  id: is.string().describe("Unique identifier. @readonly"),
  created: is.number().int().min(0).nullable().default(null).describe("Creation timestamp. @readonly"),
  updated: is.number().int().min(0).nullable().default(null).describe("Last update timestamp. @readonly"),
} as {
  id: is.ZodString
  created: is.ZodDefault<is.ZodNullable<is.ZodNumber>>
  updated: is.ZodDefault<is.ZodNullable<is.ZodNumber>>
}

/** Resource minimal model. */
const model = is.object(_model) as is.ZodObject<typeof _model>

/** Resource minimal model. */
export type model = is.infer<typeof model>

/** Resource extended model. */
// deno-lint-ignore ban-types
export type model_extended<U extends {}> = is.infer<is.ZodObject<U>> & model

/**
 * Resource.
 */
export class Resource<T extends model> {
  /** Constructor. */
  constructor(data: DeepPartial<T>)
  /** Constructor. */
  constructor(id?: Nullable<id>)
  /** Constructor. */
  constructor(id?: Nullable<id> | DeepPartial<T>) {
    const { promise, resolve, reject } = Promise.withResolvers<this>()
    this.ready = promise
    if ((typeof id === "string") && (Resource.#cache.has(id))) {
      Resource.log?.with({ id }).debug("restored from cache")
      const resource = Resource.#cache.get(id)!.deref() as Resource<T>
      resolve(resource as this)
      return resource
    }
    if (!this.store) {
      throw new ReferenceError(`${this.constructor.name} has no store instance associated. Was constructor extended using Resource.with() method ?`)
    }
    this.#fetch(resolve, reject, id)
  }

  /** Instantiated resource cache. */
  static #cache = new Map<id, WeakRef<Resource<rw>>>()

  /** Garbage collector. */
  static #gc = new FinalizationRegistry(Resource.uncache)

  /** Uncache resource. */
  static uncache(id: id) {
    Resource.log?.with({ id }).debug("garbage collected")
    Resource.#cache.delete(id)
  }

  /** Is ready ? */
  readonly ready: Promise<this>

  /** KV data. */
  #_data = { id: null as unknown as id, created: null, updated: null } as T

  /** KV data (readonly). */
  #_data_readonly = Object.freeze(this.#_data)

  /** KV data (Note: this record should ALWAYS be re-assigned to change its content) to prevent representation desync. */
  get #data() {
    return this.#_data
  }

  /** KV data (Note: this record should ALWAYS be re-assigned to change its content) to prevent representation desync. */
  set #data(data: T) {
    this.#_data = data
    this.#_data_readonly = JSON.parse(JSON.stringify(this.#_data), (_, v) => Object.freeze(v))
  }

  /** KV data. */
  get data(): Readonly<T> {
    return this.#_data_readonly
  }

  /** Unique identifier. */
  get id(): id {
    return this.#_data?.id
  }

  /** KV version. */
  version = null as Nullable<version>

  /** KV keys. The first key returned will be used as "primary index" and shall be used for read operations. */
  get keys(): key[] {
    return [
      [...(this.constructor as typeof Resource).lookup, this.id],
    ]
  }

  /** KV keys lookup for read operations. */
  static get lookup(): key {
    return [this.name]
  }

  /** Logger. */
  protected static readonly log = null as Nullable<Logger>

  /** Logger. */
  #log = null as Nullable<Logger>

  /** Logger. */
  get log(): Nullable<Logger> {
    return this.#log
  }

  /** Store. */
  protected static readonly store = null as unknown as Store

  /** Store. */
  protected get store(): Store {
    return (this.constructor as typeof Resource).store
  }

  /** Model. */
  // deno-lint-ignore no-explicit-any
  protected static readonly model = model as is.ZodObject<any>

  /** Model. */
  // deno-lint-ignore no-explicit-any
  protected get model(): is.ZodObject<any> {
    return (this.constructor as typeof Resource).model
  }

  /** Readonly fields (these are computed looking at `@readonly` presence in model descriptions). */
  protected static readonly readonly = {} as record<true>

  /** Readonly fields (these are computed looking at `@readonly` presence in model descriptions). */
  protected get readonly(): record<true> {
    return (this.constructor as typeof Resource).readonly
  }

  /** Listeners. */
  protected static readonly listeners = {} as record<Array<callback>>

  /** Listeners. */
  get #listeners() {
    return (this.constructor as typeof Resource).listeners
  }

  /** Dispatch event. */
  async #dispatch(event: "created" | "fetch" | "fetched" | "load" | "loaded" | "patch" | "patched" | "save" | "saved" | "delete" | "deleted") {
    this.log?.with({ event }).trace("dispatching")
    if (this.#listeners[event]) {
      for (const listener of this.#listeners[event]) {
        await listener()
      }
    }
  }

  /** Fetch back resource from {@link Store}. */
  async #fetch(resolve: callback, reject: callback, id?: Nullable<id> | DeepPartial<T>) {
    try {
      if (typeof id === "string") {
        this.#data = { ...this.#data, id } as T
        this.#log = (this.constructor as typeof Resource).log?.with({ type: this.constructor.name, id: this.id }) ?? null
        this.log?.with({ op: "fetch" }).trace("fetching")
        await this.#dispatch("fetch")
        const { value, version } = await this.store.get<T>(this.keys[0])
        if (!version) {
          throw new Error(`Resource not found: [${this.keys[0].join(", ")}]`)
        }
        this.version = version
        this.#data = value!
        await this.#dispatch("fetched")
        this.log?.with({ op: "fetch" }).debug("fetched")
      } else {
        const picked = Object.fromEntries(Object.keys(id ?? {}).map((key) => [key, true]))
        this.#data = { ...this.#data, ...await this.model.strict().omit({ id: true, created: true, updated: true }).pick(picked as rw).parseAsync(id ?? {}), id: ulid() } as T
        this.#log = (this.constructor as typeof Resource).log?.with({ type: this.constructor.name, id: this.id }) ?? null
        for (const key of this.keys) {
          if (await (this.constructor as typeof Resource).has(key)) {
            throw new TypeError(`Resource already exists: [${key.join(", ")}]`)
          }
        }
        await this.#dispatch("created")
        this.log?.with({ op: "created" }).debug("created")
      }
      Resource.#cache.set(this.id, new WeakRef(this))
      Resource.#gc.register(this, this.id)
      this.#data = await this.model.strict().parseAsync(this.#data) as T
      resolve(this)
    } catch (error) {
      reject(error)
    }
  }

  /** Validate patch and update resource data without comitting changes. */
  async patch(patch: Omit<DeepPartial<T>, "id" | "created" | "updated">, { readonly = true } = {}): Promise<this> {
    await this.ready
    this.log?.with({ op: "patch" }).trace("patching")
    await this.#dispatch("patch")
    const picked = Object.fromEntries(Object.keys(patch).map((key) => [key, true]))
    patch = await this.model.strict().omit({ id: true, created: true, updated: true, ...(readonly ? this.readonly : {}) }).pick(picked as rw).parseAsync(patch) as DeepPartial<T>
    this.#data = { ...this.#data, ...patch, updated: Date.now() }
    await this.model.strict().parseAsync(this.#data)
    await this.#dispatch("patched")
    this.log?.with({ op: "patch" }).debug("patched")
    return this
  }

  /** Load resource from {@link Store}. */
  async load(): Promise<Nullable<this>> {
    await this.ready
    this.log?.with({ op: "load" }).trace("loading")
    await this.#dispatch("load")
    const { value, version } = await this.store.get<T>(this.keys[0])
    this.version = version
    if (!this.version) {
      this.log?.with({ op: "load" }).wdebug("no result")
      return null
    }
    this.#data = value!
    await this.#dispatch("loaded")
    this.log?.with({ op: "load" }).debug("loaded")
    return this
  }

  /** Save resource in {@link Store}. */
  async save(): Promise<this> {
    await this.ready
    this.log?.with({ op: "save" }).trace("saving")
    this.#data = { ...this.#data, updated: Date.now() }
    if (!this.#data.created) {
      this.#data = { ...this.#data, created: this.#data.updated }
    }
    await this.#dispatch("save")
    await this.model.strict().parseAsync(this.#data)
    const { version, value } = await this.store.set(this.keys, this.#data, this.version)
    this.version = version
    this.#data = value
    await this.#dispatch("saved")
    this.log?.with({ op: "save" }).debug("saved")
    return this
  }

  /** Delete resource from {@link Store}. */
  async delete(): Promise<Nullable<this>> {
    await this.ready
    this.log?.with({ op: "delete" }).trace("deleting")
    await this.#dispatch("delete")
    if ((!this.version) || (!await this.store.has(this.keys[0]))) {
      this.log?.with({ op: "delete" }).wdebug("no result")
      return null
    }
    await this.store.delete(this.keys, this.version)
    this.version = null
    this.#data = { ...this.#data, created: null, updated: null }
    await this.#dispatch("deleted")
    this.log?.with({ op: "delete" }).debug("deleted")
    return this
  }

  /** Test if a resource with given id is present in store. */
  static async has<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key: id | key): Promise<boolean> {
    if (!Array.isArray(key)) {
      key = [...this.lookup, key] as key
    }
    if (key.includes(null as rw)) {
      return false
    }
    return await this.store.has(key)
  }

  /** Get resource data from {@link Store}. */
  static async get<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key: id | key, options: { raw: false }): Promise<Nullable<T>>
  /** Get resource from {@link Store}. */
  static async get<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key: id | key, options?: { raw?: true }): Promise<Nullable<InstanceType<T>>>
  /** Get resource from {@link Store}. */
  static async get<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key: id | key, options?: { raw?: boolean }) {
    if (!Array.isArray(key)) {
      key = [...this.lookup, key] as key
    }
    if (key.includes(null as rw)) {
      this.log?.with({ op: "get", key }).wdebug("no result as key is partially null")
      return null
    }
    const { value } = await this.store.get<InstanceType<T>>(key)
    if (!value) {
      this.log?.with({ op: "get", key }).wdebug("no result")
      return null
    }
    if (options?.raw) {
      return value
    }
    return Resource.#cache.get(value.id)?.deref() as rw ?? new this(value.id).ready
  }

  /** Delete resource from {@link Store}. */
  static async delete<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key: id | key): Promise<Nullable<InstanceType<T>>> {
    const resource = await this.get(key)
    if (!resource) {
      this.log?.with({ op: "delete", key }).wdebug("no result")
      return null
    }
    return await resource.delete()
  }

  /** List resources data from {@link Store}. */
  static async list<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key?: key | [key, key], options?: Omit<Arg<Store["list"], 1>, "array"> & { array: true; raw: true }): Promise<Array<T>>
  /** List resources data from {@link Store}. */
  static async list<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key?: key | [key, key], options?: Omit<Arg<Store["list"], 1>, "array"> & { array?: false; raw: true }): Promise<AsyncGenerator<T>>
  /** List resources from {@link Store}. */
  static async list<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key?: key | [key, key], options?: Omit<Arg<Store["list"], 1>, "array"> & { array: true; raw?: false }): Promise<Array<InstanceType<T>>>
  /** List resources from {@link Store}. */
  static async list<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key?: key | [key, key], options?: Omit<Arg<Store["list"], 1>, "array"> & { array?: false; raw?: false }): Promise<AsyncGenerator<InstanceType<T>>>
  /** List resources from {@link Store}. */
  static async list<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key?: key | [key, key], options?: Omit<Arg<Store["list"], 1>, "array"> & { array?: boolean; raw?: boolean }) {
    if (!key) {
      key = []
    }
    if ((Array.isArray(key[0])) && (Array.isArray(key[1]))) {
      if (key[0][0] !== this.name) {
        key[0] = [this.name, ...key[0]] as key
      }
      if (key[1][0] !== this.name) {
        key[1] = [this.name, ...key[1]] as key
      }
    } else {
      if (key[0] !== this.name) {
        key = [this.name, ...key] as key
      }
    }
    // deno-lint-ignore no-this-alias
    const self = this
    const list = await this.store.list(key, { ...options, array: false })
    const iterator = (async function* () {
      for await (const { key } of list) {
        yield await self.get(key, options as Arg<typeof self["get"], 1>)
      }
    })()
    return options?.array ? Array.fromAsync(iterator) : iterator
  }

  /** Initialize {@link Resource}. */
  protected static async init() {}

  /** JSON schema. */
  static get schema(): ReturnType<typeof schema> {
    return schema(this.model)
  }

  /** Instantiate a new {@link Resource} constructor with specified {@link Store}, {@link Logger}, listeners and initialization function. */
  static with<U extends shape, V extends record, W extends record, T extends typeof Resource<model_extended<U>>, Z extends typeof Resource<rw>, X = T & Z & { ready: Promise<T & Z & { bound: V & W }>; bound: V & W }>(
    this: Z,
    { store = this.store, name = this.name, log = this.log, listeners = {}, init = () => Promise.resolve(), model: _model = is.object({} as U), bind }: {
      store?: Store
      name?: string
      log?: Nullable<Logger>
      listeners?: record<Arrayable<callback>>
      init?: (_: T) => Promise<unknown>
      model?: is.ZodObject<U>
      bind?: V
    },
  ): X {
    const { promise, resolve, reject } = Promise.withResolvers()
    const that = this as rw
    // @ts-expect-error: `extended` has same signature as `this`
    const extended = class extends this {
      static log = log
      static store = store
      static ready = promise
      static listeners = Object.fromEntries(Object.entries(listeners).map(([key, value]) => [key, [...(this.listeners[key] ?? []), value].flat()])) as typeof Resource["listeners"]
      static model = that.model.merge(_model)
      static bound = { ...that.bound, ...bind }
      static readonly = Object.fromEntries(Object.entries(that.model.merge(_model).shape).filter(([_, value]) => (value as { description?: string }).description?.includes("@readonly")).map(([key]) => [key, true]))
      protected static async init() {
        await super.init()
        await init(this as unknown as T)
      }
    } as unknown as X
    Object.defineProperty(extended, "name", { value: name })
    ;(extended as rw).init().then(() => resolve(extended)).catch(reject)
    return extended
  }
}
