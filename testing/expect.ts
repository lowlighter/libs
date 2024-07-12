/**
 * @module
 * Extended version of `@std/expect`.
 */

// Imports
import { expect as _expect, type Expected, fn } from "@std/expect"
import { assert, assertEquals, type AssertionError as _AssertionError, assertMatch, assertNotEquals, assertNotStrictEquals, assertObjectMatch, assertStrictEquals } from "@std/assert"
import type { Arg, Arrayable, callback, Nullable, record, TypeOf } from "@libs/typing"
import type { testing } from "./_testing.ts"
import { STATUS_CODE as Status } from "@std/http/status"

/** Asynchronous version of a record. */
// deno-lint-ignore no-explicit-any
type Async<T> = { [K in keyof T]: T[K] extends (...args: any[]) => unknown ? (...args: Parameters<T[K]>) => Promise<ReturnType<T[K]>> : T[K] }

/** The ExtendedExpected interface defines the available assertion methods. */
export interface ExtendedExpected<IsAsync = false> extends Expected {
  /** Asserts a value matches the given predicate. */
  toSatisfy: (evaluate: callback) => unknown
  /** Asserts a value is of a given type (using `typeof` operator). */
  toBeType: (type: string, notnull?: boolean) => unknown
  /** Asserts a property matches a given descriptor (using `Object.getOwnPropertyDescriptor`). */
  toHaveDescribedProperty: (key: PropertyKey, expected: PropertyDescriptor) => unknown
  /** Asserts a writable property is immutable (i.e. setting its value does not throw but does not change its value either). Note that it will actually proceed to assign `testValue` and restore it to original value after test. */
  toHaveImmutableProperty: (key: PropertyKey, testValue?: unknown) => unknown
  /** Assert an object is iterable (checking `Symbol.iterator` presence). */
  toBeIterable: () => unknown
  /** Assert an object is sealed (using `Object.isSealed`). */
  toBeSealed: () => unknown
  /** Assert an object is frozen (using `Object.isFrozen`). */
  toBeFrozen: () => unknown
  /** Assert an object is extensible (using `Object.isExtensible`). */
  toBeExtensible: () => unknown
  /** Asserts an object is a shallow copy (i.e. its content is identical but reference is not). */
  toBeShallowCopyOf: (expected?: Iterable<unknown> | record) => unknown
  /** Asserts an iterable is empty. */
  toBeEmpty: () => unknown
  /** Asserts an iterable to be sorted. */
  toBeSorted: (compare?: Arg<Array<unknown>["sort"]>) => unknown
  /** Asserts an iterable to be reverse sorted. */
  toBeReverseSorted: (compare?: Arg<Array<unknown>["sort"]>) => unknown
  /** Asserts a value is one of expected value. */
  toBeOneOf: (values: Iterable<unknown>) => unknown
  /** Asserts a number is with a given range. */
  toBeWithin: (range: [number, number], exclusive?: boolean) => unknown
  /** Asserts a number to be finite. */
  toBeFinite: () => unknown
  /** Asserts a string to be parseable JSON. */
  toBeParseableJSON: (reviver?: Arg<JSON["parse"], 1>) => unknown
  /** Asserts a string is a valid email address (using https://pdw.ex-parrot.com/Mail-RFC822-Address.html). */
  toBeEmail(): () => unknown
  /** Asserts a string is a valid url (using `URL`). */
  toBeUrl(): () => unknown
  /** Asserts a string is a valid base64 string. */
  toBeBase64: () => unknown
  /** Asserts a response to have a given status code. Note that `Response.body.cancel()` is automatically called to prevent leaks. If you need to perform more assertions on a response, it is advised use separate matchers instead. */
  toRespondWithStatus: (status: Arrayable<number> | "informational" | "1XX" | "successful" | "2XX" | "redirect" | "3XX" | "client_error" | "4XX" | "server_error" | "5XX") => unknown
  /** Asserts a string is hashed by specified algorithm. Algorithm may be either lowercase or uppercase, and contains dashes or not (e.g. `sha256`, `SHA256` and `SHA-256` will all be treated as the same). Will throw if an unknown algorithm is specified. */
  toBeHashed: (algorithm: string) => unknown
  /** Asserts a value is a valid date (using `Date`). */
  toBeDate: () => unknown
  /** Asserts a date is before another date. */
  toBePast: (date?: number | string | Date) => unknown
  /** Asserts a date is after another date. */
  toBeFuture: (date?: number | string | Date) => unknown
  /** The negation object that allows chaining negated assertions. */
  not: IsAsync extends true ? Async<ExtendedExpected<true>> : ExtendedExpected<false>
  /** The object that allows chaining assertions with async functions that are expected to resolve to a value. */
  resolves: Async<ExtendedExpected<true>>
  /** The object that allows chaining assertions with async functions that are expected to throw an error. */
  rejects: Async<ExtendedExpected<true>>
}

