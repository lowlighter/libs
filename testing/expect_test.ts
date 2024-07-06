// Imports
import { test } from "./_testing.ts"
import { expect, Status } from "./expect.ts"

test()("expect.toSatisfy() asserts predicate", () => {
  expect("foo").toSatisfy((value: string) => value.length > 0)
  expect("foo").not.toSatisfy((value: string) => value.length === 0)
  expect(() => expect("foo").not.toSatisfy((value: string) => value.length > 0)).toThrow("to NOT satisfy")
  expect(() => expect("foo").toSatisfy((value: string) => value.length === 0)).toThrow("to satisfy")
})

test()("expect.toBeType() asserts typeof", () => {
  expect("foo").toBeType("string")
  expect("foo").not.toBeType("number")
  expect(null).toBeType("object")
  expect(null).not.toBeType("object", !null)
  expect(() => expect("foo").toBeType("number")).toThrow("to be of type")
  expect(() => expect("foo").not.toBeType("string")).toThrow("to NOT be of type")
  expect(() => expect(null).toBeType("object", !null)).toThrow("to be of type")
  expect(() => expect(null).not.toBeType("object")).toThrow("to NOT be of type")
})

test()("expect.toMatchDescriptor() asserts Object.getOwnPropertyDescriptor", () => {
  const record = Object.defineProperties({}, { foo: { value: "bar", writable: false, enumerable: false } })
  expect(record).toMatchDescriptor("foo", { value: "bar" })
  expect(record).not.toMatchDescriptor("foo", { value: "baz" })
  expect(record).toMatchDescriptor("foo", { writable: false, enumerable: false })
  expect(record).not.toMatchDescriptor("foo", { writable: true, enumerable: true })
  expect(() => expect(record).toMatchDescriptor("foo", { value: "baz" })).toThrow("does match")
  expect(() => expect(record).not.toMatchDescriptor("foo", { value: "bar" })).toThrow("does NOT match")
  expect(() => expect(record).toMatchDescriptor("foo", { writable: true, enumerable: true })).toThrow("does match")
  expect(() => expect(record).not.toMatchDescriptor("foo", { writable: false, enumerable: false })).toThrow("does NOT match")
  expect(() => expect(record).toMatchDescriptor("bar", {})).toThrow("does not exist")
})

test()("expect.toBeImmutable() asserts writable but not editable properties", () => {
  const record = Object.defineProperties({}, {
    foo: {
      get() {
        return true
      },
      set() {
        return
      },
      enumerable: true,
    },
    bar: { value: true, writable: true, enumerable: true },
  })
  expect(record).toEqual({ foo: true, bar: true })
  expect(record).toBeImmutable("foo")
  expect(record).toEqual({ foo: true, bar: true })
  expect(record).not.toBeImmutable("bar")
  expect(record).toEqual({ foo: true, bar: true })
  expect(() => expect(record).not.toBeImmutable("foo")).toThrow("to NOT be")
  expect(record).toEqual({ foo: true, bar: true })
  expect(() => expect(record).toBeImmutable("bar")).toThrow("to be")
  expect(record).toEqual({ foo: true, bar: true })
})

test()("expect.toBeIterable() asserts value is iterable", () => {
  expect([]).toBeIterable()
  expect(new Set()).toBeIterable()
  expect(new Map()).toBeIterable()
  expect(1).not.toBeIterable()
  expect(() => expect([]).not.toBeIterable()).toThrow("to NOT be iterable")
  expect(() => expect(new Set([])).not.toBeIterable()).toThrow("to NOT be iterable")
  expect(() => expect(new Map([])).not.toBeIterable()).toThrow("to NOT be iterable")
  expect(() => expect(1).toBeIterable()).toThrow("to be iterable")
})

test()("expect.toBeSealed() asserts value is sealed", () => {
  const sealed = Object.seal({})
  expect(sealed).toBeSealed()
  expect({}).not.toBeSealed()
  expect(() => expect(sealed).not.toBeSealed()).toThrow("to NOT be sealed")
  expect(() => expect({}).toBeSealed()).toThrow("to be sealed")
})

