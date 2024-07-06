import { expect, fn, test, type testing } from "@libs/testing"
import { internal } from "./_.ts"
import { BarProp, Window } from "./window.ts"
import { Navigator } from "./navigator.ts"
import { yellow } from "@std/fmt/colors"
import { delay } from "jsr:@std/async@0.224.2/delay"

test()(`Window.constructor() is legal`, () => {
  new Window()
})

test()(`Window.navigator is instanceof Navigator`, () => {
  expect(new Window().navigator).toBeInstanceOf(Navigator)
  expect(new Window()).toBeImmutable("navigator")
})

test()(`Window.clientInformation is alias for Window.navigator`, () => {
  const window = new Window()
  expect(window.clientInformation).toBe(window.navigator)
  expect(window).toBeImmutable("clientInformation")
})

for (const bar of ["locationbar", "menubar", "personalbar", "scrollbars", "statusbar", "toolbar"] as const) {
  test()(`Window.${bar} is supported`, () => {
    expect(new Window()[bar]).toBeInstanceOf(BarProp)
    expect(new Window()[bar]).not.toBeImmutable(bar)
  })
}

test()(yellow(`Window.onlanguagechange is unimplemented`), () => {
  expect(new Window().onlanguagechange).toBeNull()
})

test()(`Window.name is supported`, () => {
  const window = new Window()
  expect(window).toHaveProperty("name", "")
  window.name = "foo"
  expect(window).toHaveProperty("name", "foo")
  window.name = 1 as testing
  expect(window).toHaveProperty("name", "1")
})

test()(yellow("Window.document is unimplemented"), () => {
  expect(() => new Window().document).toThrow(DOMException)
})

test()(`Window.frameElement is supported`, () => {
  expect(new Window()).toHaveProperty("frameElement", null)
  expect(new Window()).toBeImmutable("frameElement")
})

test()(`Window.window is supported`, () => {
  const window = new Window()
  expect(window).toHaveProperty("window", window)
  expect(window).toBeImmutable("window")
})

for (const property of ["self", "frames"] as const) {
  test()(`Window.${property} is alias for itself`, () => {
    const window = new Window()
    expect(window[property]).toBe(window)
    expect(window).not.toBeImmutable(property)
  })
}

test()(`Window.opener is null`, () => {
  expect(new Window().opener).toBeNull()
  expect(new Window()).not.toBeImmutable("opener")
})

test()(`Window.length is 0`, () => {
  expect(new Window().length).toBe(0)
  expect(new Window()).not.toBeImmutable("length")
})

for (const property of ["top", "parent"] as const) {
  test()(`Window.${property} is alias for itself`, () => {
    const window = new Window()
    expect(window[property]).toBe(window)
    expect(window).toBeImmutable(property)
  })
}
test()(yellow("Window.customElements is unimplemented"), () => {
  expect(() => new Window().customElements).toThrow(DOMException)
})

test()(`Window.focus() is supported`, () => {
  expect(new Window().focus()).toBeUndefined()
})

test()(`Window.blur() is supported`, () => {
  expect(new Window().blur()).toBeUndefined()
})

test()(`Window.alert() is supported`, () => {
  expect(new Window().alert("foo")).toBeUndefined()
})

