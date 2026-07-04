/**
 * Parse a XML string into an object.
 * @module
 */

// Imports
import { parse as std_parse } from "@std/xml/parse"
import type { XmlDocument as StdDocument, XmlElement as StdElement, XmlNode as StdNode } from "@std/xml/types"
import type { Nullable, XmlDocument, XmlNode, XmlText } from "./_types.ts"
export type * from "./_types.ts"

/** XML parser options. */
export type ParseOptions = {
  /** Remove elements from result. */
  clean?: CleanOptions
  /** Flatten result depending on node content. */
  flatten?: FlattenOptions
  /** Revive result. */
  revive?: ReviveOptions
  /**
   * Parsing mode.
   * Using `html` is more permissive and will not throw on some invalid XML syntax.
   * Mainly unquoted attributes will be supported and not properly closed tags will be accepted.
   *
   * > Note: `html` mode is currently not supported.
   * > Tracking issue: https://github.com/denoland/std/issues/7212
   */
  mode?: "xml"
}

/** XML parser {@linkcode ParseOptions}`.clean` */
export type CleanOptions = {
  /** Remove attributes from result. */
  attributes?: boolean
  /** Remove comments from result. */
  comments?: boolean
  /** Remove XML doctype from result. */
  doctype?: boolean
  /** Remove XML processing instructions from result. */
  instructions?: boolean
}

/** XML parser {@linkcode ParseOptions}`.flatten` */
export type FlattenOptions = {
  /** If node only contains attributes values (i.e. with key starting with `@`), it'll be flattened as a regular object without `@` prefixes. */
  attributes?: boolean
  /** If node only contains a `#text` value, it'll be flattened as a string (defaults to `true`). */
  text?: boolean
  /** If node does not contains any attribute or text, it'll be flattened to `null` (defaults to `true`). */
  empty?: boolean
}

/** XML parser {@linkcode ParseOptions}`.revive` */
export type ReviveOptions = {
  /**
   * Trim texts (this is applied before other revivals, defaults to `true`).
   * It honors `xml:space="preserve"` attribute.
   */
  trim?: boolean
  /**
   * Revive XML entities (defaults to `true`).
   * Automatically unescape XML entities and replace common entities with their respective characters.
   */
  entities?: boolean
  /** Revive booleans (matching `/^(?:[Tt]rue|[Ff]alse)$/`).*/
  booleans?: boolean
  /**
   * Revive finite numbers.
   * Note that the version of the XML prolog is always treated as a string to avoid breaking documents.
   */
  numbers?: boolean
  /**
   * Custom reviver (this is applied after other revivals).
   * When it is applied on an attribute, `key` and `value` will be given.
   * When it is applied on a node, both `key` and `value` will be `null`.
   * Return `undefined` to delete either the attribute or the tag.
   */
  custom?: Reviver
}

/**
 * Custom XML parser reviver.
 * It can be used to change the way some nodes are parsed.
 */
export type Reviver = (args: { name: string; key: Nullable<string>; value: Nullable<string>; node: Readonly<XmlNode> }) => unknown

/**
 * Parse a XML string into an object.
 *
 * Output (cleaning, flattening, reviving, etc.) can be customized using the {@link options} parameter.
 *
 * Unless flattened, output nodes will contain the following non-enumerable properties (which mean they're not "visible" when iterating over, but are still explicitely accessible):
 * - General properties
 *   - `readonly ["~name"]: string`: tag name
 *   - `readonly ["~parent"]: Nullable<XmlNode>`: parent node
 *   - `["#text"]?: string`: text content
 * - Node properties
 *   - `readonly ["~children"]: Array<XmlNode|XmlText>`: node children
 *   - `readonly ["#comments"]?: Array<string>`: node comments
 *   - `readonly ["#text"]?: string`: concatenated children text content, this property becomes enumerable if at least one non-empty text node is present
 * - XML document properties
 *  - `["#doctype"]?: XmlNode`: XML doctype
 *  - `["#instructions"]?: { [key:string]: Arrayable<XmlNode> }`: XML processing instructions
 *
 * Attributes are prefixed with an arobase (`@`).
 *
 * ```ts
 * console.log(parse(
 * `
 *   <root>
 *     <!-- This is a comment -->
 *     <text>hello</text>
 *     <array>world</array>
 *     <array>monde</array>
 *     <array>世界</array>
 *     <array>🌏</array>
 *     <number>42</number>
 *     <boolean>true</boolean>
 *     <complex attribute="value">content</complex>
 *   </root>
 * `))
 * ```
 */
