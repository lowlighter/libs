import { expect, type testing } from "@libs/testing"
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

Deno.test("`I18n.get()` interpolates `${placeholders}` from the context", () => {
  i18n.for("en").set("greeting", "hello ${name}")
  expect(i18n.for("en").get("greeting", { name: "john" })).toBe("hello john")
  i18n.for("en").set("cats", '${n} cat${n > 1 ? "s" : ""}')
  expect(i18n.for("en").get("cats", { n: 1 })).toBe("1 cat")
  expect(i18n.for("en").get("cats", { n: 2 })).toBe("2 cats")
})

Deno.test("`I18n.md()` renders the translation as markdown", () => {
  i18n.for("en").set("welcome", "hello **${name}**")
  expect(i18n.for("en").md("welcome", { name: "john" })).toBe("<p>hello <strong>john</strong></p>")
  i18n.for("en").set("heading", "# ${title}")
  expect(i18n.for("en").md("heading", { title: "Title" })).toBe("<h1>Title</h1>")
  expect(i18n.for("en").md("unknownkey")).toBe("<p>unknownkey</p>")
})

Deno.test("`I18n.get()` uses the fallback language for missing keys and returns unresolved keys as-is", () => {
  i18n.for(I18n.fallback).set("onlyfallback", "fallback")
  expect(i18n.for("fr").get("onlyfallback")).toBe("fallback")
  expect(i18n.for("fr").get("unknownkey")).toBe("unknownkey")
})

Deno.test("`I18n.load()` loads translations from yaml files", async () => {
  const instance = await i18n.for("xa").load(import.meta.resolve("./testing/test_i18n.yaml"))
  expect(instance).toBeInstanceOf(I18n)
  expect(instance.get("sayhello", { name: "john" })).toBe("hello john")
  expect(instance.get("saygoodbye")).toBe("bye")
  expect(instance.get("1")).toBe("one")
})

Deno.test("`I18n.load()` rejects yaml files without a flat mapping of keys to values", async () => {
  await expect(i18n.for("xb").load(import.meta.resolve("./testing/test_invalid.yaml"))).rejects.toThrow("not a valid YAML object")
  await expect(i18n.for("xb").load("data:text/plain,foo")).rejects.toThrow("not a valid YAML object")
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

Deno.test("`I18n.for()` returns an instance scoped to the specified language and inherits timezone", () => {
  const base = new I18n({ language: "en", timezone: "UTC" })
  expect(base.for("fr").language).toBe("fr")
  expect(base.for("fr").timezone).toBe("UTC")
  expect(base.for("fr", { timezone: "Europe/Paris" }).timezone).toBe("Europe/Paris")
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
