// Imports
import untyped from "markdown-it"
import type { MarkdownIt, MarkdownItConstructor } from "./types.ts"
import anchors from "./plugins/anchors.ts"
import callouts from "./plugins/callouts.ts"
import directives, { type DirectivesOptions } from "./plugins/directives.ts"
import emojis from "./plugins/emojis.ts"
import frontmatter from "./plugins/frontmatter.ts"
import gfm from "./plugins/gfm.ts"
import highlighting from "./plugins/highlighting.ts"
import markers from "./plugins/markers.ts"
import math from "./plugins/math.ts"
import mermaid from "./plugins/mermaid.ts"
import ruby from "./plugins/ruby.ts"
import uncomments from "./plugins/uncomments.ts"
import wikilinks, { type WikilinksOptions } from "./plugins/wikilinks.ts"

/** markdown-it engine (untyped npm package, see ./types.ts). */
const MarkdownItEngine = untyped as unknown as MarkdownItConstructor

/** Renderer options. */
export type RendererOptions = {
  /** Enable GitHub Flavored Markdown (tables, strikethrough, autolinks, footnotes and tasklists). */
  gfm?: boolean
  /**
   * Allow raw HTML to pass through.
   *
   * When disabled (default), raw HTML is escaped and rendered as text, which makes the output safe against HTML injection.
   */
  html?: boolean
  /** Render line-breaks as hard-breaks (`<br>`). */
  breaks?: boolean
  /** Add anchors to headings and autolink them. */
  anchors?: boolean
  /** Enable Obsidian-style callouts (`> [!note]`). */
  callouts?: boolean
  /** Enable custom directives (`:::name`). */
  directives?: boolean | DirectivesOptions
  /** Enable emojis shortcodes (`:bento:`). */
  emojis?: boolean
  /** Parse YAML frontmatter (retrieve it by passing `metadata: true` to the render method). */
  frontmatter?: boolean
  /** Enable syntax highlighting of code blocks. */
  highlighting?: boolean
  /** Enable markers (`==foo==`). */
  markers?: boolean
  /** Enable math expressions (`$foo$`, `$$foo$$`), rendered as markup intended for client-side processing by KaTeX or MathJax. */
  math?: boolean
  /** Enable mermaid diagrams, rendered as markup intended for client-side processing by mermaid. */
  mermaid?: boolean
  /** Enable ruby annotations (`{漢字}^(kanji)`). */
  ruby?: boolean
  /** Remove HTML comments. */
  uncomments?: boolean
  /** Enable wiki links (`[[foo]]`). */
  wikilinks?: boolean | WikilinksOptions
  /** Hook direct access to the underlying {@link https://github.com/markdown-it/markdown-it | markdown-it} instance for custom rules and renderers. */
  hooks?: (engine: MarkdownIt) => void
}

/**
 * Markdown renderer.
 *
 * ```ts
 * import { Renderer } from "./renderer.ts"
 * const renderer = new Renderer({ highlighting: true, math: true, wikilinks: true })
 * renderer.render("# Hello, world!")
 * ```
 */
export class Renderer {
  /** Constructor. */
  constructor(options = {} as RendererOptions) {
    this.options = Object.freeze({ ...options })
    const { gfm: flavored = true, html = false, breaks = false, hooks } = options
    this.#engine = new MarkdownItEngine({ html, breaks, linkify: flavored })
    if (flavored)
      this.#engine.use(gfm)
    else
      this.#engine.disable(["table", "strikethrough"])
    if (options.frontmatter)
      this.#engine.use(frontmatter)
    if (options.uncomments)
      this.#engine.use(uncomments)
    if (options.anchors)
      this.#engine.use(anchors)
    if (options.callouts)
      this.#engine.use(callouts)
    if (options.directives)
      this.#engine.use(directives, options.directives === true ? {} : options.directives)
    if (options.emojis)
      this.#engine.use(emojis)
    if (options.highlighting)
      this.#engine.use(highlighting)
    if (options.markers)
      this.#engine.use(markers)
    if (options.math)
      this.#engine.use(math)
    if (options.mermaid)
      this.#engine.use(mermaid)
    if (options.ruby)
      this.#engine.use(ruby)
    if (options.wikilinks)
      this.#engine.use(wikilinks, options.wikilinks === true ? {} : options.wikilinks)
    hooks?.(this.#engine)
  }

  /** Options used to instantiate this renderer. */
  readonly options: Readonly<RendererOptions>

  /** Underlying {@link https://github.com/markdown-it/markdown-it | markdown-it} instance. */
  readonly #engine: MarkdownIt

  /**
   * Render markdown content into an HTML string.
   *
   * ```ts
   * import { Renderer } from "./renderer.ts"
   * new Renderer().render("# Hello, world!")
   * ```
   */
  render(content: string, options?: { metadata?: false }): string
  /**
   * Render markdown content into an HTML string with parsed metadata.
   *
   * ```ts
   * import { Renderer } from "./renderer.ts"
   * const renderer = new Renderer({ frontmatter: true })
   * const { value, metadata } = renderer.render("---\ntitle: foo\n---\nbar", { metadata: true })
   * console.log(metadata.frontmatter) // { title: "foo" }
   * ```
   */
  render(content: string, options: { metadata: true }): { value: string; metadata: Record<PropertyKey, unknown> }
  /**
   * Render markdown content.
   */
  render(content: string, { metadata = false } = {} as { metadata?: boolean }): string | { value: string; metadata: Record<PropertyKey, unknown> } {
    const env = { metadata: {} as Record<PropertyKey, unknown> }
    const value = this.#engine.render(content, env).trimEnd()
    return metadata ? { value, metadata: env.metadata } : value
  }
}
