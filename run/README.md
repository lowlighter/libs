# ⏯️ Run subprocesses

[![JSR](https://jsr.io/badges/@libs/run)](https://jsr.io/@libs/run) [![JSR Score](https://jsr.io/badges/@libs/run/score)](https://jsr.io/@libs/run)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Frun?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/run) [![Coverage](https://libs-coverage.lecoq.io/run/badge.svg)](https://libs-coverage.lecoq.io/run)

- [`🦕 Playground`](https://libs.lecoq.io/run)
- [`📚 Documentation`](https://jsr.io/@libs/run/doc)

> [!WARNING]
> Deno exclusive!

## ✨ Features

- Supports `stdin` interactivity through callbacks.
  - Make it possible to monitor `stdout` and `stderr` content and react accordingly.
- Auto-detects os and can automatically append an extension when running on Windows.
- Supports both `sync` and `async` modes in a single function.
  - Optionally decide to throw an error when the process exits with a non-zero code.
- Generates a `stdio` history that contains timestamped entries with configurable buffering

## 📜 Licenses

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
