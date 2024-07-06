# 🧪 Testing utilities

[![JSR](https://jsr.io/badges/@libs/testing)](https://jsr.io/@libs/testing) [![JSR Score](https://jsr.io/badges/@libs/testing/score)](https://jsr.io/@libs/testing)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Ftesting?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/testing) [![Coverage](https://libs-coverage.lecoq.io/testing/badge.svg)](https://libs-coverage.lecoq.io/testing)

Use [Deno](https://deno.com) to perform cross-platform testing on the [Deno](https://deno.com), [Node.js](https://nodejs.org) and [Bun](https://bun.sh) runtimes.

- [`📚 Documentation`](https://jsr.io/@libs/testing/doc)

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
