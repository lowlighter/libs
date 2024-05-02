# 🗜️ Utility types

This library contains various utility types.

## Usage

```ts
import type { Promisable } from "./mod.ts"

function maybe(): Promisable<boolean> {
  return Math.random() > 0.5 ? true : Promise.resolve(true)
}
```
