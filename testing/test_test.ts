import { expect, fn } from "./expect.ts"
import { test, TestingError, throws } from "./test.ts"
import { test as noop } from "./_testing/noop.ts"
import { test as runner_deno } from "./_testing/deno.ts"
import { runtime } from "./runtime.ts"

test("`throws()` throws an error", () => {
  expect(() => throws("foo")).toThrow(TestingError, "foo")
  expect(() => throws(new TestingError("bar"))).toThrow(TestingError, "bar")
})

test("`test()` is a test runner", () => {
  noop("noop", () => {})
  noop.only("noop.only", () => {})
  noop.skip("noop.skip", () => {})
  noop.todo("noop.todo", () => {})
})

if (runtime === "deno") {
  test("`test()` implements deno test runner", () => {
    const original = Deno.test
    try {
      Object.assign(Deno, { test: Object.assign(fn(), { only: fn(), ignore: fn() }) })
      runner_deno("noop", () => {})
      runner_deno.only("noop.only", () => {})
      runner_deno.skip("noop.skip", () => {})
      runner_deno.todo("noop.todo", () => {})
    } finally {
      Object.assign(Deno, { test: original })
    }
  })
}
