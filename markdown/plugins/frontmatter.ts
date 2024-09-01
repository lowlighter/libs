// Imports
import type { Plugin } from "../renderer.ts"
import type { Arg } from "@libs/typing/types"
import type { Parser } from "unified"
import remarkFrontmatter from "remark-frontmatter"
import { visit } from "unist-util-visit"
import * as YAML from "@std/yaml/parse"

/**
 * Support for frontmatter.
 *
 * Passing `metadata: true` to the the markdown rendering method is required to retrieve the frontmatter.
 * The frontmatter is automatically parsed as YAML.
 *
 * @example
 * ```md
 * ---
 * title: foo
 * ---
 * ```
 * ```ts
 * import { Renderer } from "../renderer.ts"
 * import frontmatter from "./frontmatter.ts"
 *
 * const markdown = new Renderer({ plugins: [frontmatter] })
 * const { metadata } = await markdown.render("...", { metadata: true })
 * console.log(metadata.frontmatter) // { title: "foo" }
 * ```
 */
export default {
  remark(processor, renderer) {
    return processor.use(remarkFrontmatter).use(function () {
      return function (tree: Arg<typeof visit>, vfile: Arg<Parser, 1>) {
        visit(tree, (node) => {
          if (node.type === "yaml") {
            const id = (vfile as unknown as { id: string }).id
            renderer.storage[id].frontmatter = YAML.parse((node as unknown as { value: string }).value)
          }
        })
      }
    })
  },
} as Plugin
