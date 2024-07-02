// Imports
import type { key, Store } from "./store/store.ts"
import type { Logger } from "jsr:@libs/logger"
import { ulid } from "jsr:@std/ulid"
import type { Arg, Arrayable, callback, Nullable, record, rw } from "jsr:@libs/typing"
import { is} from "./is/mod.ts"

/** Resource identifier. */
type id = ReturnType<typeof ulid>

/** Resource data. */
type data = record & {
  /** Unique identifier. */
  id: id
  /** Creation timestamp. */
  created: Nullable<number>
  /** Last update timestamp. */
  updated: Nullable<number>
  /** KV version. */
  version: Nullable<string>
}

/**
 * Resource.
 */
export class Resource<T extends data> {
  /** Constructor */
  constructor(id?: Nullable<id>, data?: Omit<T, "id" | "created" | "updated" | "version"> & Partial<Pick<data, "id" | "created" | "updated" | "version">>) {
    const { promise, resolve, reject } = Promise.withResolvers<this>()
    this.ready = promise
    if (id && (Resource.#cache.has(id))) {
      Resource.log?.with({ id }).debug("restored from cache")
      const resource = Resource.#cache.get(id)!.deref() as Resource<T>
      resolve(resource as this)
      return resource
    }
    if (!this.store) {
      throw new ReferenceError(`${this.constructor.name} has no store instance associated. Was constructor extended using Resource.with() method ?`)
    }
    this.#data = (data ?? {}) as T
    this.#data.id ??= (id ?? null) as id
    this.#data.created ??= null
    this.#data.updated ??= null
    this.#data.version ??= null
    this.#fetch(resolve, reject)
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
  readonly ready

  /** KV data. */
  get data() {
    return this.#data as Readonly<data>
  }

  /** KV data. */
  readonly #data = {} as T

  /** Unique identifier. */
  get id() {
    return this.#data.id
  }

  /** KV version. */
  get version() {
    return this.#data.version
  }

  /** KV keys. */
  get keys() {
    return [
      [this.constructor.name, this.id],
    ] as key[]
  }

  /** Logger. */
  protected static readonly log = null as Nullable<Logger>

  /** Logger. */
  protected get log() {
    return (this.constructor as typeof Resource).log
  }

  /** Store. */
  protected static readonly store = null as unknown as Store

  /** Store. */
  protected get store() {
    return (this.constructor as typeof Resource).store
  }

  /** Model. */
  protected static readonly model = null as Nullable<is.ZodObject<is.ZodRawShape>>

  /** Model. */
  get model() {
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
  async #fetch(resolve: callback, reject: callback) {
    try {
      if (this.id) {
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
        this.#data.id = ulid()
      }
      Resource.#cache.set(this.id, new WeakRef(this))
      Resource.#gc.register(this, this.id)
      resolve(this)
    } catch (error) {
      reject(error)
    }
  }

  /** Load resource from {@link Store}. */
  async load() {
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
  async save() {
    await this.ready
    this.log?.with({ op: "save" }).debug("saving")
    this.#data.updated = Date.now()
    this.#data.created ??= this.#data.updated
    await this.#dispatch("save")
    const { version, value } = await this.store.set(this.keys, this.#data, this.version)
    Object.assign(this.#data, { ...value, version })
    await this.#dispatch("saved")
    this.log?.with({ op: "save" }).debug("saved")
    return this
  }

  /** Delete resource from {@link Store}. */
  async delete() {
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
  static async has<T extends typeof Resource>(this: T, key: id | key) {
    if (!Array.isArray(key)) {
      key = [this.name, key] as key
    }
    return await this.store.has(key)
  }

  /** Get resource from {@link Store}. */
  static async get<T extends typeof Resource>(this: T, key: id | key): Promise<Nullable<InstanceType<T>>> {
    if (!Array.isArray(key)) {
      key = [this.name, key] as key
    }
    const { value } = await this.store.get<data>(key)
    if (!value) {
      this.log?.with({ op: "get", key }).warn("no result")
      return null
    }
    return Resource.#cache.get(value.id)?.deref() as rw ?? new this(value.id).ready
  }

  /** Delete resource from {@link Store}. */
  static async delete<T extends typeof Resource>(this: T, key: id | key) {
    const resource = await this.get(key)
    if (!resource) {
      this.log?.with({ op: "delete", key }).warn("no result")
      return null
    }
    return await resource.delete()
  }

  /** List resources from {@link Store}. */
  static async list<T extends typeof Resource>(this: T, key?: key | [key, key], options?: Omit<Arg<Store["list"], 1>, "array"> & { array: true }): Promise<Array<InstanceType<T>>>
  static async list<T extends typeof Resource>(this: T, key?: key | [key, key], options?: Omit<Arg<Store["list"], 1>, "array"> & { array?: false }): Promise<AsyncGenerator<InstanceType<T>>>
  static async list<T extends typeof Resource>(this: T, key?: key | [key, key], options?: Omit<Arg<Store["list"], 1>, "array"> & { array?: boolean }) {
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

  /** Instantiate a new {@link Resource} constructor with specified {@link Store}, {@link Logger}, listeners and initialization function. */
  static with<T extends typeof Resource, U extends is.ZodRawShape>(this: T, { store, name = this.name, log = null, listeners = {}, init = () => Promise.resolve(), model = null }: { store: Store; name?: string; log?: Nullable<Logger>; listeners?: record<Arrayable<callback>>; init?: (_: T) => Promise<unknown>, model?:Nullable<is.ZodObject<U>> }) {
    const { promise, resolve, reject } = Promise.withResolvers()
    // @ts-expect-error: `extended` has same signature as `this`
    const extended = class extends this {
      static log = log
      static store = store
      static ready = promise
      static listeners = Object.fromEntries(Object.entries(listeners).map(([key, value]) => [key, [value].flat()]))
      static model = model
    }
    Object.defineProperty(extended, "name", { value: name })
    init(extended).then(() => resolve(extended)).catch(reject)
    return extended as T & { ready: Promise<T> }
  }
}
