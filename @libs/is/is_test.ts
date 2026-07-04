import { spec } from "./testing/mod.ts"
import { arrayable, bodyInit, callable, cliable, clonable, coalesce, coerce, date, duration, expression, is, nullable, parse, parser, permissions, primitive, regex, typedArray, url } from "./is.ts"
import { expect, test } from "@libs/testing"

spec("coalesce", coalesce(is.unknown()), [
  // Coalesce
  { a: null, b: undefined },
  { a: undefined },
  // No-op
  { a: 0 },
  { a: false },
  { a: "" },
], { strict: false, prefault: false })

spec("coerce", coerce(is.union([is.number(), is.literal(Infinity), is.literal(-Infinity), is.nan(), is.void()])), [
  // Coerce
  { a: "123", b: 123 },
  { a: "NaN", b: NaN },
  { a: "Infinity", b: Infinity },
  { a: "+Infinity", b: Infinity },
  { a: "-Infinity", b: -Infinity },
  // No-op
  { a: undefined, b: undefined },
  { a: 123 },
  // Errors
  { a: "foo", b: Error },
  // Spec
  ...spec.positive.infinity,
], { strict: false, prefault: false })

spec("nullable", nullable(is.boolean()), [
  // Nullable
  { a: null, b: null },
  // No-op
  { a: true },
  { a: false },
  // Spec
  ...spec.nullable,
], { strict: false, prefault: false })

spec("clonable", clonable(is.unknown()), [
  // Clonable
  { a: true },
  { a: /foo/ },
  // Non-clonable
  { a: Symbol(), b: Error },
  { a: function () {}, b: Error },
], { strict: false, prefault: false })

spec("arrayable", arrayable(is.array(is.string())), [
  // Arrayable
  { a: "foo", b: ["foo"] },
  // No-op
  { a: ["foo"], b: ["foo"] },
  // Spec
  ...spec.string.arrayable,
], { strict: false, prefault: false })

spec("cliable.parse", cliable(is.object({}).loose(), {}), [
  // Basic
  { a: "foo bar", b: { _: ["foo", "bar"] } },
  { a: "--foo=bar --bar=baz", b: { foo: "bar", bar: "baz" } },
  // Quotes
  { a: "--foo=' bar '", b: { foo: " bar " } },
  { a: '--foo=" bar "', b: { foo: " bar " } },
  { a: "--foo=' \"bar\" '", b: { foo: ' "bar" ' } },
  { a: '--foo=" \\"bar\\" "', b: { foo: ' "bar" ' } },
  // Raw arguments
  { a: { foo: "bar" } },
  // Errors (unclosed quotes)
  { a: "-foo='unclosed", b: Error },
  { a: '-foo="unclosed', b: Error },
  { a: '-foo="unclosed\\"', b: Error },
], { strict: false, prefault: false })

spec("cliable.split", cliable(is.array(is.string())), [
  // Basic
  { a: "/usr/bin/foo --foo='bar' --foobar=\"foobar\" qux quux", b: ["/usr/bin/foo", "--foo=bar", "--foobar=foobar", "qux", "quux"] },
  // Empty arguments
  { a: "foo '' bar \"\"", b: ["foo", "", "bar", ""] },
], { strict: false, prefault: false })

spec("regex", regex(is.instanceof(RegExp)), [
  // Valid regex strings
  { a: "/foo/", b: /foo/ },
  { a: "/foo/g", b: /foo/g },
  { a: "/foo/i", b: /foo/i },
  { a: "/foo/m", b: /foo/m },
  { a: "/foo/s", b: /foo/s },
  { a: "/foo/u", b: /foo/u },
  { a: "/foo/y", b: /foo/y },
  // Errors
  { a: "/*/", b: Error },
  { a: "not-a-regex", b: Error },
], { strict: false, prefault: false })

spec("date", date(is.date()), [
  // Valid dates
  { a: "2024-01-01T00:00:00.000Z", b: new Date("2024-01-01T00:00:00.000Z") },
  { a: new Date("2024-01-01T00:00:00.000Z"), b: new Date("2024-01-01T00:00:00.000Z") },
  // Errors
  { a: "invalid-date", b: Error },
  // Spec
  ...spec.date,
], { strict: false, prefault: false })