/** Error thrown when an assertion fails. */
let AssertionError: typeof _AssertionError

// AssertionError is not exported by `@std/expect` (and it differs from `@std/assert`) which is why we retrieve it this way
try {
  _expect(null).toBe(true)
} catch (error) {
  AssertionError = error.constructor
}

/** Process callback and format result to match {@link Expected} result interface. */
function process(not: boolean, evaluate: callback, message = ""): { message: () => string; pass: boolean } {
  let pass = true
  try {
    evaluate()
  } catch (error) {
    if (error.name === AssertionError.name) {
      pass = false
      message += message ? `${error.message.charAt(0).toLocaleLowerCase()}${error.message.substring(1)}` : error.message
    } else {
      pass = not
      message = error.message
    }
  }
  message = message
    .replaceAll("{!NOT} ", not ? "NOT " : "")
    .replaceAll("{NOT} ", not ? "" : "NOT")
    .replace(/,\s*$/, "").trim()
  return { message: () => message, pass }
}

/** Asserts a value is iterable. */
function isIterable(value: testing): asserts value is Iterable<unknown> {
  assertNotEquals(value, null)
  if (typeof value[Symbol.iterator] !== "function") {
    throw new TypeError("Value is not iterable")
  }
}

/** Asserts a value is of a given type. */
function isType(value: testing, type: "string"): asserts value is string
function isType(value: testing, type: "number"): asserts value is number
function isType(value: testing, type: "bigint"): asserts value is bigint
function isType(value: testing, type: "boolean"): asserts value is boolean
function isType(value: testing, type: "symbol"): asserts value is symbol
function isType(value: testing, type: "undefined"): asserts value is undefined
function isType(value: testing, type: "object", notnull?: false): asserts value is Nullable<record>
function isType(value: testing, type: "object", notnull: true): asserts value is record
function isType(value: testing, type: "function"): asserts value is callback
function isType(value: testing, type: TypeOf, notnull?: boolean) {
  if ((typeof value) !== type) {
    throw new TypeError(`Value is not of type "${type}"`)
  }
  if (notnull && (type === "object") && (value === null)) {
    throw new TypeError(`Value is null`)
  }
}

