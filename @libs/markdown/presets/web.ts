// Imports
import { Renderer } from "../renderer.ts"

/** Renderer instance. */
const renderer = new Renderer({ html: true, highlighting: true })

/**
 * Renders a markdown expression suitable for web pages (including untrusted HTML).
 */
export function markdown(text: string): string {
  return renderer.render(text)
}