test()("expect.toBeFrozen() asserts value is frozen", () => {
  const frozen = Object.freeze({})
  expect(frozen).toBeFrozen()
  expect({}).not.toBeFrozen()
  expect(() => expect(frozen).not.toBeFrozen()).toThrow("to NOT be frozen")
  expect(() => expect({}).toBeFrozen()).toThrow("to be frozen")
})

test()("expect.toBeExtensible() asserts value is extensible", () => {
  const unextensible = Object.preventExtensions({})
  expect({}).toBeExtensible()
  expect(unextensible).not.toBeExtensible()
  expect(() => expect({}).not.toBeExtensible()).toThrow("to NOT be extensible")
  expect(() => expect(unextensible).toBeExtensible()).toThrow("to be extensible")
})

test()("expect.toBeShallowCopy() asserts value is a shallow copy", () => {
  const object = { foo: "bar" }
  const array = [1, 2, 3]
  expect(object).toBeShallowCopy({ ...object })
  expect(object).not.toBeShallowCopy(object)
  expect(array).toBeShallowCopy([...array])
  expect(array).not.toBeShallowCopy(array)
  expect(() => expect(object).not.toBeShallowCopy({ ...object })).toThrow("to NOT be a shallow copy")
  expect(() => expect(object).toBeShallowCopy(object)).toThrow("to be a shallow copy")
  expect(() => expect(array).not.toBeShallowCopy([...array])).toThrow("to NOT be a shallow copy")
  expect(() => expect(array).toBeShallowCopy(array)).toThrow("to be a shallow copy")
})

test()("expect.toBeEmpty() asserts value is empty", () => {
  expect([]).toBeEmpty()
  expect(new Set()).toBeEmpty()
  expect(new Map()).toBeEmpty()
  expect([1]).not.toBeEmpty()
  expect(new Set([1])).not.toBeEmpty()
  expect(new Map([[1, 1]])).not.toBeEmpty()
  expect(() => expect([]).not.toBeEmpty()).toThrow("to NOT be empty")
  expect(() => expect(new Set()).not.toBeEmpty()).toThrow("to NOT be empty")
  expect(() => expect(new Map()).not.toBeEmpty()).toThrow("to NOT be empty")
  expect(() => expect([1]).toBeEmpty()).toThrow("to be empty")
  expect(() => expect(new Set([1])).toBeEmpty()).toThrow("to be empty")
  expect(() => expect(new Map([[1, 1]])).toBeEmpty()).toThrow("to be empty")
})

test()("expect.toBeSorted() asserts value is sorted", () => {
  expect([1, 2, 3]).toBeSorted()
  expect([3, 2, 1]).not.toBeSorted()
  expect(() => expect([3, 2, 1]).toBeSorted()).toThrow("to be sorted")
  expect(() => expect([1, 2, 3]).not.toBeSorted()).toThrow("to NOT be sorted")
})

test()("expect.toBeReverseSorted() asserts value is reverse sorted", () => {
  expect([3, 2, 1]).toBeReverseSorted()
  expect([1, 2, 3]).not.toBeReverseSorted()
  expect(() => expect([1, 2, 3]).toBeReverseSorted()).toThrow("to be reverse sorted")
  expect(() => expect([3, 2, 1]).not.toBeReverseSorted()).toThrow("to NOT be reverse sorted")
})

test()("expect.toBeOneOf() asserts value is one of", () => {
  expect("foo").toBeOneOf(["foo", "bar"])
  expect("baz").not.toBeOneOf(["foo", "bar"])
  expect(() => expect("baz").toBeOneOf(["foo", "bar"])).toThrow("to be one of")
  expect(() => expect("foo").not.toBeOneOf(["foo", "bar"])).toThrow("to NOT be one of")
})

test()("expect.toBeWithin() asserts value is within range", () => {
  expect(0).toBeWithin([0, 1])
  expect(1).toBeWithin([0, 1])
  expect(2).not.toBeWithin([0, 1])
  expect(0).not.toBeWithin([0, 1], true)
  expect(.5).toBeWithin([0, 1], true)
  expect(() => expect(0).not.toBeWithin([0, 1])).toThrow("to NOT be within")
  expect(() => expect(1).not.toBeWithin([0, 1])).toThrow("to NOT be within")
  expect(() => expect(2).toBeWithin([0, 1])).toThrow("to be within")
  expect(() => expect(0).toBeWithin([0, 1], true)).toThrow("to be within")
  expect(() => expect(.5).not.toBeWithin([0, 1], true)).toThrow("to NOT be within")
})

