import { expect, test, type testing } from "@libs/testing"
import { internal } from "./_.ts"
import { Window } from "./window.ts"
import { yellow } from "@std/fmt/colors"
import { Document } from "./document.ts"
import { Attr } from "./attr.ts"

test()(`Document.constructor() is legal`, () => {
  new Document()
})

test()(`Document.ownerDocument is null`, () => {
  expect(new Document()).toHaveProperty("ownerDocument", null)
  expect(new Document()).toHaveImmutableProperty("ownerDocument")
})

test()(`Document.title is supported`, () => {
  const document = new Document()
  expect(document).toHaveProperty("title", "")
  document.title = "foo"
  expect(document).toHaveProperty("title", "foo")
  document.title = 1 as testing
  expect(document).toHaveProperty("title", "1")
})

test()(yellow(`Document.location is unimplemented`), () => {
  expect(() => new Document().location).toThrow(DOMException)
})

test()(yellow(`Document.domain is unimplemented`), () => {
  expect(() => new Document().domain).toThrow(DOMException)
})

test()(yellow(`Document.documentURI is unimplemented`), () => {
  expect(() => new Document().documentURI).toThrow(DOMException)
})

test()(yellow(`Document.URL is unimplemented`), () => {
  expect(() => new Document().URL).toThrow(DOMException)
})

test()(`Document.characterSet is "UTF-8"`, () => {
  expect(new Document()).toHaveProperty("characterSet", "UTF-8")
  expect(new Document()).toHaveImmutableProperty("characterSet")
})

for (const property of ["charset", "inputEncoding"] as const) {
  test()(`Document.${property} is alias for Document.characterSet`, () => {
    expect(new Document()).toHaveProperty(property, "UTF-8")
    expect(new Document()).toHaveImmutableProperty(property)
  })
}

test()(`Document.characterSet is supported`, () => {
  expect(new Document().compatMode).toBeOneOf(["BackCompat", "CSS1Compat"])
  expect(new Document()).toHaveImmutableProperty("compatMode")
})

test()(`Document.contentType is "UTF-8"`, () => {
  expect(new Document()).toHaveProperty("contentType", "text/html")
  expect(new Document()).toHaveImmutableProperty("contentType")
})

test()(yellow(`Document.cookie is partially unimplemented`), () => {
  expect(new Document()).toHaveProperty("cookie", "")
  expect(() => new Document().cookie = "foo").toThrow(DOMException)
})

test()(`Document.designMode is supported`, () => {
  const document = new Document()
  expect(document).toHaveProperty("designMode", "off")
  document.designMode = "on"
  expect(document).toHaveProperty("designMode", "on")
  document.designMode = "foo" as testing
  expect(document).toHaveProperty("designMode", "on")
})

test()(`Document.hidden is false`, () => {
  expect(new Document()).toHaveProperty("hidden", false)
  expect(new Document()).toHaveImmutableProperty("hidden")
})

test()(`Document.visibilityState is supported`, () => {
  expect(new Document()).toHaveProperty("visibilityState", "visible")
  expect(new Document()).toHaveImmutableProperty("visibilityState")
})

test()(yellow(`Document.onvisibilitychange is unimplemented`), () => {
  expect(new Document().onvisibilitychange).toBeNull()
})

test()(`Document.fullscreen is supported`, () => {
  expect(new Document()).toHaveProperty("fullscreen", false)
  expect(new Document()).toHaveImmutableProperty("fullscreen")
})

test()(`Document.fullscreenEnabled is supported`, () => {
  expect(new Document()).toHaveProperty("fullscreenEnabled", false)
  expect(new Document()).toHaveImmutableProperty("fullscreenEnabled")
})

test()(`Document.pictureInPictureEnabled is supported`, () => {
  expect(new Document()).toHaveProperty("pictureInPictureEnabled", false)
  expect(new Document()).toHaveImmutableProperty("pictureInPictureEnabled")
})

test()(`Document.referrer is supported`, () => {
  expect(new Document()).toHaveProperty("referrer", "")
  expect(new Document()).toHaveImmutableProperty("referrer")
})

