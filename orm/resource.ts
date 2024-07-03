// Imports
import type { key, Store } from "./store/store.ts"
import type { Logger } from "jsr:@libs/logger"
import { ulid } from "jsr:@std/ulid"
import type { Arg, Arrayable, callback, DeepPartial, Nullable, record, rw } from "jsr:@libs/typing"
import { is } from "./is/mod.ts"

/** Resource identifier. */
type id = ReturnType<typeof ulid>

/** Resource shape. */
type shape = is.ZodRawShape

/** Resource minimal model. */
const model = is.object({
  id: is.string().describe("Unique identifier."),
  created: is.number().min(0).nullable().default(null).describe("Creation timestamp."),
  updated: is.number().min(0).nullable().default(null).describe("Last update timestamp."),
  version: is.string().nullable().default(null).describe("KV versionstamp."),
})

/** Resource minimal model. */
type model = is.infer<typeof model>

/** Resource extended model. */
// deno-lint-ignore ban-types
type model_extended<U extends {}> = is.infer<is.ZodObject<U>> & model

/**
 * Resource.
 */
export class Resource<T extends model> {
  /** Constructor */
  constructor(data: DeepPartial<T>)
  constructor(id?: Nullable<id>)
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
  get data(): Readonly<T> {
    return this.#data
  }

  /** KV data. */
  readonly #data = { id: null as unknown as id, created: null, updated: null, version: null } as T

  /** Unique identifier. */
  get id(): id {
    return this.#data.id
  }

  /** KV version. */
  get version(): Nullable<string> {
    return this.#data.version
  }

  /** KV keys. */
  get keys(): key[] {
    return [
      [this.constructor.name, this.id],
    ]
  }

  /** Logger. */
  protected static readonly log = null as Nullable<Logger>

  /** Logger. */
  protected get log(): Nullable<Logger> {
    return (this.constructor as typeof Resource).log
  }

  /** Store. */
  protected static readonly store = null as unknown as Store

  /** Store. */
  protected get store(): Store {
    return (this.constructor as typeof Resource).store
  }

  /** Model. */
  protected static readonly model = model

  /** Model. */
  protected get model() {
    return (this.constructor as typeof Resource).model
  }

  /** Listeners. */
  protected static readonly listeners = {} as record<Array<callback>>

