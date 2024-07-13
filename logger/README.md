# 📰 Logger

[![JSR](https://jsr.io/badges/@libs/logger)](https://jsr.io/@libs/logger) [![JSR Score](https://jsr.io/badges/@libs/logger/score)](https://jsr.io/@libs/logger)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Flogger?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/logger) [![Coverage](https://libs-coverage.lecoq.io/logger/badge.svg)](https://libs-coverage.lecoq.io/logger)

- [`🦕 Playground`](https://dash.deno.com/playground/libs-logger)
- [`📚 Documentation`](https://jsr.io/@libs/logger/doc)

## ✨ Features

![](https://raw.githubusercontent.com/lowlighter/libs/main/logger/example.png)

- Has no external dependencies.
- Support for colored output.
- Support for log levels.
- Support for tags.
- Support for timestamps (date, time, delta).
- Support for displaying caller information (file, function name, line and column).
- Support for multiple log formatters (text, JSON).

## 🕊️ Migrating from 1.x.x to 2.x.x

### Flattened constructor options

All fields from `options` are now located at the root of the constructor argument.

```diff
- new Logger({ options: { date: true, time: true } })
+ new Logger({ date: true, time: true })
```

### Chainable setters for `level` and `options`

Instead of properties, `level()` and `options()` are now chainable setters when called with arguments and getters when called without.

```diff
- log.level = Logger.level.log
- log.options = {...}
- console.log(log.level, log.options)
+ log.level(Logger.level.log).options({...})
+ console.log(log.level(), log.options())
```

### Flexible file formatting

To offer more flexibility, `caller.fileformat` is now a `[RegExp, string]` tuple.

```diff
- const options = { caller: { fileformat: /(?<file>.*)/ } }
+ const options = { caller: { fileformat: [/(?<file>.*)/, "$<file>"] } }
```

### Additional stream channels

The following new stream channels are available:

- `ok` (use same channel as `info`)
- `wdebug` (use same channel as `debug`)
- `trace` (use same channel as `debug`)
- `probe` (use same channel as `debug`)

## 📜 License and credits

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
