import { expect, test, type testing } from "@libs/testing"
import { yellow } from "@std/fmt/colors"
import { internal } from "./_.ts"
import { Navigator } from "./navigator.ts"
import { Clipboard } from "./clipboard.ts"
import { Permissions } from "./permissions.ts"
import { MimeTypeArray } from "./mime_type.ts"
import { UserActivation } from "./user_activation.ts"

test()(`Navigator.constructor() is illegal`, () => {
  expect(() => new Navigator()).toThrow(TypeError)
  new Navigator({ [internal]: true })
})

test()(`Navigator.appCodeName is "Mozilla"`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("appCodeName", "Mozilla")
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("appCodeName")
})

test()(`Navigator.appName is "Netscape"`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("appName", "Netscape")
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("appName")
})

test()(`Navigator.appVersion is "4.0"`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("appVersion", "4.0")
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("appVersion")
})

test()(`Navigator.buildID is "20181001000000"`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("buildID", "20181001000000")
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("buildID")
})

test()(`Navigator.product is "Gecko"`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("product", "Gecko")
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("product")
})

test()(`Navigator.productSub is "20100101"`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("productSub", "20100101")
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("productSub")
})

test()(`Navigator.vendor is empty string`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("vendor", "")
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("vendor")
})

test()(`Navigator.vendorSub is empty string`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("vendorSub", "")
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("vendorSub")
})

test()(`Navigator.userAgent is supported`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("userAgent", navigator.userAgent)
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("userAgent")
})

test()(`Navigator.platform is supported`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("platform")
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("platform")
})

test()(`Navigator.oscpu is supported`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("oscpu")
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("oscpu")
})

test()(`Navigator.hardwareConcurrency is supported`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("hardwareConcurrency", navigator.hardwareConcurrency)
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("hardwareConcurrency")
})

test()(`Navigator.language is supported`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("language", navigator.language)
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("language")
})

test()(`Navigator.languages is supported`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("languages", navigator.languages)
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("languages")
})

test()(`Navigator.cookieEnabled is false`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("cookieEnabled", false)
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("cookieEnabled")
})

test()(`Navigator.doNotTrack is "1"`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("doNotTrack", "1")
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("doNotTrack")
})

test()(`Navigator.globalPrivacyControl() is supported`, () => {
  expect(new Navigator({ [internal]: true }).globalPrivacyControl()).toBe("true")
})

test()(`Navigator.webdriver is true`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("webdriver", true)
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("webdriver")
})

test()(`Navigator.userActivation is supported`, () => {
  expect(new Navigator({ [internal]: true }).userActivation).toBeInstanceOf(UserActivation)
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("userActivation")
})

test()(`Navigator.permissions is Permissions`, () => {
  expect(new Navigator({ [internal]: true }).permissions).toBeInstanceOf(Permissions)
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("permissions")
})

test()(`Navigator.clipboard is supported`, () => {
  expect(new Navigator({ [internal]: true }).clipboard).toBeInstanceOf(Clipboard)
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("clipboard")
})

test()(yellow("Navigator.credentials is unimplemented"), () => {
  expect(() => new Navigator({ [internal]: true }).credentials).toThrow(DOMException)
})

test()(yellow("Navigator.geolocation is unimplemented"), () => {
  expect(() => new Navigator({ [internal]: true }).geolocation).toThrow(DOMException)
})

test()(yellow("Navigator.gpu is unimplemented"), () => {
  expect(() => new Navigator({ [internal]: true }).gpu).toThrow(DOMException)
})

test()(yellow("Navigator.locks is unimplemented"), () => {
  expect(() => new Navigator({ [internal]: true }).locks).toThrow(DOMException)
})

test()(yellow("Navigator.wakeLock() is unimplemented"), () => {
  expect(() => new Navigator({ [internal]: true }).wakeLock).toThrow(DOMException)
})

test()(yellow("Navigator.storage is unimplemented"), () => {
  expect(() => new Navigator({ [internal]: true }).storage).toThrow(DOMException)
})

test()(yellow("Navigator.serviceWorker is unimplemented"), () => {
  expect(() => new Navigator({ [internal]: true }).serviceWorker).toThrow(DOMException)
})

test()(yellow("Navigator.plugins is unimplemented"), () => {
  expect(() => new Navigator({ [internal]: true }).plugins).toThrow(DOMException)
})

test()(`Navigator.mimeTypes is MimeTypeArray`, () => {
  expect(new Navigator({ [internal]: true }).mimeTypes).toBeInstanceOf(MimeTypeArray)
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("mimeTypes")
})

