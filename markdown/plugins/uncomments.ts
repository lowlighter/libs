// Imports
import type { Plugin } from "../renderer.ts"
import remarkRemoveComments from "remark-remove-comments"

/**
 * Remove HTML comments.
 *
 * @example
 * ```md
 * <!-- foo -->
 * ```
 * ```html
 * <p></p>
 * ```
 */
export default {
  remark(processor) {
    return processor.use(remarkRemoveComments)
  },
} as Plugin
