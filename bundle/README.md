# 📦 Bundle utilities

[![JSR](https://jsr.io/badges/@libs/bundle)](https://jsr.io/@libs/bundle) [![JSR Score](https://jsr.io/badges/@libs/bundle/score)](https://jsr.io/@libs/bundle)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Fbundle?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/bundle) [![Coverage](https://coverage.libs.lecoq.io/bundle/badge.svg)](https://coverage.libs.lecoq.io/bundle)

## 🗜️ TypeScript

- [`🦕 Playground`](https://libs.lecoq.io/bundle/ts)
- [`📚 Documentation`](https://jsr.io/@libs/bundle/doc/ts/~)

### ✨ Features

- Support for passing either a raw TypeScript string or a file URL.
- Support for injecting comment banners (e.g., for licenses).
- Minification is enabled by default.
  - Support for advanced minification through [Terser](https://terser.org).

## 🎨 CSS

- [`🦕 Playground`](https://libs.lecoq.io/bundle/css)
- [`📚 Documentation`](https://jsr.io/@libs/bundle/doc/css/~)

### ✨ Features

- Support for passing either a raw CSS string or a file URL.
- Support for injecting comment banners (e.g., for licenses).
- Support for minification through [CSSO](https://github.com/css/csso).
- Support for formatting and linting through [StyleLint](https://github.com/stylelint/stylelint).
- Support form compatibility checking against [MDN compatibility data](https://github.com/mdn/browser-compat-data).

## 🔬 WASM

Launch `wasm-pack` for a Rust project, inject generated bindings as a base64 string and minify the JS output!

- [`📚 Documentation`](https://jsr.io/@libs/bundle/doc/wasm/~)

### ✨ Features

- Support for injecting comment banners (e.g., for licenses).

## 📜 License and credits

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
