// Imports
// @ts-types="@types/markdown-it"
import type MarkdownIt from "markdown-it"

/**
 * Add support for markers.
 *
 * Markers may be assigned a single-letter attribute (e.g. for colors) using the `=x=foo=` syntax.
 *
 * ```md
 * ==foo==
 * =r=bar=
 * ```
 * ```html
 * <p><mark>foo</mark></p>
 * <p><mark r="">bar</mark></p>
 * ```
 */
export default function markers(engine: MarkdownIt): void {
  engine.inline.ruler.after("escape", "markers", (state, silent) => {
    if (state.src[state.pos] !== "=") {
      return false
    }
    const match = /^=(?:([a-z])=|=)(\S(?:[^=\n]*\S)?)=(=)?/.exec(state.src.slice(state.pos, state.posMax))
    if (!match) {
      return false
    }
    if (!silent) {
      const token = state.push("mark_open", "mark", 1)
      if (match[1]) {
        token.attrSet(match[1], "")
      }
      state.push("text", "", 0).content = match[2]
      state.push("mark_close", "mark", -1)
    }
    state.pos += match[0].length
    return true
  })
}
