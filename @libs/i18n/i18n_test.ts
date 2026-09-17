// Imports
import { expect } from "@libs/testing"
import type { testing } from "@libs/testing"
import { I18n, i18n } from "./i18n.ts"

Deno.test("`I18n.constructor()` defaults language and timezone from the runtime", () => {
  const instance = new I18n()
  expect(instance.language).toBe(navigator.language ?? I18n.fallback)
  expect(instance.timezone).toBe(Intl.DateTimeFormat().resolvedOptions().timeZone)
  expect(new I18n({ language: "fr", timezone: "UTC" })).toMatchObject({ language: "fr", timezone: "UTC" })
  expect(i18n).toBeInstanceOf(I18n)
})

Deno.test("`I18n.set()` registers translations and is chainable", () => {
  expect(i18n.for("en").set("sayhello", "hello").set("saygoodbye", "bye")).toBeInstanceOf(I18n)
  expect(i18n.for("en").get("sayhello")).toBe("hello")
  expect(i18n.for("en").get("saygoodbye")).toBe("bye")
})

Deno.test("`I18n.set()` seeds a whole language at once from a record and re-seeding merges", () => {
  i18n.for("en").set({ fruit: "apple", drink: "water" })
  expect(i18n.for("en").get("fruit")).toBe("apple")
  expect(i18n.for("en").get("drink")).toBe("water")
  i18n.for("en").set({ fruit: "banana" })
  expect(i18n.for("en").get("fruit")).toBe("banana")
  expect(i18n.for("en").get("drink")).toBe("water")
})

Deno.test("`I18n.get()` interpolates `${placeholders}` from the context", () => {
  i18n.for("en").set("greeting", "hello ${name}")
  expect(i18n.for("en").get("greeting", { name: "john" })).toBe("hello john")
  i18n.for("en").set("cats", '${n} cat${n > 1 ? "s" : ""}')
  expect(i18n.for("en").get("cats", { n: 1 })).toBe("1 cat")
  expect(i18n.for("en").get("cats", { n: 2 })).toBe("2 cats")
})

Deno.test("`I18n.get()` memoizes resolutions and invalidates them on re-seeding", () => {
  i18n.for("en").set("motto", "old ${who}")
  expect(i18n.for("en").get("motto", { who: "world" })).toBe("old world")
  expect(i18n.for("en").get("motto", { who: "world" })).toBe("old world")
  i18n.for("en").set("motto", "new ${who}")
  expect(i18n.for("en").get("motto", { who: "world" })).toBe("new world")
})

Deno.test("`I18n.get()` resolves keys case-insensitively", () => {
  i18n.for("en").set("MixedCase", "value")
  expect(i18n.for("en").get("mixedcase")).toBe("value")
  expect(i18n.for("en").get("MIXEDCASE")).toBe("value")
})

Deno.test("`I18n.get()` resolves in an arbitrary language per lookup", () => {
  i18n.for("en").set("color", "color")
  i18n.for("fr").set("color", "couleur")
  expect(i18n.for("en").get("color", {}, { language: "fr" })).toBe("couleur")
  expect(i18n.for("fr").get("color", {}, { language: "en" })).toBe("color")
})

Deno.test("`I18n.get()` never throws and degrades to the raw value on interpolation failure", () => {
  i18n.for("en").set("broken", "${1 +}")
  expect(i18n.for("en").get("broken")).toBe("${1 +}")
})

Deno.test("`I18n.get()` tolerates a context that cannot be serialized for memoization", () => {
  i18n.for("en").set("plain", "hello")
  const circular = {} as testing
  circular.self = circular
  expect(i18n.for("en").get("plain", circular)).toBe("hello")
})

Deno.test("`I18n.get()` reports misses through a configurable policy with per-lookup override", () => {
  expect(i18n.for("en").get("unknownkey")).toBe("unknownkey")
  expect(i18n.for("en").get("unknownkey", {}, { missing: "empty" })).toBe("")
  expect(i18n.for("en").get("unknownkey", {}, { missing: (key) => key.toUpperCase() })).toBe("UNKNOWNKEY")
  expect(new I18n({ language: "en", missing: "empty" }).get("unknownkey")).toBe("")
  expect(new I18n({ language: "en", missing: (key) => `[${key}]` }).get("unknownkey")).toBe("[unknownkey]")
})

Deno.test("`I18n.get()` supports optimistic probing through the empty miss policy", () => {
  i18n.for("en").set("sigil_men", "men")
  const probe = (key: string) => i18n.for("en").get(key, {}, { missing: "empty" }) || i18n.for("en").get("sigil_men")
  expect(probe("sigil_men_naginata")).toBe("men")
  i18n.for("en").set("sigil_men_naginata", "men (naginata)")
  expect(probe("sigil_men_naginata")).toBe("men (naginata)")
})

