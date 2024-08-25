import { Context, type target } from "./context.ts"
import { expect, fn as _fn, test, type testing } from "@libs/testing"

// The `fn` function creates a listener that wraps an event handler.
// It listens to a `CustomEvent` and stores the event's `detail` value.
function fn() {
  // Creating the listener with Object.assign so that we can extend it with additional properties.
  const listener = Object.assign(
    _fn((event: CustomEvent) => {
      // Here, we assign the event's detail to the listener's `event` property.
      Object.assign(listener, { event: event.detail })
      return event.detail
    }) as EventListener,
    {
      // Initialize event to null and add a clear method that resets the event.
      event: null,
      clear: () => listener.event = null,
    },
  )
  return listener
}

// The `observe` function creates a context object around the target and attaches event listeners
// for the 'get', 'set', 'delete', and 'call' events. These listeners allow us to observe changes.
function observe(target: target, context = new Context(target)) {
  const listeners = { get: fn(), set: fn(), delete: fn(), call: fn() }

  // We attach the appropriate listeners to the corresponding events.
  for (const event of Object.keys(listeners) as (keyof typeof listeners)[]) {
    context.addEventListener(event, listeners[event])
  }

  // We return the context, the proxified observable target, and the original target.
  return { context, observable: context.target, target, listeners }
}

