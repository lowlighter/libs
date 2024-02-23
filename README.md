# 🍱 lowlighter's standalone libraries

This is a collection of carefully crafted _TypeScript_ standalone libraries. These try to be minimal, unbloated and convenient.

Most of them are written with [deno](https://deno.com) in mind, but as the code honors [web standards](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/The_web_and_web_standards) they should be usable on any runtime that follows web specifications
(including browsers).

While this repository is open, it is not really intended to be a collaborative project. Pull requests for bug fixes or improvements are still welcome, but I may not accept any feature request if it doesn't seem to fit the scope of this project.

Additionally, these libraries tends to follow my own coding style which:

- use ES next syntax
- try to be minimalistic and visually unbloated (no semicolons, infered typing, etc.)
- use caseless convention (single whole words are preferred assuming they're unambiguous depending on the local context)

# 📜 License

This work is licensed under the [MIT License](./LICENSE).

If you include a significant part of it in your own project, _**you should keep the license notice**_ with it, including the mention of the additional original authors if any.

# 📦 Libraries

## 🔳 QR Code generator

This library is based on the awesome work of [@nayiki](https://github.com/nayuki). Please take a look at their articles about QR Codes:

- [Creating a QR Code step by step](https://www.nayuki.io/page/creating-a-qr-code-step-by-step)
- [QR Code generator library](https://www.nayuki.io/page/qr-code-generator-library)

### Features

- Support out-of-the-box `array`, `console` and `svg` outputs
- Customizable colors and error correction level (ECL)
- No external dependencies
- Not canvas based (i.e. no DOM dependencies and thus cross-platform)

### Usage

```ts
import { qrcode } from "./qrcode.ts"

// SVG output
const svg = qrcode("https://example.com", { output: "svg" })
console.assert(svg.includes("</svg>"))

// Console output
qrcode("https://example.com", { output: "console" })

// Array output
const array = qrcode("https://example.com")
console.assert(Array.isArray(array))
```
