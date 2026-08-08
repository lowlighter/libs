# 🌐 Internationalization

[![JSR](https://jsr.io/badges/@libs/i18n)](https://jsr.io/@libs/i18n) [![JSR Score](https://jsr.io/badges/@libs/i18n/score)](https://jsr.io/@libs/i18n) [![Coverage](https://libs-coverage.lecoq.io/i18n/badge.svg)](https://libs-coverage.lecoq.io/i18n)

- [`📚 Documentation`](https://jsr.io/@libs/i18n/doc)

## ✨ Features

- Minimal API surface: register with `set()` or `load()`, translate with `get()`.
- Register a whole language at once by passing a parsed record to `set()`
- Templating through `${placeholders}` evaluated as template literals against a context object.
- Markdown rendering with `md()`
- Configurable miss policy return the key (default), an empty string, or a computed placeholder
- Ambient `I18n.current` and `I18n.fallback` languages, both readable and writable at runtime.
- Resolve any language per lookup with `get(key, context, { language })`
- Case-insensitive keys, internally memoized lookups, and lookups that degrade instead of throwing.
- Automatic language negotiation from `Request` objects using `Accept-Language` headers.
- Locale-aware formatting of times, dates, numbers, bytes and percentages powered by `Intl`.

## 📑 Examples

### Translate content

```ts
import { I18n, i18n } from "./mod.ts"

// Register translations per language
i18n.for("en").set("sayhello", "hello ${name}").set("saygoodbye", "bye")
i18n.for("fr").set("sayhello", "bonjour ${name}")

// Translations are evaluated as JavaScript template literals, so any expression is supported:
i18n.for("en").set("cats", '${n} cat${n > 1 ? "s" : ""}')
console.assert(i18n.for("en").get("cats", { n: 2 }) === "2 cats")

// Seed a whole language at once from a parsed record
i18n.for("en").set({ apple: "apple", pear: "pear" })
console.assert(i18n.for("en").loaded())

// Render markdown
i18n.for("en").set("hint", "press **enter**")
console.assert(i18n.for("en").md("hint") === "press <strong>enter</strong>")

// Choose how misses are reported
console.assert(i18n.for("en").get("unknown") === "unknown")
console.assert(i18n.for("en").get("unknown", {}, { missing: "empty" }) === "")

// Resolve an arbitrary language per lookup
i18n.for("fr").set("sayhello", "bonjour ${name}")
console.assert(i18n.for("en").get("sayhello", { name: "john" }, { language: "fr" }) === "bonjour john")

// Set the ambient current language once
I18n.current = "fr"

// The language is negotiated from the `Accept-Language` header against registered languages
const request = new Request("https://example.com", { headers: { "Accept-Language": "fr-CH, fr;q=0.9, en;q=0.8" } })
console.assert(i18n.for(request).get("sayhello", { name: "john" }) === "bonjour john")

// Load translations from YAML/JSON files
await i18n.for("en").load(import.meta.resolve("./translations/en.yaml"))
```

> [!WARNING]
> Since translations are evaluated, they must come from trusted sources only.

## 📜 Licenses

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
