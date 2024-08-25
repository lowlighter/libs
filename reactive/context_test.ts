import { Context, type target } from "./context.ts"
import { expect, fn as _fn, type Nullable, test, type testing } from "@libs/testing"

/**
 * Listens for `CustomEvent` and stores the event's `detail` value in the `event` property.
 * Listeners can be cleared using the `clear` method.
 */
function fn() {
  const listener = Object.assign(
    _fn((event: CustomEvent) => {
      Object.assign(listener, { event: event.detail })
      return event.detail
    }) as EventListener,
    {
      event: null,
      clear: () => {
        ;(listener as testing)[Symbol.for("@MOCK")].calls.length = 0
        listener.event = null
      },
    },
  )
  return listener
}

/**
 * Observe `target` by passing it to a {@link Context} and also attaches event listeners for the 'get', 'set', 'delete', and 'call' events.
 * An object containing the resulting `context`, the `observable` targeet, the original `target`, and the event `listeners` is returned.
 */
// The `observe` function creates a context object around the target and attaches . These listeners allow us to observe changes.
function observe(target: target, context = new Context(target)) {
  const listeners = { get: fn(), set: fn(), delete: fn(), call: fn() }
  for (const event of Object.keys(listeners) as (keyof typeof listeners)[]) {
    context.addEventListener(event, listeners[event])
  }
  return { context, observable: context.target, target, listeners }
}

test("all")("Context.target reacts to read operations", () => {
  const { observable, target, listeners } = observe({ property: false, nested: { property: false } })

  listeners.get.clear()
  observable.property
  expect(listeners.get).toBeCalledTimes(["property"].length)
  expect(listeners.get.event).toMatchObject({ path: [], target, property: "property", value: false })

  listeners.get.clear()
  observable.nested.property
  expect(listeners.get).toBeCalledTimes(["nested", "property"].length)
  expect(listeners.get.event).toMatchObject({ path: ["nested"], target: target.nested, property: "property", value: false })

  listeners.get.clear()
  observable.undefined
  expect(listeners.get).not.toBeCalled()

  const recursive = { property: false } as testing
  recursive.recursive = recursive
  observable.recursive = recursive
  listeners.get.clear()
  observable.recursive.recursive.recursive.property
  expect(listeners.get).toBeCalledTimes(["recursive", "recursive", "recursive", "property"].length)
  //expect(listeners.get.event).toMatchObject({ path: ["recursive", "recursive", "recursive"], target: target.recursive.recursive.recursive, property: "property", value: false })
})

test("all")("Context.target reacts to read operations (child context)", () => {
  const { context: a, listeners: a_listeners } = observe({ foo: false })
  const { context: b, listeners: b_listeners } = observe(null, a.with({ bar: false }))
  const { context: c, listeners: c_listeners } = observe(null, b.with({ baz: false }))

  a.target.foo
  expect(a_listeners.get).toBeCalledTimes(1)
  expect(b_listeners.get).toBeCalledTimes(1)
  expect(c_listeners.get).toBeCalledTimes(1)

  b.target.bar
  expect(a_listeners.get).toBeCalledTimes(1)
  expect(b_listeners.get).toBeCalledTimes(2)
  expect(c_listeners.get).toBeCalledTimes(2)

  c.target.baz
  expect(a_listeners.get).toBeCalledTimes(1)
  expect(b_listeners.get).toBeCalledTimes(2)
  expect(c_listeners.get).toBeCalledTimes(3)
})

test("all")("Context.target reacts to write operations", () => {
  const { observable, target, listeners } = observe({ property: false, nested: { property: false } })

  listeners.set.clear()
  observable.property = true
  expect(observable.property).toBe(true)
  expect(listeners.set).toBeCalledTimes(1)
  expect(listeners.set.event).toMatchObject({ path: [], target, property: "property", value: { old: false, new: true } })

  listeners.set.clear()
  observable.nested.property = true
  expect(observable.nested.property).toBe(true)
  expect(listeners.set).toBeCalledTimes(1)
  expect(listeners.set.event).toMatchObject({ path: ["nested"], target: target.nested, property: "property", value: { old: false, new: true } })

  listeners.set.clear()
  observable.undefined = true
  expect(observable.undefined).toBe(true)
  expect(listeners.set).toBeCalledTimes(1)
  expect(listeners.set.event).toMatchObject({ path: [], target, property: "undefined", value: { old: undefined, new: true } })

  const recursive = { property: false } as testing
  recursive.recursive = recursive
  observable.recursive = recursive
  listeners.set.clear()
  observable.recursive.recursive.recursive.property = true
  expect(observable.recursive.recursive.recursive.property).toBe(true)
  expect(listeners.set).toBeCalledTimes(1)
  //expect(listeners.set.event).toMatchObject({ path: ["recursive", "recursive", "recursive"], target: target.recursive.recursive.recursive, property: "property", value: { old: false, new: true} })
})

