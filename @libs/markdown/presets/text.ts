// Copyright (c) - 2025+ the lowlighter/esquie authors. AGPL-3.0-or-later
import { Renderer } from "../renderer.ts"

/** Renderer instance. */
const renderer = new Renderer({ html: true })

/**
 * Renders a markdown expression as plain text (all HTML is stripped).
 */
export function markdown(text: string): string {
  return renderer.render(text)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim()
}
