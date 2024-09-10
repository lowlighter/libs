# 🧪 Testing utilities

[![JSR](https://jsr.io/badges/@libs/testing)](https://jsr.io/@libs/testing) [![JSR Score](https://jsr.io/badges/@libs/testing/score)](https://jsr.io/@libs/testing)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Ftesting?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/testing) [![Coverage](https://coverage.libs.lecoq.io/testing/badge.svg)](https://coverage.libs.lecoq.io/testing)

Use [Deno](https://deno.com) to perform cross-platform testing on the [Deno](https://deno.com), [Node.js](https://nodejs.org) and [Bun](https://bun.sh) runtimes.

- [`📚 Documentation`](https://jsr.io/@libs/testing/doc)

## 📑 Examples

```ts
// Because the testing module will spawn runtime processes, permissions are required to run tests.
// You also need to specify any additional permissions required by tests since permissions escalation is not permitted.
// deno test --allow-net=0.0.0.0 --allow-run=deno,bun,npx,node example.ts
import { expect, Status, test } from "./mod.ts"

// Test is performed on all available runtimes by default
// If a runtime is not available, the test is automatically skipped
test("all")("test on all available runtimes", () => {
  expect("https://example.com").toBeUrl()
})

// Test can be restricted to specific runtimes
test("node", "bun")("test only on node and bun runtimes", () => {
  expect("foo").toBeOneOf(["foo", "bar"])
})

// Test on deno are performed without any additional permissions by default
// to satisfy the principle of least privilege, but can be overridden (this is ignored on other runtimes)
test("deno")("test only on deno, with additional permissions", async () => {
  await using server = Deno.serve({ port: 8080, onListen: () => null }, () => new Response(null, { status: Status.OK }))
  await expect(fetch(`http://${server.addr.hostname}:${server.addr.port}`)).resolves.toRespondWithStatus("2XX")
}, { permissions: { net: "inherit" } })

// `Deno.test.only` and `Deno.test.ignore` (renamed to `skip`) are supported too
test.skip("node")("test to implement later", () => {
  throw new Error("TODO")
})
```

![](https://raw.githubusercontent.com/lowlighter/libs/main/testing/example.png)

## ✨ Features

- Extends [`@std/expect`](https://jsr.io/@std/expect) with additional matchers (`toMatchDescriptor`, `toBeImmutable`, `toBeIterable`, `toRespondWithStatus`, `toBeEmail`, etc.)
  - See [`@libs/testing/expect`](https://jsr.io/@libs/testing/doc/expect/~) for more information about available matchers.
- Specify which runtimes should be tested per test case
- Automatically detect which runtimes are available and skip tests accordingly for a streamlined development experience.
- Automatically install dependencies using `deno info` and the correct package manager for each runtime.
- The permissions for deno test are defaulted to `"none"` rather than `"inherit"`.

> [!WARNING]
> Although this library is designed for cross-platform testing, it must be run through Deno.
> Test cases will be spawned in subprocesses.

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
      - uses: denoland/setup-deno@v1
        with:
          deno-version: 1.x
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: 1.x
      - uses: actions/setup-node@v4
        with:
          node-version: 22.x
      - run: deno task ci
```

## 📜 License

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
