// Imports
import type { MarkdownIt } from "../types.ts"

/** Directives options. */
export type DirectivesOptions = {
  /** Indicate how to render a directive (defaults to a `<div>` with the directive name as class). */
  render?: (name: string, attributes: Record<string, string>) => { tag: string; attributes?: Record<string, string> }
}

/**
 * Add support for custom container directives.
 *
 * Directives may be assigned attributes using the `{#id .class key=value}` syntax.
 * Use the `render` option to customize the rendered tag and attributes.
 *
 * ```md
 * :::foo{bar=qux}
 * baz
 * :::
 * ```
 * ```html
 * <div class="foo" bar="qux">
 *   <p>baz</p>
 * </div>
 * ```
 */
export default function directives(engine: MarkdownIt, { render = (name, attributes) => ({ tag: "div", attributes: { ...attributes, class: [name, attributes.class].filter(Boolean).join(" ") } }) }: DirectivesOptions = {}): void {
  engine.block.ruler.before("fence", "directives", (state, startLine, endLine, silent) => {
    const line = state.src.slice(state.bMarks[startLine] + state.tShift[startLine], state.eMarks[startLine])
    const match = /^:::([\w-]+)(?:\{(.*?)\})?\s*$/.exec(line)
    if (!match)
      return false
    if (silent)
      return true
    let close = -1
    for (let next = startLine + 1; next < endLine; next++) {
      if (state.src.slice(state.bMarks[next] + state.tShift[next], state.eMarks[next]).trim() === ":::") {
        close = next
        break
      }
    }
    if (close < 0)
      return false
    const { tag, attributes = {} } = render(match[1], parseAttributes(match[2]))
    const open = state.push("directive_open", tag, 1)
    open.block = true
    for (const [attribute, value] of Object.entries(attributes))
      open.attrSet(attribute, value)
    const max = state.lineMax
    state.lineMax = close
    state.md.block.tokenize(state, startLine + 1, close)
    state.lineMax = max
    state.push("directive_close", tag, -1).block = true
    state.line = close + 1
    return true
  })
}

/** Parse directive attributes (`{#id .class key=value}`). */
function parseAttributes(text = ""): Record<string, string> {
  const attributes = {} as Record<string, string>
  for (const attribute of text.match(/[.#][\w-]+|[\w-]+="[^"]*"|[\w-]+=\S+/g) ?? []) {
    switch (true) {
      case attribute.startsWith("."):
        attributes.class = [attributes.class, attribute.slice(1)].filter(Boolean).join(" ")
        break
      case attribute.startsWith("#"):
        attributes.id = attribute.slice(1)
        break
      default: {
        const [key, ...value] = attribute.split("=")
        attributes[key] = value.join("=").replace(/^"([\s\S]*)"$/, "$1")
      }
    }
  }
  return attributes
}
