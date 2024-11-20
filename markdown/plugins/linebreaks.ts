// Imports
import type { Plugin } from "../renderer.ts"
import remarkBreaks from "remark-breaks"

/**
 * Force line-breaks to be hard-breaks.
 *
 * ```md
 * foo
 * bar
 * ```
 * ```html
 * <p>foo<br>bar</p>
 * ```
 */
export default {
  remark(processor) {
    return processor.use(remarkBreaks)
  },
} as Plugin