test("all")("Scope.target reacts to read operations", () => {
  const { observable, target, listeners } = observe({ property: false, nested: { property: false } })

  observable.property
  expect(listeners.get.event).toMatchObject({ path: [], target, property: "property", value: false })
  expect(listeners.get).toBeCalledTimes(1)

  observable.nested.property
  expect(listeners.get.event).toMatchObject({ path: ["nested"], target: target.nested, property: "property", value: false })
  expect(listeners.get).toBeCalledTimes(3)

  observable.undefined
  expect(listeners.get.event).toMatchObject({ path: ["nested"], target: target.nested, property: "property", value: false })
  expect(listeners.get).toBeCalledTimes(3)

  observable.recursive = { property: true }
  expect(listeners.set).toBeCalledTimes(1)
  expect(listeners.get).toBeCalledTimes(3)

  observable.recursive.property = false
  expect(listeners.set).toBeCalledTimes(2)
  expect(listeners.get).toBeCalledTimes(4)

  observable.recursive.next = true
  expect(listeners.set).toBeCalledTimes(3)
  expect(listeners.get).toBeCalledTimes(5)

  observable.recursive.property
  expect(listeners.set).toBeCalledTimes(3)
  expect(listeners.get).toBeCalledTimes(7)
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

test("all")("Scope.target skips proxification of built-in objects that are not worth observing", async () => {
  const uint8 = new TextEncoder().encode("Hello World")
  const messagechannel = new MessageChannel()
  const worker_url = URL.createObjectURL(
    new Blob([`console.log("Worker ran")`], { type: "text/javascript" }),
  )

  const Worker = globalThis.Worker ?? (await import("node:worker_threads"))?.Worker
  let worker: Worker | undefined = undefined
  try {
    worker = new Worker(worker_url, { type: "module" })
  } catch (e) {
    console.warn(e)
  }

  const { observable, target } = observe({
    error: new Error(),
    regexp: new RegExp(""),
    weakmap: new WeakMap(),
    weakset: new WeakSet(),
    weakref: new WeakRef({}),
    promise: Promise.resolve(),
    date: new Date(),
    arraybuf: uint8.buffer,
    typedarr: uint8,
    symbol: Symbol("unique"),
    bigint: BigInt(1),
    messageport: messagechannel.port1,
    messagechannel,
    worker,
  })

  for (const [key, value] of Object.entries(target)) {
    expect(observable[key]).toBe(value)
  }

  messagechannel?.port1?.close?.()
  messagechannel?.port2?.close?.()
  target?.worker?.terminate?.()
  URL?.revokeObjectURL?.(worker_url)
})

test("all")("Scope.with() returns a new context that inherits parent context", () => {
  const a = new Context({ a: 1, b: 0 })
  const b = a.with({ b: 1, c: 2 })
  expect(a.target).toEqual({ a: 1, b: 0 })
  expect(b.target).toEqual({ a: 1, b: 1, c: 2 })
  expect(Object.keys(a.target).sort()).toEqual(["a", "b"])
  expect(Object.keys(b.target).sort()).toEqual(["a", "b", "c"])
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

test("all")("Scope.target works with isolated and shared sets", () => {
  const { context, listeners } = observe({
    setOfUrls: new Set<string>(["https://example.com"]),
    name: "ParentContext",
  })

  const { context: childContext, listeners: childListeners } = observe(
    {},
    context.with({
      name: "ChildContext",
      isolatedSetOfUrls: new Set<string>(),
    }),
  )

  // Access the isolated set in the child context
  childContext.target.isolatedSetOfUrls.add("isolated-url")
  expect(childContext.target.isolatedSetOfUrls.size).toBe(1)
  expect(childContext.target.isolatedSetOfUrls.has("isolated-url")).toBe(true)

  // Access the shared set in both contexts
  childContext.target.setOfUrls.add("https://child.com")
  expect(childContext.target.setOfUrls.size).toBe(2)
  expect(context.target.setOfUrls.has("https://child.com")).toBe(true)
  expect(listeners.set).toHaveBeenCalledTimes(0) // No change event is fired on the parent contexts
  expect(listeners.call).toHaveBeenCalledTimes(2) // 2 call event are fired on the parent contexts, `add` & `has` for `setOfUrls`
  expect(childListeners.set).toHaveBeenCalledTimes(0) // No change event is fired on the child contexts
  expect(childListeners.call).toHaveBeenCalledTimes(4) // 4 call events are fired on the child context, `add` & `has` for `setOfUrls` & `isolatedSetOfUrls`

  // Access the shared set in both contexts
  context.target.setOfUrls.add("https://child-another-one.com")
  expect(context.target.setOfUrls.size).toBe(3)
  expect(childContext.target.setOfUrls.has("https://child-another-one.com")).toBe(true)
  expect(listeners.set).toHaveBeenCalledTimes(0) // No change event is fired on the parent contexts
  expect(listeners.call).toHaveBeenCalledTimes(4) // 2 + 2 call event is fired on the parent contexts, `add` & `has` for `setOfUrls`
  expect(childListeners.set).toHaveBeenCalledTimes(0) // No change event is fired on the child contexts
  expect(childListeners.call).toHaveBeenCalledTimes(6) // 4 + 2 call events are fired on the child context, `add` & `has` for `setOfUrls`
})

test("all")("Scope.target handles deep inheritance of properties", () => {
  const { context, listeners } = observe({ foo: "parent value" })
  const { context: childContext, listeners: childListeners } = observe({}, context.with({ bar: "child value" }))
  const { context: grandchildContext, listeners: grandchildListeners } = observe({}, childContext.with({ baz: "grandchild value" }))

  expect(grandchildContext.target.foo).toBe("parent value")
  expect(grandchildContext.target.bar).toBe("child value")
  expect(grandchildContext.target.baz).toBe("grandchild value")

  // Remember `foo` is a shared property so all contexts with access to `foo`
  // are dispatched `get` events
  // Notice, how the parent, child and grandchild `get` listeners are called 3 times
  expect(listeners.get).toBeCalledTimes(1)
  expect(childListeners.get).toBeCalledTimes(2)
  expect(grandchildListeners.get).toBeCalledTimes(3)

  grandchildContext.target.foo = "updated value"
  expect(context.target.foo).toBe("updated value")
  expect(childContext.target.foo).toBe("updated value")
  expect(grandchildContext.target.foo).toBe("updated value")

  // Remember `foo` is a shared property so all contexts with access to `foo`
  // are dispatched `get` events
  // Notice, how the parent, child and grandchild `get` listeners are called 3 times
  expect(listeners.get).toBeCalledTimes(4)
  expect(childListeners.get).toBeCalledTimes(5)
  expect(grandchildListeners.get).toBeCalledTimes(6)

  context.target.foo = "updated value 2"
  expect(context.target.foo).toBe("updated value 2")
  expect(childContext.target.foo).toBe("updated value 2")
  expect(grandchildContext.target.foo).toBe("updated value 2")

  // Ensure properties are correctly inherited across the hierarchy
  expect(grandchildContext.target.foo).toBe("updated value 2")

  // Remember `foo` is a shared property so all contexts with access to `foo`
  // are dispatched `get` events
  // Notice, how the parent, child and grandchild `get` listeners are called 4 times
  expect(listeners.get).toBeCalledTimes(8)
  expect(childListeners.get).toBeCalledTimes(9)
  expect(grandchildListeners.get).toBeCalledTimes(10)

  expect(grandchildContext.target.bar).toBe("child value")
  expect(childContext.target.bar).toBe("child value")
  expect(context.target.bar).toBe(undefined)

  expect(listeners.get).toBeCalledTimes(8)
  // Notice, how the child and grandchild `get` listeners are called twice
  expect(childListeners.get).toBeCalledTimes(11)
  expect(grandchildListeners.get).toBeCalledTimes(12)

  expect(grandchildContext.target.baz).toBe("grandchild value")
  expect(childContext.target.baz).toBe(undefined)
  expect(context.target.baz).toBe(undefined)

  expect(listeners.get).toBeCalledTimes(8)
  expect(childListeners.get).toBeCalledTimes(11)
  // Notice, how only the grandchild's `get` listener is called once
  expect(grandchildListeners.get).toBeCalledTimes(13)
})

test("all")("Scope.target function call from a grandchild context triggers correct events", () => {
  const { context, target, listeners } = observe({
    foo: "bar",
    logMessage: (msg: string) => `Message: ${msg}`,
  })

  const childContext = context.with({ bar: "baz", name: "childContext" })
  const grandchildContext = childContext.with({ baz: "qux", name: "grandChildContext" })

  const result = grandchildContext.target.logMessage("Hello")

  // Verify that the function was called and the event was triggered at the correct context level
  expect(listeners.get.event).toMatchObject({
    path: [],
    target,
    property: "logMessage",
    value: target.logMessage,
    type: "get",
  })
  expect(listeners.call.event).toMatchObject({
    path: [],
    target,
    property: "logMessage",
    args: ["Hello"],
    type: "call",
  })

  expect(listeners.call).toBeCalledTimes(1)
  expect(listeners.get).toBeCalledTimes(1)

  childContext.target.logMessage("Hello")

  expect(listeners.call).toBeCalledTimes(2)
  expect(listeners.get).toBeCalledTimes(2)

  // Verify that the function was called and the event was triggered at the correct context level
  expect(listeners.call.event).toMatchObject({
    path: [],
    target,
    property: "logMessage",
    args: ["Hello"],
    type: "call",
  })

  // Verify the function output
  expect(result).toBe("Message: Hello")
})

// Test case for unidirectional context inheritance behavior during delete operations.
test("all")("Scope.with() contexts operates unidirectionally when value is overridden from parent (delete operation)", () => {
  // We create a base context `a`, and then create child contexts `b` and `c` that inherit and override values.
  const { context: a } = observe({
    d: 0,
    nested: {
      b: 0,
      func() {
        return 0
      },
    },
  })
  const b = a.with<testing>({
    d: 1,
    nested: {
      b: 1,
      func() {
        return 1
      },
    },
  })
  const c = b.with<testing>({
    d: 2,
    nested: {
      b: 2,
      func() {
        return 2
      },
    },
  })

  // We add listeners to observe changes in each context `a`, `b`, and `c`.
  const listeners = { a: fn(), b: fn(), c: fn() }
  a.addEventListener("change", listeners.a)
  b.addEventListener("change", listeners.b)
  c.addEventListener("change", listeners.c)

  // Test: Check that the `d` value in each context is correct.
  // Context `a` should have `d` set to 0, `b` to 1, and `c` to 2.
  expect(a.target.d).toBe(0)
  expect(b.target.d).toBe(1)
  expect(c.target.d).toBe(2)

  // Ensure that `d` exists in each context (before we delete it).
  expect("d" in a.target).toBe(true)
  expect("d" in b.target).toBe(true)
  expect("d" in c.target).toBe(true)

  // Validate that the correct keys exist in each context object.
  expect(Object.keys(a.target).sort()).toEqual(["d", "nested"])
  expect(Object.keys(b.target).sort()).toEqual(["d", "nested"])
  expect(Object.keys(c.target).sort()).toEqual(["d", "nested"])

  // Validate that the nested objects contain the correct keys (`b` and `func`).
  expect(Object.keys(a.target.nested).sort()).toEqual(["b", "func"])
  expect(Object.keys(b.target.nested).sort()).toEqual(["b", "func"])
  expect(Object.keys(c.target.nested).sort()).toEqual(["b", "func"])

  // Ensure that `d` has the correct property descriptors in each context.
  expect(Object.getOwnPropertyDescriptor(a.target, "d")).toEqual({
    configurable: true,
    enumerable: true,
    value: 0,
    writable: true,
  })
  expect(Object.getOwnPropertyDescriptor(b.target, "d")).toEqual({
    configurable: true,
    enumerable: true,
    value: 1,
    writable: true,
  })
  expect(Object.getOwnPropertyDescriptor(c.target, "d")).toEqual({
    configurable: true,
    enumerable: true,
    value: 2,
    writable: true,
  })

  // Ensure that `b` in the nested object has the correct descriptors in each context.
  expect(Object.getOwnPropertyDescriptor(a.target.nested, "b")).toEqual({
    configurable: true,
    enumerable: true,
    value: 0,
    writable: true,
  })
  expect(Object.getOwnPropertyDescriptor(b.target.nested, "b")).toEqual({
    configurable: true,
    enumerable: true,
    value: 1,
    writable: true,
  })
  expect(Object.getOwnPropertyDescriptor(c.target.nested, "b")).toEqual({
    configurable: true,
    enumerable: true,
    value: 2,
    writable: true,
  })

  // Now, delete property `d` and `b` from context `b`. This should trigger the `delete` event listener.
  delete b.target.d

  // @ts-ignore: We ignore this because TypeScript doesn't allow deleting properties from nested objects this way.
  delete b.target.nested.b
  expect("d" in b.target).toBe(false)
  expect(listeners.b).toHaveBeenCalledTimes(2) // Expect the listener to have been triggered twice.

  // Validate that after deletion, `d` is gone from context `b` but remains in `a` and `c`.
  expect(Object.keys(a.target).sort()).toEqual(["d", "nested"])
  expect(Object.keys(b.target).sort()).toEqual(["nested"])
  expect(Object.keys(c.target).sort()).toEqual(["d", "nested"])

  // Similarly, validate the nested object keys after deletion.
  expect(Object.keys(a.target.nested).sort()).toEqual(["b", "func"])
  expect(Object.keys(b.target.nested).sort()).toEqual(["func"])
  expect(Object.keys(c.target.nested).sort()).toEqual(["b", "func"])

  // Ensure the property descriptor for `d` is now `undefined` in context `b`.
  expect(Object.getOwnPropertyDescriptor(a.target, "d")).toEqual({
    configurable: true,
    enumerable: true,
    value: 0,
    writable: true,
  })
  expect(Object.getOwnPropertyDescriptor(b.target, "d")).toBeUndefined()
  expect(Object.getOwnPropertyDescriptor(c.target, "d")).toEqual({
    configurable: true,
    enumerable: true,
    value: 2,
    writable: true,
  })

  // Similar validation for the nested property `b`.
  expect(Object.getOwnPropertyDescriptor(a.target.nested, "b")).toEqual({
    configurable: true,
    enumerable: true,
    value: 0,
    writable: true,
  })
  expect(Object.getOwnPropertyDescriptor(b.target.nested, "b")).toBeUndefined()
  expect(Object.getOwnPropertyDescriptor(c.target.nested, "b")).toEqual({
    configurable: true,
    enumerable: true,
    value: 2,
    writable: true,
  })

  // Now delete `d` in context `c` and verify that the listener is triggered.
  delete c.target.d
  expect(listeners.c).toHaveBeenCalledTimes(1)

  // Validate the structure of each context after the deletion.
  expect(Object.keys(a.target).sort()).toEqual(["d", "nested"])
  expect(Object.keys(b.target).sort()).toEqual(["nested"])
  expect(Object.keys(c.target).sort()).toEqual(["nested"])

  // Ensure `d` is still available in context `a` but no longer in `b` or `c`.
  expect(a.target.d).toBe(0)
  expect(b.target.d).toBeUndefined()
  expect(c.target.d).toBeUndefined()

  // Ensure the property descriptors reflect the changes after deletion.
  expect(Object.getOwnPropertyDescriptor(a.target, "d")).toEqual({
    configurable: true,
    enumerable: true,
    value: 0,
    writable: true,
  })
  expect(Object.getOwnPropertyDescriptor(b.target, "d")).toBeUndefined()
  expect(Object.getOwnPropertyDescriptor(c.target, "d")).toBeUndefined()

  // Test: Ensure the nested property `b` in context `a` still exists after the operations.
  expect(a.target.nested.b).toBe(0)

  // @ts-ignore: We are ignoring this check because `b.target.nested.b` was deleted and should be undefined.
  expect(b.target.nested.b).toBeUndefined()

  // Ensure the `d` property is properly removed from `b` and `c`.
  expect(a.target).toHaveProperty("d")
  expect(b.target).not.toHaveProperty("d")
  expect(c.target).not.toHaveProperty("d")

  // Ensure the nested object `b` remains in `a` but not in `b` or `c`.
  expect(a.target.nested).toHaveProperty("b")
  expect(b.target.nested).not.toHaveProperty("b")
  expect(c.target.nested).toHaveProperty("b")

  // Test: Validate the presence of `d` in `a` but not in `b` or `c`.
  expect("d" in a.target).toBe(true)
  expect("d" in b.target).toBe(false)
  expect("d" in c.target).toBe(false)

  // @ts-ignore: We are adding a property `d` back to `b.target` manually, which might not be allowed by TypeScript.
  b.target.d = 10
  expect(listeners.b).toHaveBeenCalledTimes(3) // Listener should trigger again.
  expect(b.target).toHaveProperty("d")
  expect("d" in b.target).toBe(true)

  // Validate the structure after re-adding `d` to `b`.
  expect(Object.keys(a.target).sort()).toEqual(["d", "nested"])
  expect(Object.keys(b.target).sort()).toEqual(["d", "nested"])
  expect(Object.keys(c.target).sort()).toEqual(["nested"])

  // Validate that the descriptors have been updated with the new value in context `b`.
  expect(Object.getOwnPropertyDescriptor(a.target, "d")).toEqual({
    configurable: true,
    enumerable: true,
    value: 0,
    writable: true,
  })
  expect(Object.getOwnPropertyDescriptor(b.target, "d")).toEqual({
    configurable: true,
    enumerable: true,
    value: 10,
    writable: true,
  })
  expect(Object.getOwnPropertyDescriptor(c.target, "d")).toBeUndefined()

  // Ensure the listeners were triggered appropriately during the test.
  expect(listeners.a).toHaveBeenCalledTimes(0)
  expect(listeners.b).toHaveBeenCalledTimes(3)
  expect(listeners.c).toHaveBeenCalledTimes(1)

  // @ts-ignore: We check that the `func` functions differ between contexts due to isolation.
  expect(a.target.nested.func).not.toBe(b.target.nested.func)
  // @ts-ignore Typescript doesn't like deep nested properties for some reason
  expect(b.target.nested.func).not.toBe(c.target.nested.func)

  // Validate that the `func` calls return the correct value for each context.
  expect(a.target.nested.func()).toBe(0)
  // @ts-ignore Typescript doesn't like deep nested properties for some reason
  expect(b.target.nested.func()).toBe(1)
  // @ts-ignore Typescript doesn't like deep nested properties for some reason
  expect(c.target.nested.func()).toBe(2)

  // @ts-ignore: We save the current `func` from context `b` before modifying it.
  const oldFunc = b.target.nested.func

  // @ts-ignore: Assign a new function to `b.target.nested.func`.
  b.target.nested.func = function () {
    return 10
  }

  // @ts-ignore Validate that the new `func` in context `b` doesn't match the old or other context's functions.
  expect(a.target.nested.func).not.toBe(b.target.nested.func)
  expect(a.target.nested.func).not.toBe(oldFunc)
  // @ts-ignore Typescript doesn't like deep nested properties for some reason
  expect(b.target.nested.func).not.toBe(oldFunc)
  // @ts-ignore Typescript doesn't like deep nested properties for some reason
  expect(c.target.nested.func).not.toBe(oldFunc)
  // @ts-ignore Typescript doesn't like deep nested properties for some reason
  expect(b.target.nested.func).not.toBe(c.target.nested.func)

  // Validate that each context's `func` now returns the correct values.
  expect(a.target.nested.func()).toBe(0)
  // @ts-ignore Typescript doesn't like deep nested properties for some reason
  expect(b.target.nested.func()).toBe(10)
  // @ts-ignore Typescript doesn't like deep nested properties for some reason
  expect(c.target.nested.func()).toBe(2)

  // @ts-ignore: We delete the `func` from context `b`.
  delete b.target.nested.func

  // Ensure the functions remain different across contexts after deletion.
  expect(a.target.nested.func).not.toBe(oldFunc)
  // @ts-ignore Typescript doesn't like deep nested properties for some reason
  expect(b.target.nested.func).not.toBe(oldFunc)
  // @ts-ignore Typescript doesn't like deep nested properties for some reason
  expect(c.target.nested.func).not.toBe(oldFunc)

  // Validate the `func` behavior post-deletion in context `b`.
  expect(a.target.nested.func()).toBe(0)
  // @ts-ignore Typescript doesn't like deep nested properties for some reason
  expect(b.target.nested.func).toBeUndefined()
  // @ts-ignore Typescript doesn't like deep nested properties for some reason
  expect(c.target.nested.func()).toBe(2)

  // Delete the entire nested object in context `b`.
  delete b.target.nested

  // Validate that the nested property `b` remains in context `a` and `c`.
  expect(a.target.nested.b).toBe(0)
  expect(b.target.nested).toBeUndefined()
  // @ts-ignore Typescript doesn't like deep nested properties for some reason
  expect(c.target.nested.b).toBe(2)

  // Validate that the nested objects are correctly removed from context `b`.
  expect(Object.keys(a.target).sort()).toEqual(["d", "nested"])
  expect(Object.keys(b.target).sort()).toEqual(["d"])
  expect(Object.keys(c.target).sort()).toEqual(["nested"])

  // Ensure the nested properties are correct after the operations.
  expect(Object.keys(a.target.nested).sort()).toEqual(["b", "func"])
  expect(Object.keys(c.target.nested).sort()).toEqual(["b", "func"])

  // Finally, delete the nested object in context `c`.
  delete c.target.nested

  // Ensure that only `a` retains the nested property.
  expect(a.target.nested.b).toBe(0)
  expect(b.target.nested).toBeUndefined()
  expect(c.target.nested).toBeUndefined()

  // Validate the presence of `nested` in context `a` but not in `b` or `c`.
  expect("nested" in a.target).toBe(true)
  expect("nested" in b.target).toBe(false)
  expect("nested" in c.target).toBe(false)

  // Ensure that `nested` still exists in context `a`.
  expect(a.target).toHaveProperty("nested")
  expect(b.target).not.toHaveProperty("nested")
  expect(c.target).not.toHaveProperty("nested")

  // Validate the final structure after all deletions.
  expect(Object.keys(a.target).sort()).toEqual(["d", "nested"])
  expect(Object.keys(b.target).sort()).toEqual(["d"])
  expect(Object.keys(c.target).sort()).toEqual([])

  // Ensure that the nested object structure remains intact in context `a`.
  expect(Object.keys(a.target.nested).sort()).toEqual(["b", "func"])
})

test("all")("Scope.with() creates and works with isolated and shared Map, Set, Date and ArrayBuffer without disrupting internal slots", () => {
  const currentDate = new Date()
  const { context, observable } = observe({
    currentDate,
    buffer: new ArrayBuffer(16),
    setOfUrls: new Set(["https://example.com"]),
    myMap: new Map([["key", "value"]]),
  })

  const { context: childContext, observable: childObservable } = observe(
    {},
    context.with({
      buffer: new ArrayBuffer(32),
      currentDate: new Date("2025-01-01T00:00:00Z"),
    }),
  )

  const { observable: grandchildObservable } = observe(
    {},
    childContext.with({
      currentDate: new Date("2026-01-01T00:00:00Z"),
    }),
  )

  const dataview = new DataView(observable.buffer)
  dataview.setUint8(0, 128)
  dataview.setUint8(1, 128)

  expect(dataview.buffer).toBe(observable.buffer)
  expect(observable.buffer.byteLength).toBe(16)

  const childdataview = new DataView(childObservable.buffer)
  childdataview.setUint8(2, 128)
  childdataview.setUint8(3, 128)

  expect(childdataview.buffer).toBe(childObservable.buffer)
  expect(childObservable.buffer.byteLength).toBe(32)

  const grandchilddataview = new DataView(grandchildObservable.buffer)
  grandchilddataview.setUint8(4, 156)
  grandchilddataview.setUint8(5, 156)

  expect(grandchilddataview.buffer).toBe(grandchildObservable.buffer)
  expect(grandchildObservable.buffer.byteLength).toBe(32)

  expect(observable.setOfUrls.has("https://example.com")).toBe(true)
  expect(childObservable.setOfUrls.has("https://example.com")).toBe(true)
  expect(grandchildObservable.setOfUrls.has("https://example.com")).toBe(true)

  expect(observable.currentDate.toISOString()).toBe(currentDate.toISOString())
  expect(childObservable.currentDate.toISOString()).toBe("2025-01-01T00:00:00.000Z")
  expect(grandchildObservable.currentDate.toISOString()).toBe("2026-01-01T00:00:00.000Z")

  childObservable.myMap.set("newKey", "newValue")
  expect(observable.myMap.has("newKey")).toBe(true)
  expect(observable.myMap.get("newKey")).toBe("newValue")

  expect(childObservable.myMap.has("newKey")).toBe(true)
  expect(childObservable.myMap.get("newKey")).toBe("newValue")

  expect(grandchildObservable.myMap.has("newKey")).toBe(true)
  expect(grandchildObservable.myMap.get("newKey")).toBe("newValue")
})

test("all")("Scope.with() contexts handle WeakMap, WeakSet, and Symbol", () => {
  const weakMap = new WeakMap<object, number>()
  const weakSet = new WeakSet<object>()
  const symbolKey = Symbol("uniqueKey")

  const { context, observable } = observe({ weakMap, weakSet, symbolKey })

  const obj = {}
  observable.weakMap.set(obj, 123)
  observable.weakSet.add(obj)

  const childContext = context.with({
    symbolKey: Symbol("childSymbol"),
  })

  expect(observable.weakMap.get(obj)).toBe(123)
  expect(observable.weakSet.has(obj)).toBe(true)
  expect(childContext.target.symbolKey).not.toBe(observable.symbolKey)
})
