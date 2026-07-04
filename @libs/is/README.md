# 🪪 Is

[![JSR](https://jsr.io/badges/@libs/is)](https://jsr.io/@libs/is) [![JSR Score](https://jsr.io/badges/@libs/is/score)](https://jsr.io/@libs/is)

A wrapper around [Zod](https://zod.dev/) to ease type validation and assertions.

It also contains some additional validators, in addition to a spec checker.

- [`📚 Documentation`](https://jsr.io/@libs/is/doc)

## 📖 Usage

```ts
import { coerce, duration, is, parse, url } from "@libs/is"

// `is` re-exports Zod, augmented with additional validators and transformers
const schema = is.object({
  origin: url,
  timeout: duration(is.number().min(0)),
  retries: coerce(is.number().int().nonnegative()).default(3),
})

// `parse()` works like `schema.parse()` but throws a `TypeError` with prettified issues instead of a `ZodError`
parse(schema, { origin: "https://example.com", timeout: "1m 30s", retries: "5" })
// { origin: "https://example.com", timeout: 90000, retries: 5 }
```

## 📜 License

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
