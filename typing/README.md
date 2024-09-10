# 🧰 Utility types

[![JSR](https://jsr.io/badges/@libs/typing)](https://jsr.io/@libs/typing) [![JSR Score](https://jsr.io/badges/@libs/typing/score)](https://jsr.io/@libs/typing)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Ftyping?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/typing) [![Coverage](https://coverage.libs.lecoq.io/typing/badge.svg)](https://coverage.libs.lecoq.io/typing)

- [`📚 Documentation`](https://jsr.io/@libs/typing/doc)

## 📑 Examples

```ts
import type { Arg, Arrayable, Nullable, Promisable } from "./types.ts"

function foo(_: unknown, args: Arrayable<string>): Promisable<Nullable<string>> {
  return Promise.resolve(null)
}

// Get the type of arguments[1] of `foo` function
type args = Arg<typeof foo, 1>
```

## ✨ Features

- `AsyncFunction`, `GeneratorFunction` and `AsyncGeneratorFunction` constructors.
- Addtional useful type utilites.

## 📜 License

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
