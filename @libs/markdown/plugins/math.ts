// Imports
import type { MarkdownIt } from "../types.ts"

/**
 * Add support for math expressions.
 *
 * Expressions are rendered as `.math` elements containing the raw TeX source, intended for client-side processing:
 * ```html
 * <script type="module">
 *   import katex from "https://esm.sh/katex"
 *   for (const element of document.querySelectorAll(".math")) {
 *     katex.render(element.textContent, element, { displayMode: element.classList.contains("math-display") })
 *   }
 * </script>
 * ```
 *
 * ```md
 * $$\pi$$
 * ```
 * ```html
 * <div class="math math-display">\pi</div>
 * ```
 */
export default function math(engine: MarkdownIt): void {
  engine.inline.ruler.after("escape", "math_inline", (state, silent) => {
    const { src, pos, posMax } = state
    if ((src[pos] !== "$") || (src[pos + 1] === "$") || (pos + 1 >= posMax))
      return false
    let end = pos + 1
    while ((end < posMax) && (src[end] !== "$"))
      end++
    if ((end >= posMax) || (end === pos + 1))
      return false
    const content = src.slice(pos + 1, end)
    if ((/^\s/.test(content)) || (/\s$/.test(content)))
      return false
    if (!silent)
      state.push("math_inline", "span", 0).content = content
    state.pos = end + 1
    return true
  })
  engine.block.ruler.after("fence", "math_block", (state, startLine, endLine, silent) => {
    let pos = state.bMarks[startLine] + state.tShift[startLine]
    let max = state.eMarks[startLine]
    if ((pos + 2 > max) || (state.src.slice(pos, pos + 2) !== "$$"))
      return false
    if (silent)
      return true
    let firstLine = state.src.slice(pos + 2, max)
    let lastLine = ""
    let found = false
    if (firstLine.trim().endsWith("$$")) {
      firstLine = firstLine.trim().slice(0, -2)
      found = true
    }
    let next = startLine
    while (!found) {
      next++
      if (next >= endLine)
        return false
      pos = state.bMarks[next] + state.tShift[next]
      max = state.eMarks[next]
      const line = state.src.slice(pos, max)
      if (line.trim().endsWith("$$")) {
        lastLine = line.slice(0, line.lastIndexOf("$$"))
        found = true
      }
    }
    state.line = next + 1
    const token = state.push("math_block", "div", 0)
    token.block = true
    token.content = [firstLine, next > startLine + 1 ? state.getLines(startLine + 1, next, state.tShift[startLine], false) : "", lastLine].filter((part) => part.trim()).join("\n")
    token.map = [startLine, state.line]
    return true
  })
  engine.renderer.rules.math_inline = (tokens, index) => `<span class="math math-inline">${engine.utils.escapeHtml(tokens[index].content)}</span>`
  engine.renderer.rules.math_block = (tokens, index) => `<div class="math math-display">${engine.utils.escapeHtml(tokens[index].content)}</div>\n`
}
