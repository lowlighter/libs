// Imports
import type { MarkdownIt } from "../types.ts"

/**
 * Add support for {@link https://help.obsidian.md/callouts | Obsidian-style callouts}.
 *
 * ```md
 * > [!note]
 * > foo
 * ```
 * ```html
 * <blockquote class="callout" data-callout="note">
 *   <p>foo</p>
 * </blockquote>
 * ```
 */
export default function callouts(engine: MarkdownIt): void {
  engine.core.ruler.push("callouts", (state) => {
    const tokens = state.tokens
    for (let i = 0; i + 2 < tokens.length; i++) {
      if ((tokens[i].type !== "blockquote_open") || (tokens[i + 1].type !== "paragraph_open") || (tokens[i + 2].type !== "inline"))
        continue
      const inline = tokens[i + 2]
      const text = inline.children?.[0]
      if ((!text) || (text.type !== "text"))
        continue
      const match = text.content.match(/^\[!(\w+)\][ \t]*/)
      if (!match)
        continue
      tokens[i].attrJoin("class", "callout")
      tokens[i].attrSet("data-callout", match[1].toLowerCase())
      text.content = text.content.slice(match[0].length)
      if (!text.content)
        inline.children!.splice(0, inline.children![1]?.type === "softbreak" ? 2 : 1)
    }
  })
}
