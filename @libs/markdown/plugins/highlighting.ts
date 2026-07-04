// Imports
// @ts-types="@types/markdown-it"
import type MarkdownIt from "markdown-it"
import hljs from "highlight.js/lib/common"

/**
 * Highlight code blocks.
 *
 * ````md
 * ```ts
 * const foo = 'bar'
 * ```
 * ````
 * ```html
 * <pre>
 *   <code class="hljs language-ts"><span class="hljs-keyword">const</span> foo = <span class="hljs-string">'bar'</span></code>
 * </pre>
 * ```
 */
export default function highlighting(engine: MarkdownIt): void {
  engine.options.highlight = (code, language) => {
    if ((!language) || (!hljs.getLanguage(language)))
      return ""
    return `<pre><code class="hljs language-${engine.utils.escapeHtml(language)}">${hljs.highlight(code, { language }).value}</code></pre>`
  }
}
