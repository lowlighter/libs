import { expect, fn as _fn, throws } from "@libs/testing"
import { EventEmitter, type Listener } from "./events.ts"

/** Instantiates a new mock listener. */
const fn = () => _fn() as Listener<unknown>

Deno.test("`EventEmitter.emit()` invokes registered listeners with the emitted data", () => {
  const target = new EventEmitter<string>()
  const [a, b] = [fn(), fn()]
  target.on("event", a)
  target.on("event", b)
  target.emit("event", "foo")
  expect(a).toBeCalledWith("foo")
  expect(b).toBeCalledWith("foo")
  target.emit("event", "bar")
  expect(a).toBeCalledTimes(2)
  expect(b).toBeCalledTimes(2)
  expect(a).toBeCalledWith("bar")
})

Deno.test("`EventEmitter.emit()` invokes listeners in registration order", () => {
  const target = new EventEmitter()
  const order = [] as string[]
  target.on("event", () => order.push("a"))
  target.on("event", () => order.push("b"))
  target.emit("event", null)
  expect(order).toEqual(["a", "b"])
})

Deno.test("`EventEmitter.emit()` is a noop when no listeners are registered", () => {
  const target = new EventEmitter()
  expect(() => target.emit("event", null)).not.toThrow()
})

Deno.test("`EventEmitter.emit()` only invokes listeners registered for the emitted event", () => {
  const target = new EventEmitter()
  const [a, b] = [fn(), fn()]
  target.on("a", a)
  target.on("b", b)
  target.emit("a", null)
  expect(a).toBeCalledTimes(1)
  expect(b).not.toBeCalled()
})

Deno.test("`EventEmitter.emit()` does not invoke listeners registered during the emit", () => {
  const target = new EventEmitter()
  const added = fn()
  target.on("event", () => target.on("event", added))
  target.emit("event", null)
  expect(added).not.toBeCalled()
  target.emit("event", null)
  expect(added).toBeCalledTimes(1)
})

Deno.test("`EventEmitter.emit()` does not invoke listeners unregistered during the emit", () => {
  const target = new EventEmitter()
  const removed = fn()
  target.on("event", () => target.off("event", removed))
  target.on("event", removed)
  target.emit("event", null)
  expect(removed).not.toBeCalled()
})

Deno.test("`EventEmitter.on()` ignores duplicate registrations of the same listener", () => {
  const target = new EventEmitter()
  const listener = fn()
  target.on("event", listener)
  target.on("event", listener)
  target.emit("event", null)
  expect(listener).toBeCalledTimes(1)
})

Deno.test("`EventEmitter.on()` with `once` unregisters the listener after its first invocation", () => {
  const target = new EventEmitter<string>()
  const listener = fn()
  target.on("event", listener, { once: true })
  target.emit("event", "foo")
  target.emit("event", "bar")
  expect(listener).toBeCalledTimes(1)
  expect(listener).toBeCalledWith("foo")
})

Deno.test("`EventEmitter.on()` with `once` unregisters the listener even when it throws", () => {
  const target = new EventEmitter()
  let calls = 0
  target.on("event", () => {
    calls++
    throws("Expected")
  }, { once: true })
  expect(() => target.emit("event", null)).toThrow("Expected")
  expect(() => target.emit("event", null)).not.toThrow()
  expect(calls).toBe(1)
})

Deno.test("`EventEmitter.on()` with `once` supports listeners re-registering themselves", () => {
  const target = new EventEmitter()
  let calls = 0
  const listener = () => {
    calls++
    target.on("event", listener, { once: true })
  }
  target.on("event", listener, { once: true })
  target.emit("event", null)
  expect(calls).toBe(1)
  target.emit("event", null)
  expect(calls).toBe(2)
})

Deno.test("`EventEmitter.off()` unregisters the specified listener", () => {
  const target = new EventEmitter()
  const [a, b] = [fn(), fn()]
  target.on("event", a)
  target.on("event", b)
  target.off("event", a)
  target.emit("event", null)
  expect(a).not.toBeCalled()
  expect(b).toBeCalledTimes(1)
  expect(() => target.off("event", a)).not.toThrow()
  expect(() => target.off("unknown", a)).not.toThrow()
})

Deno.test("`EventEmitter.off()` unregisters `once` listeners", () => {
  const target = new EventEmitter()
  const listener = fn()
  target.on("event", listener, { once: true })
  target.off("event", listener)
  target.emit("event", null)
  expect(listener).not.toBeCalled()
})

Deno.test("`EventEmitter.off()` unregisters all listeners for the specified event when no listener is specified", () => {
  const target = new EventEmitter()
  const [a, b, other] = [fn(), fn(), fn()]
  target.on("event", a)
  target.on("event", b)
  target.on("other", other)
  target.off("event")
  target.emit("event", null)
  target.emit("other", null)
  expect(a).not.toBeCalled()
  expect(b).not.toBeCalled()
  expect(other).toBeCalledTimes(1)
  expect(() => target.off("unknown")).not.toThrow()
})