_expect.extend({
  toSatisfy(context, predicate) {
    return process(context.isNot, () => {
      assert(predicate(context.value))
    }, "Expected value to {!NOT} satisfy predicate")
  },
  toBeType(context, type, notnull) {
    return process(context.isNot, () => {
      try {
        isType(context.value, type, notnull)
      } catch (error) {
        throw new AssertionError(error.message)
      }
    }, `Expected value to {!NOT} be of type "${type}"${notnull ? " and not null but " : ""}`)
  },
  toHaveDescribedProperty(context, key, expected) {
    return process(context.isNot, () => {
      isType(context.value, "object", !null)
      const descriptor = Object.getOwnPropertyDescriptor(context.value, key)
      if (!descriptor) {
        throw new ReferenceError(`Property "${String(key)}" does not exist on object`)
      }
      assertObjectMatch(descriptor, expected)
    }, `Property "${String(key)}" does {!NOT} match provided descriptor, `)
  },
  toHaveImmutableProperty(context, key, testValue = Symbol()) {
    return process(context.isNot, () => {
      const value = context.value as Nullable<record>
      if ((value === null) || ((typeof value !== "function") && (typeof value !== "object"))) {
        throw new TypeError("Cannot be processed as value is not indexed")
      }
      const current = value[key]
      try {
        value[key] = testValue
        assertStrictEquals(value[key], current)
      } finally {
        value[key] = current
      }
    }, `Expected property "${String(key)}" to {!NOT} be immutable, previous and current `)
  },
  toBeIterable(context) {
    return process(context.isNot, () => {
      try {
        isIterable(context.value)
      } catch (error) {
        throw new AssertionError(error.message)
      }
    }, `Expected value to {!NOT} be iterable, `)
  },
  toBeSealed(context) {
    return process(context.isNot, () => {
      assert(Object.isSealed(context.value))
    }, `Expected value to {!NOT} be sealed`)
  },
  toBeFrozen(context) {
    return process(context.isNot, () => {
      assert(Object.isFrozen(context.value))
    }, `Expected value to {!NOT} be frozen`)
  },
  toBeExtensible(context) {
    return process(context.isNot, () => {
      assert(Object.isExtensible(context.value))
    }, `Expected value to {!NOT} be extensible`)
  },
  toBeShallowCopyOf(context, expected) {
    return process(context.isNot, () => {
      assertEquals(context.value, expected)
      assertNotStrictEquals(context.value, expected, `Detected same-reference`)
    }, `Expected value to {!NOT} be a shallow copy, `)
  },
  toBeEmpty(context) {
    return process(context.isNot, () => {
      isIterable(context.value)
      assertStrictEquals([...context.value].length, 0)
    }, `Expected value to {!NOT} be empty, `)
  },
  toBeSorted(context, compare) {
    return process(context.isNot, () => {
      const value = context.value
      isIterable(value)
      assertEquals([...value], [...value].sort(compare))
    }, `Expected value to {!NOT} be sorted, `)
  },
  toBeReverseSorted(context, compare) {
    return process(context.isNot, () => {
      isIterable(context.value)
      assertEquals([...context.value], [...context.value].sort(compare).reverse())
    }, `Expected value to {!NOT} be reverse sorted, `)
  },
  toBeOneOf(context, values) {
    return process(context.isNot, () => {
      assert([...values].includes(context.value))
    }, `Expected value "${context.value}" to {!NOT} be one of expected values`)
  },
  toBeWithin(context, range, exclusive) {
    return process(context.isNot, () => {
      const value = context.value
      const [min, max] = range
      isType(value, "number")
      isType(min, "number")
      isType(max, "number")
      exclusive ? assert(value > min && value < max) : assert(value >= min && value <= max)
    }, `Expected value to {!NOT} be within range ${exclusive ? `]${range[0]}, ${range[1]}[` : `[${range[0]}, ${range[1]}]`}, `)
  },
  toBeFinite(context) {
    return process(context.isNot, () => {
      isType(context.value, "number")
      assert(Number.isFinite(context.value))
    }, `Expected value to {!NOT} be finite, `)
  },
  toBeParseableJSON(context, reviver) {
    return process(context.isNot, () => {
      try {
        JSON.parse(`${context.value}`, reviver)
      } catch (error) {
        throw new AssertionError(error.message)
      }
    }, `Expected value to {!NOT} be parseable JSON, `)
  },
  toBeEmail(context) {
    return process(context.isNot, () => {
      // https://pdw.ex-parrot.com/Mail-RFC822-Address.html
      assertMatch(
        `${context.value}`,
        // deno-lint-ignore no-control-regex
        /(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)|(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*:(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)(?:,\s*(?:(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \x00-\x19]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*))*)?;\s*)/,
      )
    }, `Expected "${context.value}" to {!NOT} be a valid email`)
  },
  toBeUrl(context) {
    return process(context.isNot, () => {
      assert(URL.canParse(`${context.value}`))
    }, `Expected "${context.value}" to {!NOT} be a valid URL`)
  },
  toBeBase64(context) {
    return process(context.isNot, () => {
      try {
        atob(`${context.value}`)
      } catch (error) {
        throw new AssertionError(error.message)
      }
    }, `Expected "${context.value}" to {!NOT} be a valid base64 string`)
  },
  toRespondWithStatus(context, code) {
    return process(context.isNot, () => {
      if (!(context.value instanceof Response)) {
        throw new TypeError("Value is not a Response object")
      }
      let ok = false
      let message = ""
      const status = context.value.status
      switch (code) {
        case "1XX":
        case "informational":
          ok = status >= 100 && status < 200
          message = `"${code}" (100-199) but got ${status}`
          break
        case "2XX":
        case "successful":
          ok = status >= 200 && status < 300
          message = `"${code}" (200-299) but got ${status}`
          break
        case "3XX":
        case "redirect":
          ok = status >= 300 && status < 400
          message = `"${code}" (300-399) but got ${status}`
          break
        case "4XX":
        case "client_error":
          ok = status >= 400 && status < 500
          message = `"${code}" (400-499) but got ${status}`
          break
        case "5XX":
        case "server_error":
          ok = status >= 500 && status < 600
          message = `"${code}" (500-599) but got ${status}`
          break
        default: {
          const codes = [code].flat()
          ok = codes.includes(status)
          message = `[${codes.join(", ")}] but got ${status}`
        }
      }
      try {
        if ((context.isNot) && (ok === context.isNot)) {
          throw new TypeError(`Expected response status to {!NOT} be ${message}`)
        }
        if ((context.isNot) || (ok === context.isNot)) {
          throw new AssertionError(`Expected response status to {!NOT} be ${message}`)
        }
      } finally {
        context.value.body?.cancel()
      }
    })
  },
  toBeHashed(context, algorithm) {
    return process(context.isNot, () => {
      isType(context.value, "string")
      algorithm = algorithm.toLocaleLowerCase().replace("-", "")
      const algorithms = {
        "bcrypt": 0,
        "md5": 32,
        "sha0": 40,
        "sha1": 40,
        "sha224": 56,
        "sha256": 64,
        "sha384": 96,
        "sha512": 128,
        "sha512/224": 56,
        "sha512/256": 64,
      } as record<number>
      if (algorithms[algorithm]) {
        assertStrictEquals(context.value.length, algorithms[algorithm])
        if (!/^[a-z0-9]+$/i.test(context.value)) {
          throw new TypeError("Value contains non-hexadecimal characters")
        }
        return
      }
      if (algorithm === "bcrypt") {
        assertMatch(context.value, /^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/)
        return
      }
      throw new RangeError(`Algorithm "${algorithm}" is unknown`)
    }, `Expected value to {!NOT} be hashed by ${algorithm}, `)
  },
  toBeDate(context) {
    return process(context.isNot, () => {
      assert(Number.isFinite(new Date(context.value as number | string | Date).getTime()))
    }, `Expected value to {!NOT} be a date, `)
  },
  toBePast(context, ref = new Date()) {
    return process(context.isNot, () => {
      const date = new Date(context.value as number | string | Date)
      if (date > ref) {
        throw new AssertionError(`${date.toISOString()} is after ${ref.toISOString()}`)
      }
    }, `Expected value to {!NOT} be in the past, `)
  },
  toBeFuture(context, ref = new Date()) {
    return process(context.isNot, () => {
      const date = new Date(context.value as number | string | Date)
      if (date < ref) {
        throw new AssertionError(`${date.toISOString()} is before ${ref.toISOString()}`)
      }
    }, `Expected value to {!NOT} be in the future, `)
  },
})

/** https://jsr.io/@std/expect/doc/~/expect. */
const expect = _expect as unknown as ((...args: Parameters<typeof _expect>) => ExtendedExpected) & { [K in keyof typeof _expect]: typeof _expect[K] }

export { AssertionError, expect, fn, Status }
export type { _AssertionError, _expect, Arg, Arrayable, Async, callback, Expected, Nullable, record, TypeOf }
