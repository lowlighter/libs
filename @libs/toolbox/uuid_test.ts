// Imports
import { expect } from "@libs/testing"
import { inspect } from "@libs/testing/highlight"
import { generate, nil, resolve } from "./uuid.ts"

Deno.test("`nil` is the all-zero UUID", () => {
  expect(nil).toBe("00000000-0000-0000-0000-000000000000")
})

for (
  const { type, timestamp, bits, uuid } of [
    // Fixed fields
    { type: 0, timestamp: 0, bits: 1, uuid: "00000000-0000-8000-8000-000000000001" },
    { type: 11, timestamp: 0n, bits: 1n, uuid: "00000000-0000-800b-8000-000000000001" },
    { type: 0, timestamp: 0, bits: 0, uuid: "00000000-0000-8000-8000-000000000000" },
    { type: 0xabc, timestamp: 0x123456789abcn, bits: 0x123456789abcdefn, uuid: "12345678-9abc-8abc-8123-456789abcdef" },
    { type: 4095, timestamp: (1n << 48n) - 1n, bits: (1n << 62n) - 1n, uuid: "ffffffff-ffff-8fff-bfff-ffffffffffff" },
    // Resource masking
    { type: -1, timestamp: 0, bits: 0, uuid: "00000000-0000-8fff-8000-000000000000" },
    { type: 4095, timestamp: 0, bits: 0, uuid: "00000000-0000-8fff-8000-000000000000" },
    { type: 8191, timestamp: 0, bits: 0, uuid: "00000000-0000-8fff-8000-000000000000" },
    { type: 4096, timestamp: 0, bits: 0, uuid: "00000000-0000-8000-8000-000000000000" },
    { type: -4096, timestamp: 0, bits: 0, uuid: "00000000-0000-8000-8000-000000000000" },
    { type: Number.MAX_SAFE_INTEGER + 1, timestamp: 0, bits: 0, uuid: "00000000-0000-8000-8000-000000000000" },
    { type: 4097, timestamp: 0, bits: 0, uuid: "00000000-0000-8001-8000-000000000000" },
    // Timestamp masking
    { type: 0, timestamp: -1, bits: 0, uuid: "ffffffff-ffff-8000-8000-000000000000" },
    { type: 0, timestamp: -1n, bits: 0, uuid: "ffffffff-ffff-8000-8000-000000000000" },
    { type: 0, timestamp: (1n << 48n) - 1n, bits: 0, uuid: "ffffffff-ffff-8000-8000-000000000000" },
    { type: 0, timestamp: 2 ** 48, bits: 0, uuid: "00000000-0000-8000-8000-000000000000" },
    { type: 0, timestamp: 1n << 48n, bits: 0, uuid: "00000000-0000-8000-8000-000000000000" },
    { type: 0, timestamp: -(1n << 48n), bits: 0, uuid: "00000000-0000-8000-8000-000000000000" },
    { type: 0, timestamp: Number.MAX_SAFE_INTEGER + 1, bits: 0, uuid: "00000000-0000-8000-8000-000000000000" },
    { type: 0, timestamp: (1n << 48n) + 1n, bits: 0, uuid: "00000000-0001-8000-8000-000000000000" },
    // Random bit masking
    { type: 0, timestamp: 0, bits: 2 ** 53, uuid: "00000000-0000-8000-8020-000000000000" },
    { type: 0, timestamp: 0, bits: -1, uuid: "00000000-0000-8000-bfff-ffffffffffff" },
    { type: 0, timestamp: 0, bits: -1n, uuid: "00000000-0000-8000-bfff-ffffffffffff" },
    { type: 0, timestamp: 0, bits: (1n << 64n) - 1n, uuid: "00000000-0000-8000-bfff-ffffffffffff" },
    { type: 0, timestamp: 0, bits: 2 ** 62, uuid: "00000000-0000-8000-8000-000000000000" },
    { type: 0, timestamp: 0, bits: 1n << 62n, uuid: "00000000-0000-8000-8000-000000000000" },
    { type: 0, timestamp: 0, bits: 1n << 63n, uuid: "00000000-0000-8000-8000-000000000000" },
    { type: 0, timestamp: 0, bits: 1n << 128n, uuid: "00000000-0000-8000-8000-000000000000" },
    { type: 0, timestamp: 0, bits: -(1n << 62n), uuid: "00000000-0000-8000-8000-000000000000" },
    { type: 11, timestamp: 0, bits: (1n << 62n) + 1n, uuid: "00000000-0000-800b-8000-000000000001" },
    { type: 11, timestamp: 0, bits: (1n << 128n) + 1n, uuid: "00000000-0000-800b-8000-000000000001" },
    { type: 11, timestamp: 0, bits: -(1n << 62n) + 1n, uuid: "00000000-0000-800b-8000-000000000001" },
  ]
) {
  Deno.test(`\`generate(${type}, ${inspect({ timestamp, bits })})\` is ${inspect(uuid)}`, () => {
    expect(generate(type, { timestamp, bits })).toBe(uuid)
  })
}

Deno.test("`generate(42)` defaults to the current timestamp", () => {
  const before = Date.now()
  const uuid = generate(42)
  const after = Date.now()
  const timestamp = Number.parseInt(uuid.slice(0, 13).replaceAll("-", ""), 16)
  expect((timestamp >= before) && (timestamp <= after)).toBe(true)
})

