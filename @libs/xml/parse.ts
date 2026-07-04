/**
 * Parse a XML string into an object.
 * @module
 */

// Imports
import { parse as std_parse } from "@std/xml/parse"
import { parseXmlStreamFromBytes } from "@std/xml/parse-stream"
import type { XmlDocument as StdDocument, XmlElement as StdElement, XmlNode as StdNode } from "@std/xml/types"
import { type CleanOptions, finalize, type FlattenOptions, type ReviveOptions, xml_doctype, xml_element, xml_instruction, xml_node, xml_text } from "./_parser.ts"
import type { XmlDocument, XmlNode } from "./_types.ts"
export type * from "./_types.ts"
export type { CleanOptions, FlattenOptions, ReviveOptions, Reviver } from "./_parser.ts"

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
   * > Note: `html` mode is currently not supported, use the WASM backend (`@libs/xml/wasm/parse`) instead.
   * > Tracking issue: https://github.com/denoland/std/issues/7212
   */
  mode?: "xml"
}

/**
 * Parse a XML string into an object.
 *
 * Output (cleaning, flattening, reviving, etc.) can be customized using the {@link ParseOptions} parameter.
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
export function parse(content: string, options?: ParseOptions): XmlDocument

/**
 * Parse a XML string into an object.
 *
 * Output (cleaning, flattening, reviving, etc.) can be customized using the {@link ParseOptions} parameter.
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
 * import { fromFileUrl } from "@std/path"
 *
 * const file = await Deno.open(fromFileUrl(import.meta.resolve("./bench/assets/small.xml")))
 * console.log(await parse(file.readable))
 * ```
 */
export function parse(content: ReadableStream<Uint8Array>, options?: ParseOptions): Promise<XmlDocument>
export function parse(content: string | ReadableStream<Uint8Array>, options?: ParseOptions): XmlDocument | Promise<XmlDocument> {
  if (typeof content !== "string")
    return parse_stream(content, options)
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

  return finalize(xml, options)
}

/**
 * Parse a XML stream into an object.
 * @std streaming parser events are mapped to the same document structure as the string version,
 * and unlike the sync DOM they natively expose the doctype and processing instructions.
 */
async function parse_stream(content: ReadableStream<Uint8Array>, options?: ParseOptions): Promise<XmlDocument> {
  const xml = xml_node("~xml") as XmlDocument
  const stack = [xml] as Array<XmlNode>
  await parseXmlStreamFromBytes(content, {
    // XML declaration
    onDeclaration(version, encoding, standalone) {
      if (version)
        xml["@version"] = version as XmlDocument["@version"]
      if (encoding)
        xml["@encoding"] = encoding
      if (standalone)
        xml["@standalone"] = standalone
    },
    // XML doctype (only the name and public/system identifiers are exposed by @std events)
    onDoctype(name, publicId, systemId) {
      const doctype = xml_node("~doctype", { parent: xml })
      ;[name, publicId, systemId].filter((value) => value !== undefined).forEach((value) => doctype[`@${value}`] = "")
      xml["#doctype"] = doctype
    },
    // XML processing instruction
    onProcessingInstruction(target, instruction) {
      xml_instruction(xml, target, instruction.trim())
    },
    // XML tag opened
    onStartElement(name, _colon, _uri, attributes, selfClosing) {
      const node = xml_element(name, stack.at(-1)!)
      for (let i = 0; i < attributes.count; i++)
        node[`@${attributes.getName(i)}`] = attributes.getValue(i)
      if (!selfClosing)
        stack.push(node)
    },
    // XML tag closed
    onEndElement() {
      stack.pop()
    },
    // Text
    onText(text) {
      xml_text(text, { type: "~text", parent: stack.at(-1)! })
    },
    // CDATA
    onCData(text) {
      xml_text(text, { type: "~cdata", parent: stack.at(-1)! })
    },
    // Comment
    onComment(text) {
      xml_text(text, { type: "~comment", parent: stack.at(-1)! })
    },
  }, { disallowDoctype: false })
  return finalize(xml, options)
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

/** Walk a std DOM element into the ergonomic ~children/@attr/#text structure. */
function build(element: StdElement, parent: XmlNode): void {
  // Attach under the enumerable key with array-grouping
  const node = xml_element(element.name.raw, parent)
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