  /** Listeners. */
  get #listeners() {
    return (this.constructor as typeof Resource).listeners
  }

  /** Dispatch event. */
  async #dispatch(event: "fetch" | "fetched" | "load" | "loaded" | "save" | "saved" | "delete" | "deleted") {
    this.log?.with({ event }).debug("dispatching")
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
        Object.assign(this.#data, { id })
        this.log?.with({ op: "fetch" }).debug("fetching")
        await this.#dispatch("fetch")
        const { value, version } = await this.store.get<T>(this.keys[0])
        Object.assign(this.#data, { ...value, version })
        if (!version) {
          throw new Error(`Resource not found: [${this.keys[0].join(", ")}]`)
        }
        await this.#dispatch("fetched")
        this.log?.with({ op: "fetch" }).debug("fetched")
      } else {
        Object.assign(this.#data, { ...id, id: ulid() })
      }
      Resource.#cache.set(this.id, new WeakRef(this))
      Resource.#gc.register(this, this.id)
      Object.assign(this.#data, await this.model.strict().parseAsync(this.#data))
      resolve(this)
    } catch (error) {
      reject(error)
    }
  }

  /** Load resource from {@link Store}. */
  async load(): Promise<Nullable<this>> {
    await this.ready
    this.log?.with({ op: "load" }).debug("loading")
    await this.#dispatch("load")
    const { value, version } = await this.store.get<T>(this.keys[0])
    Object.assign(this.#data, { ...value, version })
    if (!this.version) {
      this.log?.with({ op: "load" }).warn("no result")
      return null
    }
    await this.#dispatch("loaded")
    this.log?.with({ op: "load" }).debug("loaded")
    return this
  }

  /** Save resource in {@link Store}. */
  async save(): Promise<this> {
    await this.ready
    this.log?.with({ op: "save" }).debug("saving")
    this.#data.updated = Date.now()
    this.#data.created ??= this.#data.updated
    await this.#dispatch("save")
    await this.model.strict().parseAsync(this.#data)
    const { version, value } = await this.store.set(this.keys, this.#data, this.version)
    Object.assign(this.#data, { ...value, version })
    await this.#dispatch("saved")
    this.log?.with({ op: "save" }).debug("saved")
    return this
  }

  /** Delete resource from {@link Store}. */
  async delete(): Promise<Nullable<this>> {
    await this.ready
    this.log?.with({ op: "delete" }).debug("deleting")
    await this.#dispatch("delete")
    if ((!this.version) || (!await this.store.has(this.keys[0]))) {
      this.log?.with({ op: "delete" }).warn("no result")
      return null
    }
    await this.store.delete(this.keys, this.version)
    Object.assign(this.#data, { version: null, created: null, updated: null })
    await this.#dispatch("deleted")
    this.log?.with({ op: "delete" }).info("deleted")
    return this
  }

  /** Test if a resource with given id is present in store. */
  static async has<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key: id | key): Promise<boolean> {
    if (!Array.isArray(key)) {
      key = [this.name, key] as key
    }
    return await this.store.has(key)
  }

  /** Get resource from {@link Store}. */
  static async get<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key: id | key): Promise<Nullable<InstanceType<T>>> {
    if (!Array.isArray(key)) {
      key = [this.name, key] as key
    }
    const { value } = await this.store.get<InstanceType<T>>(key)
    if (!value) {
      this.log?.with({ op: "get", key }).warn("no result")
      return null
    }
    return Resource.#cache.get(value.id)?.deref() as rw ?? new this(value.id).ready
  }

  /** Delete resource from {@link Store}. */
  static async delete<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key: id | key): Promise<Nullable<InstanceType<T>>> {
    const resource = await this.get(key)
    if (!resource) {
      this.log?.with({ op: "delete", key }).warn("no result")
      return null
    }
    return await resource.delete()
  }

  /** List resources from {@link Store}. */
  static async list<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key?: key | [key, key], options?: Omit<Arg<Store["list"], 1>, "array"> & { array: true }): Promise<Array<InstanceType<T>>>
  static async list<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key?: key | [key, key], options?: Omit<Arg<Store["list"], 1>, "array"> & { array?: false }): Promise<AsyncGenerator<InstanceType<T>>>
  static async list<U extends shape, T extends typeof Resource<model_extended<U>>>(this: T, key?: key | [key, key], options?: Omit<Arg<Store["list"], 1>, "array"> & { array?: boolean }) {
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
        yield await self.get(key)
      }
    })()
    return options?.array ? Array.fromAsync(iterator) : iterator
  }

  /** Initialize {@link Resource}. */
  protected static async init() {}

  /** Instantiate a new {@link Resource} constructor with specified {@link Store}, {@link Logger}, listeners and initialization function. */
  static with<U extends shape, T extends typeof Resource<model_extended<U>>>(
    { store = this.store, name = this.name, log = this.log, listeners = {}, init = () => Promise.resolve(), model: _model = is.object({} as U) }: {
      store?: Store
      name?: string
      log?: Nullable<Logger>
      listeners?: record<Arrayable<callback>>
      init?: (_: T) => Promise<unknown>
      model?: is.ZodObject<U>
    },
  ): T & { ready: Promise<T> } {
    const { promise, resolve, reject } = Promise.withResolvers()
    // deno-lint-ignore no-this-alias
    const that = this
    // @ts-expect-error: `extended` has same signature as `this`
    const extended = class extends this {
      static log = log
      static store = store
      static ready = promise
      static listeners = Object.fromEntries(Object.entries(listeners).map(([key, value]) => [key, [...(this.listeners[key] ?? []), value].flat()])) as typeof Resource["listeners"]
      static model = that.model.merge(_model)
      protected static async init() {
        await super.init()
        await init(this as unknown as T)
      }
    } as unknown as T & { ready: Promise<T> }
    Object.defineProperty(extended, "name", { value: name })
    extended.init().then(() => resolve(extended)).catch(reject)
    return extended
  }
}
