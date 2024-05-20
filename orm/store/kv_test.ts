import { expect, test, type testing } from "@libs/testing"
import { Store } from "./kv.ts"
import { Logger } from "@libs/logger"
const log = new Logger({ level: Logger.level.disabled })

test("deno")(`Store[Deno.Kv] implements Store interface`, async () => {
  await using store = await new Store({ path: ":memory:", log }).ready
  expect((store as testing).options.path).toBe(":memory:")
  await expect(store.get(["a"])).resolves.toHaveProperty("value", null)
  await expect(store.list(["a"], { array: true })).resolves.toHaveLength(0)
  await expect(store.set(["a"], { foo: true })).resolves.toHaveProperty("version")
  await expect(store.set(["b"], { bar: true }, null)).resolves.toHaveProperty("version")
  await expect(store.has(["a"])).resolves.toBe(true)
  await expect(store.has(["b"])).resolves.toBe(true)
  await expect(store.list([["a"], ["c"]], { array: true })).resolves.toHaveLength(2)
  await expect(Array.fromAsync(await store.list([["a"], ["c"]], { array: false }))).resolves.toHaveLength(2)
  await expect(store.delete(["a"])).resolves.toBe(true)
  const { version } = await store.get(["b"])
  await expect(store.delete(["b"], version!)).resolves.toBe(true)
  await expect(store.has(["a"])).resolves.toBe(false)
  await expect(store.has(["b"])).resolves.toBe(false)
  await expect(store.list([["a"], ["c"]], { array: true })).resolves.toHaveLength(0)
  await expect(Array.fromAsync(await store.list([["a"], ["c"]], { array: false }))).resolves.toHaveLength(0)
})