test()(`Navigator.setAppBadge() is supported`, async () => {
  await expect(new Navigator({ [internal]: true }).setAppBadge()).resolves.toBeUndefined()
})

test()(`Navigator.clearAppBadge() is supported`, async () => {
  await expect(new Navigator({ [internal]: true }).clearAppBadge()).resolves.toBeUndefined()
})

test()(`Navigator.vibrate() is supported`, () => {
  expect(new Navigator({ [internal]: true }).vibrate([])).toBe(true)
})

test()(`Navigator.canShare() is supported`, () => {
  expect(new Navigator({ [internal]: true }).canShare()).toBe(false)
})

test()(`Navigator.share() is supported`, async () => {
  await expect(new Navigator({ [internal]: true }).share()).rejects.toThrow(DOMException)
})

test()(`Navigator.maxTouchPoints is 0`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("maxTouchPoints", 0)
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("maxTouchPoints")
})

test()(`Navigator.getGamepads() is supported`, () => {
  expect(new Navigator({ [internal]: true }).getGamepads()).toEqual([])
})

test()(`Navigator.getAutoplayPolicy() is supported`, () => {
  expect(new Navigator({ [internal]: true }).getAutoplayPolicy("mediaelement")).toBe("disallowed")
  expect(new Navigator({ [internal]: true }).getAutoplayPolicy("audiocontext")).toBe("disallowed")
  expect(() => new Navigator({ [internal]: true }).getAutoplayPolicy("foo" as testing)).toThrow(TypeError)
})

test()(yellow(`Navigator.getUserMedia() is unimplemented`), () => {
  expect(new Navigator({ [internal]: true }).getUserMedia).toThrow(DOMException)
})

test()(`Navigator.mozGetUserMedia() is supported`, () => {
  expect(new Navigator({ [internal]: true }).mozGetUserMedia).toThrow(DOMException)
})

test()(yellow("Navigator.requestMIDIAccess() is unimplemented"), () => {
  expect(new Navigator({ [internal]: true }).requestMIDIAccess).toThrow(DOMException)
})

test()(yellow("Navigator.requestMediaKeySystemAccess() is unimplemented"), () => {
  expect(new Navigator({ [internal]: true }).requestMediaKeySystemAccess).toThrow(DOMException)
})

test()(yellow("Navigator.mediaCapabilities is unimplemented"), () => {
  expect(() => new Navigator({ [internal]: true }).mediaCapabilities).toThrow(DOMException)
})

test()(yellow("Navigator.mediaDevices is unimplemented"), () => {
  expect(() => new Navigator({ [internal]: true }).mediaDevices).toThrow(DOMException)
})

test()(yellow("Navigator.mediaSession is unimplemented"), () => {
  expect(() => new Navigator({ [internal]: true }).mediaSession).toThrow(DOMException)
})

test()(yellow("Navigator.registerProtocolHandler() is unimplemented"), () => {
  expect(new Navigator({ [internal]: true }).registerProtocolHandler).toThrow(DOMException)
})

test()(`Navigator.pdfViewerEnabled is false`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("pdfViewerEnabled", false)
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("pdfViewerEnabled")
})

test()(`Navigator.onLine is true`, () => {
  expect(new Navigator({ [internal]: true })).toHaveProperty("onLine", true)
  expect(new Navigator({ [internal]: true })).toHaveImmutableProperty("onLine")
})

test()(`Navigator.sendBeacon is supported`, async () => {
  const { promise: listening, resolve: url } = Promise.withResolvers<string>()
  const { promise: requested, resolve: got } = Promise.withResolvers<Request>()
  const navigator = new Navigator({ [internal]: true })
  const server = Deno.serve({ onListen: ({ hostname, port }) => url(`http://${hostname}:${port}`) }, (request) => {
    got(request)
    return new Response()
  })
  expect(navigator.sendBeacon("http://test.invalid", "foo")).toBe(true)
  expect(navigator.sendBeacon(await listening, "foo")).toBe(true)
  const request = await requested
  expect(request.method).toBe("POST")
  await expect(request.text()).resolves.toBe("foo")
  await Promise.all(navigator[internal].beacons)
  await server.shutdown()
}, { permissions: { net: true } })

test()(`Navigator.javaEnabled() is supported`, () => {
  expect(new Navigator({ [internal]: true }).javaEnabled()).toBe(false)
})

test()(`Navigator.taintEnabled() is false`, () => {
  expect(new Navigator({ [internal]: true }).taintEnabled()).toBe(false)
})