Deno.test("`I18n.md()` renders the translation as inline markdown by default", () => {
  i18n.for("en").set("welcome", "hello **${name}**")
  expect(i18n.for("en").md("welcome", { name: "john" })).toBe("hello <strong>john</strong>")
  expect(i18n.for("en").md("welcome", { name: "john" })).toBe("hello <strong>john</strong>")
  expect(i18n.for("en").md("unknownkey")).toBe("unknownkey")
  expect(i18n.for("en").md("unknownkey", {}, { missing: "empty" })).toBe("")
})

Deno.test("`I18n.md()` renders block-level markdown when inline is disabled", () => {
  i18n.for("en").set("welcome", "hello **${name}**")
  expect(i18n.for("en").md("welcome", { name: "john" }, { inline: false })).toBe("<p>hello <strong>john</strong></p>")
  i18n.for("en").set("heading", "# ${title}")
  expect(i18n.for("en").md("heading", { title: "Title" }, { inline: false })).toBe("<h1>Title</h1>")
  expect(i18n.for("en").md("unknownkey", {}, { inline: false })).toBe("<p>unknownkey</p>")
})

Deno.test("`I18n.loaded()` reports whether translations are registered for a language", () => {
  i18n.for("en").set("anything", "value")
  expect(i18n.for("en").loaded()).toBe(true)
  expect(i18n.loaded("en")).toBe(true)
  expect(i18n.loaded("zz")).toBe(false)
})

Deno.test("`I18n.current` is a readable and writable ambient language for unscoped instances", () => {
  const original = I18n.current
  try {
    I18n.current = "fr"
    expect(i18n.language).toBe("fr")
    expect(new I18n().language).toBe("fr")
    expect(new I18n({ language: "de" }).language).toBe("de")
  } finally {
    I18n.current = original
  }
})

Deno.test("`I18n.get()` uses the fallback language for missing keys and returns unresolved keys as-is", () => {
  i18n.for(I18n.fallback).set("onlyfallback", "fallback")
  expect(i18n.for("fr").get("onlyfallback")).toBe("fallback")
  expect(i18n.for("fr").get("unknownkey")).toBe("unknownkey")
})

Deno.test({
  name: "`I18n.load()` loads translations from yaml files",
  permissions: { read: true },
  fn: async () => {
    const instance = await i18n.for("xa").load(import.meta.resolve("./testing/test_i18n.yaml"))
    expect(instance).toBeInstanceOf(I18n)
    expect(instance.get("sayhello", { name: "john" })).toBe("hello john")
    expect(instance.get("saygoodbye")).toBe("bye")
    expect(instance.get("1")).toBe("one")
    expect(instance.loaded()).toBe(true)
  },
})

Deno.test({
  name: "`I18n.load()` rejects yaml files without a flat mapping of keys to values",
  permissions: { read: true },
  fn: async () => {
    await expect(i18n.for("xb").load(import.meta.resolve("./testing/test_invalid.yaml"))).rejects.toThrow("not a valid YAML object")
    await expect(i18n.for("xb").load("data:text/plain,foo")).rejects.toThrow("not a valid YAML object")
  },
})

Deno.test("`I18n.load()` rejects unreachable sources", async () => {
  const original = globalThis.fetch
  globalThis.fetch = (() => Promise.resolve(new Response(null, { status: 404 }))) as testing
  try {
    await expect(i18n.for("xc").load("https://example.com/en.yaml")).rejects.toThrow("HTTP 404")
  } finally {
    globalThis.fetch = original
  }
})

Deno.test("`I18n.time()` formats times", () => {
  expect(i18n.for("en", { timezone: "UTC" }).time("2020-01-01T00:00:00Z")).toBe("00:00:00")
  expect(i18n.for("en", { timezone: "Europe/Paris" }).time("2020-01-01T00:00:00Z")).toBe("01:00:00")
})

Deno.test("`I18n.date()` formats dates", () => {
  const format = i18n.for("en", { timezone: "UTC" })
  expect(format.date("2020-01-01T00:00:00Z")).toBe("Jan 1, 2020")
  expect(format.date("2020-01-01T00:00:00Z", { year: undefined })).toBe("Jan 1")
  expect(format.date("2020-01-01T00:00:00Z", { day: undefined, month: undefined })).toBe("2020")
  expect(i18n.for("fr", { timezone: "UTC" }).date("2020-01-01T00:00:00Z")).toBe("1 janv. 2020")
})

Deno.test("`I18n.number()` formats numbers", () => {
  const format = i18n.for("en")
  expect(format.number(1)).toBe("1")
  expect(format.number(1000)).toBe("1K")
  expect(format.number(1234567)).toBe("1.2M")
  expect(format.number(1234, { notation: "standard" })).toBe("1,234")
  expect(i18n.for("fr").number(1500000)).toBe("1,5M")
})

