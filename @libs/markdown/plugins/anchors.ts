// Imports
import type { MarkdownIt } from "../types.ts"
import { slugify } from "@std/text/unstable-slugify"

/**
 * Add anchors to headings and autolink them.
 *
 * ```md
 * # foo
 * ```
 * ```html
 * <h1 id="foo"><a href="#foo">foo</a></h1>
 * ```
 */
export default function anchors(engine: MarkdownIt): void {
  engine.core.ruler.push("anchors", (state) => {
    const slugs = new Map<string, number>()
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i]
      const inline = state.tokens[i + 1]
      if ((token.type !== "heading_open") || (inline?.type !== "inline"))
        continue
      const text = (inline.children ?? []).filter(({ type }) => ["text", "code_inline"].includes(type)).map(({ content }) => content).join("")
      let slug = slugify(text)
      const count = slugs.get(slug) ?? 0
      slugs.set(slug, count + 1)
      if (count)
        slug = `${slug}-${count}`
      token.attrSet("id", slug)
      const open = new state.Token("link_open", "a", 1)
      open.attrSet("href", `#${slug}`)
      const close = new state.Token("link_close", "a", -1)
      inline.children = [open, ...inline.children ?? [], close]
    }
  })
}
