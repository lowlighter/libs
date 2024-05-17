# 🧪 Testing utilities

- [`📚 Documentation`](https://jsr.io/@libs/testing/doc)

## ✨ Features

- Use [deno](https://deno.com) to perform cross-platform testing on [deno](https://deno.com), [Node.js](https://nodejs.org) and [bun](https://bun.sh) runtimes
- Specify which runtimes to test per test case
- Automatically detect which runtime is available and skip tests accordingly for a streamlined development experience
- Automatically install dependencies using `deno info` and the adequate package manager for each runtime
- Permissions for deno test are defaulted to `"none"` rather than `"inherit"`

> [!WARNING] Although this library is designed for cross-platform testing, it must be run through deno. Test cases will be spawned in subprocesses using the adequate runtime and test runners.

## 📜 License

```
Copyright (c) Lecoq Simon <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
