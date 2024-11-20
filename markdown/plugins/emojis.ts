// Imports
import type { Plugin } from "../renderer.ts"
import remarkEmoji from "remark-emoji"

/**
 * Add support for emojis.
 *
 * ```md
 * :bento:
 * ```
 * ```html
 * <p>🍱</p>
 * ```
 */
export default {
  remark(processor) {
    return processor.use(remarkEmoji)
  },
} as Plugin