test()(yellow(`Document.hasFocus() is unimplemented`), () => {
  expect(() => new Document().hasFocus()).toThrow(DOMException)
})

test()(yellow(`Document.styleSheets is unimplemented`), () => {
  expect(() => new Document().styleSheets).toThrow(DOMException)
})

test()(yellow(`Document.styleSheetSets is unimplemented`), () => {
  expect(() => new Document().styleSheetSets).toThrow(DOMException)
})

test()(yellow(`Document.adoptedStyleSheets is unimplemented`), () => {
  expect(new Document().adoptedStyleSheets).toEqual([])
  expect(new Document()).toHaveImmutableProperty("adoptedStyleSheets")
})

test()(yellow(`Document.selectedStyleSheetSet is supported`), () => {
  expect(new Document()).toHaveProperty("selectedStyleSheetSet", null)
  expect(new Document()).toHaveImmutableProperty("selectedStyleSheetSet")
})

test()(yellow(`Document.lastStyleSheetSet is supported`), () => {
  expect(new Document()).toHaveProperty("lastStyleSheetSet", null)
  expect(new Document()).toHaveImmutableProperty("lastStyleSheetSet")
})

test()(yellow(`Document.enableStyleSheetsForSet() is unimplemented`), () => {
  expect(new Document().enableStyleSheetsForSet).toThrow(DOMException)
})

test()(yellow(`Document.preferredStyleSheetSet is supported`), () => {
  expect(new Document()).toHaveProperty("preferredStyleSheetSet", "")
  expect(new Document()).toHaveImmutableProperty("preferredStyleSheetSet")
})

test()(yellow(`Document.mozSetImageElement() is unimplemented`), () => {
  expect(new Document().mozSetImageElement).toThrow(DOMException)
})

test()(yellow(`Document.getAnimations() is unimplemented`), () => {
  expect(new Document().getAnimations).toThrow(DOMException)
})

test()(yellow(`Document.startViewTransition() is unimplemented`), () => {
  expect(new Document().startViewTransition).toThrow(DOMException)
})

test()(yellow(`Document.timeline is unimplemented`), () => {
  expect(() => new Document().timeline).toThrow(DOMException)
})

test()(yellow(`Document.fonts is unimplemented`), () => {
  expect(() => new Document().fonts).toThrow(DOMException)
})

for (const property of ["alinkColor", "linkColor", "vlinkColor", "bgColor", "fgColor"] as const) {
  test()(`Document.${property} is supported`, () => {
    const document = new Document()
    expect(document).toHaveProperty(property, "")
    document[property] = "rebeccapurple"
    expect(document).toHaveProperty(property, "rebeccapurple")
  })
}

test()(`Document.dir is supported`, () => {
  const document = new Document()
  expect(document).toHaveProperty("dir", "")
  document.dir = "ltr"
  expect(document).toHaveProperty("dir", "ltr")
  document.dir = "rtl"
  expect(document).toHaveProperty("dir", "rtl")
  document.dir = "foo" as testing
  expect(document).toHaveProperty("dir", "rtl")
})

test()(yellow(`Document.readyState is unimplemented`), () => {
  expect(() => new Document().readyState).toThrow(DOMException)
})

test()(yellow(`Document.open() is unimplemented`), () => {
  expect(new Document().open).toThrow(DOMException)
})

test()(yellow(`Document.close() is unimplemented`), () => {
  expect(new Document().close).toThrow(DOMException)
  expect(() => {
    using _ = new Document()
  }).toThrow(DOMException)
})

test()(`Document.clear() is supported`, () => {
  expect(new Document().clear()).toBeUndefined()
})

test()(yellow(`Document.write() is unimplemented`), () => {
  expect(new Document().write).toThrow(DOMException)
})

test()(yellow(`Document.writeln() is unimplemented`), () => {
  expect(new Document().writeln).toThrow(DOMException)
})

test()(yellow(`Document.lastModified is unimplemented`), () => {
  expect(() => new Document().lastModified).toThrow(DOMException)
})

