import { expect, fn, test, type testing } from "@libs/testing"
import { internal } from "./_.ts"
import { Node, NodeList } from "./node.ts"
import { Document } from "./document.ts"
import { yellow } from "@std/fmt/colors"

test()(`Node.constructor() is illegal`, () => {
  expect(() => new Node()).toThrow(TypeError)
  new Node({ [internal]: true })
})

test()(`Node[Symbol.toStringTag] is supported`, () => {
  expect(`${new Node({ [internal]: true })}`).toMatch(/Node/)
  expect(`${new (class Test extends Node {})({ [internal]: true })}`).toMatch(/Test/)
})

test()(`Node.ownerDocument is supported`, () => {
  const document = new Document({ [internal]: true })
  expect(new Node({ [internal]: true })).toHaveProperty("ownerDocument", null)
  expect(new Node({ [internal]: true, ownerDocument: document })).toHaveProperty("ownerDocument", document)
  expect(new Node({ [internal]: true, ownerDocument: document })).toHaveImmutableProperty("ownerDocument")
})

test()(yellow(`Node.isConnected is unimplemented`), () => {
  expect(() => new Node({ [internal]: true }).isConnected).toThrow(DOMException)
})

test()(yellow(`Node.baseURI is unimplemented`), () => {
  expect(() => new Node({ [internal]: true }).baseURI).toThrow(DOMException)
})

test()(`Node.nodeName is supported`, () => {
  expect(new Node({ [internal]: true })).toHaveProperty("nodeName", "")
  expect(new Node({ [internal]: true, nodeName: "DIV" })).toHaveProperty("nodeName", "DIV")
  expect(new Node({ [internal]: true, nodeName: "div" })).toHaveProperty("nodeName", "DIV")
  expect(new Node({ [internal]: true, nodeName: "div" })).toHaveImmutableProperty("nodeName")
})

test()(`Node.nodeValue is supported`, () => {
  expect(new Node({ [internal]: true })).toHaveProperty("nodeValue", "")
  expect(new Node({ [internal]: true, nodeValue: "foo" })).toHaveProperty("nodeValue", "foo")
  expect(new Node({ [internal]: true, nodeValue: "foo" })).toHaveImmutableProperty("nodeValue")
})

test()(`Node.textContent is supported`, () => {
  expect(new Node({ [internal]: true })).toHaveProperty("textContent", null)
  expect(new Node({ [internal]: true })).toHaveImmutableProperty("textContent")
})

test()(`Node.parentNode is supported`, () => {
  const parent = new Node({ [internal]: true }) as testing
  expect(new Node({ [internal]: true })).toHaveProperty("parentNode", null)
  expect(new Node({ [internal]: true, parentNode: parent })).toHaveProperty("parentNode", parent)
  expect(new Node({ [internal]: true, parentNode: parent })).toHaveImmutableProperty("parentNode")
})

test()(`Node.parentElement is supported`, () => {
  expect(new Node({ [internal]: true })).toHaveProperty("parentElement", null)
  expect(new Node({ [internal]: true })).toHaveImmutableProperty("parentElement")
})

test()(`Node.childNodes is supported`, () => {
  expect(new Node({ [internal]: true }).childNodes).toBeInstanceOf(NodeList)
  expect(new Node({ [internal]: true })).toHaveImmutableProperty("childNodes")
})

test()(`Node.firstChild() is supported`, () => {
  const node = new Node({ [internal]: true })
  const [a, b] = [new Node({ [internal]: true }), new Node({ [internal]: true })]
  expect(node.firstChild).toBeNull()
  node.appendChild(a)
  node.appendChild(b)
  expect(node.childNodes.length).toBe(2)
  expect(node.firstChild).toBe(a)
  expect(node).toHaveImmutableProperty("firstChild")
})

test()(`Node.lastChild() is supported`, () => {
  const node = new Node({ [internal]: true })
  const [a, b] = [new Node({ [internal]: true }), new Node({ [internal]: true })]
  expect(node.lastChild).toBeNull()
  node.appendChild(a)
  node.appendChild(b)
  expect(node.childNodes.length).toBe(2)
  expect(node.lastChild).toBe(b)
  expect(node).toHaveImmutableProperty("lastChild")
})

test()(yellow(`Node.previousSibling is unimplemented`), () => {
  expect(new Node({ [internal]: true })).toHaveProperty("previousSibling", null)
  expect(new Node({ [internal]: true })).toHaveImmutableProperty("previousSibling")
})

test()(yellow(`Node.nextSibling is unimplemented`), () => {
  expect(new Node({ [internal]: true })).toHaveProperty("nextSibling", null)
  expect(new Node({ [internal]: true })).toHaveImmutableProperty("nextSibling")
})

test()(`Node.appendChild() is supported`, () => {
  const [a, b, c, d] = [new Node({ [internal]: true }), new Node({ [internal]: true }), new Node({ [internal]: true }), new Node({ [internal]: true })]
  expect(() => a.appendChild(a)).toThrow(DOMException)
  expect(Array.from(a.childNodes)).toEqual([])
  a.appendChild(b)
  expect(b.parentNode).toBe(a)
  expect(Array.from(a.childNodes)).toEqual([b])
  //expect(() => b.appendChild(a)).toThrow(DOMException)
  c.appendChild(d)
  expect(d.parentNode).toBe(c)
  expect(Array.from(c.childNodes)).toEqual([d])
  //a.appendChild(d)
  // TODO(@lowlighter): splice actually uses the same constructor but since it doesn't pase the internal symbol it will throw
  /*expect(c.parentNode).toBe(a)
  expect(Array.from(a.childNodes)).toEqual([b, c])
  expect(Array.from(b.childNodes)).toEqual([])*/
})

