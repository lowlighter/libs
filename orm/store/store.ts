// Imports
import { Logger } from "@libs/logger"
import type { Nullable, Promisable } from "@libs/typing"
export type { Promisable }

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
    this.options = options as Record<PropertyKey, unknown>
    this.#log = log
    this.#init(resolve, reject)
  }

  /** Is ready ? */
  readonly ready: Promise<this>

  /** Options. */
  protected readonly options: Record<PropertyKey, unknown>

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
  async get<T extends object>(key: key): Promise<{ value: Nullable<T>; version: Nullable<version> }> {
    await this.ready
    const { value, version } = await this._get<T>(key)
    if (version === null) {
      this.#log.with({ op: "get", key: f(key) }).wdebug("no result")
      return { value: null, version: null }
    }
    this.#log.with({ op: "get", key: f(key), version }).trace()
    return { value, version }
  }

  /** Get entry from {@link Store}. This method is intended to be implemented by child classes. */
  protected abstract _get<T extends object>(key: key): Promisable<{ value: Nullable<T>; version: Nullable<version> }>

  /** Set entry in {@link Store}. */
  async set<T extends object>(keys: key | key[], value: T, version = null as Nullable<version>): Promise<{ value: T; version: version }> {
    await this.ready
    const indexes = Array.isArray(keys[0]) ? keys as Array<key> : [keys as key]
    const primary = indexes[0]
    const { ok, version: _version } = await this._set(indexes, value, version)
    if (!ok) {
      this.#log.with({ op: "set", key: f(primary), version }).error("failed")
      throw new TypeError(`Failed to write: ${f(primary)}@${version}`)
    }
    version = _version
    this.#log.with({ op: "set", key: f(primary), version }).debug()
    return { value, version }
  }

  /** Set entry in {@link Store}. This method is intended to be implemented by child classes. */
  protected abstract _set<T extends object>(keys: key[], value: T, versionstamp: Nullable<version>): Promisable<{ ok: boolean; version: version }>

  /** Delete entry from {@link Store}. */
  async delete(keys: key | key[], version = null as Nullable<version>): Promise<boolean> {
    await this.ready
    const indexes = Array.isArray(keys[0]) ? keys as Array<key> : [keys as key]
    const primary = indexes[0] as key
    if (!await this.has(primary)) {
      this.#log.with({ op: "delete", key: f(primary), version }).wdebug("no result")
      return false
    }
    const { ok } = await this._delete(indexes, version)
    if (!ok) {
      this.#log.with({ op: "delete", key: f(primary), version }).error("failed")
      throw new TypeError(`Failed to delete: ${f(primary)}@${version}`)
    }
    this.#log.with({ op: "delete", key: f(primary), version }).debug()
    return ok
  }

  /** Delete entry from {@link Store}. This method is intended to be implemented by child classes. */
  protected abstract _delete(keys: key[], versionstamp: Nullable<version>): Promisable<{ ok: boolean }>

  /** List entries from {@link Store}. */
  async list<T extends Record<PropertyKey, unknown>>(key: key | [key, key], options?: { limit?: number; reverse?: boolean; array: true }): Promise<Array<{ key: key; value: T; version: version }>>
  /** List entries from {@link Store}. */
  async list<T extends Record<PropertyKey, unknown>>(key: key | [key, key], options?: { limit?: number; reverse?: boolean; array?: false }): Promise<AsyncGenerator<{ key: key; value: T; version: version }>>
  /** List entries from {@link Store}. */
  async list<T extends Record<PropertyKey, unknown>>(
    key: key | [key, key],
    { limit, reverse, array = true }: { limit?: number; reverse?: boolean; array?: boolean } = {},
  ): Promise<Array<{ key: key; value: T; version: version }> | AsyncGenerator<{ key: key; value: T; version: version }>> {
    await this.ready
    const list = this._list<T>(key, { limit, reverse }, array)
    this.#log.with({ op: "list", key: f(key), limit, reverse, array }).trace()
    return list
  }

  /** List entries from {@link Store}. This method is intended to be implemented by child classes. */
  protected abstract _list<T extends Record<PropertyKey, unknown>>(
    key: key | [key, key],
    { limit, reverse }: { limit?: number; reverse?: boolean },
    array: boolean,
  ): Promisable<Array<{ key: key; value: T; version: version }> | AsyncGenerator<{ key: key; value: T; version: version }>>
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
