import { Streamable } from "./streamable.ts"
import { Stream } from "./stream.ts"
import { SeekMode } from "./types.ts"
import { expect } from "@std/expect"

Deno.test("streamable: readSync", () => {
  const stream = new Streamable("hello world")
  expect(stream.seekSync(0, SeekMode.Current)).toBe(0)
  const buffer = new Uint8Array(5)
  stream.readSync(buffer)
  expect(new TextDecoder().decode(buffer)).toBe("hello")
})

Deno.test("streamable: seekSync", () => {
  const stream = new Streamable("hello world")
  expect(stream.seekSync(5, SeekMode.Start)).toBe(5)
  expect(stream.seekSync(-2, SeekMode.Current)).toBe(3)
  expect(stream.seekSync(+2, SeekMode.Current)).toBe(5)
  expect(stream.seekSync(-1, SeekMode.End)).toBe(10)
})

Deno.test("streamable: seekSync", () => {
  const stream = new Streamable("hello world")
  expect(stream.seekSync(5, SeekMode.Start)).toBe(5)
  expect(stream.seekSync(-2, SeekMode.Current)).toBe(3)
  expect(stream.seekSync(+2, SeekMode.Current)).toBe(5)
  expect(stream.seekSync(-1, SeekMode.End)).toBe(10)
})

Deno.test("stream: cursor", () => {
  const stream = new Stream(new Streamable("hello world"))
  expect(stream.cursor).toBe(0)
  stream.read(5)
  expect(stream.cursor).toBe(5)
})

Deno.test("stream: peek", () => {
  const stream = new Stream(new Streamable("hello world"))
  expect(stream.cursor).toBe(0)
  expect(stream.peek(5)).toBe("hello")
  expect(stream.cursor).toBe(0)
  expect(stream.peek(5, 6)).toBe("world")
})

Deno.test("stream: read", () => {
  const stream = new Stream(new Streamable("hello world"))
  expect(stream.cursor).toBe(0)
  expect(stream.read(5)).toEqual(new TextEncoder().encode("hello"))
  expect(stream.cursor).toBe(5)
  expect(stream.read(6)).toEqual(new TextEncoder().encode(" world"))
  expect(() => stream.read(1000)).toThrow(Deno.errors.UnexpectedEof)
})

Deno.test("stream: capture", () => {
  const stream = new Stream(new Streamable("hello world"))
  expect(stream.cursor).toBe(0)
  expect(stream.capture({ until: / /, bytes: 1 })).toBe("hello")
  expect(stream.cursor).toBe(6)
  expect(stream.capture({ until: /(?<=wo)rld/, bytes: 5, length: 3 })).toBe("wo")
})

Deno.test("stream: consume", () => {
  const stream = new Stream(new Streamable("hello world"))
  expect(stream.cursor).toBe(0)
  stream.consume({ content: "hello " })
  expect(stream.cursor).toBe(6)
})

Deno.test("stream: trim", () => {
  const stream = new Stream(new Streamable("   hello world"))
  expect(stream.cursor).toBe(0)
  stream.trim()
  expect(stream.cursor).toBe(3)
  stream.consume({ content: "hello world" })
  stream.trim()
  expect(stream.cursor).toBe(14)
  stream.peek = () => {
    throw new EvalError()
  }
  expect(() => stream.trim()).toThrow(EvalError)
})
