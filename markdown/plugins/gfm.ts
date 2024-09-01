// Imports
import type { Plugin } from "../renderer.ts"
import remarkGfm from "remark-gfm"

/**
 * Enable GitHub Flavored Markdown (GFM).
 *
 * {@link https://github.github.com/gfm | See GitHub Flavored Markdown specification for more information}.
 */
export default {
  remark(processor) {
    return processor.use(remarkGfm)
  },
} as Plugin
