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

## 🕊️ Migrating from `4.x.x` to `5.x.x`

### `Context.unproxyable` default value

`Map`, `Set` and `Date` are not in `Context.unproxyable` by default anymore.
To restore the previous behavior, you can add them back:

```diff
+ Context.unproxyable.unshift(Map, Set, Date)
```

### Now tracking inplace data changes for built-in objects

When a built-in object is modified in place by a known method (e.g. `Array.prototype.push`, `Array.prototype.pop`, etc.), a `"set"` event is now also emitted, in addition to the `"change"` and `"call"` events.

This event has the same properties as if the object was set entirely, with the only difference being that the `value` property is `null` rather than a `{ old, new }` object (since the object has been changed inplace, creating this diff would cause a significant performance and memory overhead).

```ts ignore
const context = new Context({ foo: ["a", "b"] })
context.target.foo.push("c")
// Dispatches a "set" event with the following properties:
// - path: []
// - target: context.target.foo
// - property: "foo"
// - value: null
```

## 📜 License

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