test("all")("Context.target reacts to write operations (child context)", () => {
  const { context: a, listeners: a_listeners } = observe({ foo: "" })
  const { context: b, listeners: b_listeners } = observe(null, a.with({ bar: "" }))
  const { context: c, listeners: c_listeners } = observe(null, b.with({ baz: "" }))

  a.target.foo = "a"
  expect(a_listeners.set).toBeCalledTimes(1)
  expect(b_listeners.set).toBeCalledTimes(1)
  expect(c_listeners.set).toBeCalledTimes(1)
  expect(a.target.foo).toBe("a")
  expect(b.target.foo).toBe("a")
  expect(c.target.foo).toBe("a")

  b.target.bar = "b"
  expect(a_listeners.set).toBeCalledTimes(1)
  expect(b_listeners.set).toBeCalledTimes(2)
  expect(c_listeners.set).toBeCalledTimes(2)
  expect(a.target.bar).toBeUndefined()
  expect(b.target.bar).toBe("b")
  expect(c.target.bar).toBe("b")

  c.target.baz = "c"
  expect(a_listeners.set).toBeCalledTimes(1)
  expect(b_listeners.set).toBeCalledTimes(2)
  expect(c_listeners.set).toBeCalledTimes(3)
  expect(a.target.baz).toBeUndefined()
  expect(b.target.baz).toBeUndefined()
  expect(c.target.baz).toBe("c")

  a.target.xfoo = true
  expect(a.target.xfoo).toBe(true)
  expect(b.target.xfoo).toBe(true)
  expect(c.target.xfoo).toBe(true)

  b.target.xbar = true
  expect(a.target.xbar).toBeUndefined()
  expect(b.target.xbar).toBe(true)
  expect(c.target.xbar).toBe(true)

  c.target.xbaz = true
  expect(a.target.xbaz).toBeUndefined()
  expect(b.target.xbaz).toBeUndefined()
  expect(c.target.xbaz).toBe(true)
})

test("all")("Context.target reacts to delete operations", () => {
  const { observable, target, listeners } = observe({ property: false, nested: { property: false } })

  listeners.delete.clear()
  delete observable.property
  expect(observable.property).toBeUndefined()
  expect(listeners.delete).toBeCalledTimes(1)
  expect(listeners.delete.event).toMatchObject({ path: [], target, property: "property", value: false })

  listeners.delete.clear()
  delete observable.nested.property
  expect(observable.nested.property).toBeUndefined()
  expect(listeners.delete).toBeCalledTimes(1)
  expect(listeners.delete.event).toMatchObject({ path: ["nested"], target: target.nested, property: "property", value: false })

  listeners.delete.clear()
  delete observable.undefined
  expect(observable.undefined).toBeUndefined()
  expect(listeners.delete).toBeCalledTimes(1)
  expect(listeners.delete.event).toMatchObject({ path: [], target, property: "undefined", value: undefined })

  const recursive = { property: false } as testing
  recursive.recursive = recursive
  observable.recursive = recursive
  listeners.delete.clear()
  delete observable.recursive.recursive.recursive.property
  expect(observable.recursive.recursive.recursive.property).toBeUndefined()
  expect(listeners.delete).toBeCalledTimes(1)
  //expect(listeners.delete.event).toMatchObject({ path: ["recursive", "recursive", "recursive"], target: target.recursive.recursive.recursive, property: "property", value: false })
})

