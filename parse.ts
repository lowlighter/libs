// Imports
import init, { tokenize } from "./wasm_xml_parser/wasm_xml_parser.js"
import type { Nullable, rw } from "jsr:@libs/typing"
import type { xml_document, xml_node, xml_text } from "./_types.ts"
await init()

// Re-exports
export type { xml_document, xml_node, xml_text }

/** XML parser options. */
export type options = {
  /** Remove elements from result. */
  clean?: {
    /** Remove attributes from result. */
    attributes?: boolean
    /** Remove comments from result. */
    comments?: boolean
    /** Remove XML doctype from result. */
    doctype?: boolean
    /** Remove XML processing instructions from result. */
    instructions?: boolean
  }
  /** Flatten result depending on node content. */
  flatten?: {
    /** If node only contains attributes values (i.e. with key starting with `@`), it'll be flattened as a regular object without `@` prefixes. */
    attributes?: boolean
    /** If node only contains a `#text` value, it'll be flattened as a string (defaults to `true`). */
    text?: boolean
    /** If node does not contains any attribute or text, it'll be flattened to `null` (defaults to `true`). */
    empty?: boolean
  }
  /** Revive result. */
  revive?: {
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
    /** Revive finite numbers. */
    numbers?: boolean
    /** Custom reviver (this is applied after other revivals). */
    custom?: (args: { name: string; key: string; value: string; node: Readonly<xml_node> }) => unknown
  }
}

/**
 * Parse a XML string into an object.
 *
 * Output (cleaning, flattening, reviving, etc.) can be customized using the {@link options} parameter.
 *
 * Unless flattened, output nodes will contain the following non-enumerable properties (which mean they're not "visible" when iterating over, but are still explicitely accessible):
 * - General properties
 *   - `readonly ["~name"]: string`: tag name
 *   - `readonly ["~parent"]: xml_node|null`: parent node
 *   - `["#text"]?: string`: text content
 * - Node properties
 *   - `readonly ["~children"]: Array<xml_node|xml_text>`: node children
 *   - `readonly ["#comments"]?: Array<string>`: node comments
 *   - `readonly ["#text"]?: string`: concatenated children text content, this property becomes enumerable if at least one non-empty text node is present
 * - XML document properties
 *  - `["#doctype"]?: unknown`: XML doctype
 *  - `["#instruction"]?: Array<xml_node>`: XML processing instructions
 *
 * Attributes are prefixed with an arobase (`@`).
 *
 * @example
 * ```ts
 * import { parse } from "./parse.ts"
 *
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

export function parse(string: string, options?: options) {
  const xml = xml_node("~xml") as xml_document
  const stack = [xml] as Array<xml_node>
  for (const [token, name, value = name] of tokenize(new TextEncoder().encode(string))) {
    switch (token) {
      // XML declaration
      case "xml:declaration": {
        // https://www.w3.org/TR/REC-xml/#NT-VersionNum
        const version = value.match(/version=(["'])(?<version>1\.\d+)(\1)/)?.groups.version
        if (version) {
          xml["@version"] = version as typeof xml["@version"]
        }
        // https://www.w3.org/TR/REC-xml/#NT-EncodingDecl
        const encoding = value.match(/encoding=(["'])(?<encoding>[A-Za-z][-\w.]*)(\1)/)?.groups.encoding
        if (encoding) {
          xml["@encoding"] = encoding as typeof xml["@encoding"]
        }
        // https://www.w3.org/TR/REC-xml/#NT-SDDecl
        const standalone = value.match(/standalone=(["'])(?<standalone>yes|no)(\1)/)?.groups.standalone
        if (standalone) {
          xml["@standalone"] = standalone as typeof xml["@standalone"]
        }
        break
      }
      // XML Doctype definition
      case "xml:doctype": {
        xml["#doctype"] = value
        break
      }
      // XML processing instruction
      case "xml:instruction": {
        const instruction = xml_node(name, { parent: xml })
        xml["#instructions"] ??= []
        xml["#instructions"].push(instruction)
        //TODO(@lowlighter): parse value into href
        instruction.value = value
        break
      }
      // XML tag opened
      case "tag:open": {
        const parent = stack.at(-1)!
        const node = xml_node(name, { parent })
        switch (true) {
          case Array.isArray(parent[node["~name"]]):
            ;(parent[node["~name"]] as Array<xml_node>).push(node)
            break
          case node["~name"] in parent:
            parent[node["~name"]] = [parent[node["~name"]], node]
            break
          default:
            parent[node["~name"]] = node
        }
        stack.push(node)
        break
      }
      // XML tag closed
      case "tag:close": {
        if (stack.pop()!["~name"] !== name) {
          throw new SyntaxError(`Expected closing tag for: <${name}>`)
        }
        break
      }
      // XML attribute
      case "tag:attribute": {
        stack.at(-1)![`@${name}`] = value
        break
      }
      // Text
      case "text": {
        if (stack.length > 1) {
          xml_text(value, { type: "~text", parent: stack.at(-1)! })
        }
        break
      }
      // CDATA
      case "cdata": {
        xml_text(value, { type: "~cdata", parent: stack.at(-1)! })
        break
      }
      // Comment
      case "comment": {
        xml_text(value, { type: "~comment", parent: stack.at(-1)! })
        break
      }
    }
  }
  return postprocess(xml, options)
}

/** Create a new text node. */
function xml_text(value: string, { type = "~text" as "~text" | "~cdata" | "~comment", parent = null as Nullable<xml_node> } = {}) {
  const text = Object.defineProperties({}, {
    ["~parent"]: { enumerable: false, writable: false, value: parent },
    ["~name"]: { enumerable: false, writable: false, value: type },
  }) as xml_text
  text["#text"] = value
  if (parent) {
    parent["~children"].push(text)
  }
  return text
}

