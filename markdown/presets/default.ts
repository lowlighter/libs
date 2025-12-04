// Imports
import { Renderer } from "../renderer.ts"

/** Renderer instance. */
const renderer = new Renderer()

/**
 * Renders a markdown expression.
 */
export function markdown(text: string): Promise<string> {
  return renderer.render(text)
}