test("all")("Context.target reacts to delete operations (child context)", () => {
  const { context: a, listeners: a_listeners } = observe({ foo: false })
  const { context: b, listeners: b_listeners } = observe(null, a.with({ bar: false }))
  const { context: c, listeners: c_listeners } = observe(null, b.with({ baz: false }))

  delete a.target.property
  expect(a_listeners.delete).toBeCalledTimes(1)
  expect(b_listeners.delete).toBeCalledTimes(1)
  expect(c_listeners.delete).toBeCalledTimes(1)

  delete b.target.property
  expect(a_listeners.delete).toBeCalledTimes(1)
  expect(b_listeners.delete).toBeCalledTimes(2)
  expect(c_listeners.delete).toBeCalledTimes(2)

  delete c.target.property
  expect(a_listeners.delete).toBeCalledTimes(1)
  expect(b_listeners.delete).toBeCalledTimes(2)
  expect(c_listeners.delete).toBeCalledTimes(3)
})

test("all")("Context.target manages delete operations cleanly with correct property descriptors and presence", () => {
  const a = new Context({ a: "a", b: "a" })
  const b = a.with({ b: "b", c: "b" })
  const c = b.with({ c: "c", d: "c" })

  expect("a" in a.target).toBe(true)
  expect("b" in a.target).toBe(true)
  expect("c" in a.target).toBe(false)
  expect("d" in a.target).toBe(false)
  expect(Object.keys(a.target).sort()).toEqual(["a", "b"])
  expect(a.target).toHaveDescribedProperty("a", { value: "a", writable: true, enumerable: true, configurable: true })
  expect(a.target).toHaveDescribedProperty("b", { value: "a", writable: true, enumerable: true, configurable: true })
  expect(Object.getOwnPropertyDescriptor(a.target, "c")).toBeUndefined()
  expect(Object.getOwnPropertyDescriptor(a.target, "d")).toBeUndefined()
  expect("a" in b.target).toBe(true)
  expect("b" in b.target).toBe(true)
  expect("c" in b.target).toBe(true)
  expect("d" in b.target).toBe(false)
  expect(Object.keys(b.target).sort()).toEqual(["a", "b", "c"])
  expect(b.target).toHaveDescribedProperty("a", { value: "a", writable: true, enumerable: true, configurable: true })
  expect(b.target).toHaveDescribedProperty("b", { value: "b", writable: true, enumerable: true, configurable: true })
  expect(b.target).toHaveDescribedProperty("c", { value: "b", writable: true, enumerable: true, configurable: true })
  expect(Object.getOwnPropertyDescriptor(b.target, "d")).toBeUndefined()

  expect("a" in c.target).toBe(true)
  expect("b" in c.target).toBe(true)
  expect("c" in c.target).toBe(true)
  expect("d" in c.target).toBe(true)
  expect(Object.keys(c.target).sort()).toEqual(["a", "b", "c", "d"])
  expect(c.target).toHaveDescribedProperty("a", { value: "a", writable: true, enumerable: true, configurable: true })
  expect(c.target).toHaveDescribedProperty("b", { value: "b", writable: true, enumerable: true, configurable: true })
  expect(c.target).toHaveDescribedProperty("c", { value: "c", writable: true, enumerable: true, configurable: true })
  expect(c.target).toHaveDescribedProperty("d", { value: "c", writable: true, enumerable: true, configurable: true })

  delete (a.target as testing).a
  expect("a" in a.target).toBe(false)
  expect("a" in b.target).toBe(false)
  expect("a" in c.target).toBe(false)
  expect(Object.keys(a.target).sort()).toEqual(["b"])
  expect(Object.keys(b.target).sort()).toEqual(["b", "c"])
  expect(Object.keys(c.target).sort()).toEqual(["b", "c", "d"])

  delete (b.target as testing).b
  expect("b" in a.target).toBe(true)
  expect("b" in b.target).toBe(false)
  expect("b" in c.target).toBe(false)
  expect(Object.keys(a.target).sort()).toEqual(["b"])
  expect(Object.keys(b.target).sort()).toEqual(["c"])
  expect(Object.keys(c.target).sort()).toEqual(["c", "d"])

  delete (c.target as testing).c
  expect("c" in b.target).toBe(true)
  expect("c" in c.target).toBe(false)
  expect(Object.keys(b.target).sort()).toEqual(["c"])
  expect(Object.keys(c.target).sort()).toEqual(["d"])

  delete (c.target as testing).d
  expect("d" in c.target).toBe(false)
  expect(Object.keys(c.target).sort()).toEqual([])

  c.target.d = "c"
  expect("d" in c.target).toBe(true)
  expect(Object.keys(c.target).sort()).toEqual(["d"])

  b.target.c = "b"
  expect("c" in b.target).toBe(true)
  expect("c" in c.target).toBe(false)
  expect(Object.keys(b.target).sort()).toEqual(["c"])
  expect(Object.keys(c.target).sort()).toEqual(["d"])

  b.target.b = "b"
  expect("b" in a.target).toBe(true)
  expect("b" in c.target).toBe(true)
  expect(Object.keys(b.target).sort()).toEqual(["b", "c"])
  expect(Object.keys(c.target).sort()).toEqual(["b", "d"])

  a.target.a = "a"
  expect("a" in a.target).toBe(true)
  expect("a" in b.target).toBe(true)
  expect("a" in c.target).toBe(true)
  expect(Object.keys(a.target).sort()).toEqual(["a", "b"])
  expect(Object.keys(b.target).sort()).toEqual(["a", "b", "c"])
  expect(Object.keys(c.target).sort()).toEqual(["a", "b", "d"])

  delete (c.target as testing).a
  expect("a" in a.target).toBe(false)
  expect("a" in b.target).toBe(false)
  expect("a" in c.target).toBe(false)
  expect(Object.keys(a.target).sort()).toEqual(["b"])
  expect(Object.keys(b.target).sort()).toEqual(["b", "c"])
  expect(Object.keys(c.target).sort()).toEqual(["b", "d"])
})

