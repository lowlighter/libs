import { expect, test, type testing } from "@libs/testing"
import { Store } from "./kv.ts"
import { Logger } from "@libs/logger"
const log = new Logger({ level: "disabled" })

test("`Store[Deno.Kv]` implements `Store` interface", async () => {
  await using store = await new Store({ path: ":memory:", log }).ready
  expect((store as testing).options.path).toBe(":memory:")
  await expect(store.get(["a"])).resolves.toHaveProperty("value", null)
  await expect(store.list(["a"], { array: true })).resolves.toHaveLength(0)
  await expect(store.set(["a"], { foo: true })).resolves.toHaveProperty("version")
  await expect(store.set(["b"], { bar: true }, null)).resolves.toHaveProperty("version")
  await expect(store.has(["a"])).resolves.toBe(true)
  await expect(store.has(["b"])).resolves.toBe(true)
  await expect(store.list([["a"], ["b"]], { array: true })).resolves.toMatchObject([{ value: { foo: true } }, { value: { bar: true } }])
  await expect(store.list([["a"], ["b"]], { array: true, reverse: true })).resolves.toMatchObject([{ value: { bar: true } }, { value: { foo: true } }])
  await expect(Array.fromAsync(await store.list([["a"], ["b"]], { array: false }))).resolves.toHaveLength(2)
  const { version: a } = await store.get(["a"])
  await expect(store.delete(["a"], a)).resolves.toBe(true)
  const { version: b } = await store.get(["b"])
  await expect(store.delete(["b"], b)).resolves.toBe(true)
  await expect(store.has(["a"])).resolves.toBe(false)
  await expect(store.has(["b"])).resolves.toBe(false)
  await expect(store.list([["a"], ["c"]], { array: true })).resolves.toHaveLength(0)
  await expect(Array.fromAsync(await store.list([["a"], ["b"]], { array: false }))).resolves.toHaveLength(0)
})

test("`Store[Deno.Kv]` supports transactions", async () => {
  await using store = await new Store({ path: ":memory:", log }).ready
  const { version } = await store.set([["a"], ["b"], ["c"]], { foo: true })
  await expect(store.get(["a"])).resolves.toHaveProperty("value", { foo: true })
  await expect(store.get(["b"])).resolves.toHaveProperty("value", { foo: true })
  await expect(store.get(["c"])).resolves.toHaveProperty("value", { foo: true })
  await store.delete([["a"], ["b"], ["c"]], version)
  await expect(store.has(["a"])).resolves.toBe(false)
  await expect(store.has(["b"])).resolves.toBe(false)
  await expect(store.has(["c"])).resolves.toBe(false)
})
