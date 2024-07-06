import { expect, test } from "@libs/testing"
import { yellow } from "@std/fmt/colors"
import { construct } from "./_.ts"
import { Clipboard, ClipboardEvent, ClipboardItem } from "./clipboard.ts"
import { Navigator } from "./navigator.ts"

test()(`Clipboard.constructor() is illegal`, () => {
  expect(() => new Clipboard()).toThrow(TypeError)
  new Clipboard(construct, new Navigator(construct))
})

test()(`Clipboard.read() and Clipboard.write() are supported`, async () => {
  const navigator = new Navigator(construct)
  const item = new ClipboardItem({ "text/plain": "foo" })
  await navigator.clipboard.write([item])
  await expect(navigator.clipboard.read()).resolves.toEqual([item])
  navigator.permissions[construct].state["clipboard-read"] = "denied"
  await expect(navigator.clipboard.read()).rejects.toThrow(DOMException)
  navigator.permissions[construct].state["clipboard-write"] = "denied"
  await expect(navigator.clipboard.write([item])).rejects.toThrow(DOMException)
})

test()(`Clipboard.readText() and Clipboard.writeText() are supported`, async () => {
  const navigator = new Navigator(construct)
  await navigator.clipboard.writeText("foo")
  await expect(navigator.clipboard.readText()).resolves.toBe("foo")
  navigator.permissions[construct].state["clipboard-read"] = "denied"
  await expect(navigator.clipboard.readText()).rejects.toThrow(DOMException)
  navigator.permissions[construct].state["clipboard-write"] = "denied"
  await expect(navigator.clipboard.writeText("foo")).rejects.toThrow(DOMException)
})

test()(`ClipboardItem.constructor() is valid`, () => {
  expect(() => new ClipboardItem({})).toThrow(TypeError)
  new ClipboardItem({ "text/plain": "foo" })
})

test()(`ClipboardItem.presentationStyle is supported`, () => {
  expect(new ClipboardItem({ "text/plain": "foo" })).toHaveProperty("presentationStyle", "unspecified")
  expect(new ClipboardItem({ "text/plain": "foo" }, { presentationStyle: "inline" })).toHaveProperty("presentationStyle", "inline")
  expect(new ClipboardItem({ "text/plain": "foo" })).toBeImmutable("presentationStyle")
})

test()(`ClipboardItem.types is supported`, () => {
  const item = new ClipboardItem({ "text/plain": "foo" })
  expect(item.types).toEqual(["text/plain"])
  expect(item).toBeImmutable("types")
})

test()(`ClipboardItem.getType() is supported`, async () => {
  const item = new ClipboardItem({ "text/plain": "foo" })
  await expect(item.getType("text/html")).rejects.toThrow(DOMException)
  await expect(item.getType("text/plain")).resolves.toBeInstanceOf(Blob)
})

test()(`ClipboardItem.prototype.supports() is supported`, () => {
  expect(ClipboardItem.supports("text/plain")).toBe(true)
  expect(ClipboardItem.supports("text/html")).toBe(true)
  expect(ClipboardItem.supports("image/png")).toBe(true)
  expect(ClipboardItem.supports("app/foo")).toBe(false)
})

test()(`ClipboardEvent.constructor() is legal`, () => {
  new ClipboardEvent("copy")
})

test()(yellow("ClipboardEvent.clipboardData is unimplemented"), () => {
  expect(() => new ClipboardEvent("copy").clipboardData).toThrow(DOMException)
})
