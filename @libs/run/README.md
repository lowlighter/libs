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

// Commands are run asynchronously, and support Deno.Command options alongside additional options
// Piped channels are captured into the result and mirrored to a LogTape sub-logger; you can also automatically append an extension when running on Windows
await command("deno", ["--version"], { stdout: "piped", stderr: "piped", winext: ".exe" })

// Commands can be run synchronously too, and can also throw an error automatically when the process exits with a non-zero code
command("deno", ["--version"], { sync: true, throw: true })
```

### Writing to stdin

```ts
import { command } from "./command.ts"

const { stdout } = await command("deno", ["repl"], {
  env: { NO_COLOR: "true" },
  // Passing a callback automatically pipes stdin.
  // The callback is an async generator: `for await` over `stdio` to react to output,
  // `yield` to write to stdin (verbatim — add your own newlines), and `return` to close it.
  callback: async function* ({ stdio }) {
    for await (const { stdout } of stdio) {
      if (!stdout.includes("exit using"))
        continue
      yield "console.log('hello')\n"
      return
    }
  },
})
console.assert(stdout.includes("hello"))
```

## ✨ Features

- Supports `stdin` interactivity through an async generator callback.
  - `for await` over process output, `yield` to write to stdin, `return` to close it.
- Auto-detects os and can automatically append an extension when running on Windows.
- Supports both `sync` and `async` modes in a single function.
  - Optionally decide to throw an error when the process exits with a non-zero code.
- Background processes support `await using` for automatic cleanup (killed and awaited on scope exit).
- Generates a `stdio` history that contains timestamped entries with configurable buffering
- Integrates with [`LogTape`](https://logtape.org): each piped channel is mirrored to a sub-logger (`stdin`/`stdout`/`stderr`).
  - Logging defaults to the `["run"]` category, leaving output configuration to the host application.

## 🕊️ Migrating from `3.x.x` to `4.x.x`

Version `4.x.x` replaces the [`@libs/logger`](https://jsr.io/@libs/logger) dependency with [`LogTape`](https://logtape.org) and reworks the stdin callback:

- The `logger` option is now a category (`string[]`) forwarded to `getLogger()`, defaulting to `["run"]`.
  - As recommended for libraries, `command()` never calls `configure()` — the host application is in charge of setting up sinks and levels.
  - Each channel is mirrored to a sub-logger: `stdin` at `debug`, `stdout` at `info`, `stderr` at `error`.
- The `stdin`, `stdout` and `stderr` options now only accept `"piped"`, `"inherit"` or `null` (log levels are no longer set per-channel).
- The `callback` option is now an **async generator** instead of a function:
  - `for await (const { stdout } of stdio)` to react to output, `yield "text"` to write to stdin (verbatim, no automatic newline), and `return` to close it.
  - The `write()`, `close()` and `wait()` helpers are gone — use `yield`, `return` and `await` respectively.
  - If the generator throws, stdin is closed, the process is killed, and the result rejects with the error.

## 🕊️ Migrating from `2.x.x` to `3.x.x`

Version `3.x.x` and onwards require Deno `2.x.x` or later.

## 📜 Licenses

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
