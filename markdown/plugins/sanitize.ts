// Imports
import type { Plugin } from "../renderer.ts"
import rehypeSanitize, { defaultSchema as defaults } from "rehype-sanitize"
export { defaults as schema }

/**
 * Sanitize HTML.
 *
 * @example
 * ```md
 * <script>alert('foo')</script>
 * ```
 * ```html
 * <p></p>
 * ```
 */
export default create() as Plugin

/** Create a new HTML sanitization plugin. */
export function create(schema = defaults): Plugin {
  return {
    rehype(processor) {
      return processor.use(rehypeSanitize, schema)
    },
  } as Plugin
}
