// Imports
import { type Processor as _Processor, unified } from "unified"
import remarkRehype from "remark-rehype"
import remarkParse from "remark-parse"
import rehypeRaw from "rehype-raw"
import rehypeStringify from "rehype-stringify"
import pluginGfm from "./plugins/gfm.ts"
import pluginSanitize from "./plugins/sanitize.ts"

/**
 * Markdown renderer.
 */
export class Renderer {
  /** Constructor. */
  constructor({ plugins = [] } = {} as { plugins: Plugin[] }) {
    this.#processor = unified().use(remarkParse)
    plugins.filter(({ remark }) => remark).forEach(({ remark }) => this.#processor = remark!(this.#processor, this as unknown as FriendlyRenderer))
    this.#processor = this.#processor.use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw)
    plugins.filter(({ rehype }) => rehype).forEach(({ rehype }) => this.#processor = rehype!(this.#processor, this as unknown as FriendlyRenderer))
    this.#processor = this.#processor.use(rehypeStringify)
  }

  /** Renderer processor. */
  #processor: Processor

  /** Plugins storage by render id. */
  protected storage = {} as Record<PropertyKey, Record<PropertyKey, unknown>>

  /**
   * Render markdown content into an HTML string.
   *
   * @example
   * ```ts
   * import { Renderer } from "./renderer.ts"
   * import pluginGfm from "./plugins/gfm.ts"
   *
   * const renderer = new Renderer({ plugins: [ pluginGfm ] })
   * await renderer.render("# Hello, world!")
   * ```
   */
  async render(content: string, options?: { metadata?: false }): Promise<string>
  /**
   * Render markdown content into an HTML string with parsed metadata.
   *
   * @example
   * ```ts
   * import { Renderer } from "./renderer.ts"
   * import pluginGfm from "./plugins/gfm.ts"
   * import pluginFrontmatter from "./plugins/frontmatter.ts"
   *
   * const renderer = new Renderer({ plugins: [ pluginGfm, pluginFrontmatter ] })
   * await renderer.render(`
   * ---
   * title: Hello, world!
   * ---
   * Lorem ipsum dolor sit amet.
   * `.trim())
   * ```
   */
  async render(content: string, options?: { metadata: true }): Promise<{ value: string; metadata: Record<PropertyKey, unknown> }>
  /**
   * Render markdown content.
   */
  async render(content: string, { metadata = false } = {} as { metadata?: boolean }): Promise<string | { value: string; metadata: Record<PropertyKey, unknown> }> {
    const id = (this.#id++) % Number.MAX_SAFE_INTEGER
    try {
      if (metadata) {
        this.storage[id] ??= {}
      }
      const value = `${await this.#processor.process({ id, value: content, cwd: "" })}`
      return metadata ? { value, metadata: { ...this.storage[id] } } : value
    } finally {
      delete this.storage[id]
    }
  }

  /** Render request id counter. */
  #id = 0

  /** Default renderer instance. */
  static default = new Renderer({ plugins: [pluginGfm, pluginSanitize] }) as Renderer

  /** See {@link Renderer.render}. */
  static render = this.default.render.bind(this.default) as typeof Renderer.prototype.render

  /**
   * Instantiate a new renderer with specified plugins.
   *
   * Plugins may be specified as a URL or string path to a module, or as an already import {@link Plugin} object.
   *
   * @example
   * ```ts
   * import { Renderer } from "./renderer.ts"
   * import frontmatter from "./plugins/frontmatter.ts"
   *
   * const renderer = await Renderer.with({
   *   plugins: [
   *     frontmatter,
   *     "./plugins/gfm.ts",
   *     new URL("./plugins/sanitize.ts", import.meta.url),
   *  ]
   * })
   * await renderer.render("# foo")
   * ```
   */
  static async with({ plugins = [] }: { plugins: Array<Plugin | URL | string> }): Promise<Renderer> {
    plugins = plugins.map((plugin) => plugin instanceof URL ? plugin.href : plugin)
    const resolved = await Promise.all(plugins.map((plugin) => (typeof plugin === "string") ? import(plugin) : plugin))
    return new Renderer({ plugins: resolved })
  }
}

/** {@link Renderer} with exposed protected properties. */
export type FriendlyRenderer = Renderer & { storage: Record<PropertyKey, Record<PropertyKey, unknown>> }

/** Markdown processor. */
// deno-lint-ignore no-explicit-any
export type Processor = _Processor<any, any, any, any, any>

/** Markdown plugin. */
export type Plugin = {
  remark?: (processor: Processor, renderer: FriendlyRenderer) => Processor
  rehype?: (processor: Processor, renderer: FriendlyRenderer) => Processor
}
