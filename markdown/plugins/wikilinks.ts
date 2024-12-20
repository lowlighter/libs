// Imports
import type { Plugin } from "../renderer.ts"
import { slugify as slug } from "@std/text/unstable-slugify"
import remarkWikilinks from "remark-wiki-link"

/**
 * Add support for wiki links.
 *
 * Use the `existing` option to provide a list of existing permalinks.
 * Any link not present in the list will posses the `new` class.
 *
 * Use the `slugify` option to indicate which possible slugs are possible for a given reference.
 * All generated slugs are automatically added to the list of existing permalinks if at least one them is present.
 *
 * Use the `resolve` option to indicate how to resolve a link to a URL.
 *
 * All links generated by this plugin will have the `wikilink` class.
 *
 * ```md
 * [[foo]]
 * ```
 * ```html
 * <a href="/pages/foo" class="wikilink">foo</a>
 * ```
 */
export default create() as Plugin

/** Create a new wiki links plugin. */
export function create({
  slugify = (name) => [slug(name)],
  resolve = (link) => `/pages/${link}`,
  existing,
} = {} as { slugify?: (name: string) => string[]; resolve?: (link: string) => string; existing?: string[] }): Plugin {
  return {
    rehype(processor) {
      return processor.use(remarkWikilinks, { pageResolver: slugify, hrefTemplate: resolve, permalinks: existing, wikiLinkClassName: "wikilink" })
    },
  } as Plugin
}