test("all")("Context.target manages delete operations cleanly with correct property descriptors and presence (nested)", () => {
  const a = new Context({ nested: { a: "a", b: "a" } })
  const b = a.with({})
  const c = b.with({ nested: { c: "c" } })

  expect("a" in a.target.nested).toBe(true)
  expect("b" in a.target.nested).toBe(true)
  expect("c" in a.target.nested).toBe(false)
  expect(Object.keys(a.target.nested).sort()).toEqual(["a", "b"])

  expect("a" in b.target.nested).toBe(true)
  expect("b" in b.target.nested).toBe(true)
  expect("c" in b.target.nested).toBe(false)
  expect(Object.keys(b.target.nested).sort()).toEqual(["a", "b"])

  expect("a" in c.target.nested).toBe(false)
  expect("b" in c.target.nested).toBe(false)
  expect("c" in c.target.nested).toBe(true)
  expect(Object.keys(c.target.nested).sort()).toEqual(["c"])

  delete (c.target.nested as testing).c
  expect("c" in c.target.nested).toBe(false)
  expect(Object.keys(c.target.nested).sort()).toEqual([])

  delete (b.target.nested as testing).b
  expect("b" in a.target.nested).toBe(false)
  expect("b" in b.target.nested).toBe(false)
  expect(Object.keys(a.target.nested).sort()).toEqual(["a"])
  expect(Object.keys(b.target.nested).sort()).toEqual(["a"])

  delete (a.target.nested as testing).a
  expect("a" in a.target.nested).toBe(false)
  expect("a" in b.target.nested).toBe(false)
  expect(Object.keys(a.target.nested).sort()).toEqual([])
  expect(Object.keys(b.target.nested).sort()).toEqual([])

  c.target.nested.c = "c"
  expect("c" in c.target.nested).toBe(true)
  expect(Object.keys(c.target.nested).sort()).toEqual(["c"])

  b.target.nested.b = "b"
  expect("b" in a.target.nested).toBe(true)
  expect("b" in b.target.nested).toBe(true)
  expect(Object.keys(a.target.nested).sort()).toEqual(["b"])
  expect(Object.keys(b.target.nested).sort()).toEqual(["b"])

  a.target.nested.a = "a"
  expect("a" in a.target.nested).toBe(true)
  expect("a" in b.target.nested).toBe(true)
  expect(Object.keys(a.target.nested).sort()).toEqual(["a", "b"])
  expect(Object.keys(b.target.nested).sort()).toEqual(["a", "b"])
})

