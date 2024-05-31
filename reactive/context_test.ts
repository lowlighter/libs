import { Context, type target } from "./context.ts"
import { expect, fn as _fn, test, type testing } from "@libs/testing"

function fn() {
  const listener = Object.assign(
    _fn((event: CustomEvent) => {
      Object.assign(listener, { event: event.detail })
      return event.detail
    }) as EventListener,
    { event: null, clear: () => listener.event = null },
  )
  return listener
}

function observe(target: target) {
  const context = new Context(target)
  const listeners = { get: fn(), set: fn(), delete: fn(), call: fn() }
  for (const event of Object.keys(listeners) as (keyof typeof listeners)[]) {
    context.addEventListener(event, listeners[event])
  }
  return { context, observable: context.target, target, listeners }
}

test("all")("Scope.target reacts to read operations", () => {
  const { observable, target, listeners } = observe({ property: false, nested: { property: false } })
  observable.property
  expect(listeners.get.event).toMatchObject({ path: [], target, property: "property", value: false })
  observable.nested.property
  expect(listeners.get.event).toMatchObject({ path: ["nested"], target: target.nested, property: "property", value: false })
  observable.undefined
  expect(listeners.get.event).toMatchObject({ path: [], target, property: "undefined", value: undefined })
  observable.recursive = { property: false }
  observable.recursive.property
  expect(listeners.get.event).toMatchObject({ path: ["recursive"], target: target.recursive, property: "property", value: false })
})

test("all")("Scope.target reacts to write operations", () => {
  const { observable, target, listeners } = observe({ property: false, nested: { property: false } })
  observable.property = true
  expect(listeners.set.event).toMatchObject({ path: [], target, property: "property", value: { old: false, new: true } })
  expect(observable.property).toBe(true)
  observable.nested.property = true
  expect(listeners.set.event).toMatchObject({ path: ["nested"], target: target.nested, property: "property", value: { old: false, new: true } })
  expect(observable.nested.property).toBe(true)
  observable.undefined = true
  expect(listeners.set.event).toMatchObject({ path: [], target, property: "undefined", value: { old: undefined, new: true } })
  expect(observable.undefined).toBe(true)
  observable.recursive = { property: false }
  observable.recursive.property = true
  expect(listeners.set.event).toMatchObject({ path: ["recursive"], target: target.recursive, property: "property", value: { old: false, new: true } })
})

test("all")("Scope.target reacts to delete operations", () => {
  const { observable, target, listeners } = observe({ property: false, nested: { property: false } })
  delete observable.property
  expect(listeners.delete.event).toMatchObject({ path: [], target, property: "property", value: false })
  expect(observable.property).toBeUndefined()
  delete observable.nested.property
  expect(listeners.delete.event).toMatchObject({ path: ["nested"], target: target.nested, property: "property", value: false })
  expect(observable.nested.property).toBeUndefined()
  delete observable.undefined
  expect(listeners.delete.event).toMatchObject({ path: [], target, property: "undefined", value: undefined })
  expect(observable.undefined).toBeUndefined()
  observable.recursive = { property: false }
  delete observable.recursive.property
  expect(listeners.delete.event).toMatchObject({ path: ["recursive"], target: target.recursive, property: "property", value: false })
  expect(observable.recursive.property).toBeUndefined()
})

test("all")("Scope.target reacts to call operations", () => {
  const { observable, target, listeners } = observe({ function: () => null, nested: { function: () => null } })
  observable.function("foo")
  expect(listeners.call.event).toMatchObject({ path: [], target, property: "function", args: ["foo"] })
  observable.nested.function("foo")
  expect(listeners.call.event).toMatchObject({ path: ["nested"], target: target.nested, property: "function", args: ["foo"] })
  observable.recursive = { function: () => null }
  observable.recursive.function("foo")
  expect(listeners.call.event).toMatchObject({ path: ["recursive"], target: target.recursive, property: "function", args: ["foo"] })
})

test("all")("Scope.target reacts to change operations", () => {
  const { context, observable } = observe({ property: false, function: () => null })
  const listener = fn()
  context.addEventListener("change", listener)
  observable.property
  expect(listener).not.toBeCalled()
  observable.property = true
  expect(listener).toHaveBeenCalledTimes(1)
  delete observable.property
  expect(listener).toHaveBeenCalledTimes(2)
  observable.function()
  expect(listener).toHaveBeenCalledTimes(3)
})

