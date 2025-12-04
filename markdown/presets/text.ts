// Copyright (c) - 2025+ the lowlighter/esquie authors. AGPL-3.0-or-later
import { Renderer } from "@libs/markdown"
import { create as sanitize } from "@libs/markdown/plugins/sanitize"

/** Renderer instances. */
const renderer = new Renderer({ plugins: [sanitize({ tagNames: [] })] })

/**
 * Renders a markdown expression as plain text (all HTML is stripped).
 */
export function markdown(text: string): Promise<string> {
  return renderer.render(text)
}
