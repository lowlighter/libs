// Imports
import { Renderer } from "../renderer.ts"
import gfm from "../plugins/gfm.ts"
import highlighting from "../plugins/highlighting.ts"

/** Renderer instance. */
const renderer = new Renderer({ plugins: [gfm, highlighting] })

/**
 * Renders a markdown expression suitable for web pages (including untrusted HTML).
 */
export function markdown(text: string): Promise<string> {
  return renderer.render(text)
}