test("all")("Scope.target supports objects with internal slots", () => {
  const { observable, target, listeners } = observe({ set: new Set() })
  observable.set.add("foo")
  expect(listeners.call.event).toMatchObject({ path: [], target: target.set, property: "add", args: ["foo"] })
  expect(observable.set).toEqual(new Set(["foo"]))
  observable.set.has("foo")
  expect(listeners.call.event).toMatchObject({ path: [], target: target.set, property: "has", args: ["foo"] })
  observable.set.delete("foo")
  expect(listeners.call.event).toMatchObject({ path: [], target: target.set, property: "delete", args: ["foo"] })
  expect(observable.set).toEqual(new Set([]))
})

test("all")("Scope.target skips proxification of built-in objects that are not worth observing", () => {
  const { observable, target } = observe({
    error: new Error(),
    regexp: new RegExp(""),
    weakmap: new WeakMap(),
    weakset: new WeakSet(),
    weakref: new WeakRef({}),
    promise: Promise.resolve(),
  })
  for (const [key, value] of Object.entries(target)) {
    expect(observable[key]).toBe(value)
  }
})

test("all")("Scope.with() returns a new context that inherits parent context", () => {
  const a = new Context({ a: 1, b: 0 })
  const b = a.with({ b: 1, c: 2 })
  expect(a.target).toEqual({ a: 1, b: 0 })
  expect(b.target).toEqual({ a: 1, b: 1, c: 2 })
  expect(Object.keys(a.target)).toEqual(["a", "b"])
  expect(Object.keys(b.target)).toEqual(["a", "b", "c"])
})

test("all")("Scope.with() contexts operates bidirectionaly when value is inherited from parent", () => {
  const a = new Context({ a: 1 })
  const b = a.with({})
  const listeners = { a: fn(), b: fn() }
  a.addEventListener("change", listeners.a)
  b.addEventListener("change", listeners.b)
  a.target.a--
  expect(a.target.a).toBe(0)
  expect(b.target.a).toBe(0)
  expect(listeners.a).toHaveBeenCalledTimes(1)
  expect(listeners.b).toHaveBeenCalledTimes(1)
  b.target.a++
  expect(a.target.a).toBe(1)
  expect(b.target.a).toBe(1)
  expect(listeners.a).toHaveBeenCalledTimes(2)
  expect(listeners.b).toHaveBeenCalledTimes(2)
})

test("all")("Scope.with() contexts operates unidirectionaly when value is overidden from parent", () => {
  const a = new Context({ b: 1 })
  const b = a.with({ b: 1 })
  const listeners = { a: fn(), b: fn() }
  a.addEventListener("change", listeners.a)
  b.addEventListener("change", listeners.b)
  a.target.b--
  expect(a.target.b).toBe(0)
  expect(b.target.b).toBe(1)
  expect(listeners.a).toHaveBeenCalledTimes(1)
  expect(listeners.b).toHaveBeenCalledTimes(0)
  b.target.b++
  expect(a.target.b).toBe(0)
  expect(b.target.b).toBe(2)
  expect(listeners.a).toHaveBeenCalledTimes(1)
  expect(listeners.b).toHaveBeenCalledTimes(1)
})

test("all")("Scope.with() contexts operates unidirectionaly when value is not present in parent", () => {
  const a = new Context({})
  const b = a.with({ c: 1 })
  const listeners = { a: fn(), b: fn() }
  a.addEventListener("change", listeners.a)
  b.addEventListener("change", listeners.b)
  b.target.c++
  expect((a.target as testing).c).toBeUndefined()
  expect(b.target.c).toBe(2)
  expect(listeners.a).toHaveBeenCalledTimes(0)
  expect(listeners.b).toHaveBeenCalledTimes(1)
})

test("all")("Scope.target works as expected when run within a `with` context", () => {
  const { observable, listeners } = observe({ foo: false, bar: () => true })
  expect(() => new Function("observable", "with (observable) { foo = bar() }")(observable)).not.toThrow()
  expect(listeners.set).toHaveBeenCalledTimes(1)
  expect(listeners.call).toHaveBeenCalledTimes(1)
  expect(observable.foo).toBe(true)
})
