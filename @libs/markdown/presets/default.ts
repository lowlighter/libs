// Imports
import { Renderer } from "../renderer.ts"

/** Renderer instance. */
const renderer = new Renderer()

/**
 * Renders a markdown expression (GitHub Flavored Markdown, raw HTML escaped).
 */
export function markdown(text: string): string {
  return renderer.render(text)
}
