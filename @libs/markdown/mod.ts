// Imports
import { Renderer, type RendererOptions } from "./renderer.ts"
export { Renderer }
export type * from "./renderer.ts"
export type * from "./types.ts"

/** Cached renderer instances. */
const cache = new Map<string, Renderer>()

/** Options for {@link markdown}. */
export type MarkdownOptions = RendererOptions & {
  /** Return parsed metadata (e.g. frontmatter) along with the rendered value. */
  metadata?: boolean
}

/**
 * Render markdown content into an HTML string.
 *
 * Raw HTML is escaped unless the `html` option is enabled, which makes the default output safe against HTML injection.
 *
 * ```ts
 * import { markdown } from "./mod.ts"
 * markdown("# Hello, world!")
 * markdown("$\\pi$ is ==irrational==", { math: true, markers: true })
 * ```
 */
export function markdown(content: string, options?: MarkdownOptions & { metadata?: false }): string
/**
 * Render markdown content into an HTML string with parsed metadata.
 *
 * ```ts
 * import { markdown } from "./mod.ts"
 * const { value, metadata } = markdown("---\ntitle: foo\n---\nbar", { frontmatter: true, metadata: true })
 * console.log(metadata.frontmatter) // { title: "foo" }
 * ```
 */
export function markdown(content: string, options: MarkdownOptions & { metadata: true }): { value: string; metadata: Record<PropertyKey, unknown> }
/**
 * Render markdown content.
 */
export function markdown(content: string, options = {} as MarkdownOptions): string | { value: string; metadata: Record<PropertyKey, unknown> } {
  const { metadata = false, ...rest } = options
  let renderer = new Renderer(rest)
  if (Object.values(rest).every((value) => typeof value === "boolean")) {
    const key = JSON.stringify(rest, Object.keys(rest).sort())
    if (!cache.has(key)) {
      if (cache.size > 64)
        cache.clear()
      cache.set(key, renderer)
    }
    renderer = cache.get(key)!
  }
  return renderer.render(content, { metadata: metadata as true })
}
