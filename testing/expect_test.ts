// Imports
import { test } from "./_testing.ts"
import { AssertionError, expect, Status } from "./expect.ts"

test()("expect.toSatisfy() asserts predicate", () => {
  expect("foo").toSatisfy((value: string) => value.length > 0)
  expect("foo").not.toSatisfy((value: string) => value.length === 0)
  expect(() => expect("foo").not.toSatisfy((value: string) => value.length > 0)).toThrow(AssertionError)
  expect(() => expect("foo").toSatisfy((value: string) => value.length === 0)).toThrow(AssertionError)
})

test()("expect.toBeType() asserts typeof", () => {
  expect("foo").toBeType("string")
  expect("foo").not.toBeType("number")
  expect(() => expect("foo").toBeType("number")).toThrow(AssertionError)
  expect(() => expect("foo").not.toBeType("string")).toThrow(AssertionError)
})

test()("expect.toMatchDescriptor() asserts Object.getOwnPropertyDescriptor", () => {
  const record = Object.defineProperties({}, { foo: { value: "bar", writable: false, enumerable: false } })
  expect(record).toMatchDescriptor("foo", { value: "bar" })
  expect(record).not.toMatchDescriptor("foo", { value: "baz" })
  expect(record).toMatchDescriptor("foo", { writable: false, enumerable: false })
  expect(record).not.toMatchDescriptor("foo", { writable: true, enumerable: true })
  expect(() => expect(record).toMatchDescriptor("foo", { value: "baz" })).toThrow(AssertionError)
  expect(() => expect(record).not.toMatchDescriptor("foo", { value: "bar" })).toThrow(AssertionError)
  expect(() => expect(record).toMatchDescriptor("foo", { writable: true, enumerable: true })).toThrow(AssertionError)
  expect(() => expect(record).not.toMatchDescriptor("foo", { writable: false, enumerable: false })).toThrow(AssertionError)
  expect(() => expect(record).toMatchDescriptor("bar", {})).toThrow(AssertionError)
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
  expect(() => expect(record).not.toBeImmutable("foo")).toThrow(AssertionError)
  expect(record).toEqual({ foo: true, bar: true })
  expect(() => expect(record).toBeImmutable("bar")).toThrow(AssertionError)
  expect(record).toEqual({ foo: true, bar: true })
})

test()("expect.toBeIterable() asserts value is iterable", () => {
  expect([]).toBeIterable()
  expect(new Set()).toBeIterable()
  expect(new Map()).toBeIterable()
  expect(1).not.toBeIterable()
  expect(() => expect([]).not.toBeIterable()).toThrow(AssertionError)
  expect(() => expect(new Set([])).not.toBeIterable()).toThrow(AssertionError)
  expect(() => expect(new Map([])).not.toBeIterable()).toThrow(AssertionError)
  expect(() => expect(1).toBeIterable()).toThrow(AssertionError)
})

test()("expect.toBeSealed() asserts value is sealed", () => {
  const sealed = Object.seal({})
  expect(sealed).toBeSealed()
  expect({}).not.toBeSealed()
  expect(() => expect(sealed).not.toBeSealed()).toThrow(AssertionError)
  expect(() => expect({}).toBeSealed()).toThrow(AssertionError)
})

test()("expect.toBeFrozen() asserts value is frozen", () => {
  const frozen = Object.freeze({})
  expect(frozen).toBeFrozen()
  expect({}).not.toBeFrozen()
  expect(() => expect(frozen).not.toBeFrozen()).toThrow(AssertionError)
  expect(() => expect({}).toBeFrozen()).toThrow(AssertionError)
})

test()("expect.toBeExtensible() asserts value is extensible", () => {
  const unextensible = Object.preventExtensions({})
  expect({}).toBeExtensible()
  expect(unextensible).not.toBeExtensible()
  expect(() => expect({}).not.toBeExtensible()).toThrow(AssertionError)
  expect(() => expect(unextensible).toBeExtensible()).toThrow(AssertionError)
})

