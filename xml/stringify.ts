// Imports
import type { Nullable, record, rw } from "@libs/typing"
import type { xml_document, xml_node, xml_text } from "./_types.ts"

// Re-exports
export type { xml_document, xml_node, xml_text }

/** XML stringifier options. */
export type options = {
  /** Format options. */
  format?: {
    /**
     * Indent string (defaults to `"  "`).
     * Set to empty string to disable indentation and enable minification.
     */
    indent?: string
    /** Break text node if its length is greater than this value (defaults to `128`). */
    breakline?: number
  }
  /** Replace options. */
  replace?: {
    /**
     * Force escape all XML entities.
     * By default, only the ones that would break the XML structure are escaped.
     */
    entities?: boolean
    /**
     * Custom replacer (this is applied after other revivals).
     * When it is applied on an attribute, `key` and `value` will be given.
     * When it is applied on a node, both `key` and `value` will be `null`.
     * Return `undefined` to delete either the attribute or the tag.
     */
    custom?: (args: { name: string; key: Nullable<string>; value: Nullable<string>; node: Readonly<xml_node> }) => unknown
  }
}

/** XML stringifier options (with non-nullable format options). */
type _options = options & { format: NonNullable<options["format"]> }

/** Internal symbol to store properties without erasing user-provided ones. */
const internal = Symbol("internal")

/** A laxer type for what can be stringified. We won’t ever create this, but we’ll accept it. */
export type stringifyable = Partial<Omit<xml_document, "@version" | "@standalone"> & { "@version": string; "@standalone": string }>

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
 *   "@version": "1.0",
 *   "@standalone": "yes",
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
export function stringify(document: stringifyable, options?: options): string {
  options ??= {}
  options.format ??= {}
  options.format.indent ??= "  "
  options.format.breakline ??= 128
  const _options = options as _options
  let text = ""
  // Add prolog
  text += xml_prolog(document as xml_document, _options)
  // Add processing instructions
  if (document["#instructions"]) {
    for (const nodes of Object.values(document["#instructions"])) {
      for (const node of [nodes].flat()) {
        text += xml_instruction(node, _options)
      }
    }
  }
  // Add doctype
  if (document["#doctype"]) {
    text += xml_doctype(document["#doctype"] as xml_node, _options)
  }

  // Add root node
  const [root, ...garbage] = xml_children(document as xml_document, _options)
  if (!root) {
    throw new SyntaxError("No root node detected")
  }
  if (garbage.length) {
    throw new SyntaxError("Multiple root node detected")
  }
  text += xml_node(root, { ..._options, depth: 0 })

  return text.trim()
}

/** Helper to create a CDATA node. */
export function cdata(text: string): Omit<xml_text, "~parent"> {
  return {
    "~name": "~cdata",
    "#text": text,
  }
}

/** Helper to create a comment node. */
export function comment(text: string): Omit<xml_text, "~parent"> {
  return {
    "~name": "~comment",
    "#text": text,
  }
}

/** Create XML prolog. */
function xml_prolog(document: xml_document, options: _options): string {
  ;(document as rw)["~name"] ??= "xml"
  return xml_instruction(document, options)
}

/** Create XML instruction. */
function xml_instruction(node: xml_node, { format: { indent } }: _options): string {
  let text = ""
  const attributes = xml_attributes(node as xml_node, arguments[1])
  if (attributes.length) {
    text += `<?${node["~name"].replace(/^~/, "")}`
    for (const [name, value] of attributes) {
      text += ` ${name}="${value}"`
    }
    text += `?>${indent ? "\n" : ""}`
  }
  return text
}

/** Create XML doctype. */
function xml_doctype(node: xml_node, { format: { indent } }: _options): string {
  let text = ""
  const attributes = xml_attributes(node, arguments[1])
  const elements = xml_children(node, arguments[1])
  if (attributes.length + elements.length) {
    text += `<!DOCTYPE`
    for (const [name] of attributes) {
      text += ` ${!/^[A-Za-z0-9_]+$/.test(name) ? `"${name}"` : name}`
    }
    if (elements.length) {
      text += `${indent ? `\n${indent}` : " "}[${indent ? "\n" : ""}`
      for (const element of elements) {
        text += `${indent}<!ELEMENT ${element["~name"]} (${element["#text"]})>${indent ? "\n" : ""}`
      }
      text += `${indent ? indent : ""}]${indent ? "\n" : ""}`
    }
    text += `>${indent ? "\n" : ""}`
  }
  return text
}

