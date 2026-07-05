// Imports
import type { MarkdownIt } from "../types.ts"

/**
 * Add support for {@link https://developer.mozilla.org/docs/Web/HTML/Element/ruby | ruby} text.
 *
 * ```md
 * {漢字}^(kanji)
 * ```
 * ```html
 * <ruby>漢字<rp>(</rp><rt>kanji</rt><rp>)</rp></ruby>
 * ```
 */
export default function ruby(engine: MarkdownIt): void {
  engine.inline.ruler.after("escape", "ruby", (state, silent) => {
    if (state.src[state.pos] !== "{")
      return false
    const match = /^\{([^}\n]+)\}\^\(([^)\n]+)\)/.exec(state.src.slice(state.pos, state.posMax))
    if (!match)
      return false
    if (!silent)
      state.push("ruby", "ruby", 0).meta = { base: match[1], annotation: match[2] }
    state.pos += match[0].length
    return true
  })
  engine.renderer.rules.ruby = (tokens, index) => {
    const { base, annotation } = tokens[index].meta as { base: string; annotation: string }
    return `<ruby>${engine.utils.escapeHtml(base)}<rp>(</rp><rt>${engine.utils.escapeHtml(annotation)}</rt><rp>)</rp></ruby>`
  }
}
