import { expect, test } from "@libs/testing"
import { state } from "./promises.ts"

test('`state()` returns "fulfilled" on resolved promises', async () => {
  const { promise, resolve } = Promise.withResolvers<void>()
  await expect(state(promise)).resolves.toBe("pending")
  resolve()
  await expect(state(promise)).resolves.toBe("fulfilled")
})

test('`state()` returns "rejected" on rejected promises', async () => {
  const { promise, reject } = Promise.withResolvers<void>()
  await expect(state(promise)).resolves.toBe("pending")
  reject()
  await expect(state(promise)).resolves.toBe("rejected")
})