/** Create XML node. */
function xml_node(node: xml_node, { format: { breakline = 0, indent = "" }, replace, depth = 0 }: _options & { depth?: number }): string {
  if (replace?.custom) {
    if (replace.custom({ name: node["~name"], key: null, value: null, node }) === undefined) {
      return ""
    }
  }
  let text = `${indent.repeat(depth)}<${node["~name"]}`
  const attributes = xml_attributes(node, arguments[1])
  const children = xml_children(node, arguments[1])
  const preserve = node["@xml:space"] === "preserve"
  for (const [name, value] of attributes) {
    text += ` ${name}="${value}"`
  }
  if ((children.length) || (("#text" in node) && (node["#text"].length))) {
    const inline = indent && (!preserve) && ((children.length) || (node["#text"].length > breakline - indent.length * depth))
    text += `>${indent && (!preserve) && (children.length) ? "\n" : ""}`
    if ("#text" in node) {
      if (inline) {
        text += `\n${indent.repeat(depth + 1)}`
      }
      text += node["#text"]
      if (inline) {
        text += "\n"
      }
    }
    for (const child of children) {
      text += xml_node(child, { ...arguments[1], depth: depth + 1 })
    }
    if (inline) {
      text += indent.repeat(depth)
    }
    text += `</${node["~name"]}>${indent ? "\n" : ""}`
  } else {
    text += `/>${indent ? "\n" : ""}`
  }
  return text
}

/** Extract children from node. */
function xml_children(node: xml_node, options: options): Array<xml_node> {
  const children = Object.keys(node)
    .filter((key) => /^[A-Za-z_]/.test(key))
    .flatMap((key) =>
      [node![key]].flat().map((value) => {
        switch (true) {
          case value === null:
            return ({ ["~name"]: key, ["#text"]: "" })
          case typeof value === "object": {
            const child = { ...value as record, ["~name"]: key } as record
            if (((value as record)["~name"] as string)?.startsWith("~")) {
              child[internal] = (value as record)["~name"]
            }
            return child
          }
          default:
            return ({ ["~name"]: key, ["#text"]: `${value}` })
        }
      })
    )
    .map((node) => {
      if ("#text" in node) {
        const cdata = node[internal] === "~cdata"
        const comment = node[internal] === "~comment"
        node["#text"] = replace(node as xml_node, "#text", { ...options, escape: cdata ? [] : ["<", ">"] }) as string
        if (node["#text"] === undefined) {
          delete node["#text"]
        } else {
          node["#text"] = cdata ? `<![CDATA[${node["#text"]}]]>` : comment ? `<!--${node["#text"]}-->` : `${node["#text"]}`
        }
      }
      return node
    }) as ReturnType<typeof xml_children>
  return children
}

/** Extract attributes from node. */
function xml_attributes(node: xml_node, options: options): Array<[string, string]> {
  return Object.entries(node!)
    .filter(([key]) => key.startsWith("@"))
    .map(([key]) => [key.slice(1), replace(node!, key, { ...options, escape: ['"', "'"] })])
    .filter(([_, value]) => value !== undefined) as ReturnType<typeof xml_attributes>
}

/** Entities */
const entities = {
  "&": "&amp;", //Keep first
  '"': "&quot;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&apos;",
} as const

/** Replace value. */
function replace(node: xml_node | xml_text, key: string, options: options & { escape?: Array<keyof typeof entities> }) {
  let value = `${(node as xml_node)[key]}` as string
  if (options?.escape) {
    if (options?.replace?.entities) {
      options.escape = Object.keys(entities) as Array<keyof typeof entities>
    }
    for (const char of options?.escape) {
      value = `${value}`.replaceAll(char, entities[char])
    }
  }
  if (options?.replace?.custom) {
    return options.replace.custom({ name: node["~name"], key, value, node: node as xml_node })
  }
  return value
}
