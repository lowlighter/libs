import { expect } from "@libs/testing/expect"
import { Emitter } from "./emitter.ts"

Deno.test("Emitter", async (it) => {
  await it.step("on()", () => {
    const emitter = new Emitter<number>()
    const events = [] as number[]
    const off = emitter.on((event) => events.push(event))
    emitter.emit(1)
    off()
    emitter.emit(2)
    expect(events).toEqual([1])
  })

  await it.step("on() (duplicate listener registers once)", () => {
    const emitter = new Emitter<number>()
    const events = [] as number[]
    const listener = (event: number) => events.push(event)
    emitter.on(listener)
    emitter.on(listener)
    emitter.emit(1)
    expect(events).toEqual([1])
  })

  await it.step("off()", () => {
    const emitter = new Emitter<number>()
    const events = [] as number[]
    const listener = (event: number) => events.push(event)
    emitter.on(listener)
    emitter.off(listener)
    emitter.emit(1)
    expect(events).toEqual([])
  })

  await it.step("emit() (listeners run in registration order)", () => {
    const emitter = new Emitter<number>()
    const order = [] as string[]
    emitter.on(() => order.push("first"))
    emitter.on(() => order.push("second"))
    emitter.emit(0)
    expect(order).toEqual(["first", "second"])
  })

  await it.step("emit() (emitters are isolated)", () => {
    const a = new Emitter<number>()
    const b = new Emitter<number>()
    const events = [] as number[]
    a.on((event) => events.push(event))
    b.emit(1)
    expect(events).toEqual([])
  })

  await it.step("clear()", () => {
    const emitter = new Emitter<number>()
    const events = [] as number[]
    emitter.on((event) => events.push(event))
    emitter.clear()
    emitter.emit(1)
    expect(events).toEqual([])
  })
})
