# 🖨️ Markdown

[![JSR](https://jsr.io/badges/@libs/markdown)](https://jsr.io/@libs/markdown) [![JSR Score](https://jsr.io/badges/@libs/markdown/score)](https://jsr.io/@libs/markdown)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Fmarkdown?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/markdown) [![Coverage](https://coverage.libs.lecoq.io/markdown/badge.svg)](https://coverage.libs.lecoq.io/markdown)

- [`🦕 Playground`](https://libs.lecoq.io/markdown)
- [`📚 Documentation`](https://jsr.io/@libs/markdown/doc)

## 📑 Examples

### Rendering markdown

```ts
// Render markdown using the default renderer
import { Renderer } from "./renderer.ts"
await Renderer.render("# Hello, world!")

// Render markdown using a custom renderer
import { gfm, highlighting, markers, math, sanitize, wikilinks } from "./plugins/mod.ts"
const renderer = new Renderer({ plugins: [gfm, highlighting, math, markers, wikilinks, sanitize] })
await renderer.render("# Hello, world!")
```

### Creating a custom renderer with different plugins sources

```ts
import { Renderer } from "./renderer.ts"
import frontmatter from "./plugins/frontmatter.ts"

const renderer = await Renderer.with({
  plugins: [
    // You can specify an existing Plugin object...
    frontmatter,
    // ...or a a HTTPS import that points towards a compatible Plugin object!
    // Warning: this is not possible if you are using the JSR package version
    //          https://github.com/denoland/deno/pull/22623
    "https://esm.sh/jsr/@libs/markdown/plugins/gfm",
  ],
})
await renderer.render("# foo")
```

## ✨ Features

- Render markdown to HTML using the [unified ecosystem](https://unifiedjs.com).
- Straightforward API for both basic markdown and extended markdown rendering
- Support out-of-the-box dozen of plugins to add extended markdown features
  - [Headings anchors](https://jsr.io/@libs/markdown/doc/plugins/anchors/~/default)
  - [Custom directives](https://jsr.io/@libs/markdown/doc/plugins/directives/~/default)
  - [Emoji rendering](https://jsr.io/@libs/markdown/doc/plugins/emojis/~/default)
  - [Frontmatter parsing](https://jsr.io/@libs/markdown/doc/plugins/frontmatter/~/default)
  - [GitHub Flavored Markdown](https://jsr.io/@libs/markdown/doc/plugins/gfm/~/default)
  - [Code highlighting](https://jsr.io/@libs/markdown/doc/plugins/highlighting/~/default)
  - [Linebreaks](https://jsr.io/@libs/markdown/doc/plugins/linebreaks/~/default)
  - [Markers](https://jsr.io/@libs/markdown/doc/plugins/markers/~/default)
  - [Math rendering](https://jsr.io/@libs/markdown/doc/plugins/math/~/default)
  - [Mermaid diagrams](https://jsr.io/@libs/markdown/doc/plugins/mermaid/~/default)
  - [Ruby annotations](https://jsr.io/@libs/markdown/doc/plugins/ruby/~/default)
  - [HTML sanitization](https://jsr.io/@libs/markdown/doc/plugins/sanitize/~/default)
  - [Comment removal](https://jsr.io/@libs/markdown/doc/plugins/uncomments/~/default)
  - [Wiki links](https://jsr.io/@libs/markdown/doc/plugins/wikilinks/~/default)
  - etc.
- Plugins can be imported:
  - From already existing Plugin objects
  - From local sources
  - From remote HTTPS sources
    - The last option is particularly useful for user-provided customizations in a dynamic environment.

## 📜 Licenses and credits

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```

This library rely on the awesome [unified ecosystem](https://unifiedjs.com).
