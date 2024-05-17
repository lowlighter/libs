# 🧪 Testing utilities

[![JSR](https://jsr.io/badges/@libs/testing)](https://jsr.io/@libs/testing) [![JSR Score](https://jsr.io/badges/@libs/testing/score)](https://jsr.io/@libs/testing)

- [`📚 Documentation`](https://jsr.io/@libs/testing/doc)

## ✨ Features

- Use [deno](https://deno.com) to perform cross-platform testing on [deno](https://deno.com), [Node.js](https://nodejs.org) and [bun](https://bun.sh) runtimes
- Specify which runtimes should be tested per test case
- Automatically detect which runtime is available on current platform and skip tests accordingly for a streamlined development experience
- Automatically install dependencies using `deno info` and the adequate package manager for each runtime
- Permissions for deno test are defaulted to `"none"` rather than `"inherit"`

> [!WARNING]\
> Although this library is designed for cross-platform testing, it must be run through deno. Test cases will be spawned in subprocesses using the adequate runtime and test runners.

## 🤖 Workflow usage

Below is an example on how it could be used within a [GitHub Actions](https://github.com/features/actions) workflow:

```yaml
on:
  - push
  - pull_request
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

```
Copyright (c) Lecoq Simon <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
