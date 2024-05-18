// Imports
import type { Nullable } from "@libs/typing"
import type { xml_document, xml_node, xml_text } from "./_types.ts"

// Re-exports
export type { xml_document, xml_node, xml_text }

/**
 * Stringify an {@link xml_document} object into a XML string.
 *
 * Output can be customized using the {@link options} parameter.
 *
 * @example
 * ```ts
 * import { stringify } from "./stringify.ts"
 *
 * console.log(stringify({
 *   root: {
 *     text: "hello",
 *     array: ["world", "monde", "世界", "🌏"],
 *     number: 42,
 *     boolean: true,
 *     complex: {
 *       "@attribute": "value",
 *       "#text": "content",
 *     },
 *   }
 * }))
 * ```
 */
export function stringify(document: Partial<xml_document>, _options?: unknown): string {
  let text = ""
  text += xml_prolog(document as xml_document)

  console.log(document)

  const [root, ...garbage] = xml_children(document as xml_document)
  if (garbage.length) {
    throw new SyntaxError("Multiple root node detected")
  }
  text += xml_node(root[0], root[1] as xml_node)
  return text
}

/** Create XML prolog. */
function xml_prolog(document: xml_document): string {
  let text = ""
  const attributes = xml_attributes(document as xml_document)
  if (attributes.length) {
    text += "<?xml"
    for (const [name, value] of attributes) {
      text += ` ${name}="${value}"`
    }
    text += "?>"
  }
  return text
}

/** Create XML node. */
function xml_node(name: string, node: xml_node): string {
  let text = `<${name}`
  const attributes = xml_attributes(node)
  const children = xml_children(node)
  for (const [name, value] of attributes) {
    text += ` ${name}="${value}"`
  }
  if (children.length) {
    text += ">"
    text += `</${name}>`
  } else {
    text += "/>"
  }
  return text
}

/** Extract children from node. */
function xml_children(node: Nullable<xml_node>): Array<[string, unknown]> {
  return Object.entries(node ?? {}).filter(([key]) => /^[A-Za-z_]/.test(key)).map(([key, value]) => [key, value]) as Array<[string, unknown]>
}

/** Extract attributes from node. */
function xml_attributes(node: Nullable<xml_node>): Array<[string, string]> {
  return Object.entries(node ?? {}).filter(([key]) => key.startsWith("@")).map(([key, value]) => [key.slice(1), `${value}`])
}