test()("expect.toBeFinite() asserts value is finite", () => {
  expect(0).toBeFinite()
  expect(Infinity).not.toBeFinite()
  expect(NaN).not.toBeFinite()
  expect(() => expect(0).not.toBeFinite()).toThrow("to NOT be finite")
  expect(() => expect(Infinity).toBeFinite()).toThrow("to be finite")
  expect(() => expect(NaN).toBeFinite()).toThrow("to be finite")
})

test()("expect.toBeParseableJSON() asserts value is parseable JSON", () => {
  expect('{"foo":"bar"}').toBeParseableJSON()
  expect("<invalid>").not.toBeParseableJSON()
  expect(() => expect('{"foo":"bar"}').not.toBeParseableJSON()).toThrow("to NOT be parseable JSON")
  expect(() => expect("<invalid>").toBeParseableJSON()).toThrow("to be parseable JSON")
})

test()("expect.toBeEmail() asserts value is parseable email", () => {
  expect("foo@example.com").toBeEmail()
  expect("foo+meta@example.com").toBeEmail()
  expect("<invalid>").not.toBeEmail()
  expect(() => expect("foo@example.com").not.toBeEmail()).toThrow("to NOT be a valid email")
  expect(() => expect("foo+meta@example.com").not.toBeEmail()).toThrow("to NOT be a valid email")
  expect(() => expect("<invalid>").toBeEmail()).toThrow("to be a valid email")
})

test()("expect.toBeUrl() asserts value is parseable URL", () => {
  expect("https://example.com").toBeUrl()
  expect(new URL("https://example.com")).toBeUrl()
  expect("<invalid>").not.toBeUrl()
  expect(() => expect("https://example.com").not.toBeUrl()).toThrow("to NOT be a valid URL")
  expect(() => expect(new URL("https://example.com")).not.toBeUrl()).toThrow("to NOT be a valid URL")
  expect(() => expect("<invalid>").toBeUrl()).toThrow("to be a valid URL")
})

test()("expect.toBeBase64() asserts value is a valid base64 string", () => {
  expect(btoa("foo")).toBeBase64()
  expect("<invalid>").not.toBeBase64()
  expect(() => expect(btoa("foo")).not.toBeBase64()).toThrow("to NOT be a valid base64 string")
  expect(() => expect("<invalid>").toBeBase64()).toThrow("to be a valid base64 string")
})

