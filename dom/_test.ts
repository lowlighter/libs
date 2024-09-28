import { expect, fn, test, type testing } from "@libs/testing"
import { dispatch, illegal, Indexable, internal, unimplemented } from "./_.ts"

test()("`illegal()` throws if internal symbol is not passed in the first argument", () => {
  expect(() =>
    (function (..._: unknown[]) {
      illegal(arguments)
    })({})
  ).toThrow(TypeError)
  expect(() =>
    (function (..._: unknown[]) {
      illegal(arguments)
    })({ [internal]: true })
  ).not.toThrow()
})

test()("`unimplemented()` throws a `DOMException<'NotSupportedError'>`", () => {
  expect(unimplemented).toThrow(DOMException)
})

test()("`unimplemented.getter`() throws a `DOMException<'NotSupportedError'>`", () => {
  expect(unimplemented.getter).toThrow(DOMException)
})

test()("`dispatch()` dispatches events", () => {
  const target = new EventTarget()
  const listener = fn() as testing
  const onfoo = fn() as testing
  target.addEventListener("foo", listener)
  Object.assign(target, { onfoo })
  dispatch(target, new Event("foo"))
  expect(listener).toHaveBeenCalled()
  expect(onfoo).toHaveBeenCalled()
})

test()("`Indexable.constructor()` is illegal", () => {
  expect(() => new Indexable()).toThrow(TypeError)
  new Indexable({ [internal]: true })
})

test()("`Indexable.length` is supported", () => {
  expect(new Indexable({ [internal]: true })).toHaveProperty("length", 0)
})

test()("`Indexable.toString()` is supported", () => {
  class Test extends Indexable<unknown> {}
  expect(new Indexable({ [internal]: true }).toString()).toBe("[object Indexable]")
  expect(new Test({ [internal]: true }).toString()).toBe("[object Test]")
})

test()("`Indexable[internal]` exposes `Array` methods", () => {
  for (const property of ["push", "pop", "shift", "unshift", "splice", "indexOf", "find", "map", "filter"] as const) {
    expect(new Indexable({ [internal]: true })[property]).toBeUndefined()
    expect(new Indexable({ [internal]: true })[internal][property]).toBeDefined()
  }
})