test()("expect.toBeShallowCopy() asserts value is a shallow copy", () => {
  const object = { foo: "bar" }
  const array = [1, 2, 3]
  expect(object).toBeShallowCopy({ ...object })
  expect(object).not.toBeShallowCopy(object)
  expect(array).toBeShallowCopy([...array])
  expect(array).not.toBeShallowCopy(array)
  expect(() => expect(object).not.toBeShallowCopy({ ...object })).toThrow(AssertionError)
  expect(() => expect(object).toBeShallowCopy(object)).toThrow(AssertionError)
  expect(() => expect(array).not.toBeShallowCopy([...array])).toThrow(AssertionError)
  expect(() => expect(array).toBeShallowCopy(array)).toThrow(AssertionError)
})

test()("expect.toBeEmpty() asserts value is empty", () => {
  expect([]).toBeEmpty()
  expect(new Set()).toBeEmpty()
  expect(new Map()).toBeEmpty()
  expect([1]).not.toBeEmpty()
  expect(new Set([1])).not.toBeEmpty()
  expect(new Map([[1, 1]])).not.toBeEmpty()
  expect(() => expect([]).not.toBeEmpty()).toThrow(AssertionError)
  expect(() => expect(new Set()).not.toBeEmpty()).toThrow(AssertionError)
  expect(() => expect(new Map()).not.toBeEmpty()).toThrow(AssertionError)
  expect(() => expect([1]).toBeEmpty()).toThrow(AssertionError)
  expect(() => expect(new Set([1])).toBeEmpty()).toThrow(AssertionError)
  expect(() => expect(new Map([[1, 1]])).toBeEmpty()).toThrow(AssertionError)
})

test()("expect.toBeSorted() asserts value is sorted", () => {
  expect([1, 2, 3]).toBeSorted()
  expect([3, 2, 1]).not.toBeSorted()
  expect(() => expect([3, 2, 1]).toBeSorted()).toThrow(AssertionError)
  expect(() => expect([1, 2, 3]).not.toBeSorted()).toThrow(AssertionError)
})

test()("expect.toBeReverseSorted() asserts value is reverse sorted", () => {
  expect([3, 2, 1]).toBeReverseSorted()
  expect([1, 2, 3]).not.toBeReverseSorted()
  expect(() => expect([1, 2, 3]).toBeReverseSorted()).toThrow(AssertionError)
  expect(() => expect([3, 2, 1]).not.toBeReverseSorted()).toThrow(AssertionError)
})

test()("expect.toBeOneOf() asserts value is one of", () => {
  expect("foo").toBeOneOf(["foo", "bar"])
  expect("baz").not.toBeOneOf(["foo", "bar"])
  expect(() => expect("baz").toBeOneOf(["foo", "bar"])).toThrow(AssertionError)
  expect(() => expect("foo").not.toBeOneOf(["foo", "bar"])).toThrow(AssertionError)
})

test()("expect.toBeWithin() asserts value is within range", () => {
  expect(0).toBeWithin([0, 1])
  expect(1).toBeWithin([0, 1])
  expect(2).not.toBeWithin([0, 1])
  expect(0).not.toBeWithin([0, 1], true)
  expect(.5).toBeWithin([0, 1], true)
  expect(() => expect(0).not.toBeWithin([0, 1])).toThrow(AssertionError)
  expect(() => expect(1).not.toBeWithin([0, 1])).toThrow(AssertionError)
  expect(() => expect(2).toBeWithin([0, 1])).toThrow(AssertionError)
  expect(() => expect(0).toBeWithin([0, 1], true)).toThrow(AssertionError)
  expect(() => expect(.5).not.toBeWithin([0, 1], true)).toThrow(AssertionError)
})

