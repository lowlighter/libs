# 🦊 Virtual DOM

[![JSR](https://jsr.io/badges/@libs/dom)](https://jsr.io/@libs/dom) [![JSR Score](https://jsr.io/badges/@libs/dom/score)](https://jsr.io/@libs/dom)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Form?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/dom) [![Coverage](https://libs-coverage.lecoq.io/dom/badge.svg)](https://libs-coverage.lecoq.io/dom)

- [`🦕 Playground`](https://libs.lecoq.io/dom)
- [`📚 Documentation`](https://jsr.io/@libs/dom/doc)

> [!CAUTION]
> This package is in early development and is not yet ready for production use.

This library implements Web APIs so it is possible to create "browser-like" environments which can then be used to perform server-side rendering or unit-testing without a fully-fledged browser.

While it will work on any runtime following standards, please note that any built-in Web API present in the Deno runtime is not re-implemented, to keep it maintainable and lightweight.

Implemention follows [Mozilla Developer Network documentation](https://developer.mozilla.org) and supported features mostly reflects what is available on a [Firefox browser](https://www.mozilla.org/firefox) (when possible).

It tries to match standards as closely as possible (so many classes cannot be instantiated directly for example) but behavior may differ slightly in some cases (please open an issue in this case).

## 📦 Features

This library implements web APIs based on `lib.dom.d.ts` type definitions, which means it'll satisfy any code that relies on these types:

```ts
/// <reference lib="dom" />
```

Supported Web APIs _(some may be partially implemented, in which case accessing or calling such a property will throw a `DOMException`)_:

- [x] [Clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard)
  - [x] [ClipboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent)
  - [x] [ClipboardItem](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem)
- [x] [Navigator](https://developer.mozilla.org/en-US/docs/Web/API/Navigator)
  - [x] [Permissions](https://developer.mozilla.org/en-US/docs/Web/API/Permissions)
    - [x] [PermissionsStatus](https://developer.mozilla.org/en-US/docs/Web/API/PermissionsStatus)
  - [x] [UserActivation](https://developer.mozilla.org/en-US/docs/Web/API/UserActivation)
  - [x] [MimeType](https://developer.mozilla.org/en-US/docs/Web/API/MimeType)
  - [x] [MimeTypeArray](https://developer.mozilla.org/en-US/docs/Web/API/MimeTypeArray)
- [x] [Window](https://developer.mozilla.org/en-US/docs/Web/API/Window)
  - [x] [BarProp](https://developer.mozilla.org/en-US/docs/Web/API/BarProp)
  - [ ] [History](https://developer.mozilla.org/en-US/docs/Web/API/History)
  - [ ] [Location](https://developer.mozilla.org/en-US/docs/Web/API/Location)
  - [ ] [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)
  - [ ] [Selection](https://developer.mozilla.org/en-US/docs/Web/API/Selection)
    - [ ] [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range)
  - [ ] [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
  - [ ] [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
  - [ ] [CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry)
- [ ] [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document)
  - [ ] [QuerySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
- [ ] [CSS](https://developer.mozilla.org/en-US/docs/Web/API/CSS)
  - [ ] [CSSStyleSheet](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet)
- [ ] [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
  - [x] [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList)
  - [ ] [NamedNodeMap](https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap)
  - [x] [Attr](https://developer.mozilla.org/en-US/docs/Web/API/Attr)
  - [ ] [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
- [ ] [DOMParser](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)
- [ ] [Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage)
- [ ] [XMLSerializer](https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer)
- [ ] [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)

## 📜 Licenses

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
