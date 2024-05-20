// Imports
import type { Nullable, Promisable, record, rw } from "@libs/typing"
import { Store as _Store } from "./store.ts"
import type { key, version } from "./store.ts"

/** Key-Value store based upon {@link https://deno.land/api?s=Deno.Kv&unstable | Deno.KV}. */
export class Store extends _Store {
  /** Constructor. */
  constructor(options: { path?: string } & ConstructorParameters<typeof _Store>[0] = {}) {
    super(options)
    this.#kv = null as unknown as Deno.Kv
  }

  /** {@link Deno.Kv} store. */
  readonly #kv

  /** Open {@link Store}. */
  protected async _open() {
    ;(this as rw).#kv = await Deno.openKv(this.options.path as string)
  }

  /** Close {@link Store} instance. */
  protected _close() {
    this.#kv.close()
  }

  /** Get entry from {@link Store}. */
  protected async _get<T extends record>(key: key): Promise<{ value: Nullable<T>; version: Nullable<version> }> {
    const { value, versionstamp: version } = await this.#kv.get<T>(key)
    return { value, version }
  }

  /** Set entry in {@link Store}. */
  protected async _set<T extends record>(key: key, value: T, versionstamp: Nullable<version>, atomic: boolean): Promise<{ ok: boolean; version: version }> {
    let ok = false
    let version = null
    if (atomic) {
      ;({ ok, versionstamp: version } = await this.#kv.atomic().check({ key, versionstamp }).set(key, value).commit() as Deno.KvCommitResult)
    } else {
      ;({ ok, versionstamp: version } = await this.#kv.set(key, value))
    }
    return { ok, version }
  }

  /** Delete entry from {@link Store}. */
  protected async _delete(key: key, versionstamp: Nullable<version>, atomic: boolean): Promise<{ ok: boolean }> {
    let ok = false
    if (atomic) {
      ;({ ok } = await this.#kv.atomic().check({ key, versionstamp }).delete(key).commit() as Deno.KvCommitResult)
    } else {
      await this.#kv.delete(key)
      ok = true
    }
    return { ok }
  }

  /** List entries from {@link Store}. */
  protected _list<T extends record>(key: key | [key, key], { limit, reverse }: { limit?: number; reverse?: boolean }, array: boolean): Promisable<Array<{ key: key; value: T; version: version }> | AsyncGenerator<{ key: key; value: T; version: version }>> {
    let list
    if ((Array.isArray(key[0])) && (Array.isArray(key[1]))) {
      const [start, end] = key
      list = this.#kv.list<T>({ start, end }, { limit, reverse })
    } else {
      list = this.#kv.list<T>({ prefix: key as key }, { limit, reverse })
    }
    const iterator = (async function* () {
      for await (const { key, value, versionstamp: version } of list) {
        yield { key: key as key, value, version }
      }
    })()
    return array ? Array.fromAsync(iterator) : iterator
  }
}