test()("expect.toBeFinite() asserts value is finite", () => {
  expect(0).toBeFinite()
  expect(Infinity).not.toBeFinite()
  expect(NaN).not.toBeFinite()
  expect(() => expect(0).not.toBeFinite()).toThrow(AssertionError)
  expect(() => expect(Infinity).toBeFinite()).toThrow(AssertionError)
  expect(() => expect(NaN).toBeFinite()).toThrow(AssertionError)
})

test()("expect.toBeParseableJSON() asserts value is parseable JSON", () => {
  expect('{"foo":"bar"}').toBeParseableJSON()
  expect("<invalid>").not.toBeParseableJSON()
  expect(() => expect('{"foo":"bar"}').not.toBeParseableJSON()).toThrow(AssertionError)
  expect(() => expect("<invalid>").toBeParseableJSON()).toThrow(AssertionError)
})

test()("expect.toRespondWithStatus() asserts response status", () => {
  expect(new Response(null, { status: Status.OK })).toRespondWithStatus(Status.OK)
  expect(new Response(null, { status: Status.OK })).toRespondWithStatus([Status.OK])
  expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus(Status.NotFound)
  expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus([Status.NotFound])
  expect(new Response(null, { status: Status.SwitchingProtocols })).toRespondWithStatus("informational")
  expect(new Response(null, { status: Status.OK })).toRespondWithStatus("successful")
  expect(new Response(null, { status: Status.MovedPermanently })).toRespondWithStatus("redirect")
  expect(new Response(null, { status: Status.BadRequest })).toRespondWithStatus("client_error")
  expect(new Response(null, { status: Status.InternalServerError })).toRespondWithStatus("server_error")
  expect(new Response(null, { status: Status.SwitchingProtocols })).not.toRespondWithStatus("successful")
  expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus("informational")
  expect(new Response(null, { status: Status.MovedPermanently })).not.toRespondWithStatus("informational")
  expect(new Response(null, { status: Status.BadRequest })).not.toRespondWithStatus("informational")
  expect(new Response(null, { status: Status.InternalServerError })).not.toRespondWithStatus("informational")
  expect(() => expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus(Status.OK)).toThrow(AssertionError)
  expect(() => expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus([Status.OK])).toThrow(AssertionError)
  expect(() => expect(new Response(null, { status: Status.OK })).toRespondWithStatus(Status.NotFound)).toThrow(AssertionError)
  expect(() => expect(new Response(null, { status: Status.OK })).toRespondWithStatus([Status.NotFound])).toThrow(AssertionError)
  expect(() => expect(new Response(null, { status: Status.SwitchingProtocols })).not.toRespondWithStatus("informational")).toThrow(AssertionError)
  expect(() => expect(new Response(null, { status: Status.OK })).not.toRespondWithStatus("successful")).toThrow(AssertionError)
  expect(() => expect(new Response(null, { status: Status.MovedPermanently })).not.toRespondWithStatus("redirect")).toThrow(AssertionError)
  expect(() => expect(new Response(null, { status: Status.BadRequest })).not.toRespondWithStatus("client_error")).toThrow(AssertionError)
  expect(() => expect(new Response(null, { status: Status.InternalServerError })).not.toRespondWithStatus("server_error")).toThrow(AssertionError)
  expect(() => expect(new Response(null, { status: Status.SwitchingProtocols })).toRespondWithStatus("successful")).toThrow(AssertionError)
  expect(() => expect(new Response(null, { status: Status.OK })).toRespondWithStatus("informational")).toThrow(AssertionError)
  expect(() => expect(new Response(null, { status: Status.MovedPermanently })).toRespondWithStatus("informational")).toThrow(AssertionError)
  expect(() => expect(new Response(null, { status: Status.BadRequest })).toRespondWithStatus("informational")).toThrow(AssertionError)
  expect(() => expect(new Response(null, { status: Status.InternalServerError })).toRespondWithStatus("informational")).toThrow(AssertionError)
  expect(new Response("Body is canceled", { status: Status.OK })).toRespondWithStatus(Status.OK)
})
