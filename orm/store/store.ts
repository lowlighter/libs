// Imports
import type { Nullable, Promisable, record } from "@libs/typing"
import { Logger } from "@libs/logger"

/**
 * Key-Value store.
 *
 * Intended to be subclassed for specific implementations.
 */
export abstract class Store {
  /** Constructor. */
  constructor({ log = new Logger(), ...options }: { log?: Logger } = {}) {
    const { promise, resolve, reject } = Promise.withResolvers<this>()
    this.ready = promise
    this.options = options as record
    this.#log = log
    this.#init(resolve, reject)
  }

  /** Is ready ? */
  readonly ready: Promise<this>

  /** Options. */
  protected readonly options: record

  /** {@link Logger}. */
  readonly #log

  /** Async constructor. */
  async #init(resolve: (value: this) => void, reject: (error: Error) => void) {
    try {
      await this._open()
      this.#log.debug("opened")
      resolve(this)
    } catch (error) {
      reject(error)
    }
  }

  /** Open {@link Store}. This method is intended to be implemented by child classes. */
  protected abstract _open(): Promisable<void>

  /** Asynchronous disposal (calls {@link Store#_close}). */
  async [Symbol.asyncDispose]() {
    await this.ready
    await this._close()
    this.#log.debug("closed")
  }

  /** Close {@link Store} instance. This method is intended to be implemented by child classes. */
  protected abstract _close(): Promisable<void>

  /** Check if entry is present in {@link Store}. */
  async has(key: key): Promise<boolean> {
    await this.ready
    return (await this.get(key)).version !== null
  }

  /** Get entry from {@link Store}. */
  async get<T extends record>(key: key): Promise<{ value: Nullable<T>; version: Nullable<version> }> {
    await this.ready
    const { value, version } = await this._get<T>(key)
    if (version === null) {
      this.#log.with({ op: "get", key: f(key) }).debug("no result")
      return { value: null, version: null }
    }
    this.#log.with({ op: "get", key: f(key), version }).debug()
    return { value, version }
  }

  /** Get entry from {@link Store}. This method is intended to be implemented by child classes. */
  protected abstract _get<T extends record>(key: key): Promisable<{ value: Nullable<T>; version: Nullable<version> }>

  /** Set entry in {@link Store}. */
  async set<T extends record>(key: key, value: T, version?: Nullable<version>): Promise<{ value: T; version: version }> {
    await this.ready
    const atomic = version !== undefined
    const { ok, version: _version } = await this._set(key, value, version ?? null, atomic)
    if (!ok) {
      this.#log.with({ op: "set", key: f(key), version, atomic }).error(`${atomic ? "transaction " : ""}failed`)
      throw new TypeError(`Failed to write: ${f(key)}@${version}`)
    }
    version = _version
    this.#log.with({ op: "set", key: f(key), version, atomic }).debug()
    return { value, version }
  }

  /** Set entry in {@link Store}. This method is intended to be implemented by child classes. */
  protected abstract _set<T extends record>(key: key, value: T, versionstamp: Nullable<version>, atomic: boolean): Promisable<{ ok: boolean; version: version }>

  /** Delete entry from {@link Store}. */
  async delete(key: key, version?: version): Promise<boolean> {
    await this.ready
    const atomic = version !== undefined
    if (!await this.has(key)) {
      this.#log.with({ op: "delete", key: f(key), version, atomic }).debug("no result")
      return false
    }
    const { ok } = await this._delete(key, version ?? null, atomic)
    if (!ok) {
      this.#log.with({ op: "set", key: f(key), version, atomic }).error(`${atomic ? "transaction " : ""}failed`)
      throw new TypeError(`Failed to delete: ${f(key)}@${version}`)
    }
    this.#log.with({ op: "delete", key: f(key), version, atomic }).debug()
    return ok
  }

  /** Delete entry from {@link Store}. This method is intended to be implemented by child classes. */
  protected abstract _delete(key: key, versionstamp: Nullable<version>, atomic: boolean): Promisable<{ ok: boolean }>

  /** List entries from {@link Store}. */
  async list<T extends record>(key: key | [key, key], options?: { limit?: number; reverse?: boolean; array?: true }): Promise<Array<{ key: key; value: T; version: version }>>
  async list<T extends record>(key: key | [key, key], options?: { limit?: number; reverse?: boolean; array?: false }): Promise<AsyncGenerator<{ key: key; value: T; version: version }>>
  async list<T extends record>(key: key | [key, key], { limit, reverse, array = true }: { limit?: number; reverse?: boolean; array?: boolean } = {}): Promise<Array<{ key: key; value: T; version: version }> | AsyncGenerator<{ key: key; value: T; version: version }>> {
    await this.ready
    const list = this._list<T>(key, { limit, reverse }, array)
    this.#log.with({ op: "list", key: f(key), limit, reverse, array }).debug()
    return list
  }

  /** List entries from {@link Store}. This method is intended to be implemented by child classes. */
  protected abstract _list<T extends record>(key: key | [key, key], { limit, reverse }: { limit?: number; reverse?: boolean }, array: boolean): Promisable<Array<{ key: key; value: T; version: version }> | AsyncGenerator<{ key: key; value: T; version: version }>>
}

/** {@link Store} entry's key. */
export type key = Array<string | number | boolean | bigint>

/** {@link Store} entry's version. */
export type version = string

/** Format a {@link Store} key into a string. */
function f(key: key | [key, key]): string {
  if ((Array.isArray(key[0])) && (Array.isArray(key[1]))) {
    return `[${f(key[0])}...${f(key[1])}]`
  }
  return `[${key.join(", ")}]`
}
