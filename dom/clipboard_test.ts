import { expect, test } from "@libs/testing"
import { yellow } from "@std/fmt/colors"
import { internal } from "./_.ts"
import { Clipboard, ClipboardEvent, ClipboardItem } from "./clipboard.ts"
import { Navigator } from "./navigator.ts"

test()("`Clipboard.constructor()` is illegal", () => {
  expect(() => new Clipboard()).toThrow(TypeError)
  new Clipboard({ [internal]: true, navigator: new Navigator({ [internal]: true }) })
})

test()("`Clipboard.read()` and `Clipboard.write()` are supported", async () => {
  const navigator = new Navigator({ [internal]: true })
  const item = new ClipboardItem({ "text/plain": "foo" })
  await expect(navigator.clipboard.write([item])).rejects.toThrow(DOMException)
  await expect(navigator.clipboard.read()).rejects.toThrow(DOMException)
  navigator.permissions[internal].state["clipboard-read"] = "granted"
  navigator.permissions[internal].state["clipboard-write"] = "granted"
  await expect(navigator.clipboard.write([item])).resolves.toBeUndefined()
  await expect(navigator.clipboard.read()).resolves.toEqual([item])
})

test()("`Clipboard.readText()` and `Clipboard.writeText()` are supported", async () => {
  const navigator = new Navigator({ [internal]: true })
  await expect(navigator.clipboard.writeText("foo")).rejects.toThrow(DOMException)
  await expect(navigator.clipboard.readText()).rejects.toThrow(DOMException)
  navigator.permissions[internal].state["clipboard-read"] = "granted"
  navigator.permissions[internal].state["clipboard-write"] = "granted"
  await expect(navigator.clipboard.writeText("foo")).resolves.toBeUndefined()
  await expect(navigator.clipboard.readText()).resolves.toBe("foo")
})

test()("`ClipboardItem.constructor()` is valid", () => {
  expect(() => new ClipboardItem({})).toThrow(TypeError)
  new ClipboardItem({ "text/plain": "foo" })
})

test()("`ClipboardItem.types` is supported", () => {
  const item = new ClipboardItem({ "text/plain": "foo" })
  expect(item.types).toEqual(["text/plain"])
  expect(item).toHaveImmutableProperty("types")
})

test()("`ClipboardItem.getType()` is supported", async () => {
  const item = new ClipboardItem({ "text/plain": "foo" })
  await expect(item.getType("text/html")).rejects.toThrow(DOMException)
  await expect(item.getType("text/plain")).resolves.toBeInstanceOf(Blob)
})

test()("`ClipboardItem.presentationStyle` is supported", () => {
  expect(new ClipboardItem({ "text/plain": "foo" })).toHaveProperty("presentationStyle", "unspecified")
  expect(new ClipboardItem({ "text/plain": "foo" }, { presentationStyle: "inline" })).toHaveProperty("presentationStyle", "inline")
  expect(new ClipboardItem({ "text/plain": "foo" })).toHaveImmutableProperty("presentationStyle")
})

test()("`ClipboardItem.prototype.supports()` is supported", () => {
  expect(ClipboardItem.supports("text/plain")).toBe(true)
  expect(ClipboardItem.supports("text/html")).toBe(true)
  expect(ClipboardItem.supports("image/png")).toBe(true)
  expect(ClipboardItem.supports("app/foo")).toBe(false)
})

test()("`ClipboardEvent.constructor()` is legal", () => {
  new ClipboardEvent("copy")
})

test()(yellow("`ClipboardEvent.clipboardData` is unimplemented"), () => {
  expect(() => new ClipboardEvent("copy").clipboardData).toThrow(DOMException)
})
