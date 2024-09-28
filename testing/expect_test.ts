import { test } from "./_testing.ts"
import { AssertionError, expect, Status } from "./expect.ts"

test()("`expect` has typings", () => {
  // Built-in properties
  expect.any(null)
  // Built-in matchers
  expect(null).toBe(null)
  expect(null).not.toBe(true)
  // Extended matchers
  expect(null).toSatisfy(() => true)
  expect(null).not.toSatisfy(() => false)
})

test()("`expect._toThrow()` asserts a function throws", () => {
  class TestError extends Error {
    constructor() {
      super("Expected error")
    }
  }
  const throws = (error: typeof Error | typeof TestError) => () => {
    throw new error()
  }
  expect(throws(TestError))._toThrow()
  expect(throws(TestError))._toThrow(TestError)
  expect(throws(TestError))._toThrow(new TestError())
  expect(throws(TestError))._toThrow("Expected error")
  expect(throws(TestError))._toThrow(/Expected/)
  expect(throws(TestError))._toThrow(TestError, "Expected error")
  expect(throws(TestError))._toThrow(TestError, /Expected error/)
  expect(throws(TestError))._toThrow(new TestError(), "Expected error")
  expect(throws(TestError))._toThrow(new TestError(), /Expected error/)
  expect(() => expect(() => {})._toThrow()).toThrow("to be an Error object")
  expect(() => expect(throws(Error))._toThrow(TestError)).toThrow(`to be instance of "TestError"`)
  expect(() => expect(throws(Error))._toThrow(new TestError())).toThrow(`to be instance of "TestError"`)
  expect(() => expect(throws(Error))._toThrow("Expected error")).toThrow("error message to include")
  expect(() => expect(throws(Error))._toThrow(/Expected/)).toThrow("error message to include")
  expect(() => expect(throws(Error))._toThrow(Error, "Expected error")).toThrow("error message to include")
  expect(() => expect(throws(Error))._toThrow(Error, /Expected error/)).toThrow("error message to include")
  expect(() => expect(throws(Error))._toThrow(new Error(), "Expected error")).toThrow("error message to include")
  expect(() => expect(throws(Error))._toThrow(new Error(), /Expected error/)).toThrow("error message to include")
  expect(() => {}).not._toThrow()
  expect(throws(Error)).not._toThrow(TestError)
  expect(throws(Error)).not._toThrow(new TestError())
  expect(throws(Error)).not._toThrow("Expected error")
  expect(throws(Error)).not._toThrow(/Expected/)
  expect(throws(Error)).not._toThrow(Error, "Expected error")
  expect(throws(Error)).not._toThrow(Error, /Expected error/)
  expect(throws(Error)).not._toThrow(new Error(), "Expected error")
  expect(throws(Error)).not._toThrow(new Error(), /Expected error/)
  expect(() => expect(throws(Error)).not._toThrow()).toThrow("NOT throw")
  expect(() => expect(throws(Error)).not._toThrow(Error)).toThrow(/NOT throw .* Error/)
  expect(() => expect(throws(Error)).not._toThrow(new Error())).toThrow("NOT throw Error")
  expect(() => expect(throws(Error)).not._toThrow("")).toThrow("NOT throw")
  expect(() => expect(throws(Error)).not._toThrow(/^$/)).toThrow("NOT throw")
  expect(() => expect(throws(Error)).not._toThrow(Error, "")).toThrow(/NOT throw .* Error/)
  expect(() => expect(throws(Error)).not._toThrow(Error, /^$/)).toThrow("NOT throw")
  expect(() => expect(throws(Error)).not._toThrow(new Error(), "")).toThrow("NOT throw")
  expect(() => expect(throws(Error)).not._toThrow(new Error(), /^$/)).toThrow("NOT throw")
  expect(() => expect(null)._toThrow("foo", "bar"))._toThrow(TypeError, "First argument must be an Error class or instance when second argument is a string or RegExp")
})