export function parse(content: string, options?: ParseOptions): XmlDocument {
  const xml = xml_node("~xml") as XmlDocument
  content = content.replace(/^\s+/, "")
  // @std sync parser only exposes a DOM tree of {declaration, root}
  // and is missing DOCTYPE and processing instructions (they are discarded)
  // Prescan the content to recover them first
  content = prescan(content, xml)
  const doc: StdDocument = std_parse(content, { disallowDoctype: false })

  // XML declaration
  if (doc.declaration) {
    if (doc.declaration.version)
      xml["@version"] = doc.declaration.version as typeof xml["@version"]
    if (doc.declaration.encoding)
      xml["@encoding"] = doc.declaration.encoding
    if (doc.declaration.standalone)
      xml["@standalone"] = doc.declaration.standalone
  }

  build(doc.root, xml)

  options ??= {}
  options.revive ??= {}
  options.revive.trim ??= true
  options.revive.entities ??= true
  options.flatten ??= {}
  options.flatten.text ??= true
  options.flatten.empty ??= true
  if (!Object.keys(xml).length)
    throw new SyntaxError("Malformed XML document: empty document or no root node detected")
  return postprocess(xml, options) as XmlDocument
}

/** Recover `#doctype` and `#instructions`. */
function prescan(content: string, xml: XmlDocument): string {
  // Prolog: skip whitespace/comments, collect instructions and doctype until the root element opens
  let i = 0
  prolog: while (i < content.length) {
    switch (true) {
      case /\s/.test(content[i]): {
        i++
        continue
      }
      case content.startsWith("<!--", i): {
        const end = content.indexOf("-->", i + 4)
        if (end < 0)
          break prolog
        i = end + 3
        continue
      }
      case content.startsWith("<?", i): {
        const end = content.indexOf("?>", i + 2)
        if (end < 0)
          break prolog
        const raw = content.slice(i + 2, end)
        i = end + 2
        const target = raw.match(/^\S+/)?.[0] ?? ""
        // The <?xml?> declaration is already handled through std's DOM
        if (target !== "xml")
          xml_instruction(xml, target, raw.slice(target.length).trim())
        continue
      }
      case content.startsWith("<!DOCTYPE", i): {
        // Find the closing ">", skipping quoted literals and the internal subset "[...]"
        let j = i + 9
        doctype: while (j < content.length) {
          switch (content[j]) {
            case '"':
            case "'": {
              const quote = content.indexOf(content[j], j + 1)
              if (quote < 0)
                break doctype
              j = quote + 1
              break
            }
            case "[": {
              const bracket = content.indexOf("]", j + 1)
              if (bracket < 0)
                break doctype
              j = bracket + 1
              break
            }
            case ">":
              break doctype
            default:
              j++
          }
        }
        xml["#doctype"] = Object.assign(xml_node("~doctype", { parent: xml }), xml_doctype(content.slice(i + 9, j).trim()))
        const end = Math.min(j + 1, content.length)
        content = `${content.slice(0, i)}${" ".repeat(end - i)}${content.slice(end)}`
        i = end
        continue
      }
      default:
        break prolog
    }
  }
  // Epilog: only comments and instructions may follow the root element, scan them backwards
  const instructions = [] as Array<[string, string]>
  let tail = content.trimEnd()
  epilog: while (true) {
    switch (true) {
      case tail.endsWith("-->"): {
        const start = tail.lastIndexOf("<!--")
        if (start < 0)
          break epilog
        tail = tail.slice(0, start).trimEnd()
        continue
      }
      case tail.endsWith("?>"): {
        const start = tail.lastIndexOf("<?")
        if (start < 0)
          break epilog
        const raw = tail.slice(start + 2, -2)
        const target = raw.match(/^\S+/)?.[0] ?? ""
        instructions.unshift([target, raw.slice(target.length).trim()])
        tail = tail.slice(0, start).trimEnd()
        continue
      }
      default:
        break epilog
    }
  }
  instructions.forEach(([target, raw]) => xml_instruction(xml, target, raw))
  return content
}

/** Attach a processing instruction under `#instructions` with array-grouping.  */
function xml_instruction(xml: XmlDocument, name: string, raw: string): void {
  const instruction = Object.assign(xml_node(name, { parent: xml }), xml_attributes(raw))
  xml["#instructions"] ??= {}
  switch (true) {
    case Array.isArray(xml["#instructions"][name]):
      ;(xml["#instructions"][name] as Array<XmlNode>).push(instruction)
      break
    case name in xml["#instructions"]:
      xml["#instructions"][name] = [xml["#instructions"][name] as XmlNode, instruction]
      break
    default:
      xml["#instructions"][name] = instruction
  }
}

