// Imports
import { expect as _expect, type Expected } from "@std/expect"
import { assert, assertEquals, assertInstanceOf, type AssertionError as _AssertionError, assertNotEquals, assertNotStrictEquals, assertObjectMatch, assertStrictEquals } from "@std/assert"
import type { Arg, Arrayable, callback, Nullable, record, TypeOf } from "@libs/typing"
import type { testing } from "./mod.ts"
import { STATUS_CODE as Status } from "@std/http/status"

// deno-lint-ignore no-explicit-any
type Async<T> = { [K in keyof T]: T[K] extends (...args: any[]) => unknown ? (...args: Parameters<T[K]>) => Promise<ReturnType<T[K]>> : T[K] }

/** The ExtendedExpected interface defines the available assertion methods. */
export interface ExtendedExpected<IsAsync = false> extends Expected {
  /** Asserts a value matches the given predicate. */
  toSatisfy: (evaluate: callback) => unknown
  /** Asserts a value is of a given type (using `typeof` operator). */
  toBeType: (type: string) => unknown
  /** Asserts a property matches a given descriptor (using `Object.getOwnPropertyDescriptor`). */
  toMatchDescriptor: (key: PropertyKey, expected: PropertyDescriptor) => unknown
  /** Asserts a writable property is immutable (i.e. setting its value does not throw but does not change its value either). Note that it will actually proceed to assign `testValue` and restore it to original value after test. */
  toBeImmutable: (key: PropertyKey, testValue?: unknown) => unknown
  /** Assert an object is iterable (checking `Symbol.iterator` presence). */
  toBeIterable: () => unknown
  /** Assert an object is sealed (using `Object.isSealed`). */
  toBeSealed: () => unknown
  /** Assert an object is frozen (using `Object.isFrozen`). */
  toBeFrozen: () => unknown
  /** Assert an object is extensible (using `Object.isExtensible`). */
  toBeExtensible: () => unknown
  /** Asserts an object is a shallow copy (i.e. its content is identical but reference is not). */
  toBeShallowCopy: (expected?: Iterable<unknown> | record) => unknown
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
  /** Asserts a response to have a given status code. */
  toRespondWithStatus: (status: Arrayable<number> | "informational" | "successful" | "redirect" | "client_error" | "server_error") => unknown
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
function process(evaluate: callback, prefix = ""): { message: () => string; pass: boolean } {
  let error = null
  try {
    evaluate()
  } catch (caught) {
    error = caught
  }
  return { message: () => `${prefix}${error}`, pass: !error }
}

/** Asserts a value is iterable. */
function assertIsIterable(value: testing): asserts value is Iterable<unknown> {
  assertNotEquals(value, null)
  if (typeof value[Symbol.iterator] !== "function") {
    throw new AssertionError("Value is not iterable")
  }
}

/** Asserts a value is of a given type. */
function assertType(value: testing, type: "string"): asserts value is string
function assertType(value: testing, type: "number"): asserts value is number
function assertType(value: testing, type: "bigint"): asserts value is bigint
function assertType(value: testing, type: "boolean"): asserts value is boolean
function assertType(value: testing, type: "symbol"): asserts value is symbol
function assertType(value: testing, type: "undefined"): asserts value is undefined
function assertType(value: testing, type: "object", notnull?: false): asserts value is Nullable<record>
function assertType(value: testing, type: "object", notnull: true): asserts value is record
function assertType(value: testing, type: "function"): asserts value is callback
function assertType(value: testing, type: TypeOf, notnull?: boolean) {
  assert((typeof value) === type, `Value is not of type "${type}"`)
  if ((type === "object") && notnull) {
    assert(value, `Value is of type "object" but is null`)
  }
}

_expect.extend({
  toSatisfy(context, predicate) {
    return process(() => {
      assert(predicate(context.value), "Value does not satisfy predicate")
    })
  },
  toBeType(context, type) {
    return process(() => {
      assertType(context.value, type)
    })
  },
  toMatchDescriptor(context, key, expected) {
    return process(() => {
      assertType(context.value, "object", !null)
      const descriptor = Object.getOwnPropertyDescriptor(context.value, key)
      if (!descriptor) {
        throw new Error(`Property "${String(key)}" does not exist on object`)
      }
      assertObjectMatch(descriptor, expected)
    }, `Property "${String(key)}" does not match provided descriptor, `)
  },
  toBeImmutable(context, key, testValue = Symbol()) {
    return process(() => {
      assertType(context.value, "object", !null)
      const value = context.value
      const current = value[key]
      try {
        value[key] = testValue
        assertStrictEquals(value[key], current)
      } finally {
        value[key] = current
      }
    }, `Property "${String(key)}" is not immutable, previous and current `)
  },
  toBeIterable(context) {
    return process(() => {
      assertIsIterable(context.value)
    }, `Value is not iterable, `)
  },
  toBeSealed(context) {
    return process(() => {
      assert(Object.isSealed(context.value), `Value is not sealed`)
    })
  },
  toBeFrozen(context) {
    return process(() => {
      assert(Object.isFrozen(context.value), `Value is not frozen`)
    })
  },
  toBeExtensible(context) {
    return process(() => {
      assert(Object.isExtensible(context.value), `Value is not extensible`)
    })
  },
  toBeShallowCopy(context, expected) {
    return process(() => {
      assertEquals(context.value, expected)
      assertNotStrictEquals(context.value, expected, `Detected same-reference`)
    }, `Value is not a shallow copy, `)
  },
  toBeEmpty(context) {
    return process(() => {
      assertIsIterable(context.value)
      assertStrictEquals([...context.value].length, 0)
    }, `Value is not empty, `)
  },
  toBeSorted(context, compare) {
    return process(() => {
      const value = context.value
      assertIsIterable(value)
      assertEquals([...value], [...value].sort(compare))
    }, `Value is not sorted, `)
  },
  toBeReverseSorted(context, compare) {
    return process(() => {
      assertIsIterable(context.value)
      assertEquals([...context.value], [...context.value].sort(compare).reverse())
    }, `Value is not reverse sorted, `)
  },
  toBeOneOf(context, values) {
    return process(() => {
      assert([...values].includes(context.value), `Value "${context.value}" is not one of expected values, `)
    })
  },
  toBeWithin(context, range, exclusive) {
    return process(() => {
      const value = context.value
      const [min, max] = range
      assertType(value, "number")
      assertType(min, "number")
      assertType(max, "number")
      exclusive ? assert(value > min && value < max) : assert(value >= min && value <= max)
    }, `Value is not within range ${exclusive ? `]${range[0]}, ${range[1]}[` : `[${range[0]}, ${range[1]}]`}, `)
  },
  toBeFinite(context) {
    return process(() => {
      assertType(context.value, "number")
      assert(Number.isFinite(context.value), `Value is not finite, `)
    })
  },
  toBeParseableJSON(context, reviver) {
    return process(() => {
      assertType(context.value, "string")
      JSON.parse(context.value, reviver)
    }, `Value is not JSON serializable, `)
  },
  toRespondWithStatus(context, code) {
    return process(() => {
      assertInstanceOf(context.value, Response)
      try {
        const status = context.value.status
        switch (code) {
          case "informational":
            assert(status >= 100 && status < 200, `Expected response status to be "${code}" (100-199) but got ${status}`)
            break
          case "successful":
            assert(status >= 200 && status < 300, `Expected response status to be "${code}" (200-299) but got ${status}`)
            break
          case "redirect":
            assert(status >= 300 && status < 400, `Expected response status to be "${code}" (300-399) but got ${status}`)
            break
          case "client_error":
            assert(status >= 400 && status < 500, `Expected response status to be "${code}" (400-499) but got ${status}`)
            break
          case "server_error":
            assert(status >= 500 && status < 600, `Expected response status to be "${code}" (500-599) but got ${status}`)
            break
          default: {
            const codes = [code].flat()
            assert(codes.includes(status), `Expected response status to be [${codes.join(", ")}] but got ${status}`)
          }
        }
      } finally {
        context.value.body?.cancel()
      }
    })
  },
})

/** https://jsr.io/@std/expect/doc/~/expect. */
const expect = _expect as unknown as ((...args: Parameters<typeof _expect>) => ExtendedExpected)

export { AssertionError, expect, Status }
