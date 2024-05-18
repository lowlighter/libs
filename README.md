# 📃 XML parser and stringifier

[![JSR](https://jsr.io/badges/@libs/xml)](https://jsr.io/@libs/xml) [![JSR Score](https://jsr.io/badges/@libs/xml/score)](https://jsr.io/@libs/xml)

- [`🦕 Playground`](https://dash.deno.com/playground/libs-xml)
- [`📚 Documentation`](https://jsr.io/@libs/xml/doc)

## ✨ Features

- Based on [quick-xml](https://github.com/tafia/quick-xml) rust package (compiled to WASM)
- Support `XML.parse` and `XML.stringify`
- Support `<!-- -->` comments
- Support XML entities (`&amp;`, `&#38;`, `&#x26;`, ...)
- Support mixed content (text and nodes)
- Large output transformation options
  - Auto-flattening of nodes with a single child, text or attributes
  - Auto-revival of `boolean`, `number`, etc.
  - Auto-group same-named nodes into arrays
  - Custom `reviver` function
- Metadata stored into non-enumerable properties for advanced usage

## 📜 License and credits

```
Copyright (c) Lecoq Simon <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```

This library used to be published at [deno.land/x/xml](https://deno.land/x/xml) and [jsr.io/@lowlighter/xml](https://jsr.io/@lowlighter/xml). It was moved into [jsr.io/@libs/xml](https://jsr.io/@libs/xml) starting version `5.0.0`.

Version prior to `5.0.0` used to be fully written in TypeScript but it was rewritten in Rust to improve performances and support more features.