/** Walk a std DOM element into the ergonomic ~children/@attr/#text structure. */
function build(element: StdElement, parent: XmlNode): void {
  const node = xml_node(element.name.raw, { parent })
  // Attach under the enumerable key with array-grouping
  switch (true) {
    case Array.isArray(parent[node["~name"]]):
      ;(parent[node["~name"]] as Array<XmlNode>).push(node)
      break
    case node["~name"] in parent:
      parent[node["~name"]] = [parent[node["~name"]], node]
      break
    default:
      parent[node["~name"]] = node
  }
  // Attributes
  for (const [name, value] of Object.entries(element.attributes))
    node[`@${name}`] = value
  // Children
  for (const child of element.children as ReadonlyArray<StdNode>) {
    switch (child.type) {
      case "element":
        build(child, node)
        break
      case "text":
        xml_text(child.text, { type: "~text", parent: node })
        break
      case "cdata":
        xml_text(child.text, { type: "~cdata", parent: node })
        break
      case "comment":
        xml_text(child.text, { type: "~comment", parent: node })
        break
    }
  }
}

/** Parse xml attributes. */
function xml_attributes(raw: string) {
  const attributes = {} as Record<PropertyKey, string>
  for (const [_, name, __, value] of raw.matchAll(/(?<name>[A-Za-z_][-\w.:]*)=(["'])(?<value>(?:(?!\2).)*)(\2)/g))
    attributes[`@${name}`] = value
  return attributes
}

/** Parse xml doctype. */
function xml_doctype(raw: string) {
  const node = {} as XmlNode
  const { attributes: _attributes, elements: _elements = "" } = raw.match(/^(?<attributes>[^\[]*)(?:\[(?<elements>[\s\S]*)\])?/)?.groups!
  // Parse attributes
  raw = raw.replace(`[${_elements}]`, "")
  for (const [match, __, name] of _attributes.matchAll(/(["'])(?<name>(?:(?!\1).)*)(\1)/g)) {
    node[`@${name}`] = ""
    raw = raw.replace(match, "")
  }
  raw.split(/\s+/).filter(Boolean).forEach((name) => node[`@${name}`] = "")
  // Parse elements
  for (const [_, name, value] of _elements.matchAll(/<!ELEMENT\s+(?<name>\w+)\s+\((?<value>[^\)]+)\)/g))
    node[name] = value
  return node
}

/** Create a new text node. */
function xml_text(value: string, { type = "~text" as "~text" | "~cdata" | "~comment", parent = null as Nullable<XmlNode> } = {}): XmlText {
  const text = Object.defineProperties({}, {
    ["~parent"]: { enumerable: false, writable: false, value: parent },
    ["~name"]: { enumerable: false, writable: false, value: type },
  }) as XmlText
  text["#text"] = value
  if (parent)
    parent["~children"].push(text)
  return text
}

/** Create a new node. */
function xml_node(name: string, { parent = null as Nullable<XmlNode> } = {}): XmlNode {
  const node = Object.defineProperties({}, {
    ["~parent"]: { enumerable: false, writable: false, value: parent },
    ["~name"]: { enumerable: false, writable: false, value: name },
    ["~children"]: { enumerable: false, writable: true, value: [] },
    ["#text"]: {
      enumerable: false,
      configurable: true,
      get(this: XmlNode) {
        const children = this["~children"].filter((node) => node["~name"] !== "~comment")
        // If xml:space is not set to "preserve", concatenate text nodes and trim them while removing empty ones
        if (this["@xml:space"] !== "preserve")
          return children.map((child) => child["#text"]).filter(Boolean).join(" ")
        // If xml:space is set to "preserve", concatenate text nodes without trimming them
        // In case of mixed content, add a space between mixed nodes if needed
        let text = ""
        for (let i = 0; i < children.length; i++) {
          const spaced = i && (+children[i - 1]["~name"].startsWith("~") ^ +children[i]["~name"].startsWith("~")) && (!children[i - 1]["#text"].endsWith(" ")) && (!children[i]["#text"].startsWith(" "))
          text += `${spaced ? " " : ""}${children[i]["#text"]}`
        }
        return text
      },
    },
    ["#comments"]: {
      enumerable: false,
      configurable: true,
      get(this: XmlNode) {
        return this["~children"].filter((node) => node["~name"] === "~comment").map((node) => node["#text"]!)
      },
    },
  }) as XmlNode
  if (parent)
    parent["~children"].push(node)
  return node
}

/** Post-process xml node. */
function postprocess(node: XmlNode, options: ParseOptions) {
  // Clean XML document if required
  if (node["~name"] === "~xml") {
    if (options?.clean?.doctype)
      delete node["#doctype"]
    if (options?.clean?.instructions) {
      ;(node as Record<PropertyKey, unknown>)["~children"] = node["~children"].filter((child) => !(child["~name"] in ((node as XmlDocument)["#instructions"] ?? {})))
      delete node["#instructions"]
    }
  }
  // Clean node and enable enumerable properties if required
  if (node["~children"]) {
    if (options?.clean?.comments) {
      ;(node as Record<PropertyKey, unknown>)["~children"] = node["~children"].filter((child) => child["~name"] !== "~comment")
    }
    if (options?.revive?.trim)
      node["~children"].forEach((child) => /^~(?:text|cdata|comment)$/.test(child["~name"]) ? (child as Record<PropertyKey, unknown>)["#text"] = revive(child, "#text", { revive: { trim: node["@xml:space"] !== "preserve" } }) : null)
    if (node["~children"].some((child) => (/^~(?:text|cdata)$/.test(child["~name"])) && (child["#text"].trim().length + (node["@xml:space"] === "preserve" ? 1 : 0) * child["#text"].length)))
      Object.defineProperty(node, "#text", { enumerable: true, configurable: true })
    if (node["~children"].some((child) => child["~name"] === "~comment"))
      Object.defineProperty(node, "#comments", { enumerable: true, configurable: true })
  }
  // Process child nodes
  for (const [key, value] of Object.entries(node)) {
    // Skip comments
    if (key === "#comments")
      continue
    // Clean attributes if required
    if ((options?.clean?.attributes) && (key.startsWith("@"))) {
      delete node[key]
      continue
    }
    // Revive attribute value if required
    if (key.startsWith("@")) {
      node[key] = revive(node, key, options)
      if (node[key] === undefined)
        delete node[key]
      continue
    }
    // Handle other nodes
    if (Array.isArray(value)) {
      node[key] = Object.defineProperties(value.map((child) => postprocess(child, options)), {
        ["~parent"]: { enumerable: false, writable: false, value: node },
        ["~name"]: { enumerable: false, writable: false, value: key },
      })
    } else if ((typeof value === "object") && value) {
      node[key] = postprocess(value as XmlNode, options)
    }
    if (node[key] === undefined)
      delete node[key]
  }
  // Revive text if required
  const keys = Object.keys(node)
  if (keys.includes("#text")) {
    const _options = { ...options, revive: { ...options?.revive, trim: (options?.revive?.trim) && (node["@xml:space"] !== "preserve") } }
    Object.defineProperty(node, "#text", { enumerable: true, configurable: true, value: revive(node, "#text", _options) })
  }
  // Custom revival if required
  if (options?.revive?.custom) {
    if (options.revive.custom({ name: node["~name"], key: null, value: null, node: node as XmlNode }) === undefined)
      return undefined
  }
  // Flatten object if required
  if ((options?.flatten?.text) && (keys.length === 1) && (keys.includes("#text")))
    return node["#text"]
  if ((options?.flatten?.attributes) && (keys.length) && (keys.every((key) => key.startsWith("@")))) {
    for (const key of keys) {
      node[key.slice(1)] = node[key]
      delete node[key]
    }
    return node
  }
  if (!keys.length)
    return (options?.flatten?.empty) ? null : (options?.flatten?.text) ? "" : Object.defineProperty(node, "#text", { enumerable: true, configurable: true, value: "" })
  return node
}

/** Entities */
const entities = {
  "&lt;": "<",
  "&gt;": ">",
  "&apos;": "'",
  "&quot;": '"',
  "&amp;": "&", //Keep last
} as const

/** Revive value. */
function revive(node: XmlNode | XmlText, key: string, options: ParseOptions) {
  let value = (node as XmlNode)[key] as string
  if (options?.revive?.trim)
    value = value.trim()
  if (options?.revive?.entities) {
    value = value.replaceAll(/&#(?<hex>x?)(?<code>[A-Fa-f\d]+);/g, (_, hex, code) => String.fromCharCode(Number.parseInt(code, hex ? 16 : 10)))
    for (const [entity, character] of Object.entries(entities))
      value = value.replaceAll(entity, character)
  }
  if ((options?.revive?.numbers) && (value.length) && (Number.isFinite(Number(value))) && (!((node["~name"] === "~xml") && (key === "@version"))))
    value = Number(value) as unknown as string
  if ((options?.revive?.booleans) && (/^(?:[Tt]rue|[Ff]alse)$/.test(value)))
    value = /^[Tt]rue$/.test(value) as unknown as string
  if (options?.revive?.custom)
    return options.revive.custom({ name: node["~name"], key, value, node: node as XmlNode })
  return value
}
