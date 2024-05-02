# 📰 Logger

[`🦕 Playground`](https://dash.deno.com/playground/libs-logger)

This library is a simple improvement upon [`console`](https://developer.mozilla.org/en-US/docs/Web/API/console) API to provide additional metadata (such as timestamps and tags), and customization options.

When executed on a v8 runtime (such as deno), it can also provide caller information (like file path, function name, line and column) using the [`Error.prepareStackTrace`](https://v8.dev/docs/stack-trace-api) API.

_Example output (with all options enabled):_ ![demo](/logger/mod.png)

## Features

- Colored output
- Log levels
- Tags
- Timestamps
  - Date
  - Time
- Delta
- Caller information
  - File
  - Function name
  - Line and column
- Log formatters
  - Text
  - JSON

## Usage

```ts
import { Logger } from "./mod.ts"

// Configure logger
const tags = { foo: true, bar: "string" }
const options = { date: true, time: true, delta: true, caller: { file: true, fileformat: /.*\/(?<file>libs\/.*)$/, name: true, line: true } }
const log = new Logger({ level: Logger.level.debug, options, tags })

// Print logs
log.error("🍱 bento")
log.warn("🍜 ramen")
log.info("🍣 sushi")
log.log("🍥 narutomaki")
log.debug("🍡 dango")
```
