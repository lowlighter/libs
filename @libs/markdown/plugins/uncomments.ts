// Imports
// @ts-types="@types/markdown-it"
import type MarkdownIt from "markdown-it"

/**
 * Remove HTML comments.
 *
 * Code blocks are left untouched.
 *
 * ```md
 * foo<!-- baz -->bar
 * ```
 * ```html
 * <p>foobar</p>
 * ```
 */
export default function uncomments(engine: MarkdownIt): void {
  engine.core.ruler.push("uncomments", (state) => {
    const walk = (tokens: typeof state.tokens) => {
      for (const token of tokens) {
        if (token.children)
          walk(token.children)
        if (["html_block", "html_inline", "text"].includes(token.type))
          token.content = token.content.replace(/<!--[\s\S]*?-->/g, "")
      }
    }
    walk(state.tokens)
  })
}
