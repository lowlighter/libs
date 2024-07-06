import { expect, test } from "@libs/testing"
import { yellow } from "@std/fmt/colors"
import { construct } from "./_.ts"
import { MimeType, MimeTypeArray } from "./mime_type.ts"

test()(`MimeTypeArray.constructor() is illegal`, () => {
  expect(() => new MimeTypeArray()).toThrow(TypeError)
  new MimeTypeArray(construct)
})

test()(`MimeTypeArray.item() returns MimeType`, () => {
  const array = new MimeTypeArray(construct)
  const mime = new MimeType(construct, "application/foo")
  expect(array.item(0)).toBeNull()
  array[construct].push(mime)
  expect(array.item(0)).toBe(mime)
})

test()(`MimeTypeArray.namedItem() searches for MimeType`, () => {
  const array = new MimeTypeArray(construct)
  const mime = new MimeType(construct, "application/foo")
  expect(array.namedItem("application/foo")).toBeNull()
  array[construct].push(mime)
  expect(array.namedItem("application/foo")).toBe(mime)
})

test()(`MimeType.constructor() is illegal`, () => {
  expect(() => new MimeType()).toThrow(TypeError)
  new MimeType(construct, "application/foo")
})

test()(`MimeType.type is supported`, () => {
  const mime = new MimeType(construct, "application/foo")
  expect(mime).toHaveProperty("type", "application/foo")
  expect(mime).toBeImmutable("type")
})

test()(`MimeType.description is supported`, () => {
  const mime = new MimeType(construct, "")
  expect(mime).toHaveProperty("description", "")
  expect(mime).toBeImmutable("description")
})

test()(`MimeType.suffixes is supported`, () => {
  const mime = new MimeType(construct, "")
  expect(mime).toHaveProperty("suffixes", "")
  expect(mime).toBeImmutable("suffixes")
})

test()(yellow("MimeType.enabledPlugin is unimplemented"), () => {
  expect(() => new MimeType(construct, "").enabledPlugin).toThrow(DOMException)
})
