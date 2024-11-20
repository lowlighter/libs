// Imports
import type { Plugin } from "../renderer.ts"
import remarkMath from "remark-math"
import rehypeMathjax from "rehype-mathjax"

/**
 * Add support for math.
 *
 * {@link https://www.mathjax.org | See MathJax documentation for more information}.
 *
 * ```md
 * $$
 * \frac{1}{2}
 * $$
 * ```
 */
export default {
  remark(processor) {
    return processor.use(remarkMath)
  },
  rehype(processor) {
    return processor.use(rehypeMathjax)
  },
} as Plugin
