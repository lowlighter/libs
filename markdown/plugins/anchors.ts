// Imports
import type { Plugin } from "../renderer.ts"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"

/**
 * Add anchors to headings and autolink them.
 *
 * @example
 * ```md
 * # foo
 * ```
 * ```html
 * <h1 id="foo"><a href="#foo">foo</a></h1>
 * ```
 */
export default {
  rehype(processor) {
    return processor.use(rehypeSlug).use(rehypeAutolinkHeadings, { behavior: "wrap" })
  },
} as Plugin