test("all")("Context.target reacts to call operations", () => {
  const { observable, target, listeners } = observe({ function: () => null, nested: { function: () => null } })

  listeners.call.clear()
  observable.function("foo")
  expect(listeners.call).toBeCalledTimes(1)
  expect(listeners.call.event).toMatchObject({ path: [], target, property: "function", args: ["foo"] })

  listeners.call.clear()
  observable.nested.function("foo")
  expect(listeners.call).toBeCalledTimes(1)
  expect(listeners.call.event).toMatchObject({ path: ["nested"], target: target.nested, property: "function", args: ["foo"] })

  const recursive = { function: () => null } as testing
  recursive.recursive = recursive
  observable.recursive = recursive
  listeners.call.clear()
  observable.recursive.recursive.recursive.function("foo")
  expect(observable.recursive.recursive.recursive.function).toBeInstanceOf(Function)
  expect(listeners.call).toBeCalledTimes(1)
  //expect(listeners.call.event).toMatchObject({ path: ["recursive", "recursive", "recursive"], target: target.recursive.recursive.recursive, property: "function", args: ["foo"] })
})

test("all")("Context.target reacts to call operations (child context)", () => {
  const { context: a, target, listeners: a_listeners } = observe({ function: () => null })
  const { context: b, listeners: b_listeners } = observe(null, a.with({}))
  const { context: c, listeners: c_listeners } = observe(null, b.with({}))
  c.target.function()
  expect(a_listeners.call).toBeCalledTimes(1)
  expect(a_listeners.call.event).toMatchObject({ path: [], target, property: "function", args: [] })
  expect(b_listeners.call).toBeCalledTimes(1)
  expect(b_listeners.call.event).toMatchObject({ path: [], target, property: "function", args: [] })
  expect(c_listeners.call).toBeCalledTimes(1)
  expect(c_listeners.call.event).toMatchObject({ path: [], target, property: "function", args: [] })
})

