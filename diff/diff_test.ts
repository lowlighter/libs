import { diff } from "../diff/diff.ts"
import { expect } from "https://deno.land/std@0.222.1/expect/expect.ts"

async function read(test: string) {
  const a = await Deno.readTextFile(new URL(`testing/${test}/a`, import.meta.url))
  const b = await Deno.readTextFile(new URL(`testing/${test}/b`, import.meta.url))
  const c = await Deno.readTextFile(new URL(`testing/${test}/c`, import.meta.url))
  return { a: a.replaceAll("\r\n", "\n"), b: b.replaceAll("\r\n", "\n"), c: c.replaceAll("\r\n", "\n") }
}

Deno.test("diff() handles empty texts", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("empty")
  expect(diff(a, b)).toStrictEqual(c)
})

Deno.test("diff() handles empty unchanged texts", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("identical")
  expect(diff(a, b)).toStrictEqual(c)
})

Deno.test("diff() handles final newline in texts", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("newline")
  expect(diff(a, b)).toStrictEqual(c)
})

Deno.test("diff() handles single addition", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("single/addition")
  expect(diff(a, b)).toStrictEqual(c)
})

Deno.test("diff() handles additions", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("addition")
  expect(diff(a, b)).toStrictEqual(c)
})

Deno.test("diff() handles single deletion", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("single/deletion")
  expect(diff(a, b)).toStrictEqual(c)
})

Deno.test("diff() handles deletions", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("deletion")
  expect(diff(a, b)).toStrictEqual(c)
})

Deno.test("diff() handles single edition", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("single/edition")
  expect(diff(a, b)).toStrictEqual(c)
})

Deno.test("diff() handles editions", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("edition")
  expect(diff(a, b)).toStrictEqual(c)
})

Deno.test("diff() handles multiple hunks", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("hunks")
  expect(diff(a, b)).toStrictEqual(c)
})

Deno.test("diff() handles moved lines", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("moved")
  expect(diff(a, b)).toStrictEqual(c)
})

Deno.test("diff() handles complex texts", { permissions: { read: true } }, async () => {
  const { a, b, c } = await read("lorem")
  expect(diff(a, b)).toStrictEqual(c)
})
