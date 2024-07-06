import { expect, test, type testing } from "@libs/testing"
import { yellow } from "@std/fmt/colors"
import { construct } from "./_.ts"
import { Navigator } from "./navigator.ts"
import { Clipboard } from "./clipboard.ts"
import { Permissions } from "./permissions.ts"
import { MimeTypeArray } from "./mime_type.ts"
import { UserActivation } from "./user_activation.ts"

test()(`Navigator.constructor() is illegal`, () => {
  expect(() => new Navigator()).toThrow(TypeError)
  new Navigator(construct)
})

test()(`Navigator.appCodeName is "Mozilla"`, () => {
  expect(new Navigator(construct)).toHaveProperty("appCodeName", "Mozilla")
  expect(new Navigator(construct)).toBeImmutable("appCodeName")
})

test()(`Navigator.appName is "Netscape"`, () => {
  expect(new Navigator(construct)).toHaveProperty("appName", "Netscape")
  expect(new Navigator(construct)).toBeImmutable("appName")
})

test()(`Navigator.appVersion is supported`, () => {
  expect(new Navigator(construct).appVersion).toBeType("string")
  expect(new Navigator(construct)).toBeImmutable("appVersion")
})

test()(`Navigator.buildID is "20181001000000"`, () => {
  expect(new Navigator(construct)).toHaveProperty("buildID", "20181001000000")
  expect(new Navigator(construct)).toBeImmutable("buildID")
})

test()(`Navigator.canShare() is supported`, () => {
  expect(new Navigator(construct).canShare()).toBe(false)
})

test()(`Navigator.clearAppBadge() is supported`, async () => {
  await expect(new Navigator(construct).clearAppBadge()).resolves.toBeUndefined()
})

test()(`Navigator.clipboard is supported`, () => {
  expect(new Navigator(construct).clipboard).toBeInstanceOf(Clipboard)
  expect(new Navigator(construct)).toBeImmutable("clipboard")
})

test()(`Navigator.cookieEnabled is false`, () => {
  expect(new Navigator(construct).cookieEnabled).toBe(false)
  expect(new Navigator(construct)).toBeImmutable("cookieEnabled")
})

test()(yellow("Navigator.credentials is unimplemented"), () => {
  expect(() => new Navigator(construct).credentials).toThrow(DOMException)
})

test()(`Navigator.doNotTrack is "1"`, () => {
  expect(new Navigator(construct)).toHaveProperty("doNotTrack", "1")
  expect(new Navigator(construct)).toBeImmutable("doNotTrack")
})

test()(yellow("Navigator.geolocation is unimplemented"), () => {
  expect(() => new Navigator(construct).geolocation).toThrow(DOMException)
})

test()(`Navigator.getAutoplayPolicy() is supported`, () => {
  expect(new Navigator(construct).getAutoplayPolicy("mediaelement")).toBe("disallowed")
  expect(new Navigator(construct).getAutoplayPolicy("audiocontext")).toBe("disallowed")
  expect(() => new Navigator(construct).getAutoplayPolicy("foo" as testing)).toThrow(TypeError)
})

test()(`Navigator.getGamepads() is supported`, () => {
  expect(new Navigator(construct).getGamepads()).toEqual([])
})

test()(`Navigator.mozGetUserMedia() is supported`, () => {
  expect(new Navigator(construct).mozGetUserMedia({}, () => null, () => null)).toBeUndefined()
})

test()(`Navigator.globalPrivacyControl() is supported`, () => {
  expect(new Navigator(construct).globalPrivacyControl()).toBe("true")
})

test()(yellow("Navigator.gpu is unimplemented"), () => {
  expect(() => new Navigator(construct).gpu).toThrow(DOMException)
})

test()(`Navigator.hardwareConcurrency is supported`, () => {
  expect(new Navigator(construct)).toHaveProperty("hardwareConcurrency", navigator.hardwareConcurrency)
  expect(new Navigator(construct)).toBeImmutable("hardwareConcurrency")
})

test()(`Navigator.javaEnabled() is supported`, () => {
  expect(new Navigator(construct).javaEnabled()).toBe(false)
})

test()(`Navigator.language is supported`, () => {
  expect(new Navigator(construct)).toHaveProperty("language", navigator.language)
  expect(new Navigator(construct)).toBeImmutable("language")
})

test()(`Navigator.languages is supported`, () => {
  expect(new Navigator(construct)).toHaveProperty("languages", navigator.languages)
  expect(new Navigator(construct)).toBeImmutable("languages")
})

test()(yellow("Navigator.locks is unimplemented"), () => {
  expect(() => new Navigator(construct).locks).toThrow(DOMException)
})

test()(`Navigator.maxTouchPoints is 0`, () => {
  expect(new Navigator(construct)).toHaveProperty("maxTouchPoints", 0)
  expect(new Navigator(construct)).toBeImmutable("maxTouchPoints")
})

test()(yellow("Navigator.mediaCapabilities is unimplemented"), () => {
  expect(() => new Navigator(construct).mediaCapabilities).toThrow(DOMException)
})

test()(yellow("Navigator.mediaDevices is unimplemented"), () => {
  expect(() => new Navigator(construct).mediaDevices).toThrow(DOMException)
})

test()(yellow("Navigator.mediaSession is unimplemented"), () => {
  expect(() => new Navigator(construct).mediaSession).toThrow(DOMException)
})