for (
  const { options, pattern } of [
    { options: undefined, pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-802a-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/ },
    { options: { timestamp: 0 }, pattern: /^00000000-0000-802a-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/ },
    { options: { bits: 0 }, pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-802a-8000-000000000000$/ },
  ]
) {
  Deno.test(`\`generate(42, ${inspect(options)})\` matches ${pattern}`, () => {
    expect(generate(42, options)).toMatch(pattern)
  })
}

Deno.test("`generate()` sorts lexicographically by timestamp", () => {
  const earlier = generate(4095, { timestamp: 0xffff, bits: (1n << 62n) - 1n })
  const later = generate(0, { timestamp: 0x10000, bits: 0 })
  expect(earlier < later).toBe(true)
})

for (const value of [NaN, Infinity, -Infinity, 0.5]) {
  for (const { type, options } of [{ type: value, options: { timestamp: 0, bits: 0 } }, { type: 0, options: { timestamp: value, bits: 0 } }, { type: 0, options: { timestamp: 0, bits: value } }]) {
    Deno.test(`\`generate(${inspect(type)}, ${inspect(options)})\` throws RangeError`, () => {
      expect(() => generate(type, options)).toThrow(RangeError)
    })
  }
}

for (const { type, value } of [{ type: 1, value: Map }, { type: 2, value: Set }]) {
  Deno.test(`\`resolve({ 1: Map, 2: Set }, UUID of type ${type})\` is ${value.name}`, () => {
    expect(resolve({ 1: Map, 2: Set }, generate(type, { timestamp: 0, bits: 0 }))).toBe(value)
  })
}

Deno.test("`resolve()` returns the union of mapped value types", () => {
  const resource = resolve({ 1: Map, 2: Set }, generate(1, { timestamp: 0, bits: 0 }))
  const constructor: MapConstructor | SetConstructor = resource
  expect(constructor).toBe(Map)
  // @ts-expect-error Resolution returns the union, not an arbitrary value.
  const invalid: string = resource
  void invalid
})

Deno.test("`resolve()` returns a usable constructor for compatible signatures", () => {
  expect(new (resolve({ 1: Map, 2: Map }, generate(1, { timestamp: 0, bits: 0 })))()).toBeInstanceOf(Map)
})

for (const { type, value } of [{ type: 0, value: undefined }, { type: 1, value: null }, { type: 2, value: false }, { type: 3, value: 0 }, { type: 4, value: "" }, { type: 0xabc, value: { name: "resource" } }, { type: 4095, value: "last" }]) {
  Deno.test(`\`resolve()\` returns ${inspect(value)} for resource type ${type}`, () => {
    expect(resolve({ [type]: value }, generate(type, { timestamp: 0, bits: 0 }))).toBe(value)
  })
}

for (const uuid of ["00000000-0000-8abc-8000-000000000000", "00000000-0000-8ABC-8000-000000000000"]) {
  Deno.test(`\`resolve({ 2748: true }, ${inspect(uuid)})\` is true`, () => {
    expect(resolve({ 2748: true }, uuid)).toBe(true)
  })
}

for (const uuid of ["00000000-0000-8000-8000-000000000000", "00000000-0000-8000-9000-000000000000", "00000000-0000-8000-a000-000000000000", "00000000-0000-8000-b000-000000000000"]) {
  Deno.test(`\`resolve({ 0: true }, ${inspect(uuid)})\` is true`, () => {
    expect(resolve({ 0: true }, uuid)).toBe(true)
  })
}

for (const bits of [(1n << 62n) + 1n, (1n << 128n) + 1n, -(1n << 62n) + 1n]) {
  Deno.test(`\`resolve()\` accepts a UUID generated with bits ${inspect(bits)}`, () => {
    expect(resolve({ 11: "resource" }, generate(11, { timestamp: 0, bits }))).toBe("resource")
  })
}

for (const { name, resources } of [{ name: "missing", resources: {} }, { name: "inherited", resources: Object.create({ 1: Map }) as Record<number, unknown> }]) {
  Deno.test(`\`resolve()\` throws RangeError for a ${name} resource mapping`, () => {
    expect(() => resolve(resources, "00000000-0000-8001-8000-000000000000")).toThrow(RangeError, "No mapping found for resource type 1")
  })
}

for (
  const uuid of [
    "",
    nil,
    "0000000-0000-8001-8000-000000000000",
    "00000000-0000-8001-8000-0000000000000",
    " 00000000-0000-8001-8000-000000000000",
    "00000000-0000-8001-8000-000000000000\n",
    "00000000000080018000000000000000",
    "00000000-0000-7001-8000-000000000000",
    "00000000-0000-8001-c000-000000000000",
    "00000000-0000-8001-0000-000000000000",
    "00000000-0000-800g-8000-000000000000",
  ]
) {
  Deno.test(`\`resolve({ 1: Map }, ${inspect(uuid)})\` throws SyntaxError`, () => {
    expect(() => resolve({ 1: Map }, uuid)).toThrow(SyntaxError, "Unsupported UUID format")
  })
}
