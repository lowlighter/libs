// Copyright (c) - 2025+ the lowlighter/esquie authors. AGPL-3.0-or-later
import { Renderer } from "../renderer.ts"
import { create as sanitize } from "../plugins/sanitize.ts"

/** Renderer instances. */
const renderer = new Renderer({ plugins: [sanitize({ tagNames: [] })] })

/**
 * Renders a markdown expression as plain text (all HTML is stripped).
 */
export function markdown(text: string): Promise<string> {
  return renderer.render(text)
}