test.skip()(yellow(`Node.removeChild() is unimplemented`), () => {
  expect(new Node({ [internal]: true }).removeChild).toThrow(DOMException)
})

test()(yellow(`Node.replaceChild() is unimplemented`), () => {
  expect(new Node({ [internal]: true }).replaceChild).toThrow(DOMException)
})

test()(yellow(`Node.insertBefore() is unimplemented`), () => {
  expect(new Node({ [internal]: true }).insertBefore).toThrow(DOMException)
})

test()(yellow(`Node.cloneNode() is unimplemented`), () => {
  expect(new Node({ [internal]: true }).cloneNode).toThrow(DOMException)
})

test()(`Node.hasChildNodes() is supported`, () => {
  const node = new Node({ [internal]: true })
  expect(node.hasChildNodes()).toBe(false)
  node.appendChild(new Node({ [internal]: true }))
  expect(node.hasChildNodes()).toBe(true)
})

test()(yellow(`Node.contains() is unimplemented`), () => {
  expect(new Node({ [internal]: true }).contains).toThrow(DOMException)
})

test()(yellow(`Node.isEqualNode() is unimplemented`), () => {
  expect(new Node({ [internal]: true }).isEqualNode).toThrow(DOMException)
})

test()(yellow(`Node.isSameNode() is unimplemented`), () => {
  expect(new Node({ [internal]: true }).isSameNode).toThrow(DOMException)
})

test()(yellow(`Node.isDefaultNamespace() is unimplemented`), () => {
  expect(new Node({ [internal]: true }).isDefaultNamespace).toThrow(DOMException)
})

test()(yellow(`Node.lookupPrefix() is unimplemented`), () => {
  expect(new Node({ [internal]: true }).lookupPrefix).toThrow(DOMException)
})

test()(yellow(`Node.lookupNamespaceURI() is unimplemented`), () => {
  expect(new Node({ [internal]: true }).lookupNamespaceURI).toThrow(DOMException)
})

test()(yellow(`Node.compareDocumentPosition() is unimplemented`), () => {
  expect(new Node({ [internal]: true }).compareDocumentPosition).toThrow(DOMException)
})

test()(yellow(`Node.getRootNode() is unimplemented`), () => {
  expect(new Node({ [internal]: true }).getRootNode).toThrow(DOMException)
})

test()(yellow(`Node.normalize() is unimplemented`), () => {
  expect(new Node({ [internal]: true }).normalize).toThrow(DOMException)
})

test()(`Node.nodeType is supported`, () => {
  expect(new Node({ [internal]: true }).nodeType).toBeNaN()
  expect(new Node({ [internal]: true })).toHaveImmutableProperty("nodeType")
})

for (
  const [property, value] of [
    ["ELEMENT_NODE", 1],
    ["ATTRIBUTE_NODE", 2],
    ["TEXT_NODE", 3],
    ["CDATA_SECTION_NODE", 4],
    ["ENTITY_REFERENCE_NODE", 5],
    ["ENTITY_NODE", 6],
    ["PROCESSING_INSTRUCTION_NODE", 7],
    ["COMMENT_NODE", 8],
    ["DOCUMENT_NODE", 9],
    ["DOCUMENT_TYPE_NODE", 10],
    ["DOCUMENT_FRAGMENT_NODE", 11],
    ["NOTATION_NODE", 12],
    ["DOCUMENT_POSITION_DISCONNECTED", 1],
    ["DOCUMENT_POSITION_PRECEDING", 2],
    ["DOCUMENT_POSITION_FOLLOWING", 4],
    ["DOCUMENT_POSITION_CONTAINS", 8],
    ["DOCUMENT_POSITION_CONTAINED_BY", 16],
    ["DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", 32],
  ] as const
) {
  test()(`Document.${property} is supported`, () => {
    const node = new Node({ [internal]: true })
    expect(node).toHaveProperty(property, value)
    expect(node).toHaveImmutableProperty(property)
    expect(Node).toHaveProperty(property, value)
    expect(Node).toHaveImmutableProperty(property)
  })
}

test()(`NodeList.constructor() is illegal`, () => {
  expect(() => new NodeList()).toThrow(TypeError)
  new NodeList({ [internal]: true })
})

test()(`NodeList.item() is supported`, () => {
  const list = new NodeList({ [internal]: true })
  const node = new Node({ [internal]: true })
  expect(list.item(0)).toBeNull()
  list[internal].push(node)
  expect(list.item(0)).toBe(node)
})

test()(`NodeList[] is supported`, () => {
  const list = new NodeList({ [internal]: true })
  const node = new Node({ [internal]: true })
  expect(list[0]).toBeUndefined()
  list[internal].push(node)
  expect(list[0]).toBe(node)
})

test()(`NodeList.forEach() is supported`, () => {
  const callback = fn() as testing
  const list = new NodeList({ [internal]: true })
  const node = new Node({ [internal]: true })
  list[internal].push(node)
  list.forEach(callback)
  expect(callback).toHaveBeenCalledWith(node, 0, list)
})
