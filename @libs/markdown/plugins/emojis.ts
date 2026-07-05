// Imports
import type { MarkdownIt } from "../types.ts"
import { full } from "markdown-it-emoji"

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
export default function emojis(engine: MarkdownIt): void {
  engine.use(full)
}
