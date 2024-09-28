import { expect, test, type testing } from "@libs/testing"
import { Element } from "./element.ts"
import { internal } from "./_.ts"
import { Attr } from "./attr.ts"
import { Document } from "./document.ts"

test()("`Attr.constructor()` is illegal", () => {
  expect(() => new Attr()).toThrow(TypeError)
  new Attr({ [internal]: true })
})

test()("`Attr.ownerDocument` is supported", () => {
  const document = new Document()
  expect(new Attr({ [internal]: true, ownerDocument: document })).toHaveProperty("ownerDocument", document)
  expect(new Attr({ [internal]: true, ownerDocument: document })).toHaveImmutableProperty("ownerDocument")
  expect(new Attr({ [internal]: true }).ownerDocument).toBeNull()
})

test()("`Attr.ownerElement` is supported", () => {
  const element = new Element({ [internal]: true })
  expect(new Attr({ [internal]: true, ownerElement: element })).toHaveProperty("ownerElement", element)
  expect(new Attr({ [internal]: true, ownerElement: element })).toHaveImmutableProperty("ownerElement")
  expect(new Attr({ [internal]: true }).ownerElement).toBeNull()
})

test()("`Attr.name` is supported", () => {
  expect(new Attr({ [internal]: true, prefix: "foo", localName: "bar" })).toHaveProperty("name", "foo:bar")
  expect(new Attr({ [internal]: true, prefix: null, localName: "bar" })).toHaveProperty("name", "bar")
  expect(new Attr({ [internal]: true, prefix: "foo", localName: "bar" })).toHaveImmutableProperty("name")
})

test()("`Attr.value` is supported", () => {
  const attr = new Attr({ [internal]: true })
  expect(attr.value).toBe("")
  attr.value = "bar"
  expect(attr.value).toBe("bar")
  attr.value = 1 as testing
  expect(attr.value).toBe("1")
})

test()("`Attr.prefix` is supported", () => {
  expect(new Attr({ [internal]: true }).prefix).toBeNull()
  expect(new Attr({ [internal]: true, prefix: "foo" })).toHaveProperty("prefix", "foo")
  expect(new Attr({ [internal]: true, prefix: "foo" })).toHaveImmutableProperty("prefix")
})

test()("`Attr.localName` is supported", () => {
  expect(new Attr({ [internal]: true }).localName).toBe("")
  expect(new Attr({ [internal]: true, localName: "foo" })).toHaveProperty("localName", "foo")
  expect(new Attr({ [internal]: true, localName: "foo" })).toHaveImmutableProperty("localName")
})

test()("`Attr.namespaceURI` is supported", () => {
  expect(new Attr({ [internal]: true }).namespaceURI).toBeNull()
  expect(new Attr({ [internal]: true, namespaceURI: "foo" })).toHaveProperty("namespaceURI", "foo")
  expect(new Attr({ [internal]: true, namespaceURI: "foo" })).toHaveImmutableProperty("namespaceURI")
})

test()("`Attr.specified` is supported", () => {
  expect(new Attr({ [internal]: true })).toHaveProperty("specified", false)
  expect(new Attr({ [internal]: true })).toHaveImmutableProperty("specified")
})