spec("duration", duration(is.number().min(0)), [
  // Single units
  ...["", "ms", "millis", "millisecond", "milliseconds"].flatMap((ms) => [
    { a: `0${ms}`, b: 0 },
    { a: `10${ms}`, b: 10 },
    { a: `1000${ms}`, b: 1000 },
    { a: `3000${ms}`, b: 3000 },
  ]),
  ...["s", "sec", "secs", "second", "seconds"].flatMap((s) => [
    { a: `0${s}`, b: 0 },
    { a: `1${s}`, b: 1000 },
    { a: `60${s}`, b: 60000 },
    { a: `90${s}`, b: 90000 },
  ]),
  ...["m", "min", "mins", "minute", "minutes"].flatMap((m) => [
    { a: `0${m}`, b: 0 },
    { a: `1${m}`, b: 60000 },
    { a: `60${m}`, b: 3600000 },
    { a: `90${m}`, b: 5400000 },
  ]),
  ...["h", "hr", "hrs", "hour", "hours"].flatMap((h) => [
    { a: `0${h}`, b: 0 },
    { a: `1${h}`, b: 3600000 },
    { a: `24${h}`, b: 86400000 },
    { a: `48${h}`, b: 172800000 },
  ]),
  ...["d", "day", "days"].flatMap((d) => [
    { a: `0${d}`, b: 0 },
    { a: `1${d}`, b: 86400000 },
    { a: `7${d}`, b: 604800000 },
    { a: `30${d}`, b: 2592000000 },
  ]),
  // Combined units
  { a: "1d", b: 86400000 },
  { a: "1d 1h", b: 3600000 + 86400000 },
  { a: "1d 1h 1m", b: 60000 + 3600000 + 86400000 },
  { a: "1d 1h 1m 1s", b: 1000 + 60000 + 3600000 + 86400000 },
  { a: "1d 1h 1m 1s 1ms", b: 1 + 1000 + 60000 + 3600000 + 86400000 },
  // Errors
  { a: "<invalid>", b: Error },
], { strict: false, prefault: false })

spec("primitive", primitive, [
  // Valid primitives
  { a: "foo" },
  { a: 123 },
  { a: 123n },
  { a: true },
  { a: undefined },
  { a: null },
  // Errors
  { a: {}, b: Error },
  { a: [], b: Error },
  { a: () => {}, b: Error },
  // Spec
  ...spec.primitive,
], { strict: false, prefault: false })

spec("typedArray", typedArray, [
  // Valid typed arrays
  { a: new Int8Array() },
  { a: new Uint8Array() },
  { a: new Uint8ClampedArray() },
  { a: new Int16Array() },
  { a: new Uint16Array() },
  { a: new Int32Array() },
  { a: new Uint32Array() },
  { a: new Float16Array() },
  { a: new Float32Array() },
  { a: new Float64Array() },
  { a: new BigInt64Array() },
  { a: new BigUint64Array() },
  // Errors
  // deno-lint-ignore no-array-constructor
  { a: new Array(), b: Error },
  { a: [], b: Error },
  { a: {}, b: Error },
  { a: () => {}, b: Error },
  // Spec
  ...spec.array.typed,
], { strict: false, prefault: false })

spec("bodyInit", bodyInit, [
  // Valid body init types
  { a: null },
  { a: "foo" },
  { a: new Blob() },
  { a: new ArrayBuffer(8) },
  { a: new DataView(new ArrayBuffer(8)) },
  { a: new FormData() },
  { a: new ReadableStream() },
  { a: new URLSearchParams() },
  { a: new Int8Array() },
  // Errors
  { a: {}, b: Error },
  { a: [], b: Error },
  { a: () => {}, b: Error },
  // Spec
  ...spec.response.body.init,
], { strict: false, prefault: false })

spec("permissions()", permissions(), [
  // Valid permissions
  { a: "inherit" },
  { a: "none" },
  { a: {} },
  { a: { read: true } },
  { a: { read: "inherit" } },
  { a: { read: "none" }, b: { read: ["none"] } },
  { a: { read: "/file/path" }, b: { read: ["/file/path"] } },
  { a: { read: ["/file/path"] } },
  { a: { read: ["file:///file/path"] } },
  { a: { read: [new URL("file:///file/path")] }, b: { read: ["file:///file/path"] } },
  // Errors
  { a: true, b: Error },
  { a: false, b: Error },
  { a: 123, b: Error },
  { a: { invalid: true }, b: Error },
  { a: { env: [new URL("file:///file/path")] }, b: Error },
  { a: { sys: ["invalid"] }, b: Error },
], { strict: false, prefault: false })

spec("permissions({ set: ['read'] })", permissions({ set: ["read"] }), [
  // Valid permissions
  { a: "inherit" },
  { a: "none" },
  { a: {} },
  { a: { read: true } },
  // Errors
  { a: { write: true }, b: Error },
], { strict: false, prefault: false })

