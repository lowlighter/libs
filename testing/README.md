# 🧪 Testing utilities

[![JSR](https://jsr.io/badges/@libs/testing)](https://jsr.io/@libs/testing) [![JSR Score](https://jsr.io/badges/@libs/testing/score)](https://jsr.io/@libs/testing)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Ftesting?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/testing) [![Coverage](https://libs-coverage.lecoq.io/testing/badge.svg)](https://libs-coverage.lecoq.io/testing)

Testing utilities built upon [`@std/expect`](https://jsr.io/@std/expect) and [`@std/assert`](https://jsr.io/@std/assert).

- [`📚 Documentation`](https://jsr.io/@libs/testing/doc)

## 📑 Examples

```ts
import { expect, Status } from "./mod.ts"

Deno.test("`expect()` supports additional matchers", () => {
  expect("https://example.com").toBeUrl()
  expect("foo").toBeOneOf(["foo", "bar"])
  expect(new Response(null, { status: Status.OK })).toRespondWithStatus("2XX")
})
```

## ✨ Features

- Extends [`@std/expect`](https://jsr.io/@std/expect) with additional matchers (`toBeIterable`, `toRespondWithStatus`, `toBeEmail`, etc.)
  - See [`@libs/testing/expect`](https://jsr.io/@libs/testing/doc/expect/~) for more information about available matchers.
- Re-exports [`@std/assert`](https://jsr.io/@std/assert) through [`@libs/testing/assert`](https://jsr.io/@libs/testing/doc/assert/~).
- Re-exports [`@faker-js/faker`](https://fakerjs.dev) through [`@libs/testing/faker`](https://jsr.io/@libs/testing/doc/faker/~).
- Provides CLI syntax highlighting utilities through [`@libs/testing/highlight`](https://jsr.io/@libs/testing/doc/highlight/~) (supports `typescript`, `css`, `markdown`, `html`, `diff`, `yaml` and `json`).

## 🕊️ Migrating from `4.x.x` to `5.x.x`

Dropped support of `test()` cross-runtime helper.
This package now only provide testing utilities.

## 🕊️ Migrating from `3.x.x` to `4.x.x`

### Test must be run through respective runtime

Previously, tests were run through Deno, but now you are supposed to run them through the runtime you want to test.

- `deno`: `deno test`
- `bun`: `bun test`
- `node`: `npx tsx --test`

### Runtime selection must now be done by gating tests

The `test()` function is now directly the runner rather than a function that returns a runner.

```diff
- test()("foo", () => void null)
+ test("foo", () => void null)
```

```diff
- test("node", "bun")("foo", () => void null)
+ if (runtime === "node" || runtime === "bun")
+   test("foo", () => void null)
```

## 🕊️ Migrating from `2.x.x` to `3.x.x`

Version `3.x.x` and onwards require Deno `2.x.x` or later.

### `toBeType("object")` and `null`

The `toBeType("object")` matcher now excludes `null` by default.
The second argument has been replaced by an object with a `nullable` property for better readability.

```diff
- expect(null).toBeType("object", !null)
+ expect(null).toBeType("object", { nullable: true })
```

### Updated headers and syntax highlighting

The prefix for runtime in test names has been changed to be displayed in uppercase over a colored background.
If you were using the `deno test --filter` option, you will need to update your filter accordingly.

```diff
- [deno]
+  DENO
```

Additionally, test names now syntax highlight everything specified in backticks.

## 📜 License

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
