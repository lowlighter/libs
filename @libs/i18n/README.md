# 🌐 Internationalization

[![JSR](https://jsr.io/badges/@libs/i18n)](https://jsr.io/@libs/i18n) [![JSR Score](https://jsr.io/badges/@libs/i18n/score)](https://jsr.io/@libs/i18n) [![Coverage](https://libs-coverage.lecoq.io/i18n/badge.svg)](https://libs-coverage.lecoq.io/i18n)

- [`📚 Documentation`](https://jsr.io/@libs/i18n/doc)

## ✨ Features

- Minimal API surface: register with `set()` or `load()`, translate with `get()`.
- Templating through `${placeholders}` evaluated as template literals against a context object.
- Configurable fallback language, with unresolved keys returned as-is.
- Automatic language negotiation from `Request` objects using `Accept-Language` headers.
- Supports loading translations from YAML files.
- Locale-aware formatting of times, dates, numbers, bytes and percentages powered by `Intl`.

## 📑 Examples

### Translate content

```ts
import { i18n } from "./mod.ts"

// Register translations per language
i18n.for("en").set("sayhello", "hello ${name}").set("saygoodbye", "bye")
i18n.for("fr").set("sayhello", "bonjour ${name}")

// Translations are evaluated as JavaScript template literals, so any expression is supported:
i18n.for("en").set("cats", '${n} cat${n > 1 ? "s" : ""}')
console.assert(i18n.for("en").get("cats", { n: 2 }) === "2 cats")

// Load translations from YAML/JSON files
await i18n.for("en").load(import.meta.resolve("./translations/en.yaml"))

// The language is negotiated from the `Accept-Language` header against registered languages
const request = new Request("https://example.com", { headers: { "Accept-Language": "fr-CH, fr;q=0.9, en;q=0.8" } })
console.assert(i18n.for(request).get("sayhello", { name: "john" }) === "bonjour john")
```

> [!WARNING]
> Since translations are evaluated, they must come from trusted sources only.

## 📜 Licenses

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
