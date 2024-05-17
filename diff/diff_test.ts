import { diff } from "./diff.ts"
import { expect, test } from "@libs/testing"

async function read(test: string) {
  const a = await Deno.readTextFile(new URL(`testing/${test}/a`, import.meta.url))
  const b = await Deno.readTextFile(new URL(`testing/${test}/b`, import.meta.url))
  const c = await Deno.readTextFile(new URL(`testing/${test}/c`, import.meta.url))
  return { a: a.replaceAll("\r\n", "\n"), b: b.replaceAll("\r\n", "\n"), c: c.replaceAll("\r\n", "\n") }
}

test("deno")("diff() handles empty texts", async () => {
  const { a, b, c } = await read("empty")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("deno")("diff() handles empty unchanged texts", async () => {
  const { a, b, c } = await read("identical")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("deno")("diff() handles final newline in texts", async () => {
  const { a, b, c } = await read("newline")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("deno")("diff() handles single addition", async () => {
  const { a, b, c } = await read("single/addition")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("deno")("diff() handles additions", async () => {
  const { a, b, c } = await read("addition")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("deno")("diff() handles single deletion", async () => {
  const { a, b, c } = await read("single/deletion")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("deno")("diff() handles deletions", async () => {
  const { a, b, c } = await read("deletion")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("deno")("diff() handles single edition", async () => {
  const { a, b, c } = await read("single/edition")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("deno")("diff() handles editions", async () => {
  const { a, b, c } = await read("edition")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("deno")("diff() handles multiple hunks", async () => {
  const { a, b, c } = await read("hunks")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("deno")("diff() handles moved lines", async () => {
  const { a, b, c } = await read("moved")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("deno")("diff() handles complex texts", async () => {
  const { a, b, c } = await read("lorem")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })
