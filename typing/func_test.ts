import { AsyncFunction, AsyncGeneratorFunction, GeneratorFunction } from "./func.ts"
import { expect, test } from "@libs/testing"

test("all")("new AsyncFunction() returns an async function", async () => {
  const func = new AsyncFunction("return 1")
  const ret = func()
  expect(func).toBeInstanceOf(Function)
  expect(ret).toBeInstanceOf(Promise)
  await expect(ret).resolves.toBe(1)
})

test("all")("new GeneratorFunction() returns a generator function", () => {
  const func = new GeneratorFunction("yield 1")
  const gen = func()
  expect(func).toBeInstanceOf(Function)
  expect(gen.next).toBeInstanceOf(Function)
  expect(gen.return).toBeInstanceOf(Function)
  expect(gen.throw).toBeInstanceOf(Function)
  const ret = gen.next()
  expect(ret).toEqual({ value: 1, done: false })
})

test("all")("new AsyncGeneratorFunction() returns an async generator function", async () => {
  const func = new AsyncGeneratorFunction("yield 1")
  const gen = func()
  expect(func).toBeInstanceOf(Function)
  expect(gen.next).toBeInstanceOf(Function)
  expect(gen.return).toBeInstanceOf(Function)
  expect(gen.throw).toBeInstanceOf(Function)
  const ret = gen.next()
  expect(ret).toBeInstanceOf(Promise)
  await expect(ret).resolves.toEqual({ value: 1, done: false })
})
