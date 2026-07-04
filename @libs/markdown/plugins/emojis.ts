// Imports
// @ts-types="@types/markdown-it"
import type MarkdownIt from "markdown-it"
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
