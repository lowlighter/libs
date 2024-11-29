// Imports
import type { Plugin } from "../renderer.ts"
import type { Arg, Arrayable, Nullable, Optional } from "@libs/typing/types"
import remarkDirective from "remark-directive"
import { visit } from "unist-util-visit"
export { h } from "hastscript"

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
export function directive(callback: (node: AstNode) => void): Plugin {
  return {
    remark(processor) {
      return processor.use(function () {
        return function (tree: Arg<typeof visit>) {
          visit(tree, (node) => {
            if (!/(?:container|leaf|text)Directive/.test(node.type)) {
              return
            }
            callback(node as AstNode)
          })
        }
      })
    },
  } as Plugin
}

// =======================================================================================================
// The following definitions were adapted from:
// - https://github.com/DefinitelyTyped/DefinitelyTyped/blob/a6e9e491ff5d0fd7f438fb77a70b54b28e356ced/types/hast/v2/index.d.ts
// - https://github.com/DefinitelyTyped/DefinitelyTyped/blob/a6e9e491ff5d0fd7f438fb77a70b54b28e356ced/types/unist/v2/index.d.ts

/** Information associated by the ecosystem with the node. */
export interface AstData {
  /**
   * Signal that a node should result in something with these children.
   *
   * When this is defined, when a parent is created, these children will be used.
   */
  hChildren?: AstElementContent[]

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
  hProperties?: AstProperties

  /** Represents information associated with an element. */
  [key: string]: unknown
}

/** Represents information associated with an element. */
export interface AstProperties {
  /** Represents information associated with an element. */
  [PropertyName: string]: Optional<Nullable<boolean | Arrayable<string | number>>>
}

/** Syntactic units in unist syntax trees are called nodes. */
export interface AstNode<Data extends object = AstData, ChildNode = unknown> {
  /** The variant of a node. */
  type: string
  /** Information from the ecosystem. */
  data?: Data
  /** Location of a node in a source document. Must not be present if a node is generated. */
  position?: AstPosition
  /** Directive name. */
  name?: string
  /** Directive attributes. */
  attributes?: Nullable<Record<string, Optional<Nullable<string>>>>
  /** Children of the directive. */
  children: ChildNode[]
}

/** Util for extracting type of {@link Node.data}. */
export type AstNodeData<Node extends AstNode<object>> = Node extends AstNode<infer TData> ? TData : never

/** Location of a node in a source file. */
export interface AstPosition {
  /** Place of the first character of the parsed source region. */
  start: AstPoint
  /** Place of the first character after the parsed source region. */
  end: AstPoint
  /** Start column at each index (plus start line) in the source region, for elements that span multiple lines. */
  indent?: number[]
}

/** One place in a source file. */
export interface AstPoint {
  /** Line in a source file (1-indexed integer). */
  line: number
  /** Column in a source file (1-indexed integer). */
  column: number
  /** Character in a source file (0-indexed integer). */
  offset?: number
}

/** Node in hast containing other nodes. */
export interface AstParent<ChildNode extends AstNode<object> = AstContent, Data extends object = AstNodeData<ChildNode>> extends AstNode<Data> {
  /** List representing the children of a node. */
  children: ChildNode[]
}

/** Represents a root or element node. */
export type AstContent = AstRootContent | AstElementContent

/** Represents a root node content. */
export type AstRootContent = AstRootContentMap[keyof AstRootContentMap]

/** Represents an element node content. */
export type AstElementContent = AstElementContentMap[keyof AstElementContentMap]

/** Represents an HTML DocumentType. */
export interface AstDocType extends AstNode {
  /** Represents this variant of a Node. */
  type: "doctype"
  /** Represents the document name. */
  name: string
}

/**
 * Root represents a document.
 * Can be used as the root of a tree, or as a value of the content field on a 'template' Element, never as a child.
 */
export interface AstRoot extends AstParent {
  /** Represents this variant of a Node. */
  type: "root"
  /** List representing the children of a node. */
  children: AstRootContent[]
}

/** This map registers all node types that may be used as top-level content in the document. These types are accepted inside `root` nodes. */
export interface AstRootContentMap extends AstElementContentMap {
  /** Represents an HTML DocumentType. */
  doctype: AstDocType
}

/** Element represents an HTML Element. */
export interface AstElement extends AstParent {
  /** Represents this variant of a Node. */
  type: "element"
  /** Represents the element’s local name. */
  tagName: string
  /** Represents information associated with the element. */
  properties?: AstProperties
  /** If the tagName field is 'template', a content field can be present. */
  content?: AstRoot
  /** List representing the children of a node. */
  children: AstElementContent[]
}

/** This map registers all node types that may be used as content in an element. These types are accepted inside `element` nodes. */
export interface AstElementContentMap {
  /** Represents an HTML Element. */
  // deno-lint-ignore no-explicit-any
  element: any // AstElement
  /** Represents an HTML Comment. */
  comment: AstComment
  /** Represents an HTML Text. */
  text: AstText
}

/** Nodes in hast containing a value. */
export interface AstLiteral extends AstNode {
  /** Represents the value of a node. */
  value: string
}

/** Represents an HTML Comment. */
export interface AstComment extends AstLiteral {
  /** Represents this variant of a Literal. */
  type: "comment"
}

/** Represents an HTML Text. */
export interface AstText extends AstLiteral {
  /** Represents this variant of a Literal. */
  type: "text"
}