test()(`Navigator.mimeTypes is MimeTypeArray`, () => {
  expect(new Navigator(construct).mimeTypes).toBeInstanceOf(MimeTypeArray)
  expect(new Navigator(construct)).toBeImmutable("mimeTypes")
})

test()(`Navigator.onLine is true`, () => {
  expect(new Navigator(construct)).toHaveProperty("onLine", true)
  expect(new Navigator(construct)).toBeImmutable("onLine")
})

test()(`Navigator.oscpu is supported`, () => {
  expect(new Navigator(construct)).toHaveProperty("oscpu")
  expect(new Navigator(construct)).toBeImmutable("oscpu")
})

test()(`Navigator.pdfViewerEnabled is false`, () => {
  expect(new Navigator(construct)).toHaveProperty("pdfViewerEnabled", false)
  expect(new Navigator(construct)).toBeImmutable("pdfViewerEnabled")
})

test()(`Navigator.permissions is Permissions`, () => {
  expect(new Navigator(construct).permissions).toBeInstanceOf(Permissions)
  expect(new Navigator(construct)).toBeImmutable("permissions")
})

test()(`Navigator.platform is supported`, () => {
  expect(new Navigator(construct)).toHaveProperty("platform")
  expect(new Navigator(construct)).toBeImmutable("platform")
})

test()(yellow("Navigator.plugins is unimplemented"), () => {
  expect(() => new Navigator(construct).plugins).toThrow(DOMException)
})

test()(`Navigator.product is "Gecko"`, () => {
  expect(new Navigator(construct)).toHaveProperty("product", "Gecko")
  expect(new Navigator(construct)).toBeImmutable("product")
})

test()(`Navigator.productSub is "20100101"`, () => {
  expect(new Navigator(construct)).toHaveProperty("productSub", "20100101")
  expect(new Navigator(construct)).toBeImmutable("productSub")
})

test()(yellow("Navigator.registerProtocolHandler() is unimplemented"), () => {
  expect(() => new Navigator(construct).registerProtocolHandler("foo", "https://example.com/%s")).toThrow(DOMException)
})

test()(yellow("Navigator.requestMIDIAccess() is unimplemented"), () => {
  expect(() => new Navigator(construct).requestMIDIAccess()).toThrow(DOMException)
})

test()(yellow("Navigator.requestMediaKeySystemAccess() is unimplemented"), () => {
  expect(() => new Navigator(construct).requestMediaKeySystemAccess("com.example", [])).toThrow(DOMException)
})

test()(`Navigator.sendBeacon is supported`, async () => {
  const { promise: listening, resolve: url } = Promise.withResolvers<string>()
  const { promise: requested, resolve: got } = Promise.withResolvers<Request>()
  const navigator = new Navigator(construct)
  const server = Deno.serve({ onListen: ({ hostname, port }) => url(`http://${hostname}:${port}`) }, (request) => {
    got(request)
    return new Response()
  })
  expect(navigator.sendBeacon("http://test.invalid", "foo")).toBe(true)
  expect(navigator.sendBeacon(await listening, "foo")).toBe(true)
  const request = await requested
  expect(request.method).toBe("POST")
  await expect(request.text()).resolves.toBe("foo")
  await Promise.all(navigator[construct].beacons)
  await server.shutdown()
}, { permissions: { net: true } })

test()(yellow("Navigator.serviceWorker is unimplemented"), () => {
  expect(() => new Navigator(construct).serviceWorker).toThrow(DOMException)
})

test()(`Navigator.setAppBadge() is supported`, async () => {
  await expect(new Navigator(construct).setAppBadge()).resolves.toBeUndefined()
})

test()(yellow("Navigator.share() is unimplemented"), () => {
  expect(() => new Navigator(construct).share()).toThrow(DOMException)
})

test()(yellow("Navigator.storage is unimplemented"), () => {
  expect(() => new Navigator(construct).storage).toThrow(DOMException)
})

test()(`Navigator.taintEnabled() is false`, () => {
  expect(new Navigator(construct).taintEnabled()).toBe(false)
})

test()(`Navigator.userActivation is supported`, () => {
  expect(new Navigator(construct).userActivation).toBeInstanceOf(UserActivation)
  expect(new Navigator(construct)).toBeImmutable("userActivation")
})

test()(`Navigator.userAgent is supported`, () => {
  expect(new Navigator(construct).userAgent).toBeDefined()
  expect(new Navigator(construct)).toBeImmutable("userAgent")
})

test()(`Navigator.vendor is empty string`, () => {
  expect(new Navigator(construct)).toHaveProperty("vendor", "")
  expect(new Navigator(construct)).toBeImmutable("vendor")
})

test()(`Navigator.vendorSub is empty string`, () => {
  expect(new Navigator(construct)).toHaveProperty("vendorSub", "")
  expect(new Navigator(construct)).toBeImmutable("vendorSub")
})

test()(yellow("Navigator.wakeLock() is unimplemented"), () => {
  expect(() => new Navigator(construct).wakeLock).toThrow(DOMException)
})

test()(`Navigator.webdriver is true`, () => {
  expect(new Navigator(construct)).toHaveProperty("webdriver", true)
  expect(new Navigator(construct)).toBeImmutable("webdriver")
})

test()(yellow("Navigator.vibrate() is unimplemented"), () => {
  expect(() => new Navigator(construct).vibrate([])).toThrow(DOMException)
})