test()(yellow(`Document.prototype.parseHTMLUnsafe() is unimplemented`), () => {
  expect(Document.parseHTMLUnsafe).toThrow(DOMException)
})

test()(yellow(`Document.defaultView is supported`), () => {
  expect(new Document()).toHaveProperty("defaultView", null)
  expect(new Document()).toHaveImmutableProperty("defaultView")
  const window = new Window()
  const document = new Document({ [internal]: true, defaultView: window })
  expect(document).toHaveProperty("defaultView", window)
  expect(document).toHaveImmutableProperty("defaultView")
})

test()(yellow(`Document.doctype is unimplemented`), () => {
  expect(() => new Document().doctype).toThrow(DOMException)
})

test()(yellow(`Document.head is unimplemented`), () => {
  expect(() => new Document().head).toThrow(DOMException)
})

test()(yellow(`Document.body is unimplemented`), () => {
  expect(() => new Document().body).toThrow(DOMException)
})

test()(yellow(`Document.all is unimplemented`), () => {
  expect(() => new Document().all).toThrow(DOMException)
})

test()(yellow(`Document.anchors is unimplemented`), () => {
  expect(() => new Document().anchors).toThrow(DOMException)
})

test()(yellow(`Document.links is unimplemented`), () => {
  expect(() => new Document().links).toThrow(DOMException)
})

test()(yellow(`Document.images is unimplemented`), () => {
  expect(() => new Document().images).toThrow(DOMException)
})

test()(yellow(`Document.forms is unimplemented`), () => {
  expect(() => new Document().forms).toThrow(DOMException)
})

test()(yellow(`Document.scripts is unimplemented`), () => {
  expect(() => new Document().scripts).toThrow(DOMException)
})

test()(yellow(`Document.embeds is unimplemented`), () => {
  expect(() => new Document().embeds).toThrow(DOMException)
})

test()(yellow(`Document.applets is unimplemented`), () => {
  expect(() => new Document().applets).toThrow(DOMException)
})

test()(yellow(`Document.plugins is unimplemented`), () => {
  expect(() => new Document().plugins).toThrow(DOMException)
})

test()(`Document.rootElement is supported`, () => {
  expect(new Document()).toHaveProperty("rootElement", null)
  expect(new Document()).toHaveImmutableProperty("rootElement")
})

test()(yellow(`Document.documentElement is unimplemented`), () => {
  expect(() => new Document().documentElement).toThrow(DOMException)
})

test()(`Document.activeElement is supported`, () => {
  expect(new Document()).toHaveProperty("activeElement", null)
  expect(new Document()).toHaveImmutableProperty("activeElement")
})

test()(yellow(`Document.scrollingElement is unimplemented`), () => {
  expect(() => new Document().scrollingElement).toThrow(DOMException)
})

test()(`Document.fullscreenElement is supported`, () => {
  expect(new Document()).toHaveProperty("fullscreenElement", null)
  expect(new Document()).toHaveImmutableProperty("fullscreenElement")
})

test()(`Document.pictureInPictureElement is supported`, () => {
  expect(new Document()).toHaveProperty("pictureInPictureElement", null)
  expect(new Document()).toHaveImmutableProperty("pictureInPictureElement")
})

test()(`Document.pointerLockElement is supported`, () => {
  expect(new Document()).toHaveProperty("pointerLockElement", null)
  expect(new Document()).toHaveImmutableProperty("pointerLockElement")
})

test()(`Document.currentScript is supported`, () => {
  expect(new Document()).toHaveProperty("currentScript", null)
  expect(new Document()).toHaveImmutableProperty("currentScript")
})

test()(yellow(`Document.implementation is unimplemented`), () => {
  expect(() => new Document().implementation).toThrow(DOMException)
})

test()(yellow(`Document.children is unimplemented`), () => {
  expect(() => new Document().children).toThrow(DOMException)
})

test()(`Document.childElementCount is supported`, () => {
  expect(new Document()).toHaveProperty("childElementCount", 1)
  expect(new Document()).toHaveImmutableProperty("childElementCount")
})

