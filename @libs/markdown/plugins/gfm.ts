// Imports
import type { MarkdownIt } from "../types.ts"
import footnote from "markdown-it-footnote"

/**
 * Enable GitHub Flavored Markdown (GFM).
 *
 * The markdown-it defaults already cover tables and strikethrough, this plugin adds footnotes and tasklists.
 * Autolinks are covered by the `linkify` option of markdown-it itself.
 *
 * {@link https://github.github.com/gfm | See GitHub Flavored Markdown specification for more information}.
 *
 * ```md
 * - [x] foo
 * ```
 * ```html
 * <ul class="contains-task-list">
 *   <li class="task-list-item"><input type="checkbox" disabled checked> foo</li>
 * </ul>
 * ```
 */
export default function gfm(engine: MarkdownIt): void {
  engine.use(footnote)
  engine.core.ruler.after("inline", "tasklists", (state) => {
    const tokens = state.tokens
    const lists = [] as typeof tokens
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if ((token.type === "bullet_list_open") || (token.type === "ordered_list_open"))
        lists.push(token)
      if ((token.type === "bullet_list_close") || (token.type === "ordered_list_close"))
        lists.pop()
      if ((token.type !== "inline") || (!token.children?.length) || (tokens[i - 1]?.type !== "paragraph_open") || (tokens[i - 2]?.type !== "list_item_open"))
        continue
      const text = token.children[0]
      if (text.type !== "text")
        continue
      const match = text.content.match(/^\[([ xX])\](?: |$)/)
      if (!match)
        continue
      text.content = text.content.slice(match[0].length)
      const checkbox = new state.Token("html_inline", "", 0)
      checkbox.content = `<input type="checkbox" disabled${match[1] === " " ? "" : " checked"}> `
      token.children.unshift(checkbox)
      tokens[i - 2].attrJoin("class", "task-list-item")
      const list = lists.at(-1)
      if (list && (!`${list.attrGet("class")}`.includes("contains-task-list")))
        list.attrJoin("class", "contains-task-list")
    }
  })
}
