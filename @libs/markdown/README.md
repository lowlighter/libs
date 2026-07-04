# 🖨️ Markdown

[![JSR](https://jsr.io/badges/@libs/markdown)](https://jsr.io/@libs/markdown) [![JSR Score](https://jsr.io/badges/@libs/markdown/score)](https://jsr.io/@libs/markdown)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Fmarkdown?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/markdown) [![Coverage](https://libs-coverage.lecoq.io/markdown/badge.svg)](https://libs-coverage.lecoq.io/markdown)

- [`🦕 Playground`](https://libs.lecoq.io/markdown)
- [`📚 Documentation`](https://jsr.io/@libs/markdown/doc)

## 📑 Examples

### Rendering markdown

```ts
import { markdown } from "./mod.ts"

// Render markdown (GitHub Flavored Markdown is enabled by default)
markdown("# Hello, world!")

// Toggle additional features through options
markdown("$\\pi$ is ==irrational==", { math: true, markers: true })

// Raw HTML is escaped by default, opt-in with the `html` option
markdown("<b>trusted</b>", { html: true })

// Retrieve frontmatter metadata
const { value, metadata } = markdown("---\ntitle: foo\n---\nbar", { frontmatter: true, metadata: true })
console.log(value, metadata.frontmatter) // "<p>bar</p>" { title: "foo" }
```

### Reusing a renderer and hooking custom rules

```ts
import { Renderer } from "./renderer.ts"

const renderer = new Renderer({
  highlighting: true,
  wikilinks: { resolve: (link) => `/wiki/${link}` },
  // Hook the underlying markdown-it instance for custom rules and renderers
  hooks(engine) {
    engine.renderer.rules.code_inline = (tokens, index) => `<kbd>${engine.utils.escapeHtml(tokens[index].content)}</kbd>`
  },
})
renderer.render("# Hello, world!")
```

## ✨ Features

- Single `markdown(text, options)` function where every feature is a simple toggle.
- Renders [GitHub Flavored Markdown](https://github.github.com/gfm) by default (tables, strikethrough, autolinks, footnotes and tasklists).
- Raw HTML is escaped by default, making the output safe against HTML injection (opt-in with the `html` option).
- Optional features:
  - [Headings anchors](https://jsr.io/@libs/markdown/doc/plugins/anchors/~/default)
  - [Obsidian-style callouts](https://jsr.io/@libs/markdown/doc/plugins/callouts/~/default)
  - [Custom directives](https://jsr.io/@libs/markdown/doc/plugins/directives/~/default)
  - [Emoji rendering](https://jsr.io/@libs/markdown/doc/plugins/emojis/~/default)
  - [Frontmatter parsing](https://jsr.io/@libs/markdown/doc/plugins/frontmatter/~/default)
  - [Code highlighting](https://jsr.io/@libs/markdown/doc/plugins/highlighting/~/default)
  - [Markers](https://jsr.io/@libs/markdown/doc/plugins/markers/~/default)
  - [Math rendering](https://jsr.io/@libs/markdown/doc/plugins/math/~/default)
  - [Mermaid diagrams](https://jsr.io/@libs/markdown/doc/plugins/mermaid/~/default)
  - [Ruby annotations](https://jsr.io/@libs/markdown/doc/plugins/ruby/~/default)
  - [Comment removal](https://jsr.io/@libs/markdown/doc/plugins/uncomments/~/default)
  - [Wiki links](https://jsr.io/@libs/markdown/doc/plugins/wikilinks/~/default)
- Math and mermaid are rendered as plain markup intended for client-side processing (KaTeX, MathJax, mermaid), so no heavyweight server-side dependency is required.
- Escape hatch to the underlying [markdown-it](https://github.com/markdown-it/markdown-it) instance through the `hooks` option for custom syntax and rendering rules.

## 📜 Licenses and credits

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```

This library relies on the awesome [markdown-it](https://github.com/markdown-it/markdown-it) library.