test()(yellow(`Document.firstElementChild is unimplemented`), () => {
  expect(() => new Document().firstElementChild).toThrow(DOMException)
})

test()(yellow(`Document.lastElementChild is unimplemented`), () => {
  expect(() => new Document().lastElementChild).toThrow(DOMException)
})

test()(yellow(`Document.adoptNode() is unimplemented`), () => {
  expect(new Document().adoptNode).toThrow(DOMException)
})

test()(yellow(`Document.importNode() is unimplemented`), () => {
  expect(new Document().importNode).toThrow(DOMException)
})

test()(yellow(`Document.append() is unimplemented`), () => {
  expect(new Document().append).toThrow(DOMException)
})

test()(yellow(`Document.prepend() is unimplemented`), () => {
  expect(new Document().prepend).toThrow(DOMException)
})

test()(yellow(`Document.replaceChildren() is unimplemented`), () => {
  expect(new Document().replaceChildren).toThrow(DOMException)
})

test()(yellow(`Document.createRange() is unimplemented`), () => {
  expect(new Document().createRange).toThrow(DOMException)
})

test()(yellow(`Document.caretRangeFromPoint() is unimplemented`), () => {
  expect(new Document().caretRangeFromPoint).toThrow(DOMException)
})

test()(yellow(`Document.caretPositionFromPoint() is unimplemented`), () => {
  expect(new Document().caretPositionFromPoint).toThrow(DOMException)
})

test()(`Document.createAttribute() is supported`, () => {
  const document = new Document()
  const attr = document.createAttribute("foo")
  expect(attr).toBeInstanceOf(Attr)
  expect(attr).toHaveProperty("ownerDocument", document)
  expect(attr).toHaveProperty("ownerElement", null)
  expect(attr).toHaveProperty("namespaceURI", null)
  expect(attr).toHaveProperty("localName", "foo")
})

test()(`Document.createAttributeNS() is supported`, () => {
  const document = new Document()
  const attr = document.createAttributeNS("foo", "bar")
  expect(attr).toBeInstanceOf(Attr)
  expect(attr).toHaveProperty("ownerDocument", document)
  expect(attr).toHaveProperty("ownerElement", null)
  expect(attr).toHaveProperty("namespaceURI", "foo")
  expect(attr).toHaveProperty("localName", "bar")
})

test()(yellow(`Document.createDocumentFragment() is unimplemented`), () => {
  expect(new Document().createDocumentFragment).toThrow(DOMException)
})

test()(yellow(`Document.createProcessingInstruction() is unimplemented`), () => {
  expect(new Document().createProcessingInstruction).toThrow(DOMException)
})

test()(yellow(`Document.createComment() is unimplemented`), () => {
  expect(new Document().createComment).toThrow(DOMException)
})

test()(yellow(`Document.createCDATASection() is unimplemented`), () => {
  expect(new Document().createCDATASection).toThrow(DOMException)
})

test()(yellow(`Document.createTextNode() is unimplemented`), () => {
  expect(new Document().createTextNode).toThrow(DOMException)
})

test()(yellow(`Document.createTreeWalker() is unimplemented`), () => {
  expect(new Document().createTreeWalker).toThrow(DOMException)
})

test()(yellow(`Document.createNodeIterator() is unimplemented`), () => {
  expect(new Document().createNodeIterator).toThrow(DOMException)
})

test()(yellow(`Document.createElement() is unimplemented`), () => {
  expect(new Document().createElement).toThrow(DOMException)
})

test()(yellow(`Document.createElementNS() is unimplemented`), () => {
  expect(new Document().createElementNS).toThrow(DOMException)
})

test()(yellow(`Document.createEvent() is unimplemented`), () => {
  expect(new Document().createEvent).toThrow(DOMException)
})

test()(yellow(`Document.createExpression() is unimplemented`), () => {
  expect(new Document().createExpression).toThrow(DOMException)
})

test()(yellow(`Document.createNSResolver() is unimplemented`), () => {
  expect(new Document().createNSResolver).toThrow(DOMException)
})

