/**
 * Shared internals between the std-based ({@link ./parse.ts}) and WASM-based ({@link ./wasm/parse.ts}) XML parsers.
 * @module
 */

// Imports
import type { Nullable, XmlDocument, XmlNode, XmlText } from "./_types.ts"

/** XML parser `clean` options. */
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

/** XML parser `flatten` options. */
export type FlattenOptions = {
  /** If node only contains attributes values (i.e. with key starting with `@`), it'll be flattened as a regular object without `@` prefixes. */
  attributes?: boolean
  /** If node only contains a `#text` value, it'll be flattened as a string (defaults to `true`). */
  text?: boolean
  /** If node does not contains any attribute or text, it'll be flattened to `null` (defaults to `true`). */
  empty?: boolean
}

/** XML parser `revive` options. */
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

/** Backend-agnostic parser options (each backend extends it with its own supported `mode`). */
export type ParserOptions = {
  /** Remove elements from result. */
  clean?: CleanOptions
  /** Flatten result depending on node content. */
  flatten?: FlattenOptions
  /** Revive result. */
  revive?: ReviveOptions
}

/** Apply parser option defaults and post-process the parsed document. */
export function finalize(xml: XmlDocument, options?: ParserOptions): XmlDocument {
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

/** Attach a processing instruction under `#instructions` with array-grouping.  */
export function xml_instruction(xml: XmlDocument, name: string, raw: string): void {
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

/** Parse xml attributes. */
export function xml_attributes(raw: string): Record<PropertyKey, string> {
  const attributes = {} as Record<PropertyKey, string>
  for (const [_, name, __, value] of raw.matchAll(/(?<name>[A-Za-z_][-\w.:]*)=(["'])(?<value>(?:(?!\2).)*)(\2)/g))
    attributes[`@${name}`] = value
  return attributes
}

/** Parse xml doctype. */
export function xml_doctype(raw: string): XmlNode {
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
export function xml_text(value: string, { type = "~text" as "~text" | "~cdata" | "~comment", parent = null as Nullable<XmlNode> } = {}): XmlText {
  const text = Object.defineProperties({}, {
    ["~parent"]: { enumerable: false, writable: false, value: parent },
    ["~name"]: { enumerable: false, writable: false, value: type },
  }) as XmlText
  text["#text"] = value
  if (parent)
    parent["~children"].push(text)
  return text
}

/** Create a new element node and attach it under its parent's enumerable key with array-grouping. */
export function xml_element(name: string, parent: XmlNode): XmlNode {
  const node = xml_node(name, { parent })
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
  return node
}

/** Create a new node. */
export function xml_node(name: string, { parent = null as Nullable<XmlNode> } = {}): XmlNode {
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
function postprocess(node: XmlNode, options: ParserOptions) {
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
function revive(node: XmlNode | XmlText, key: string, options: ParserOptions) {
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