test("all")("Context.target reacts to change operations", () => {
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

test("all")("Context.target works as expected when run within a `with` context", () => {
  const { observable, listeners } = observe({ foo: false, bar: () => true })
  expect(() => new Function("observable", "with (observable) { foo = bar() }")(observable)).not.toThrow()
  expect(listeners.set).toHaveBeenCalledTimes(1)
  expect(listeners.call).toHaveBeenCalledTimes(1)
  expect(observable.foo).toBe(true)
})

test("all")("Context.target skips proxification of Context.unproxyable objects", async () => {
  const uint8 = new TextEncoder().encode("foo")
  const messagechannel = new MessageChannel()
  const _worker = URL.createObjectURL(new Blob([""], { type: "text/javascript" }))
  let worker
  try {
    const Worker = globalThis.Worker ?? (await import("node:worker_threads"))?.Worker
    worker = new Worker(_worker, { type: "module" })
  } catch {
    // Ignore
  }

  const { observable, target } = observe({
    map: new Map(),
    set: new Set(),
    error: new Error(),
    regexp: new RegExp(""),
    weakmap: new WeakMap(),
    weakset: new WeakSet(),
    weakref: new WeakRef({}),
    promise: Promise.resolve(),
    date: new Date(),
    arraybuffer: uint8.buffer,
    typedarray: uint8,
    symbol: Symbol("unique"),
    bigint: BigInt(1),
    messageport: messagechannel.port1,
    messagechannel,
    worker,
    t_undefined: undefined,
    t_null: null,
    t_boolean: true,
    t_number: 1,
    t_string: "foo",
  })

  for (const [key, value] of Object.entries(target)) {
    expect(observable[key]).toBe(value)
  }

  messagechannel?.port1?.close?.()
  messagechannel?.port2?.close?.()
  target?.worker?.terminate?.()
  URL?.revokeObjectURL?.(_worker)
})

test("all")("Context.with() returns a new context that inherits parent context", () => {
  const a = new Context({ a: "a", b: "a" })
  const b = a.with({ b: "b", c: "b" })
  const c = b.with({ c: "c", d: "c" })
  expect(a.target).toEqual({ a: "a", b: "a" })
  expect(b.target).toEqual({ a: "a", b: "b", c: "b" })
  expect(c.target).toEqual({ a: "a", b: "b", c: "c", d: "c" })
  expect(Object.keys(a.target).sort()).toEqual(["a", "b"])
  expect(Object.keys(b.target).sort()).toEqual(["a", "b", "c"])
  expect(Object.keys(c.target).sort()).toEqual(["a", "b", "c", "d"])
})

test("all")("Context.with() contexts support nullish values", () => {
  const a = new Context({ a: undefined, b: null })
  const b = a.with({ c: undefined, d: null })
  expect(a.target).toEqual({ a: undefined, b: null })
  expect(b.target).toEqual({ a: undefined, b: null, c: undefined, d: null })
})

test("all")("Context.with() contexts operates bidirectionaly when value is inherited from parent", () => {
  const a = new Context({ foo: null as Nullable<boolean> })
  const b = a.with({})
  const listeners = { a: fn(), b: fn() }
  a.addEventListener("change", listeners.a)
  b.addEventListener("change", listeners.b)
  a.target.foo = true
  expect(a.target.foo).toBe(true)
  expect(b.target.foo).toBe(true)
  expect(listeners.a).toHaveBeenCalledTimes(1)
  expect(listeners.b).toHaveBeenCalledTimes(1)
  b.target.foo = false
  expect(a.target.foo).toBe(false)
  expect(b.target.foo).toBe(false)
  expect(listeners.a).toHaveBeenCalledTimes(2)
  expect(listeners.b).toHaveBeenCalledTimes(2)
})

test("all")("Context.with() contexts operates unidirectionaly when value is overidden from parent", () => {
  const a = new Context({ foo: null as Nullable<boolean> })
  const b = a.with({ foo: null as Nullable<boolean> })
  const listeners = { a: fn(), b: fn() }
  a.addEventListener("change", listeners.a)
  b.addEventListener("change", listeners.b)
  a.target.foo = false
  expect(a.target.foo).toBe(false)
  expect(b.target.foo).toBe(null)
  expect(listeners.a).toHaveBeenCalledTimes(1)
  expect(listeners.b).toHaveBeenCalledTimes(0)
  b.target.foo = true
  expect(a.target.foo).toBe(false)
  expect(b.target.foo).toBe(true)
  expect(listeners.a).toHaveBeenCalledTimes(1)
  expect(listeners.b).toHaveBeenCalledTimes(1)
})

test("all")("Context.with() contexts operates unidirectionaly when value is not present in parent", () => {
  const a = new Context({})
  const b = a.with({ bar: null as Nullable<boolean> })
  const listeners = { a: fn(), b: fn() }
  a.addEventListener("change", listeners.a)
  b.addEventListener("change", listeners.b)
  b.target.bar = true
  expect((a.target as testing).bar).toBeUndefined()
  expect(b.target.bar).toBe(true)
  expect(listeners.a).toHaveBeenCalledTimes(0)
  expect(listeners.b).toHaveBeenCalledTimes(1)
})

test("all")("Context.with() contexts supports Set instance methods", () => {
  const { context: a } = observe({ foo: new Set<number>([0]) })
  const { context: b } = observe(null, a.with({}))

  a.target.foo.add(1)
  expect([...a.target.foo]).toEqual([0, 1])
  expect([...b.target.foo]).toEqual([0, 1])

  b.target.foo.add(2)
  expect([...a.target.foo]).toEqual([0, 1, 2])
  expect([...b.target.foo]).toEqual([0, 1, 2])
})

test("all")("Context.with() contexts supports Map instance methods", () => {
  const { context: a } = observe({ foo: new Map<string, number>([["foo", 0]]) })
  const { context: b } = observe(null, a.with({}))

  a.target.foo.set("bar", 1)
  expect([...a.target.foo]).toEqual([["foo", 0], ["bar", 1]])
  expect([...b.target.foo]).toEqual([["foo", 0], ["bar", 1]])

  b.target.foo.set("baz", 2)
  expect([...a.target.foo]).toEqual([["foo", 0], ["bar", 1], ["baz", 2]])
  expect([...b.target.foo]).toEqual([["foo", 0], ["bar", 1], ["baz", 2]])
})

test("all")("Context.with() contexts supports Map instance methods", () => {
  const { context: a } = observe({ foo: new Map<string, number>([["foo", 0]]) })
  const { context: b } = observe(null, a.with({}))

  a.target.foo.set("bar", 1)
  expect([...a.target.foo]).toEqual([["foo", 0], ["bar", 1]])
  expect([...b.target.foo]).toEqual([["foo", 0], ["bar", 1]])

  b.target.foo.set("baz", 2)
  expect([...a.target.foo]).toEqual([["foo", 0], ["bar", 1], ["baz", 2]])
  expect([...b.target.foo]).toEqual([["foo", 0], ["bar", 1], ["baz", 2]])
})
