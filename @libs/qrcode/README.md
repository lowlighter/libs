# 🔳 QR Code generator

[![JSR](https://jsr.io/badges/@libs/qrcode)](https://jsr.io/@libs/qrcode) [![JSR Score](https://jsr.io/badges/@libs/qrcode/score)](https://jsr.io/@libs/qrcode)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Fqrcode?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/qrcode) [![Coverage](https://libs-coverage.lecoq.io/qrcode/badge.svg)](https://libs-coverage.lecoq.io/qrcode)

- [`🦕 Playground`](https://libs.lecoq.io/qrcode)
- [`📚 Documentation`](https://jsr.io/@libs/qrcode/doc)

## 📑 Examples

### SVG output

```ts
import { qrcode } from "./mod.ts"
const svg = qrcode("https://example.com", { output: "svg" })
console.assert(svg.includes("</svg>"))
```

### PNG output

```ts
import { qrcode } from "./mod.ts"
const png = qrcode("https://example.com", { output: "png", scale: 8 })
console.assert(png instanceof Uint8Array)
// await Deno.writeFile("qrcode.png", png)
```

### Console output

```ts
import { qrcode } from "./mod.ts"
qrcode("https://example.com", { output: "console" })
```

### Array output

```ts
import { qrcode } from "./mod.ts"
const array = qrcode("https://example.com")
console.assert(Array.isArray(array))
```

## ✨ Features

- Support for `array`, `console`, `svg` and `png` outputs out-of-the-box.
- Support for custom colors and error correction level (ECL).
- Has a modern implementation using TypeScript and EcmaScript modules.
- Has no external dependencies _(not even the DOM's [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) element)_!
- Is runtime agnostic _(and even works in browsers)_!

## 📜 License and credits

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE

Copyright (c) Project Nayuki. (MIT License)
https://www.nayuki.io/page/qr-code-generator-library
```

This library is based on the awesome work of [@nayiki](https://github.com/nayuki).

Please take a look at their articles about QR Codes:

- [Creating a QR Code step by step](https://www.nayuki.io/page/creating-a-qr-code-step-by-step)
- [QR Code generator library](https://www.nayuki.io/page/qr-code-generator-library)
