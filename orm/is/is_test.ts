import { expect, test } from "@libs/testing"
import { is } from "./is.ts"

test("deno")("`is.parse()` validates input", () => {
  const model = is.object({ foo: is.string() })
  expect(model.parse({ foo: "bar" })).toEqual({ foo: "bar" })
  expect(() => model.parse({ foo: true })).toThrow(TypeError)
})

test("deno")("`is.parseAsync()` validates input asynchronously", async () => {
  const model = is.object({ foo: is.string() })
  await expect(model.parseAsync({ foo: "bar" })).resolves.toEqual({ foo: "bar" })
  await expect(model.parseAsync({ foo: true })).rejects.toThrow(TypeError)
})
