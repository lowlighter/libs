/**
 * Parse a XML string into an object.
 * @module
 */

// Imports
import { initSync, JsReader, source, Token, tokenize } from "./wasm_xml_parser/wasm_xml_parser.js"
import type { Nullable, ReaderSync, xml_document, xml_node, xml_text } from "./_types.ts"
export type * from "./_types.ts"
initSync(source())

/** XML parser options. */
export type parse_options = {
  /** Remove elements from result. */
  clean?: clean_options
  /** Flatten result depending on node content. */
  flatten?: flatten_options
  /** Revive result. */
  revive?: revive_options
  /**
   * Parsing mode.
   * Using `html` is more permissive and will not throw on some invalid XML syntax.
   * Mainly unquoted attributes will be supported and not properly closed tags will be accepted.
   */
  mode?: "xml" | "html"
}

/** XML parser {@linkcode parse_options}`.clean` */
export type clean_options = {
  /** Remove attributes from result. */
  attributes?: boolean
  /** Remove comments from result. */
  comments?: boolean
  /** Remove XML doctype from result. */
  doctype?: boolean
  /** Remove XML processing instructions from result. */
  instructions?: boolean
}

/** XML parser {@linkcode parse_options}`.flatten` */
export type flatten_options = {
  /** If node only contains attributes values (i.e. with key starting with `@`), it'll be flattened as a regular object without `@` prefixes. */
  attributes?: boolean
  /** If node only contains a `#text` value, it'll be flattened as a string (defaults to `true`). */
  text?: boolean
  /** If node does not contains any attribute or text, it'll be flattened to `null` (defaults to `true`). */
  empty?: boolean
}

/** XML parser {@linkcode parse_options}`.revive` */
export type revive_options = {
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
  custom?: reviver
}

/**
 * Custom XML parser reviver.
 * It can be used to change the way some nodes are parsed.
 */
export type reviver = (args: { name: string; key: Nullable<string>; value: Nullable<string>; node: Readonly<xml_node> }) => unknown

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
 *  - `["#doctype"]?: xml_node`: XML doctype
 *  - `["#instructions"]?: { [key:string]: xml_node| Array<xml_node> }`: XML processing instructions
 *
 * Attributes are prefixed with an arobase (`@`).
 *
 * You can also pass an object that implement {@link ReaderSync} instead of a string.
 *
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
 *
 * ```ts
 * import { parse } from "./parse.ts"
 * import { fromFileUrl } from "@std/path"
 *
 * using file = await Deno.open(fromFileUrl(import.meta.resolve("./bench/assets/small.xml")))
 * console.log(parse(file))
 * ```
 */
