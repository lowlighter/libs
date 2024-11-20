// Imports
import type { Plugin } from "../renderer.ts"
import rehypeHighlight from "rehype-highlight"

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
export default {
  rehype(processor) {
    return processor.use(rehypeHighlight)
  },
} as Plugin