test()("`expect.toSatisfy()` asserts predicate", () => {
  expect("foo").toSatisfy((value: string) => value.length > 0)
  expect("foo").not.toSatisfy((value: string) => value.length === 0)
  expect(() => expect("foo").not.toSatisfy((value: string) => value.length > 0))._toThrow(AssertionError, "to NOT satisfy")
  expect(() => expect("foo").toSatisfy((value: string) => value.length === 0))._toThrow(AssertionError, "to satisfy")
})

test()("`expect.toBeType()` asserts typeof", () => {
  expect("foo").toBeType("string")
  expect("foo").not.toBeType("number")
  expect(null).toBeType("object", { nullable: true })
  expect(null).not.toBeType("object", { nullable: false })
  expect(() => expect("foo").toBeType("number"))._toThrow(AssertionError, "to be of type")
  expect(() => expect("foo").not.toBeType("string"))._toThrow(AssertionError, "to NOT be of type")
  expect(() => expect(null).toBeType("object", { nullable: false }))._toThrow(AssertionError, "to be of type")
  expect(() => expect(null).not.toBeType("object", { nullable: true }))._toThrow(AssertionError, "to NOT be of type")
})

test()("`expect.toHaveDescribedProperty()` asserts `Object.getOwnPropertyDescriptor()`", () => {
  const record = Object.defineProperties({}, { foo: { value: "bar", writable: false, enumerable: false } })
  expect(record).toHaveDescribedProperty("foo", { value: "bar" })
  expect(record).not.toHaveDescribedProperty("foo", { value: "baz" })
  expect(record).toHaveDescribedProperty("foo", { writable: false, enumerable: false })
  expect(record).not.toHaveDescribedProperty("foo", { writable: true, enumerable: true })
  expect(() => expect(record).toHaveDescribedProperty("foo", { value: "baz" }))._toThrow(AssertionError, "does match")
  expect(() => expect(record).not.toHaveDescribedProperty("foo", { value: "bar" }))._toThrow(AssertionError, "does NOT match")
  expect(() => expect(record).toHaveDescribedProperty("foo", { writable: true, enumerable: true }))._toThrow(AssertionError, "does match")
  expect(() => expect(record).not.toHaveDescribedProperty("foo", { writable: false, enumerable: false }))._toThrow(AssertionError, "does NOT match")
  expect(() => expect(record).toHaveDescribedProperty("bar", {}))._toThrow(AssertionError, "does not exist")
})

