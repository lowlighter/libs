import { expect, test } from "@libs/testing"
import { construct, illegalConstructor, Indexable, unimplemented } from "./_.ts"

test()("illegalConstructor() throws if construct symbol is not passed", () => {
  expect(() =>
    (function (..._: unknown[]) {
      illegalConstructor(arguments)
    })()
  ).toThrow(TypeError)
  expect(() =>
    (function (..._: unknown[]) {
      illegalConstructor(arguments)
    })(construct)
  ).not.toThrow()
})

test()("unimplemented() and unimplemented.getter() throws a DOMException<'NotSupportedError'>", () => {
  expect(() => unimplemented()).toThrow(DOMException)
  expect(() => unimplemented.getter()).toThrow(DOMException)
})

test()("Indexable.constructor() is illegal", () => {
  expect(() => new Indexable()).toThrow(TypeError)
  new Indexable(construct)
})

test()("Indexable.length is supported", () => {
  expect(new Indexable(construct).length).toBe(0)
})

test()("Indexable.toString() returns object name", () => {
  class Test extends Indexable<unknown> {}
  expect(new Indexable(construct).toString()).toBe("[object Indexable]")
  expect(new Test(construct).toString()).toBe("[object Test]")
})

test()("Indexable[construct] exposes Array methods", () => {
  expect(new Indexable(construct)[construct]).toHaveProperty("push")
})

test()("Indexable[construct] hides Array methods", () => {
  expect(new Indexable(construct).push).toBeUndefined()
})
