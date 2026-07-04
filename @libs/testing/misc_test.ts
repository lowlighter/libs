import { expect } from "./expect.ts"
import { TestingError, throws } from "./misc.ts"

Deno.test("`throws()` throws an error", () => {
  expect(() => throws("foo")).toThrow(TestingError, "foo")
  expect(() => throws(new TestingError("bar"))).toThrow(TestingError, "bar")
})