/** Create a new node. */
function xml_node(name: string, { parent = null as Nullable<xml_node> } = {}) {
  const node = Object.defineProperties({}, {
    ["~parent"]: { enumerable: false, writable: false, value: parent },
    ["~name"]: { enumerable: false, writable: false, value: name },
    ["~children"]: { enumerable: false, writable: true, value: [] },
    ["#text"]: {
      enumerable: false,
      configurable: true,
      get(this: xml_node) {
        return this["~children"].map((node) => node["~name"] !== "~comment" ? node["#text"] ?? "" : "").filter(Boolean).join(" ")
      },
    },
    ["#comments"]: {
      enumerable: false,
      configurable: true,
      get(this: xml_node) {
        return this["~children"].filter((node) => node["~name"] === "~comment").map((node) => node["#text"]!)
      },
    },
  }) as xml_node
  if (parent) {
    parent["~children"].push(node)
  }
  return node
}

/** Post-process xml node. */
function postprocess(node: xml_node, options?: options) {
  // Clean XML document if required
  if (node["~name"] === "~xml") {
    if (options?.clean?.doctype) {
      delete node["#doctype"]
    }
    if (options?.clean?.instructions) {
      ;(node as rw)["~children"] = node["~children"].filter((child) => !(node["#instructions"] as Array<xml_node | xml_text>)?.includes(child))
      delete node["#instructions"]
    }
  }
  // Clean comments if required
  if (options?.clean?.comments) {
    ;(node as rw)["~children"] = node["~children"].filter((child) => child["~name"] !== "~comment")
  }
  // Trim text nodes if required
  if (options?.revive?.trim ?? true) {
    node["~children"].forEach((child) => /^~(?:text|cdata|comment)$/.test(child["~name"]) ? (child as rw)["#text"] = revive(child, "#text", { revive: { trim: node["@xml:space"] !== "preserve" } }) : null)
  }
  if (node["~children"].some((child) => (/^~(?:text|cdata)$/.test(child["~name"])) && (child["#text"].length))) {
    Object.defineProperty(node, "#text", { enumerable: true, configurable: true })
  }
  if (node["~children"].some((child) => child["~name"] === "~comment")) {
    Object.defineProperty(node, "#comments", { enumerable: true, configurable: true })
  }
  // Process child nodes
  for (const [key, value] of Object.entries(node)) {
    // Skip comments
    if (key === "#comments") {
      continue
    }
    // Clean attributes if required
    if ((options?.clean?.attributes) && (key.startsWith("@"))) {
      delete node[key]
    }
    // Revive attribute value if required
    if (key.startsWith("@")) {
      node[key] = revive(node, key, options)
      continue
    }
    // Handle other nodes
    if (Array.isArray(value)) {
      node[key] = value.map((child) => postprocess(child, options))
      continue
    }
    if ((typeof value === "object") && value) {
      node[key] = postprocess(value as xml_node, options)
      continue
    }
  }
  // Revive text if required
  const keys = Object.keys(node)
  if (keys.includes("#text")) {
    const _options = { ...options, revive: { ...options?.revive, trim: (options?.revive?.trim ?? true) && (node["@xml:space"] !== "preserve") } }
    Object.defineProperty(node, "#text", { enumerable: true, configurable: true, value: revive(node, "#text", _options) })
  }
  // Flatten object if required
  if ((options?.flatten?.text ?? true) && (keys.length === 1) && (keys.includes("#text"))) {
    return node["#text"]
  }
  if ((options?.flatten?.attributes) && (keys.length) && (keys.every((key) => key.startsWith("@")))) {
    return Object.fromEntries(Object.entries(node).map(([key, value]) => [key.slice(1), value]))
  }
  if (!keys.length) {
    return (options?.flatten?.empty ?? true) ? null : ""
  }

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
function revive(node: xml_node | xml_text, key: string, options?: options) {
  let value = (node as xml_node)[key] as string
  if (options?.revive?.trim ?? true) {
    value = value.trim()
  }
  if (options?.revive?.entities ?? true) {
    value = value.replaceAll(/&#(?<hex>x?)(?<code>\d+);/g, (_, hex, code) => String.fromCharCode(Number.parseInt(code, hex ? 16 : 10)))
    for (const [entity, character] of Object.entries(entities)) {
      value = value.replaceAll(entity, character)
    }
  }
  if ((options?.revive?.numbers) && (value.length) && (Number.isFinite(Number(value))) && (!((node["~name"] === "xml") && (key === "version")))) {
    value = Number(value) as unknown as string
  }
  if ((options?.revive?.booleans) && (/^(?:[Tt]rue|[Ff]alse)$/.test(value))) {
    value = /^[Tt]rue$/.test(value) as unknown as string
  }
  if (options?.revive?.custom) {
    return options.revive.custom({ name: node["~name"], key, value, node: node as xml_node })
  }
  return value
}
