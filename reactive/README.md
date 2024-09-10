# 🎯 Reactivity

[![JSR](https://jsr.io/badges/@libs/reactive)](https://jsr.io/@libs/reactive) [![JSR Score](https://jsr.io/badges/@libs/reactive/score)](https://jsr.io/@libs/reactive)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Freactive?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/reactive) [![Coverage](https://libs-coverage.lecoq.io/reactive/badge.svg)](https://libs-coverage.lecoq.io/reactive)

Track `get`, `set`, `delete` and `call` operations on objects.

- [`🦕 Playground`](https://dash.deno.com/playground/libs-reactive)
- [`📚 Documentation`](https://jsr.io/@libs/reactive/doc)

## 📑 Examples

```ts
import { Context } from "./context.ts"

const context = new Context({ foo: "bar", bar: () => null })

// Attach listeners
context.addEventListener("get", ({ detail: { property } }: any) => console.log(`get: ${property}`))
context.addEventListener("set", ({ detail: { property, value } }: any) => console.log(`set: ${property}: ${value.old} => ${value.new}`))
context.addEventListener("delete", ({ detail: { property } }: any) => console.log(`delete: ${property}`))
context.addEventListener("call", ({ detail: { property, args } }: any) => console.log(`call: ${property}(${args.join(", ")})`))
context.addEventListener("change", ({ detail: { type } }: any) => console.log(`change: ${type}`))

// Operate on the context
context.target.foo = "baz" // Triggers the "set" and "change" events
context.target.bar() // Triggers the "call" and "change" events
```

## ✨ Features

- Support `change` event for convenience.
- Applies recursively!
- Supports inherited context.

## 📜 License

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
