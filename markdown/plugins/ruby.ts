// Imports
import type { Plugin } from "../renderer.ts"
import remarkRuby from "remark-ruby"

/**
 * Add support for {@link https://developer.mozilla.org/docs/Web/HTML/Element/ruby | ruby} text.
 *
 * ```md
 * {漢字}^(kanji)
 * ```
 * ```html
 * <ruby>漢字<rp>(</rp><rt>kanji</rt><rp>)</rp></ruby>
 * ```
 */
export default {
  remark(processor) {
    // deno-lint-ignore no-explicit-any
    return processor.use(remarkRuby as any)
  },
} as Plugin
