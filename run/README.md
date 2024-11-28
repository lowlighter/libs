# ⏯️ Run subprocesses

[![JSR](https://jsr.io/badges/@libs/run)](https://jsr.io/@libs/run) [![JSR Score](https://jsr.io/badges/@libs/run/score)](https://jsr.io/@libs/run)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Frun?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/run) [![Coverage](https://libs-coverage.lecoq.io/run/badge.svg)](https://libs-coverage.lecoq.io/run)

- [`🦕 Playground`](https://libs.lecoq.io/run)
- [`📚 Documentation`](https://jsr.io/@libs/run/doc)

> [!WARNING]
> Deno exclusive!

## 📑 Examples

### Run a command

```ts
import { command } from "./command.ts"

// Commands are run asynchronously, and support Deno.command options alongside additional options
// For example, stdio can also be set to a Logger level too or you can automatically append an extension when running on Windows
await command("deno", ["--version"], { stdout: "debug", stderr: "piped", winext: ".exe" })

// Commands can be run synchronously too, and can also throw an error automatically when the process exits with a non-zero code
command("deno", ["--version"], { sync: true, throw: true })
```

### Writing to stdin

```ts
import { command } from "./command.ts"

const { stdout } = await command("deno", ["repl"], {
  env: { NO_COLOR: "true" },
  // Passing a callback will automatically set `stdin` to `"piped"`
  // You can then write to the process using utility functions
  callback: async ({ i, stdio, write, close, wait }) => {
    if ((!stdio.stdout.includes("exit using")) || i) {
      return
    }
    await write("console.log('hello')")
    await wait(1000)
    close()
  },
})
console.assert(stdout.includes("hello"))
```

## ✨ Features

- Supports `stdin` interactivity through callbacks.
  - Make it possible to monitor `stdout` and `stderr` content and react accordingly.
- Auto-detects os and can automatically append an extension when running on Windows.
- Supports both `sync` and `async` modes in a single function.
  - Optionally decide to throw an error when the process exits with a non-zero code.
- Generates a `stdio` history that contains timestamped entries with configurable buffering

## 🕊️ Migrating from `2.x.x` to `3.x.x`

Version `3.x.x` and onwards require Deno `2.x.x` or later.

## 📜 Licenses

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