test()("expect.toRespondWithStatus() asserts response status", () => {
  expect(() => expect({}).toRespondWithStatus(Status.OK)).toThrow("is not a Response")
  expect(new Response(null, { status: Status.OK })).toRespondWithStatus(Status.OK)
  expect(new Response(null, { status: Status.OK })).toRespondWithStatus([Status.OK])
  expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus(Status.NotFound)
  expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus([Status.NotFound])
  expect(new Response(null, { status: Status.SwitchingProtocols })).toRespondWithStatus("1XX")
  expect(new Response(null, { status: Status.SwitchingProtocols })).toRespondWithStatus("informational")
  expect(new Response(null, { status: Status.OK })).toRespondWithStatus("2XX")
  expect(new Response(null, { status: Status.OK })).toRespondWithStatus("successful")
  expect(new Response(null, { status: Status.MovedPermanently })).toRespondWithStatus("3XX")
  expect(new Response(null, { status: Status.MovedPermanently })).toRespondWithStatus("redirect")
  expect(new Response(null, { status: Status.BadRequest })).toRespondWithStatus("4XX")
  expect(new Response(null, { status: Status.BadRequest })).toRespondWithStatus("client_error")
  expect(new Response(null, { status: Status.InternalServerError })).toRespondWithStatus("5XX")
  expect(new Response(null, { status: Status.InternalServerError })).toRespondWithStatus("server_error")
  expect(new Response(null, { status: Status.SwitchingProtocols })).not.toRespondWithStatus("2XX")
  expect(new Response(null, { status: Status.SwitchingProtocols })).not.toRespondWithStatus("successful")
  expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus("1XX")
  expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus("informational")
  expect(new Response(null, { status: Status.MovedPermanently })).not.toRespondWithStatus("1XX")
  expect(new Response(null, { status: Status.MovedPermanently })).not.toRespondWithStatus("informational")
  expect(new Response(null, { status: Status.BadRequest })).not.toRespondWithStatus("1XX")
  expect(new Response(null, { status: Status.BadRequest })).not.toRespondWithStatus("informational")
  expect(new Response(null, { status: Status.InternalServerError })).not.toRespondWithStatus("1XX")
  expect(new Response(null, { status: Status.InternalServerError })).not.toRespondWithStatus("informational")
  expect(() => expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus(Status.OK)).toThrow("status to NOT be")
  expect(() => expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus([Status.OK])).toThrow("status to NOT be")
  expect(() => expect(new Response(null, { status: Status.OK })).toRespondWithStatus(Status.NotFound)).toThrow("status to be")
  expect(() => expect(new Response(null, { status: Status.OK })).toRespondWithStatus([Status.NotFound])).toThrow("status to be")
  expect(() => expect(new Response(null, { status: Status.SwitchingProtocols })).not.toRespondWithStatus("1XX")).toThrow("status to NOT be")
  expect(() => expect(new Response(null, { status: Status.SwitchingProtocols })).not.toRespondWithStatus("informational")).toThrow("status to NOT be")
  expect(() => expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus("2XX")).toThrow("status to NOT be")
  expect(() => expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus("successful")).toThrow("status to NOT be")
  expect(() => expect(new Response(null, { status: Status.MovedPermanently })).not.toRespondWithStatus("3XX")).toThrow("status to NOT be")
  expect(() => expect(new Response(null, { status: Status.MovedPermanently })).not.toRespondWithStatus("redirect")).toThrow("status to NOT be")
  expect(() => expect(new Response(null, { status: Status.BadRequest })).not.toRespondWithStatus("4XX")).toThrow("status to NOT be")
  expect(() => expect(new Response(null, { status: Status.BadRequest })).not.toRespondWithStatus("client_error")).toThrow("status to NOT be")
  expect(() => expect(new Response(null, { status: Status.InternalServerError })).not.toRespondWithStatus("5XX")).toThrow("status to NOT be")
  expect(() => expect(new Response(null, { status: Status.InternalServerError })).not.toRespondWithStatus("server_error")).toThrow("status to NOT be")
  expect(() => expect(new Response(null, { status: Status.SwitchingProtocols })).toRespondWithStatus("2XX")).toThrow("status to be")
  expect(() => expect(new Response(null, { status: Status.SwitchingProtocols })).toRespondWithStatus("successful")).toThrow("status to be")
  expect(() => expect(new Response(null, { status: Status.OK })).toRespondWithStatus("1XX")).toThrow("status to be")
  expect(() => expect(new Response(null, { status: Status.OK })).toRespondWithStatus("informational")).toThrow("status to be")
  expect(() => expect(new Response(null, { status: Status.MovedPermanently })).toRespondWithStatus("1XX")).toThrow("status to be")
  expect(() => expect(new Response(null, { status: Status.MovedPermanently })).toRespondWithStatus("informational")).toThrow("status to be")
  expect(() => expect(new Response(null, { status: Status.BadRequest })).toRespondWithStatus("1XX")).toThrow("status to be")
  expect(() => expect(new Response(null, { status: Status.BadRequest })).toRespondWithStatus("informational")).toThrow("status to be")
  expect(() => expect(new Response(null, { status: Status.InternalServerError })).toRespondWithStatus("1XX")).toThrow("status to be")
  expect(() => expect(new Response(null, { status: Status.InternalServerError })).toRespondWithStatus("informational")).toThrow("status to be")
  expect(new Response("Body is canceled", { status: Status.OK })).toRespondWithStatus(Status.OK)
})

