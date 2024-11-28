# 🧪 Testing utilities

[![JSR](https://jsr.io/badges/@libs/testing)](https://jsr.io/@libs/testing) [![JSR Score](https://jsr.io/badges/@libs/testing/score)](https://jsr.io/@libs/testing)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Ftesting?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/testing) [![Coverage](https://libs-coverage.lecoq.io/testing/badge.svg)](https://libs-coverage.lecoq.io/testing)

Isomorphic test runner to perform cross-platform testing on the [Deno](https://deno.com), [Node.js](https://nodejs.org) and [Bun](https://bun.sh) runtimes.

- [`📚 Documentation`](https://jsr.io/@libs/testing/doc)

## 📑 Examples

```ts
import { expect, runtime, Status, test, throws } from "./mod.ts"

// Test is performed on all available runtimes by default
test("test on all available runtimes", () => {
  expect("https://example.com").toBeUrl()
})

// Test can be restricted to specific runtimes by gating them with `runtime`
if (runtime === "node") {
  test("test only on node runtime", () => {
    expect("foo").toBeOneOf(["foo", "bar"])
  })
}

// Test on deno are performed without any additional permissions by default
// to satisfy the principle of least privilege, but can be overridden (this is ignored on other runtimes)
test("test `Deno.serve({ port: 8080 })` with additional `{ permissions: { net: 'inherit' } }`", async () => {
  await using server = Deno.serve({ port: 8080, onListen: () => null }, () => new Response(null, { status: Status.OK }))
  await expect(fetch(`http://${server.addr.hostname}:${server.addr.port}`)).resolves.toRespondWithStatus("2XX")
}, { permissions: { net: "inherit" } })

// You can use
test.todo("todo test", () => null)
test.skip("broken test", () => throws("broken test"))
```

![](https://raw.githubusercontent.com/lowlighter/libs/main/testing/example.png)

## ✨ Features

- Isomorphic test runner that can be used multiple different runtimes.
- Extends [`@std/expect`](https://jsr.io/@std/expect) with additional matchers (`toMatchDescriptor`, `toBeImmutable`, `toBeIterable`, `toRespondWithStatus`, `toBeEmail`, etc.)
  - See [`@libs/testing/expect`](https://jsr.io/@libs/testing/doc/expect/~) for more information about available matchers.
- The permissions for deno test are defaulted to `"none"` rather than `"inherit"`.
- Syntax highlighting in test names for better readability.

## 🤖 Workflow usage

Below is an example on how it could be used within a [GitHub Actions](https://github.com/features/actions) workflow:

```yaml
on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
        with:
          deno-version: 2.x
      - run: deno test
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: 1.x
      - run: bun test
      - uses: actions/setup-node@v4
        with:
          node-version: 22.x
      - run: npx tsx --test
```

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