for (const property of ["onfocus", "onblur"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

for (const property of ["innerHeight", "innerWidth", "outerHeight", "outerWidth"] as const) {
  test()(`Window.${property} is supported`, () => {
    expect(new Window()).toHaveProperty(property, 0)
    expect(new Window()).not.toBeImmutable(property)
  })
}
for (const property of ["mozInnerScreenX", "mozInnerScreenY"] as const) {
  test()(`Window.${property} is supported`, () => {
    expect(new Window()).toHaveProperty(property, 0)
    expect(new Window()).toBeImmutable(property)
  })
}

test()(`Window.setRezizable() is supported`, () => {
  expect(new Window().setRezizable()).toBeUndefined()
})

test()(`Window.resizeBy() is supported`, () => {
  const window = new Window()
  expect(() => (window as testing).resizeBy()).toThrow(TypeError)
  expect(window.resizeBy(0, 0)).toBeUndefined()
})

test()(`Window.resizeTo() is supported`, () => {
  const window = new Window()
  expect(() => (window as testing).resizeTo()).toThrow(TypeError)
  expect(window.resizeTo(0, 0)).toBeUndefined()
})

test()(yellow(`Window.onresize is unimplemented`), () => {
  expect(new Window().onresize).toBeNull()
})

test()(yellow(`Window.screen is unimplemented`), () => {
  expect(() => new Window().screen).toThrow(DOMException)
})

for (const property of ["screenX", "screenY", "screenLeft", "screenTop"] as const) {
  test()(`Window.${property} is supported`, () => {
    expect(new Window()).toHaveProperty(property, 0)
    expect(new Window()).not.toBeImmutable(property)
  })
}

test()(`Window.moveBy() is supported`, () => {
  const window = new Window()
  expect(() => (window as testing).moveBy()).toThrow(TypeError)
  expect(window.moveBy(0, 0)).toBeUndefined()
})

test()(`Window.moveTo() is supported`, () => {
  const window = new Window()
  expect(() => (window as testing).moveTo()).toThrow(TypeError)
  expect(window.moveTo(0, 0)).toBeUndefined()
})

for (const property of ["scrollX", "scrollY", "pageXOffset", "pageYOffset", "scrollMaxX", "scrollMaxY"] as const) {
  test()(`Window.${property} is supported`, () => {
    expect(new Window()).toHaveProperty(property, 0)
    expect(new Window()).not.toBeImmutable(property)
  })
}

test()(yellow(`Window.scroll() is supported`), () => {
  expect(new Window().scroll).toThrow(DOMException)
})

test()(yellow(`Window.scrollTo() is supported`), () => {
  expect(new Window().scrollTo).toThrow(DOMException)
})

test()(yellow(`Window.scrollBy() is supported`), () => {
  expect(new Window().scrollBy).toThrow(DOMException)
})

test()(yellow(`Window.scrollByLines() is supported`), () => {
  expect(new Window().scrollByLines).toThrow(DOMException)
})

test()(yellow(`Window.scrollByPages() is supported`), () => {
  expect(new Window().scrollByPages).toThrow(DOMException)
})

for (const property of ["onscroll", "onscrollend"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

test()(`Window.orientation is supported`, () => {
  expect(new Window()).toHaveProperty("orientation", 0)
  expect(new Window()).toBeImmutable("orientation")
})

for (const property of ["ondevicemotion", "ondeviceorientation", "onorientationchange", "ondeviceorientationabsolute"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

test()(`Window.setTimeout() is supported`, async () => {
  using win = new Window()
  const handler = fn()
  win.setTimeout("")
  win.setTimeout(handler, 15, "foo")
  expect(handler).not.toBeCalled()
  await delay(30)
  expect(handler).toBeCalledWith("foo")
})

test()(`Window.clearTimeout() is supported`, async () => {
  using win = new Window()
  const handler = fn()
  const id = win.setTimeout(handler, 15)
  win.clearTimeout(id)
  await delay(30)
  expect(handler).not.toBeCalled()
})

test()(`Window.setInterval() is supported`, async () => {
  using win = new Window()
  const handler = fn()
  win.setInterval("")
  win.setInterval(handler, 15, "foo")
  expect(handler).not.toBeCalled()
  await delay(30)
  expect(handler).toBeCalledWith("foo")
})

test()(`Window.clearInterval() is supported`, async () => {
  using win = new Window()
  const handler = fn()
  const id = win.setInterval(handler, 15)
  win.clearInterval(id)
  await delay(30)
  expect(handler).not.toBeCalled()
})

test()(yellow(`Window.queueMicrotask() is unimplemented`), () => {
  expect(new Window().queueMicrotask).toThrow(DOMException)
})

test()(yellow(`Window.visualViewport is unimplemented`), () => {
  expect(() => new Window().visualViewport).toThrow(DOMException)
})

test()(`Window.devicePixelRatio is 1`, () => {
  expect(new Window()).toHaveProperty("devicePixelRatio", 1)
  expect(new Window()).not.toBeImmutable("devicePixelRatio")
})

test()(`Window.fullScreen is false`, () => {
  const window = new Window()
  expect(window.fullScreen).toBe(false)
  expect(window).toBeImmutable("fullScreen")
})

test()(yellow(`Window.requestAnimationFrame() is unimplemented`), () => {
  expect(new Window().requestAnimationFrame).toThrow(DOMException)
})

test()(yellow(`Window.cancelAnimationFrame() is unimplemented`), () => {
  expect(new Window().cancelAnimationFrame).toThrow(DOMException)
})

test()(yellow(`Window.requestIdleCallback() is unimplemented`), () => {
  expect(new Window().requestIdleCallback).toThrow(DOMException)
})

test()(yellow(`Window.cancelIdleCallback() is unimplemented`), () => {
  expect(new Window().cancelIdleCallback).toThrow(DOMException)
})

test()(yellow(`Window.getComputedStyle() is unimplemented`), () => {
  expect(new Window().getComputedStyle).toThrow(DOMException)
})

test()(yellow(`Window.getDefaultComputedStyle() is unimplemented`), () => {
  expect(new Window().getDefaultComputedStyle).toThrow(DOMException)
})

test()(yellow(`Window.matchMedia() is unimplemented`), () => {
  expect(new Window().matchMedia).toThrow(DOMException)
})

for (
  const property of [
    "onanimationstart",
    "onanimationiteration",
    "onanimationend",
    "onanimationcancel",
    "ontransitionstart",
    "ontransitionrun",
    "ontransitionend",
    "ontransitioncancel",
    "onwebkitanimationstart",
    "onwebkitanimationiteration",
    "onwebkitanimationend",
    "onwebkittransitionend",
  ] as const
) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

test()(`Window.strucuredClone() is supported`, () => {
  const value = { foo: "bar" }
  expect(new Window().structuredClone(value)).toEqual(structuredClone(value))
})

test()(yellow(`Window.postMessage() is unimplemented`), () => {
  expect(new Window().postMessage).toThrow(DOMException)
})

for (const property of ["onmessage", "onmessageerror"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

test()(yellow(`Window.reportError() is unimplemented`), () => {
  expect(new Window().reportError).toThrow(DOMException)
})

for (const property of ["onerror", "onrejectionhandled", "onunhandledrejection"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

test()(`Window.console is supported`, () => {
  const window = new Window()
  expect(window.console).toBe(console)
  expect(window).not.toBeImmutable("console")
})

test()(`Window.print() is supported`, () => {
  expect(new Window().print()).toBeUndefined()
})

test()(yellow(`Window.dump() is unimplemented`), () => {
  expect(new Window().dump).toThrow(DOMException)
})

for (const property of ["onbeforeprint", "onafterprint"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

test()(`Window.isSecureContext is true`, () => {
  expect(new Window().isSecureContext).toBe(true)
  expect(new Window()).toBeImmutable("isSecureContext")
})

test()(`Window.crypto is supported`, () => {
  expect(new Window().crypto).toBe(crypto)
  expect(new Window()).toBeImmutable("crypto")
})

test()(`Window.atob() is supported`, () => {
  expect(new Window().atob("Zm9v")).toBe(atob("Zm9v"))
})

test()(`Window.btoa() is supported`, () => {
  expect(new Window().btoa("foo")).toBe(btoa("foo"))
})

test()(yellow(`Window.location is unimplemented`), () => {
  expect(() => new Window().location).toThrow(DOMException)
})

test()(yellow(`Window.origin is unimplemented`), () => {
  expect(() => new Window().origin).toThrow(DOMException)
})

test()(yellow(`Window.history is unimplemented`), () => {
  expect(() => new Window().history).toThrow(DOMException)
})

test()(yellow(`Window.open() is unimplemented`), () => {
  expect(() => new Window().open()).toThrow(DOMException)
})

test()(`Window.close() is supported`, () => {
  expect(new Window().close()).toBeUndefined()
})

test()(`Window.closed is supported`, () => {
  const window = new Window()
  expect(window).toHaveProperty("closed", false)
  expect(window).toBeImmutable("closed")
  window.close()
  expect(window).toHaveProperty("closed", true)
})

test()(yellow(`Window.stop() is unimplemented`), () => {
  expect(new Window().stop).toThrow(DOMException)
})

test()(`Window.crossOriginIsolated is supported`, () => {
  expect(new Window()).toHaveProperty("crossOriginIsolated", false)
  expect(new Window()).toBeImmutable("crossOriginIsolated")
})

for (const property of ["onload", "onbeforeunload", "onunload", "onpageshow", "onpagehide", "onpopstate", "onhashchange", "onclose"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

test()(yellow(`Window.caches is unimplemented`), () => {
  expect(() => new Window().caches).toThrow(DOMException)
})

test()(yellow(`Window.indexedDB is unimplemented`), () => {
  expect(() => new Window().indexedDB).toThrow(DOMException)
})

test()(`Window.localStorage is supported`, () => {
  expect(new Window().localStorage).toBe(localStorage)
  expect(new Window()).toBeImmutable("localStorage")
})

test()(`Window.sessionStorage is supported`, () => {
  expect(new Window().sessionStorage).toBe(sessionStorage)
  expect(new Window()).toBeImmutable("sessionStorage")
})

test()(yellow(`Window.onstorage is unimplemented`), () => {
  expect(new Window().onstorage).toBeNull()
})

test()(`Window.alert() is supported`, () => {
  expect(new Window().alert("foo")).toBeUndefined()
})

test()(`Window.confirm() is supported`, () => {
  expect(new Window().confirm("foo")).toBe(false)
})

test()(`Window.prompt() is supported`, () => {
  expect(new Window().prompt("foo")).toBeNull()
  expect(new Window().prompt("foo", "bar")).toBe("bar")
})

test()(yellow(`Window.getSelection() is unimplemented`), () => {
  expect(new Window().getSelection).toThrow(DOMException)
})

for (const property of ["oncopy", "onpaste", "oncut", "onselect", "onselectionchange", "onselectstart"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

for (const property of ["onmousedown", "onmouseup", "onmousemove", "onmouseenter", "onmouseleave", "onmouseover", "onmouseout"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

for (const property of ["onpointerdown", "onpointerup", "onpointermove", "onpointerenter", "onpointerleave", "onpointerover", "onpointerout", "onpointercancel", "ongotpointercapture", "onlostpointercapture"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

for (const property of ["onclick", "ondblclick", "onauxclick", "oncontextmenu", "onwheel"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

for (const property of ["onkeydown", "onkeyup", "onkeypress"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

for (const property of ["ondrag", "ondragstart", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondrop"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

for (const property of ["onbeforeinput", "oninput", "onchange", "oninvalid", "oncancel", "onreset", "onsubmit", "onformdata"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

for (
  const property of [
    "onloadeddata",
    "onloadedmetadata",
    "onloadstart",
    "oncanplay",
    "oncanplaythrough",
    "onplay",
    "onplaying",
    "onseeked",
    "onseeking",
    "onstalled",
    "onwaiting",
    "onsuspend",
    "onpause",
    "ontimeupdate",
    "ondurationchange",
    "onratechange",
    "onvolumechange",
    "onemptied",
    "onended",
  ] as const
) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

for (const property of ["onprogress", "onabort", "onbeforetoggle", "ontoggle", "onslotchange", "oncuechange", "onsecuritypolicyviolation"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

for (const property of ["ongamepadconnected", "ongamepaddisconnected"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

test()(`Window.status is supported`, () => {
  const window = new Window()
  expect(window).toHaveProperty("status", "")
  window.status = "foo"
  expect(window).toHaveProperty("status", "foo")
  window.status = 1 as testing
  expect(window).toHaveProperty("status", "1")
})

test()(yellow(`Window.speechSynthesis is unimplemented`), () => {
  expect(() => new Window().speechSynthesis).toThrow(DOMException)
})

test()(yellow(`Window.performance is supported`), () => {
  expect(new Window().performance).toBe(performance)
})

test()(yellow(`Window.external is unimplemented`), () => {
  expect(() => new Window().external).toThrow(DOMException)
})

test()(`Window.event is undefined`, () => {
  expect(new Window().event).toBeUndefined()
  expect(new Window()).not.toBeImmutable("event")
})

test()(`Window.captureEvents is supported`, () => {
  expect(new Window().captureEvents()).toBeUndefined()
})

test()(yellow(`Window.releaseEvents is unimplemented`), () => {
  expect(new Window().releaseEvents).toThrow(DOMException)
})

test()(yellow(`Window.find is unimplemented`), () => {
  expect(new Window().find).toThrow(DOMException)
})

test()(`Window.updateCommands is supported`, () => {
  expect(new Window().updateCommands()).toBeUndefined()
})

for (const property of ["ononline", "onoffline"] as const) {
  test()(yellow(`Window.${property} is unimplemented`), () => {
    expect(new Window()[property]).toBeNull()
  })
}

for (
  const [key, value] of [
    ["fetch", fetch],
    ["createImageBitmap", createImageBitmap],
    ["Deno", Deno],
    ["Location", Location],
    ["Navigator", Navigator],
  ] as const
) {
  test()(`Window.${key} is supported`, () => {
    expect(new Window()).toHaveProperty(key, value)
    expect(new Window()).not.toBeImmutable(key)
  })
}

test()(`BarProp.constructor() is illegal`, () => {
  expect(() => new BarProp()).toThrow(TypeError)
  new BarProp({ [internal]: true })
})

test()(`BarProp.visible is supported`, () => {
  expect(new BarProp({ [internal]: true })).toHaveProperty("visible", false)
  expect(new BarProp({ [internal]: true })).toBeImmutable("visible")
})