test()("`expect.toHaveImmutableProperty()` asserts writable but not editable properties", () => {
  for (const target of [{}, function () {}]) {
    const record = Object.defineProperties(target, {
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
    const original = { ...record }
    expect(record).toMatchObject(original)
    expect(record).toHaveImmutableProperty("foo")
    expect(record).toMatchObject(original)
    expect(record).not.toHaveImmutableProperty("bar")
    expect(record).toMatchObject(original)
    expect(() => expect(record).not.toHaveImmutableProperty("foo"))._toThrow(AssertionError, "to NOT be")
    expect(record).toMatchObject(original)
    expect(() => expect(record).toHaveImmutableProperty("bar"))._toThrow(AssertionError, "to be")
    expect(record).toMatchObject(original)
  }
  expect(() => expect(null).toHaveImmutableProperty("foo"))._toThrow(AssertionError, "value is not indexed")
  expect(() => expect(1).toHaveImmutableProperty("foo"))._toThrow(AssertionError, "value is not indexed")
})

test()("`expect.toBeIterable()` asserts value is iterable", () => {
  expect([]).toBeIterable()
  expect(new Set()).toBeIterable()
  expect(new Map()).toBeIterable()
  expect(1).not.toBeIterable()
  expect(() => expect([]).not.toBeIterable())._toThrow(AssertionError, "to NOT be iterable")
  expect(() => expect(new Set([])).not.toBeIterable())._toThrow(AssertionError, "to NOT be iterable")
  expect(() => expect(new Map([])).not.toBeIterable())._toThrow(AssertionError, "to NOT be iterable")
  expect(() => expect(1).toBeIterable())._toThrow(AssertionError, "to be iterable")
})

test()("`expect.toBeSealed()` asserts value is sealed", () => {
  const sealed = Object.seal({})
  expect(sealed).toBeSealed()
  expect({}).not.toBeSealed()
  expect(() => expect(sealed).not.toBeSealed())._toThrow(AssertionError, "to NOT be sealed")
  expect(() => expect({}).toBeSealed())._toThrow(AssertionError, "to be sealed")
})

test()("`expect.toBeFrozen()` asserts value is frozen", () => {
  const frozen = Object.freeze({})
  expect(frozen).toBeFrozen()
  expect({}).not.toBeFrozen()
  expect(() => expect(frozen).not.toBeFrozen())._toThrow(AssertionError, "to NOT be frozen")
  expect(() => expect({}).toBeFrozen())._toThrow(AssertionError, "to be frozen")
})

test()("`expect.toBeExtensible()` asserts value is extensible", () => {
  const unextensible = Object.preventExtensions({})
  expect({}).toBeExtensible()
  expect(unextensible).not.toBeExtensible()
  expect(() => expect({}).not.toBeExtensible())._toThrow(AssertionError, "to NOT be extensible")
  expect(() => expect(unextensible).toBeExtensible())._toThrow(AssertionError, "to be extensible")
})

test()("`expect.toBeShallowCopyOf()` asserts value is a shallow copy", () => {
  const object = { foo: "bar" }
  const array = [1, 2, 3]
  expect(object).toBeShallowCopyOf({ ...object })
  expect(object).not.toBeShallowCopyOf(object)
  expect(array).toBeShallowCopyOf([...array])
  expect(array).not.toBeShallowCopyOf(array)
  expect(() => expect(object).not.toBeShallowCopyOf({ ...object }))._toThrow(AssertionError, "to NOT be a shallow copy")
  expect(() => expect(object).toBeShallowCopyOf(object))._toThrow(AssertionError, "to be a shallow copy")
  expect(() => expect(array).not.toBeShallowCopyOf([...array]))._toThrow(AssertionError, "to NOT be a shallow copy")
  expect(() => expect(array).toBeShallowCopyOf(array))._toThrow(AssertionError, "to be a shallow copy")
})

test()("`expect.toBeEmpty()` asserts value is empty", () => {
  expect([]).toBeEmpty()
  expect(new Set()).toBeEmpty()
  expect(new Map()).toBeEmpty()
  expect([1]).not.toBeEmpty()
  expect(new Set([1])).not.toBeEmpty()
  expect(new Map([[1, 1]])).not.toBeEmpty()
  expect(() => expect([]).not.toBeEmpty())._toThrow(AssertionError, "to NOT be empty")
  expect(() => expect(new Set()).not.toBeEmpty())._toThrow(AssertionError, "to NOT be empty")
  expect(() => expect(new Map()).not.toBeEmpty())._toThrow(AssertionError, "to NOT be empty")
  expect(() => expect([1]).toBeEmpty())._toThrow(AssertionError, "to be empty")
  expect(() => expect(new Set([1])).toBeEmpty())._toThrow(AssertionError, "to be empty")
  expect(() => expect(new Map([[1, 1]])).toBeEmpty())._toThrow(AssertionError, "to be empty")
})

test()("`expect.toBeSorted()` asserts value is sorted", () => {
  expect([1, 2, 3]).toBeSorted()
  expect([3, 2, 1]).not.toBeSorted()
  expect(() => expect([3, 2, 1]).toBeSorted())._toThrow(AssertionError, "to be sorted")
  expect(() => expect([1, 2, 3]).not.toBeSorted())._toThrow(AssertionError, "to NOT be sorted")
})

test()("`expect.toBeReverseSorted()` asserts value is reverse sorted", () => {
  expect([3, 2, 1]).toBeReverseSorted()
  expect([1, 2, 3]).not.toBeReverseSorted()
  expect(() => expect([1, 2, 3]).toBeReverseSorted())._toThrow(AssertionError, "to be reverse sorted")
  expect(() => expect([3, 2, 1]).not.toBeReverseSorted())._toThrow(AssertionError, "to NOT be reverse sorted")
})

test()("`expect.toBeOneOf()` asserts value is one of", () => {
  expect("foo").toBeOneOf(["foo", "bar"])
  expect("baz").not.toBeOneOf(["foo", "bar"])
  expect(() => expect("baz").toBeOneOf(["foo", "bar"]))._toThrow(AssertionError, "to be one of")
  expect(() => expect("foo").not.toBeOneOf(["foo", "bar"]))._toThrow(AssertionError, "to NOT be one of")
})

test()("`expect.toBeWithin()` asserts value is within range", () => {
  expect(0).toBeWithin([0, 1])
  expect(1).toBeWithin([0, 1])
  expect(2).not.toBeWithin([0, 1])
  expect(0).not.toBeWithin([0, 1], true)
  expect(.5).toBeWithin([0, 1], true)
  expect(() => expect(0).not.toBeWithin([0, 1]))._toThrow(AssertionError, "to NOT be within")
  expect(() => expect(1).not.toBeWithin([0, 1]))._toThrow(AssertionError, "to NOT be within")
  expect(() => expect(2).toBeWithin([0, 1]))._toThrow(AssertionError, "to be within")
  expect(() => expect(0).toBeWithin([0, 1], true))._toThrow(AssertionError, "to be within")
  expect(() => expect(.5).not.toBeWithin([0, 1], true))._toThrow(AssertionError, "to NOT be within")
})

test()("`expect.toBeFinite()` asserts value is finite", () => {
  expect(0).toBeFinite()
  expect(Infinity).not.toBeFinite()
  expect(NaN).not.toBeFinite()
  expect(() => expect(0).not.toBeFinite())._toThrow(AssertionError, "to NOT be finite")
  expect(() => expect(Infinity).toBeFinite())._toThrow(AssertionError, "to be finite")
  expect(() => expect(NaN).toBeFinite())._toThrow(AssertionError, "to be finite")
})

test()("`expect.toBeParseableJSON()` asserts value is parseable JSON", () => {
  expect('{"foo":"bar"}').toBeParseableJSON()
  expect("<invalid>").not.toBeParseableJSON()
  expect(() => expect('{"foo":"bar"}').not.toBeParseableJSON())._toThrow(AssertionError, "to NOT be parseable JSON")
  expect(() => expect("<invalid>").toBeParseableJSON())._toThrow(AssertionError, "to be parseable JSON")
})

test()("`expect.toBeEmail()` asserts value is parseable email", () => {
  expect("foo@example.com").toBeEmail()
  expect("foo+meta@example.com").toBeEmail()
  expect("<invalid>").not.toBeEmail()
  expect(() => expect("foo@example.com").not.toBeEmail())._toThrow(AssertionError, "to NOT be a valid email")
  expect(() => expect("foo+meta@example.com").not.toBeEmail())._toThrow(AssertionError, "to NOT be a valid email")
  expect(() => expect("<invalid>").toBeEmail())._toThrow(AssertionError, "to be a valid email")
})

test()("`expect.toBeUrl()` asserts value is parseable url", () => {
  expect("https://example.com").toBeUrl()
  expect(new URL("https://example.com")).toBeUrl()
  expect("<invalid>").not.toBeUrl()
  expect(() => expect("https://example.com").not.toBeUrl())._toThrow(AssertionError, "to NOT be a valid URL")
  expect(() => expect(new URL("https://example.com")).not.toBeUrl())._toThrow(AssertionError, "to NOT be a valid URL")
  expect(() => expect("<invalid>").toBeUrl())._toThrow(AssertionError, "to be a valid URL")
})

test()("`expect.toBeBase64()` asserts value is a valid base64 string", () => {
  expect(btoa("foo")).toBeBase64()
  expect("<invalid>").not.toBeBase64()
  expect(() => expect(btoa("foo")).not.toBeBase64())._toThrow(AssertionError, "to NOT be a valid base64 string")
  expect(() => expect("<invalid>").toBeBase64())._toThrow(AssertionError, "to be a valid base64 string")
})

test()("`expect.toRespondWithStatus()` asserts response status", () => {
  expect(() => expect({}).toRespondWithStatus(Status.OK))._toThrow(AssertionError, "is not a Response")
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
  expect(() => expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus(Status.OK))._toThrow(AssertionError, "status to NOT be")
  expect(() => expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus([Status.OK]))._toThrow(AssertionError, "status to NOT be")
  expect(() => expect(new Response(null, { status: Status.OK })).toRespondWithStatus(Status.NotFound))._toThrow(AssertionError, "status to be")
  expect(() => expect(new Response(null, { status: Status.OK })).toRespondWithStatus([Status.NotFound]))._toThrow(AssertionError, "status to be")
  expect(() => expect(new Response(null, { status: Status.SwitchingProtocols })).not.toRespondWithStatus("1XX"))._toThrow(AssertionError, "status to NOT be")
  expect(() => expect(new Response(null, { status: Status.SwitchingProtocols })).not.toRespondWithStatus("informational"))._toThrow(AssertionError, "status to NOT be")
  expect(() => expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus("2XX"))._toThrow(AssertionError, "status to NOT be")
  expect(() => expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus("successful"))._toThrow(AssertionError, "status to NOT be")
  expect(() => expect(new Response(null, { status: Status.MovedPermanently })).not.toRespondWithStatus("3XX"))._toThrow(AssertionError, "status to NOT be")
  expect(() => expect(new Response(null, { status: Status.MovedPermanently })).not.toRespondWithStatus("redirect"))._toThrow(AssertionError, "status to NOT be")
  expect(() => expect(new Response(null, { status: Status.BadRequest })).not.toRespondWithStatus("4XX"))._toThrow(AssertionError, "status to NOT be")
  expect(() => expect(new Response(null, { status: Status.BadRequest })).not.toRespondWithStatus("client_error"))._toThrow(AssertionError, "status to NOT be")
  expect(() => expect(new Response(null, { status: Status.InternalServerError })).not.toRespondWithStatus("5XX"))._toThrow(AssertionError, "status to NOT be")
  expect(() => expect(new Response(null, { status: Status.InternalServerError })).not.toRespondWithStatus("server_error"))._toThrow(AssertionError, "status to NOT be")
  expect(() => expect(new Response(null, { status: Status.SwitchingProtocols })).toRespondWithStatus("2XX"))._toThrow(AssertionError, "status to be")
  expect(() => expect(new Response(null, { status: Status.SwitchingProtocols })).toRespondWithStatus("successful"))._toThrow(AssertionError, "status to be")
  expect(() => expect(new Response(null, { status: Status.OK })).toRespondWithStatus("1XX"))._toThrow(AssertionError, "status to be")
  expect(() => expect(new Response(null, { status: Status.OK })).toRespondWithStatus("informational"))._toThrow(AssertionError, "status to be")
  expect(() => expect(new Response(null, { status: Status.MovedPermanently })).toRespondWithStatus("1XX"))._toThrow(AssertionError, "status to be")
  expect(() => expect(new Response(null, { status: Status.MovedPermanently })).toRespondWithStatus("informational"))._toThrow(AssertionError, "status to be")
  expect(() => expect(new Response(null, { status: Status.BadRequest })).toRespondWithStatus("1XX"))._toThrow(AssertionError, "status to be")
  expect(() => expect(new Response(null, { status: Status.BadRequest })).toRespondWithStatus("informational"))._toThrow(AssertionError, "status to be")
  expect(() => expect(new Response(null, { status: Status.InternalServerError })).toRespondWithStatus("1XX"))._toThrow(AssertionError, "status to be")
  expect(() => expect(new Response(null, { status: Status.InternalServerError })).toRespondWithStatus("informational"))._toThrow(AssertionError, "status to be")
  expect(new Response("Body is canceled", { status: Status.OK })).toRespondWithStatus(Status.OK)
})

test()("`expect.toBeHashed()` asserts value is likely to be hashed with specified algorithm", () => {
  expect(() => expect(null).toBeHashed("md5"))._toThrow(AssertionError, "is not of type")
  expect(() => expect("acbd18db4cc2f85cedef654fccc4a4d8").toBeHashed("<invalid>"))._toThrow(AssertionError, "is unknown")
  expect(() => expect("same length as hash but not one!").toBeHashed("md5"))._toThrow(AssertionError, "contains non-hexadecimal characters")
  expect("acbd18db4cc2f85cedef654fccc4a4d8").toBeHashed("md5")
  expect("0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33").toBeHashed("sha1")
  expect("0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33").toBeHashed("SHA1")
  expect("0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33").toBeHashed("SHA-1")
  expect("$2a$12$lpGSoVPZ8erLDF93Sqyic.U73v0/w0owPb3dIP9goO7iC5Wp/I8OG").toBeHashed("bcrypt")
  expect("foo").not.toBeHashed("md5")
  expect(() => expect("acbd18db4cc2f85cedef654fccc4a4d8").not.toBeHashed("md5"))._toThrow(AssertionError, "to NOT be hashed")
  expect(() => expect("0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33").not.toBeHashed("sha1"))._toThrow(AssertionError, "to NOT be hashed")
  expect(() => expect("0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33").not.toBeHashed("SHA1"))._toThrow(AssertionError, "to NOT be hashed")
  expect(() => expect("0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33").not.toBeHashed("SHA-1"))._toThrow(AssertionError, "to NOT be hashed")
  expect(() => expect("$2a$12$lpGSoVPZ8erLDF93Sqyic.U73v0/w0owPb3dIP9goO7iC5Wp/I8OG").not.toBeHashed("bcrypt"))._toThrow(AssertionError, "to NOT be hashed")
  expect(() => expect("foo").toBeHashed("md5"))._toThrow(AssertionError, "to be hashed")
})

test()("`expect.toBeDate()` asserts value is a valid date", () => {
  expect(new Date()).toBeDate()
  expect(new Date().toISOString()).toBeDate()
  expect(Date.now()).toBeDate()
  expect("<invalid>").not.toBeDate()
  expect(() => expect(new Date()).not.toBeDate())._toThrow(AssertionError, "to NOT be a date")
  expect(() => expect(new Date().toISOString()).not.toBeDate())._toThrow(AssertionError, "to NOT be a date")
  expect(() => expect(Date.now()).not.toBeDate())._toThrow(AssertionError, "to NOT be a date")
  expect(() => expect("<invalid>").toBeDate())._toThrow(AssertionError, "to be a date")
})

test()("`expect.toBePast()` asserts value is a past date", () => {
  expect(new Date(Date.now() - 5000)).toBePast()
  expect(new Date(Date.now() + 5000)).not.toBePast()
  expect(new Date(Date.now() - 5000)).toBePast(new Date(Date.now() + 10000))
  expect(new Date(Date.now() + 5000)).not.toBePast(new Date(Date.now() - 10000))
  expect(() => expect(new Date(Date.now() + 5000)).toBePast())._toThrow(AssertionError, "to be in the past")
  expect(() => expect(new Date(Date.now() - 5000)).not.toBePast())._toThrow(AssertionError, "to NOT be in the past")
  expect(() => expect(new Date(Date.now() + 5000)).toBePast(new Date(Date.now() - 10000)))._toThrow(AssertionError, "to be in the past")
  expect(() => expect(new Date(Date.now() - 5000)).not.toBePast(new Date(Date.now() + 10000)))._toThrow(AssertionError, "to NOT be in the past")
})

test()("`expect.toBeFuture()` asserts value is a future date", () => {
  expect(new Date(Date.now() + 5000)).toBeFuture()
  expect(new Date(Date.now() - 5000)).not.toBeFuture()
  expect(new Date(Date.now() + 5000)).toBeFuture(new Date(Date.now() - 10000))
  expect(new Date(Date.now() - 5000)).not.toBeFuture(new Date(Date.now() + 10000))
  expect(() => expect(new Date(Date.now() - 5000)).toBeFuture())._toThrow(AssertionError, "to be in the future")
  expect(() => expect(new Date(Date.now() + 5000)).not.toBeFuture())._toThrow(AssertionError, "to NOT be in the future")
  expect(() => expect(new Date(Date.now() - 5000)).toBeFuture(new Date(Date.now() + 10000)))._toThrow(AssertionError, "to be in the future")
  expect(() => expect(new Date(Date.now() + 5000)).not.toBeFuture(new Date(Date.now() - 10000)))._toThrow(AssertionError, "to NOT be in the future")
})