test()("expect.toBeHashed() asserts value is hashed with specified algorithm", () => {
  expect(() => expect(null).toBeHashed("md5")).toThrow("is not of type")
  expect(() => expect("acbd18db4cc2f85cedef654fccc4a4d8").toBeHashed("<invalid>")).toThrow("is unknown")
  expect("acbd18db4cc2f85cedef654fccc4a4d8").toBeHashed("md5")
  expect("0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33").toBeHashed("sha1")
  expect("0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33").toBeHashed("SHA1")
  expect("0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33").toBeHashed("SHA-1")
  expect("$2a$12$lpGSoVPZ8erLDF93Sqyic.U73v0/w0owPb3dIP9goO7iC5Wp/I8OG").toBeHashed("bcrypt")
  expect("foo").not.toBeHashed("md5")
  expect(() => expect("acbd18db4cc2f85cedef654fccc4a4d8").not.toBeHashed("md5")).toThrow("to NOT be hashed")
  expect(() => expect("0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33").not.toBeHashed("sha1")).toThrow("to NOT be hashed")
  expect(() => expect("0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33").not.toBeHashed("SHA1")).toThrow("to NOT be hashed")
  expect(() => expect("0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33").not.toBeHashed("SHA-1")).toThrow("to NOT be hashed")
  expect(() => expect("$2a$12$lpGSoVPZ8erLDF93Sqyic.U73v0/w0owPb3dIP9goO7iC5Wp/I8OG").not.toBeHashed("bcrypt")).toThrow("to NOT be hashed")
  expect(() => expect("foo").toBeHashed("md5")).toThrow("to be hashed")
})

test()("expect.toBeDate() asserts value is a date", () => {
  expect(new Date()).toBeDate()
  expect(new Date().toISOString()).toBeDate()
  expect(Date.now()).toBeDate()
  expect("<invalid>").not.toBeDate()
  expect(() => expect(new Date()).not.toBeDate()).toThrow("to NOT be a date")
  expect(() => expect(new Date().toISOString()).not.toBeDate()).toThrow("to NOT be a date")
  expect(() => expect(Date.now()).not.toBeDate()).toThrow("to NOT be a date")
  expect(() => expect("<invalid>").toBeDate()).toThrow("to be a date")
})

test()("expect.toBePast() asserts value is a past date", () => {
  expect(new Date(Date.now() - 5000)).toBePast()
  expect(new Date(Date.now() + 5000)).not.toBePast()
  expect(new Date(Date.now() - 5000)).toBePast(new Date(Date.now() + 10000))
  expect(new Date(Date.now() + 5000)).not.toBePast(new Date(Date.now() - 10000))
  expect(() => expect(new Date(Date.now() + 5000)).toBePast()).toThrow("to be in the past")
  expect(() => expect(new Date(Date.now() - 5000)).not.toBePast()).toThrow("to NOT be in the past")
  expect(() => expect(new Date(Date.now() + 5000)).toBePast(new Date(Date.now() - 10000))).toThrow("to be in the past")
  expect(() => expect(new Date(Date.now() - 5000)).not.toBePast(new Date(Date.now() + 10000))).toThrow("to NOT be in the past")
})

test()("expect.toBeFuture() asserts value is a future date", () => {
  expect(new Date(Date.now() + 5000)).toBeFuture()
  expect(new Date(Date.now() - 5000)).not.toBeFuture()
  expect(new Date(Date.now() + 5000)).toBeFuture(new Date(Date.now() - 10000))
  expect(new Date(Date.now() - 5000)).not.toBeFuture(new Date(Date.now() + 10000))
  expect(() => expect(new Date(Date.now() - 5000)).toBeFuture()).toThrow("to be in the future")
  expect(() => expect(new Date(Date.now() + 5000)).not.toBeFuture()).toThrow("to NOT be in the future")
  expect(() => expect(new Date(Date.now() - 5000)).toBeFuture(new Date(Date.now() + 10000))).toThrow("to be in the future")
  expect(() => expect(new Date(Date.now() + 5000)).not.toBeFuture(new Date(Date.now() - 10000))).toThrow("to NOT be in the future")
})
