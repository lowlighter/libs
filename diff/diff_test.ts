// deno-lint-ignore-file no-external-import
import { diff } from "./diff.ts"
import { expect, test } from "@libs/testing"
import { readFile } from "node:fs/promises"

async function read(test: string) {
  const a = await readFile(new URL(`testing/${test}/a`, import.meta.url), "utf-8")
  const b = await readFile(new URL(`testing/${test}/b`, import.meta.url), "utf-8")
  const c = await readFile(new URL(`testing/${test}/c`, import.meta.url), "utf-8")
  return { a: a.replaceAll("\r\n", "\n"), b: b.replaceAll("\r\n", "\n"), c: c.replaceAll("\r\n", "\n") }
}

test("`diff()` handles empty texts", async () => {
  const { a, b, c } = await read("empty")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("`diff()` handles empty unchanged texts", async () => {
  const { a, b, c } = await read("identical")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("`diff()` handles final newline in texts", async () => {
  const { a, b, c } = await read("newline")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("`diff()` handles single addition", async () => {
  const { a, b, c } = await read("single/addition")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("`diff()` handles additions", async () => {
  const { a, b, c } = await read("addition")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("`diff()` handles single deletion", async () => {
  const { a, b, c } = await read("single/deletion")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("`diff()` handles deletions", async () => {
  const { a, b, c } = await read("deletion")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("`diff()` handles single edition", async () => {
  const { a, b, c } = await read("single/edition")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("`diff()` handles editions", async () => {
  const { a, b, c } = await read("edition")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("`diff()` handles multiple hunks", async () => {
  const { a, b, c } = await read("hunks")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("`diff()` handles moved lines", async () => {
  const { a, b, c } = await read("moved")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })

test("`diff()` handles complex texts", async () => {
  const { a, b, c } = await read("lorem")
  expect(diff(a, b)).toStrictEqual(c)
}, { permissions: { read: true } })
