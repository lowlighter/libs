// Imports
import type { MarkdownIt } from "../types.ts"

/**
 * Add support for Mermaid diagrams.
 *
 * Diagrams are rendered as `<pre class="mermaid">` elements intended for client-side processing:
 * ```html
 * <script type="module">
 *   import mermaid from "https://esm.sh/mermaid"
 *   mermaid.run()
 * </script>
 * ```
 *
 * {@link https://mermaid-js.github.io/mermaid | See Mermaid documentation for more information}.
 *
 * ````md
 * ```mermaid
 * graph TD;
 *   A-->B;
 * ```
 * ````
 * ```html
 * <pre class="mermaid">graph TD;
 *   A-->B;</pre>
 * ```
 */
export default function mermaid(engine: MarkdownIt): void {
  const fence = engine.renderer.rules.fence!
  engine.renderer.rules.fence = (tokens, index, options, env, self) => {
    if (tokens[index].info.trim() === "mermaid")
      return `<pre class="mermaid">${engine.utils.escapeHtml(tokens[index].content.trim())}</pre>\n`
    return fence(tokens, index, options, env, self)
  }
}
