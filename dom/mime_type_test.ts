import { expect, test } from "@libs/testing"
import { yellow } from "@std/fmt/colors"
import { internal } from "./_.ts"
import { MimeType, MimeTypeArray } from "./mime_type.ts"

test()(`MimeTypeArray.constructor() is illegal`, () => {
  expect(() => new MimeTypeArray()).toThrow(TypeError)
  new MimeTypeArray({ [internal]: true })
})

test()(`MimeTypeArray.item() returns MimeType`, () => {
  const array = new MimeTypeArray({ [internal]: true })
  const mime = new MimeType({ [internal]: true, type: "application/foo" })
  expect(array.item(0)).toBeNull()
  array[internal].push(mime)
  expect(array.item(0)).toBe(mime)
})

test()(`MimeTypeArray.namedItem() searches for MimeType`, () => {
  const array = new MimeTypeArray({ [internal]: true })
  const mime = new MimeType({ [internal]: true, type: "application/foo" })
  expect(array.namedItem(mime.type)).toBeNull()
  array[internal].push(mime)
  expect(array.namedItem(mime.type)).toBe(mime)
})

test()(`MimeType.constructor() is illegal`, () => {
  expect(() => new MimeType()).toThrow(TypeError)
  new MimeType({ [internal]: true })
})

test()(`MimeType.type is supported`, () => {
  const mime = new MimeType({ [internal]: true, type: "application/foo" })
  expect(mime).toHaveProperty("type", "application/foo")
  expect(mime).toBeImmutable("type")
})

test()(`MimeType.description is supported`, () => {
  const mime = new MimeType({ [internal]: true, description: "Foo" })
  expect(mime).toHaveProperty("description", "Foo")
  expect(mime).toBeImmutable("description")
})

test()(`MimeType.suffixes is supported`, () => {
  const mime = new MimeType({ [internal]: true, suffixes: "foo" })
  expect(mime).toHaveProperty("suffixes", "foo")
  expect(mime).toBeImmutable("suffixes")
})

test()(yellow("MimeType.enabledPlugin is unimplemented"), () => {
  expect(() => new MimeType({ [internal]: true }).enabledPlugin).toThrow(DOMException)
})