test()(yellow(`Document.evaluate() is unimplemented`), () => {
  expect(new Document().evaluate).toThrow(DOMException)
})

test()(yellow(`Document.querySelector() is unimplemented`), () => {
  expect(new Document().querySelector).toThrow(DOMException)
})

test()(yellow(`Document.querySelectorAll() is unimplemented`), () => {
  expect(new Document().querySelectorAll).toThrow(DOMException)
})

test()(yellow(`Document.getElementById() is unimplemented`), () => {
  expect(new Document().getElementById).toThrow(DOMException)
})

test()(yellow(`Document.getElementsByClassName() is unimplemented`), () => {
  expect(new Document().getElementsByClassName).toThrow(DOMException)
})

test()(yellow(`Document.getElementsByName() is unimplemented`), () => {
  expect(new Document().getElementsByName).toThrow(DOMException)
})

test()(yellow(`Document.getElementsByTagName() is unimplemented`), () => {
  expect(new Document().getElementsByTagName).toThrow(DOMException)
})

test()(yellow(`Document.getElementsByTagNameNS() is unimplemented`), () => {
  expect(new Document().getElementsByTagNameNS).toThrow(DOMException)
})

test()(yellow(`Document.getSelection() is unimplemented`), () => {
  expect(new Document().getSelection).toThrow(DOMException)
})

test()(yellow(`Document.elementFromPoint() is unimplemented`), () => {
  expect(new Document().elementFromPoint).toThrow(DOMException)
})

test()(yellow(`Document.elementsFromPoint() is unimplemented`), () => {
  expect(new Document().elementsFromPoint).toThrow(DOMException)
})

test()(yellow(`Document.queryCommandSupported() is unimplemented`), () => {
  expect(new Document().queryCommandSupported).toThrow(DOMException)
})

test()(yellow(`Document.queryCommandEnabled() is unimplemented`), () => {
  expect(new Document().queryCommandEnabled).toThrow(DOMException)
})

test()(yellow(`Document.queryCommandState() is unimplemented`), () => {
  expect(new Document().queryCommandState).toThrow(DOMException)
})

test()(yellow(`Document.queryCommandIndeterm() is unimplemented`), () => {
  expect(new Document().queryCommandIndeterm).toThrow(DOMException)
})

test()(yellow(`Document.queryCommandValue() is unimplemented`), () => {
  expect(new Document().queryCommandValue).toThrow(DOMException)
})

test()(yellow(`Document.execCommand() is unimplemented`), () => {
  expect(new Document().execCommand).toThrow(DOMException)
})

test()(yellow(`Document.requestStorageAccess() is unimplemented`), () => {
  expect(new Document().requestStorageAccess).toThrow(DOMException)
})

test()(yellow(`Document.hasStorageAccess() is unimplemented`), () => {
  expect(new Document().hasStorageAccess).toThrow(DOMException)
})

test()(yellow(`Document.hasUnpartitionedCookieAccess() is unimplemented`), () => {
  expect(new Document().hasUnpartitionedCookieAccess).toThrow(DOMException)
})

test()(yellow(`Document.exitFullscreen() is unimplemented`), () => {
  expect(new Document().exitFullscreen).toThrow(DOMException)
})

test()(yellow(`Document.exitPictureInPicture() is unimplemented`), () => {
  expect(new Document().exitPictureInPicture).toThrow(DOMException)
})

test()(yellow(`Document.exitPointerLock() is unimplemented`), () => {
  expect(new Document().exitPointerLock).toThrow(DOMException)
})

test()(yellow(`Document.captureEvents() is unimplemented`), () => {
  expect(new Document().captureEvents).toThrow(DOMException)
})

test()(yellow(`Document.releaseEvents() is unimplemented`), () => {
  expect(new Document().releaseEvents).toThrow(DOMException)
})

test()(yellow(`Document.releaseCapture() is unimplemented`), () => {
  expect(new Document().releaseCapture).toThrow(DOMException)
})

for (const property of [] as const) {
  test()(yellow(`Document.${property} is unimplemented`), () => {
    expect(new Document()[property]).toBeNull()
  })
}
