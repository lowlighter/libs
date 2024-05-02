# 🔳 QR Code generator

[`🦕 Playground`](https://dash.deno.com/playground/libs-qrcode)

This library is based on the awesome work of [@nayiki](https://github.com/nayuki). Please take a look at their articles about QR Codes:

- [Creating a QR Code step by step](https://www.nayuki.io/page/creating-a-qr-code-step-by-step)
- [QR Code generator library](https://www.nayuki.io/page/qr-code-generator-library)

I rewrote this because I couldn't find a suitable implementation using EcmaScript modules. Oddly enough, most of the libraries I found also required a [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) to properly work (but I specifically wanted a SVG
image output). Usually it's because they were maily intended for client-side usage. A few other implementations had either some dated code or obfuscated code which I didn't want.

## Features

- Support out-of-the-box `array`, `console` and `svg` outputs
- Customizable colors and error correction level (ECL)
- No external dependencies
- Not canvas based (i.e. no DOM dependencies and thus cross-platform)

## Usage

```ts
import { qrcode } from "./mod.ts"

// SVG output
const svg = qrcode("https://example.com", { output: "svg" })
console.assert(svg.includes("</svg>"))

// Console output
qrcode("https://example.com", { output: "console" })

// Array output
const array = qrcode("https://example.com")
console.assert(Array.isArray(array))
```