Deno.test("`I18n.number()` formats numbers and pluralizes text", () => {
  const format = i18n.for("en")
  expect(format.number("cat", 0)).toBe("0 cats")
  expect(format.number("cat", 1)).toBe("1 cat")
  expect(format.number("cat", 1000)).toBe("1K cats")
})

Deno.test("`I18n.number()` formats bytes", () => {
  const format = i18n.for("en")
  expect(format.number(0, { format: "bytes" })).toBe("0B")
  expect(format.number(1, { format: "bytes" })).toBe("1B")
  expect(format.number(1024, { format: "bytes" })).toBe("1kB")
  expect(format.number(1500000, { format: "bytes" })).toBe("1.5MB")
  expect(format.number(3e9, { format: "bytes" })).toBe("3GB")
  expect(format.number(4e12, { format: "bytes" })).toBe("4TB")
  expect(format.number(5e15, { format: "bytes" })).toBe("5PB")
  expect(format.number(1e18, { format: "bytes" })).toBe("1,000PB")
  expect(format.number("file", 1024, { format: "bytes" })).toBe("1kB files")
})

Deno.test("`I18n.percentage()` formats percentages", () => {
  expect(i18n.for("en").percentage(0.1234)).toBe("12.34%")
  expect(i18n.for("en").percentage(0.1234, 0)).toBe("12%")
  expect(i18n.for("fr").percentage(0.1234)).toBe("12,34%")
})

Deno.test("`I18n.for()` returns an instance scoped to the specified language and inherits timezone and miss policy", () => {
  const base = new I18n({ language: "en", timezone: "UTC", missing: "empty" })
  expect(base.for("fr").language).toBe("fr")
  expect(base.for("fr").timezone).toBe("UTC")
  expect(base.for("fr", { timezone: "Europe/Paris" }).timezone).toBe("Europe/Paris")
  expect(base.for("fr").get("unknownkey")).toBe("")
})

Deno.test("`I18n.for()` negotiates language from `Request` objects", () => {
  i18n.for("en").set("greet", "hello")
  i18n.for("fr").set("greet", "bonjour")
  const request = new Request("https://example.com", { headers: { "Accept-Language": "fr-CH, fr;q=0.9, en;q=0.8" } })
  expect(i18n.for(request).language).toBe("fr")
  expect(i18n.for(request).get("greet")).toBe("bonjour")
  const unmatched = new Request("https://example.com", { headers: { "Accept-Language": "de" } })
  expect(i18n.for(unmatched).language).toBe(I18n.fallback)
})

Deno.test("`I18n` memoization stays bounded under many distinct contexts", () => {
  i18n.for("en").set("counter", "value ${n}")
  for (let n = 0; n < 1100; n++)
    expect(i18n.for("en").get("counter", { n })).toBe(`value ${n}`)
})

Deno.test("`I18n.load()` parses inline YAML and JSON and infers the language", async () => {
  const original = globalThis.fetch
  globalThis.fetch = () => Promise.reject(new Error("Inline content must not be fetched"))
  try {
    const instance = await I18n.load("_: xd\na: foo\nb: bar")
    expect(instance.language).toBe("xd")
    expect(i18n.for("xd").get("a")).toBe("foo")
    expect(instance.get("b")).toBe("bar")
    expect(instance.get("_", {}, { missing: "empty" })).toBe("")
    expect((await I18n.load("_: xe\ra: carriage")).get("a")).toBe("carriage")
    expect((await I18n.load('{\n"_": "xf", "a": "json"\n}')).get("a")).toBe("json")
    await expect(I18n.load("null\n")).rejects.toThrow("not a valid YAML object")
  } finally {
    globalThis.fetch = original
  }
})

Deno.test("`I18n.load()` honors explicit and instance languages", async () => {
  const instance = await I18n.load("_: xh\na: explicit", { language: "xg" })
  expect(instance.language).toBe("xg")
  expect(instance.get("a")).toBe("explicit")
  const scoped = new I18n({ language: "xg" })
  expect(await scoped.load("_: xh\na: instance")).toBe(scoped)
  expect(scoped.get("a")).toBe("instance")
  expect(i18n.loaded("xh")).toBe(false)
})

Deno.test("`I18n.load()` defaults to the current language and supports fetched content", async () => {
  const original = I18n.current
  I18n.current = "xi"
  try {
    const instance = await I18n.load("a: ambient\n")
    expect(instance.language).toBe("xi")
    expect(instance.get("a")).toBe("ambient")
    const source = new URL("data:application/json,%7B%22a%22:%22fetched%22%7D")
    expect((await I18n.load(source)).get("a")).toBe("fetched")
    const inferred = await I18n.load("data:text/plain,_%3A%20xj%0Aa%3A%20remote")
    expect(inferred.language).toBe("xj")
    expect(inferred.get("a")).toBe("remote")
  } finally {
    I18n.current = original
  }
})
