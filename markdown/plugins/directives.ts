// Imports
import type { Plugin } from "../renderer.ts"
import type { Arg, Nullable, Optional } from "@libs/typing/types"
import remarkDirective from "remark-directive"
import { visit } from "unist-util-visit"
export { h } from "hastscript"
import type { Data, ElementContent, Properties } from "hast"

/**
 * Add support for custom directives.
 *
 * {@link https://github.com/remarkjs/remark-directive?tab=readme-ov-file#examples | See remark-directive for more information}.
 */
export default {
  remark(processor) {
    return processor.use(remarkDirective)
  },
} as Plugin

/**
 * Create a new custom directive.
 *
 * @example
 * ```ts
 * import { Renderer } from "../renderer.ts"
 * import directives, { directive, h } from "./directives.ts"
 *
 * const foo = directive((node) => {
 *   node.data ??= {}
 *   node.data.hName = "div"
 *   node.data.hProperties = h(node.data.hName, { bar: "qux" }).properties
 * })
 *
 * const markdown = new Renderer({ plugins: [directives, foo] })
 * await markdown.render(`
 * :::foo
 * baz
 * :::
 * `.trim())
 * ```
 */
export function directive(callback: (node: AugmentedNode) => void): Plugin {
  return {
    remark(processor) {
      return processor.use(function () {
        return function (tree: Arg<typeof visit>) {
          visit(tree, (node) => {
            if (!/(?:container|leaf|text)Directive/.test(node.type)) {
              return
            }
            callback(node as AugmentedNode)
          })
        }
      })
    },
  } as Plugin
}

/**
 * Node.
 *
 * Augmented from {@link https://github.com/syntax-tree/mdast-util-directive/blob/main/index.d.ts | mdast-util-directive}.
 */
interface AugmentedNode extends Arg<typeof visit> {
  /**
   * Directive name.
   */
  name: string
  /**
   * Directive attributes.
   */
  attributes?: Nullable<Record<string, Optional<Nullable<string>>>>

  /**
   * Info from the ecosystem.
   */
  data?: AugmentedData

  /**
   * Children of the directive.
   */
  children: AugmentedNode[]
}

/**
 * Info associated with hast nodes by the ecosystem.
 *
 * Augmented from {@link  https://github.com/syntax-tree/mdast-util-to-hast/blob/main/index.d.ts | mdast-util-to-hast}.
 */
interface AugmentedData extends Data {
  /**
   * Signal that a node should result in something with these children.
   *
   * When this is defined, when a parent is created, these children will be used.
   */
  hChildren?: ElementContent[]

  /**
   * Signal that a node should result in a particular element, instead of its default behavior.
   *
   * When this is defined, an element with the given tag name is created.
   * For example, when setting `hName` to `'b'`, a `<b>` element is created.
   */
  hName?: string

  /**
   * Signal that a node should result in an element with these properties.
   *
   * When this is defined, when an element is created, these properties will be used.
   */
  hProperties?: Properties
}
