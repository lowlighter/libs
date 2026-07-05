// Imports
import type { MarkdownIt } from "../types.ts"
import { parse } from "@std/yaml/parse"

/**
 * Support for frontmatter.
 *
 * Passing `metadata: true` to the markdown rendering method is required to retrieve the frontmatter.
 * The frontmatter is automatically parsed as YAML.
 *
 * ```md
 * ---
 * title: foo
 * ---
 * ```
 * ```ts
 * import { Renderer } from "../renderer.ts"
 *
 * const markdown = new Renderer({ frontmatter: true })
 * const { metadata } = markdown.render("---\ntitle: foo\n---\nbar", { metadata: true })
 * console.log(metadata.frontmatter) // { title: "foo" }
 * ```
 */
export default function frontmatter(engine: MarkdownIt): void {
  engine.block.ruler.before("table", "frontmatter", (state, startLine, endLine, silent) => {
    if ((startLine !== 0) || (state.blkIndent !== 0) || (state.tShift[0] > 0))
      return false
    if (state.src.slice(state.bMarks[0], state.eMarks[0]).trimEnd() !== "---")
      return false
    let close = -1
    for (let line = 1; line < endLine; line++) {
      const text = state.src.slice(state.bMarks[line], state.eMarks[line]).trimEnd()
      if ((text === "---") || (text === "...")) {
        close = line
        break
      }
    }
    if (close < 0)
      return false
    let parsed
    try {
      parsed = parse(state.getLines(1, close, 0, false))
    } catch {
      return false
    }
    if (!silent) {
      const env = state.env as { metadata?: Record<PropertyKey, unknown> }
      env.metadata ??= {}
      env.metadata.frontmatter = parsed
      state.line = close + 1
    }
    return true
  })
}