spec("permissions({ expand: true })", permissions({ expand: true }), [
  // Valid permissions
  { a: "inherit", b: { read: "inherit", write: "inherit", net: "inherit", env: "inherit", sys: "inherit", run: "inherit", ffi: "inherit", import: "inherit" } },
  { a: "none", b: { read: [], write: [], net: [], env: [], sys: [], run: [], ffi: [], import: [] } },
  { a: { read: true }, b: { read: true, write: [], net: [], env: [], sys: [], run: [], ffi: [], import: [] } },
  { a: "read", b: { read: "inherit", write: [], net: [], env: [], sys: [], run: [], ffi: [], import: [] } },
  { a: ["read"], b: { read: "inherit", write: [], net: [], env: [], sys: [], run: [], ffi: [], import: [] } },
  // Errors
  { a: true, b: Error },
  { a: false, b: Error },
  { a: ["invalid"], b: Error },
  { a: 123, b: Error },
  { a: { invalid: true }, b: Error },
], { strict: false, prefault: false })

spec("permissions({ set: ['read'], expand: true })", permissions({ set: ["read"], expand: true }), [
  // Valid permissions
  { a: "inherit", b: { read: "inherit" } },
  { a: "none", b: { read: [] } },
  { a: {}, b: { read: [] } },
  { a: { read: true }, b: { read: true } },
  { a: { read: "inherit" } },
  { a: { read: true } },
  { a: { read: false }, b: { read: [] } },
  { a: { read: "none" }, b: { read: ["none"] } },
  { a: { read: "/file/path" }, b: { read: ["/file/path"] } },
  { a: { read: ["/file/path"] } },
  // Errors
  { a: { write: true }, b: Error },
], { strict: false, prefault: false })

spec("url", url, [
  // Valid URLs
  { a: "https://example.app" },
  { a: "http://example.app" },
  { a: "file:///test/path" },
  // Additional supported protocols
  { a: "wasm:///test/path" },
  { a: "data:text/plain,Hello%2C%20World!" },
  { a: "blob:https://example.com/550e8400-e29b-41d4-a716-446655440000" },
  { a: "jsr:module" },
  { a: "npm:package" },
  // Errors
  { a: "invalid-url", b: Error },
  { a: "profile://example.com", b: Error },
  { a: "xnpm:package", b: Error },
  { a: "datafoo:bar", b: Error },
  // Spec
  ...spec.url,
], { strict: false, prefault: false })

spec("url.with", url.with(["ssh"]), [
  // Valid URLs
  { a: "ssh://example.com" },
  { a: "https://example.com" },
  // Errors
  { a: "sshx://example.com", b: Error },
  { a: "profile://example.com", b: Error },
], { strict: false, prefault: false })

spec("expression", expression, [
  // Valid expressions
  { a: "${'test'}" },
  { a: "${1 + 2}" },
  { a: "${true}" },
  // Errors
  { a: "not-an-expression", b: Error },
  // Spec
  ...spec.expression,
], { strict: false, prefault: false })

spec("callable", callable, [
  // Valid callables
  { a: () => {} },
  { a: function () {} },
  { a: async () => {} },
  // Errors
  { a: 123, b: Error },
  { a: "string", b: Error },
  { a: {}, b: Error },
  // Spec
  ...spec.callable,
], { strict: false, prefault: false })

spec("parser", parser, [
  // Valid parsers
  { a: Object.assign(is.object({ foo: is.string() }), { [Symbol.for("Deno.customInspect")]: () => "schema" }) },
  { a: Object.assign(is.unknown(), { [Symbol.for("Deno.customInspect")]: () => "schema" }) },
  { a: Object.assign({ parse: () => ({}) }, { [Symbol.for("Deno.customInspect")]: () => "schemalike" }) },
  // Errors
  { a: "string", b: Error },
  { a: () => ({}), b: Error },
  // Spec
  ...spec.parser,
], { strict: false, prefault: false })

test("parse() parses values", () => {
  parse(is.string(), "foo")
  expect(() => parse(is.string(), true)).toThrow(TypeError, "Validation failed: \n✘ Invalid input: expected string, received boolean")
  expect(() => parse(is.string(), true, { zodError: true })).toThrow(is.ZodError)
})

test("parse() parses values asynchronously", async () => {
  await parse(is.string(), "foo")
  await expect(parse(is.string(), true, { async: true })).rejects.toThrow(TypeError, "Validation failed: \n✘ Invalid input: expected string, received boolean")
  await expect(parse(is.string(), true, { async: true, zodError: true })).rejects.toThrow(is.ZodError)
})

test("parse() prettifies issue paths", () => {
  // Property and index segments
  expect(() => parse(is.object({ foo: is.object({ bar: is.array(is.string()) }) }), { foo: { bar: [1] } })).toThrow(TypeError, "→ at .foo.bar[0]")
  // Segments with special characters
  expect(() => parse(is.object({ "foo-bar": is.string() }), { "foo-bar": 1 })).toThrow(TypeError, '→ at ["foo-bar"]')
})

test("parse() prettifies union issues", () => {
  expect(() => parse(is.object({ foo: is.union([is.string(), is.number()]) }), { foo: true })).toThrow(TypeError, "→ tried to fit into one of the allowed types:")
})
