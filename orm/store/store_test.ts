import { expect, fn, test, type testing } from "@libs/testing"
import { Store } from "./store.ts"
import { Logger } from "@libs/logger"
const log = new Logger({ level: "disabled" })

test("deno")("`Store` calls `open()` upon construction and `close()` upon destruction", async () => {
  const _open = fn()
  const _close = fn()
  const options = { log, foo: true }
  const TestStore = class extends (Store as testing) {
    _open() {
      _open()
    }
    _close() {
      _close()
    }
  } as testing
  {
    await using store = await new TestStore(options).ready
    expect(store.options).toMatchObject({ foo: true })
    expect(_open).toHaveBeenCalled()
    expect(_close).not.toHaveBeenCalled()
  }
  expect(_close).toHaveBeenCalled()

  const ErrorStore = class extends (Store as testing) {
    _open() {
      throw new Error("Expected")
    }
  } as testing
  await expect(new ErrorStore().ready).rejects.toThrow("Expected")
})

test("deno")("`Store.get()` gets key-values", async () => {
  let value = null as testing
  const key = ["key"], version = "0"
  const TestStore = class extends (Store as testing) {
    _open() {}
    _get = fn(() => ({ value, version }))
  } as testing
  const store = await new TestStore({ log }).ready
  await expect(store.get(key)).resolves.toHaveProperty("value", null)
  expect(store._get).toHaveBeenLastCalledWith(key)
  value = { foo: true }
  await expect(store.get(key)).resolves.toEqual({ value, version })
})

test("deno")("`Store.set()` sets key-values", async () => {
  const key = ["key"], value = { foo: true }, version = "0"
  let ok = true
  const TestStore = class extends (Store as testing) {
    _open() {}
    _set = fn(() => ({ ok, version }))
  } as testing
  const store = await new TestStore({ log }).ready
  for (const versionstamp of [null, version]) {
    ok = true
    await expect(store.set(key, value, versionstamp)).resolves.toEqual({ value, version })
    expect(store._set).toHaveBeenLastCalledWith([key], value, versionstamp)
    ok = false
    await expect(store.set(key, value, versionstamp)).rejects.toThrow("Failed")
    expect(store._set).toHaveBeenLastCalledWith([key], value, versionstamp)
  }
})

test("deno")("`Store.delete()` deletes key-values", async () => {
  const key = ["key"], version = "0"
  let ok = true, value = { foo: true } as testing
  const TestStore = class extends (Store as testing) {
    _open() {}
    _get() {
      return { value, version: value ? "0" : null }
    }
    _delete = fn(() => (value = null, { ok }))
  } as testing
  const store = await new TestStore({ log }).ready
  await expect(store.delete(key, version)).resolves.toBe(true)
  expect(store._delete).toHaveBeenLastCalledWith([key], version)
  await expect(store.delete(key, version)).resolves.toBe(false)
  expect(store._delete).toHaveBeenLastCalledWith([key], version)
  ok = false
  value = { foo: true }
  await expect(store.delete(key, version)).rejects.toThrow("Failed")
  expect(store._delete).toHaveBeenLastCalledWith([key], version)
})

test("deno")("`Store.list()` lists key-values", async () => {
  const key = [["key_a"], ["key_b"]]
  const TestStore = class extends (Store as testing) {
    _open() {}
    _list = fn((_: unknown, __: unknown, array: boolean) => array ? [] : (async function* () {})())
  } as testing
  const store = await new TestStore({ log }).ready
  await expect(store.list(key, { array: true })).resolves.toBeInstanceOf(Array)
  expect(store._list).toHaveBeenLastCalledWith(key, {}, true)
  await expect(store.list(key, { array: false })).not.resolves.toBeInstanceOf(Array)
  expect(store._list).toHaveBeenLastCalledWith(key, {}, false)
})