export function parse(content: string | ReaderSync, options?: parse_options): xml_document {
  const xml = xml_node("~xml") as xml_document
  const stack = [xml] as Array<xml_node>
  const tokens = [] as Array<[number, string, string?]>
  const states = [] as Array<[number, number]>
  const flags = { root: false }
  try {
    const reader = new JsReader(new TextEncoder().encode(content as string), typeof content === "object" ? content : undefined)
    tokenize(reader, tokens, states, options?.mode === "html")
  } catch (error) {
    if (states.at(-1)?.[0] === Token.StateParseAttribute) {
      tokens.push([Token.Error, `Failed to parse attribute around position ${states.at(-1)![1]}`])
    }
    if (!states.length) {
      throw new EvalError(`WASM XML parser crashed: ${error}`)
    }
  }
  const errors = tokens.find(([token]) => token === Token.Error)
  if (errors) {
    throw new SyntaxError(`Malformed XML document: ${errors[1]}`)
  }
  options ??= {}
  options.revive ??= {}
  options.revive.trim ??= true
  options.revive.entities ??= true
  options.flatten ??= {}
  options.flatten.text ??= true
  options.flatten.empty ??= true
  for (const [token, name, value = name] of tokens) {
    switch (token) {
      // XML declaration
      case Token.XMLDeclaration: {
        // https://www.w3.org/TR/REC-xml/#NT-VersionNum
        const version = value.match(/version=(["'])(?<version>1\.\d+)(\1)/)?.groups?.version
        if (version) {
          xml["@version"] = version as typeof xml["@version"]
        }
        // https://www.w3.org/TR/REC-xml/#NT-EncodingDecl
        const encoding = value.match(/encoding=(["'])(?<encoding>[A-Za-z][-\w.]*)(\1)/)?.groups?.encoding
        if (encoding) {
          xml["@encoding"] = encoding as typeof xml["@encoding"]
        }
        // https://www.w3.org/TR/REC-xml/#NT-SDDecl
        const standalone = value.match(/standalone=(["'])(?<standalone>yes|no)(\1)/)?.groups?.standalone
        if (standalone) {
          xml["@standalone"] = standalone as typeof xml["@standalone"]
        }
        break
      }
      // XML Doctype definition
      case Token.XMLDoctype: {
        xml["#doctype"] = Object.assign(xml_node("~doctype", { parent: xml }), xml_doctype(value))
        break
      }
      // XML processing instruction
      case Token.XMLInstruction: {
        const [name, ...raw] = value.split(" ")
        const instruction = Object.assign(xml_node(name, { parent: xml }), xml_attributes(raw.join(" ")))
        xml["#instructions"] ??= {}
        switch (true) {
          case Array.isArray(xml["#instructions"][name]):
            ;(xml["#instructions"][name] as Array<xml_node>).push(instruction)
            break
          case name in xml["#instructions"]:
            xml["#instructions"][name] = [xml["#instructions"][name] as xml_node, instruction]
            break
          default:
            xml["#instructions"][name] = instruction
        }
        break
      }
      // XML tag opened
      case Token.TagOpen: {
        if (stack.length === 1) {
          if (flags.root) {
            throw new SyntaxError("Multiple root node detected")
          }
          flags.root = true
        }
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
      case Token.TagClose: {
        stack.pop()
        break
      }
      // XML attribute
      case Token.TagAttribute: {
        stack.at(-1)![`@${name}`] = value
        break
      }
      // Text
      case Token.Text: {
        xml_text(value, { type: "~text", parent: stack.at(-1)! })
        break
      }
      // CDATA
      case Token.CData: {
        xml_text(value, { type: "~cdata", parent: stack.at(-1)! })
        break
      }
      // Comment
      case Token.Comment: {
        xml_text(value, { type: "~comment", parent: stack.at(-1)! })
        break
      }
    }
  }
  if (!Object.keys(xml).length) {
    throw new SyntaxError("Malformed XML document: empty document or no root node detected")
  }
  return postprocess(xml, options) as xml_document
}

/** Parse xml attributes. */
function xml_attributes(raw: string) {
  const attributes = {} as Record<PropertyKey, string>
  for (const [_, name, __, value] of raw.matchAll(/(?<name>[A-Za-z_][-\w.:]*)=(["'])(?<value>(?:(?!\2).)*)(\2)/g)) {
    attributes[`@${name}`] = value
  }
  return attributes
}

/** Parse xml doctype. */
function xml_doctype(raw: string) {
  const node = {} as xml_node
  const { attributes: _attributes, elements: _elements = "" } = raw.match(/^(?<attributes>[^\[]*)(?:\[(?<elements>[\s\S]*)\])?/)?.groups!
  // Parse attributes
  raw = raw.replace(`[${_elements}]`, "")
  for (const [match, __, name] of _attributes.matchAll(/(["'])(?<name>(?:(?!\1).)*)(\1)/g)) {
    node[`@${name}`] = ""
    raw = raw.replace(match, "")
  }
  raw.split(/\s+/).filter(Boolean).forEach((name) => node[`@${name}`] = "")
  // Parse elements
  for (const [_, name, value] of _elements.matchAll(/<!ELEMENT\s+(?<name>\w+)\s+\((?<value>[^\)]+)\)/g)) {
    node[name] = value
  }
  return node
}

/** Create a new text node. */
function xml_text(value: string, { type = "~text" as "~text" | "~cdata" | "~comment", parent = null as Nullable<xml_node> } = {}): xml_text {
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
function xml_node(name: string, { parent = null as Nullable<xml_node> } = {}): xml_node {
  const node = Object.defineProperties({}, {
    ["~parent"]: { enumerable: false, writable: false, value: parent },
    ["~name"]: { enumerable: false, writable: false, value: name },
    ["~children"]: { enumerable: false, writable: true, value: [] },
    ["#text"]: {
      enumerable: false,
      configurable: true,
      get(this: xml_node) {
        const children = this["~children"].filter((node) => node["~name"] !== "~comment")
        // If xml:space is not set to "preserve", concatenate text nodes and trim them while removing empty ones
        if (this["@xml:space"] !== "preserve") {
          return children.map((child) => child["#text"]).filter(Boolean).join(" ")
        }
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
function postprocess(node: xml_node, options: parse_options) {
  // Clean XML document if required
  if (node["~name"] === "~xml") {
    if (options?.clean?.doctype) {
      delete node["#doctype"]
    }
    if (options?.clean?.instructions) {
      ;(node as Record<PropertyKey, unknown>)["~children"] = node["~children"].filter((child) => !(child["~name"] in ((node as xml_document)["#instructions"] ?? {})))
      delete node["#instructions"]
    }
  }
  // Clean node and enable enumerable properties if required
  if (node["~children"]) {
    if (options?.clean?.comments) {
      ;(node as Record<PropertyKey, unknown>)["~children"] = node["~children"].filter((child) => child["~name"] !== "~comment")
    }
    if (options?.revive?.trim) {
      node["~children"].forEach((child) => /^~(?:text|cdata|comment)$/.test(child["~name"]) ? (child as Record<PropertyKey, unknown>)["#text"] = revive(child, "#text", { revive: { trim: node["@xml:space"] !== "preserve" } }) : null)
    }
    if (node["~children"].some((child) => (/^~(?:text|cdata)$/.test(child["~name"])) && (child["#text"].trim().length + (node["@xml:space"] === "preserve" ? 1 : 0) * child["#text"].length))) {
      Object.defineProperty(node, "#text", { enumerable: true, configurable: true })
    }
    if (node["~children"].some((child) => child["~name"] === "~comment")) {
      Object.defineProperty(node, "#comments", { enumerable: true, configurable: true })
    }
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
      continue
    }
    // Revive attribute value if required
    if (key.startsWith("@")) {
      node[key] = revive(node, key, options)
      if (node[key] === undefined) {
        delete node[key]
      }
      continue
    }
    // Handle other nodes
    if (Array.isArray(value)) {
      node[key] = Object.defineProperties(value.map((child) => postprocess(child, options)), {
        ["~parent"]: { enumerable: false, writable: false, value: node },
        ["~name"]: { enumerable: false, writable: false, value: key },
      })
    } else if ((typeof value === "object") && value) {
      node[key] = postprocess(value as xml_node, options)
    }
    if (node[key] === undefined) {
      delete node[key]
    }
  }
  // Revive text if required
  const keys = Object.keys(node)
  if (keys.includes("#text")) {
    const _options = { ...options, revive: { ...options?.revive, trim: (options?.revive?.trim) && (node["@xml:space"] !== "preserve") } }
    Object.defineProperty(node, "#text", { enumerable: true, configurable: true, value: revive(node, "#text", _options) })
  }
  // Custom revival if required
  if (options?.revive?.custom) {
    if (options.revive.custom({ name: node["~name"], key: null, value: null, node: node as xml_node }) === undefined) {
      return undefined
    }
  }
  // Flatten object if required
  if ((options?.flatten?.text) && (keys.length === 1) && (keys.includes("#text"))) {
    return node["#text"]
  }
  if ((options?.flatten?.attributes) && (keys.length) && (keys.every((key) => key.startsWith("@")))) {
    for (const key of keys) {
      node[key.slice(1)] = node[key]
      delete node[key]
    }
    return node
  }
  if (!keys.length) {
    return (options?.flatten?.empty) ? null : (options?.flatten?.text) ? "" : Object.defineProperty(node, "#text", { enumerable: true, configurable: true, value: "" })
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
function revive(node: xml_node | xml_text, key: string, options: parse_options) {
  let value = (node as xml_node)[key] as string
  if (options?.revive?.trim) {
    value = value.trim()
  }
  if (options?.revive?.entities) {
    value = value.replaceAll(/&#(?<hex>x?)(?<code>[A-Fa-f\d]+);/g, (_, hex, code) => String.fromCharCode(Number.parseInt(code, hex ? 16 : 10)))
    for (const [entity, character] of Object.entries(entities)) {
      value = value.replaceAll(entity, character)
    }
  }
  if ((options?.revive?.numbers) && (value.length) && (Number.isFinite(Number(value))) && (!((node["~name"] === "~xml") && (key === "@version")))) {
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
