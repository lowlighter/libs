/**
 * Parse a XML string into an object (legacy WASM backend).
 *
 * This backend predates the {@link ../parse.ts} implementation based on `@std/xml` and is kept as an alternative,
 * mainly because it additionally supports the more permissive `html` parsing mode.
 * Both share the same options, output structure and types.
 *
 * @module
 */

// Imports
import { initSync, JsReader, source, Token, tokenize } from "./wasm_xml_parser.js"
import { type CleanOptions, finalize, type FlattenOptions, type ReviveOptions, xml_doctype, xml_element, xml_instruction, xml_node, xml_text } from "../_parser.ts"
import type { ReaderSync, XmlDocument, XmlNode } from "../_types.ts"
export type * from "../_types.ts"
export type { CleanOptions, FlattenOptions, ReviveOptions, Reviver } from "../_parser.ts"
initSync(source())

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
   */
  mode?: "xml" | "html"
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
 * You can also pass an object that implements {@link ReaderSync} instead of a string.
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
 * Parse a XML file into an object.
 *
 * Output (cleaning, flattening, reviving, etc.) can be customized using the {@link ParseOptions} parameter.
 *
 * ```ts
 * import { fromFileUrl } from "@std/path"
 *
 * const file = await Deno.open(fromFileUrl(import.meta.resolve("../bench/assets/small.xml")))
 * console.log(parse(file))
 * ```
 */
export function parse(content: ReaderSync, options?: ParseOptions): XmlDocument

/**
 * Parse a XML stream into an object.
 *
 * Output (cleaning, flattening, reviving, etc.) can be customized using the {@link ParseOptions} parameter.
 *
 * ```ts
 * import { fromFileUrl } from "@std/path"
 *
 * const file = await Deno.open(fromFileUrl(import.meta.resolve("../bench/assets/small.xml")))
 * console.log(await parse(file.readable))
 * ```
 */
export function parse(content: ReadableStream<Uint8Array>, options?: ParseOptions): Promise<XmlDocument>
export function parse(content: string | ReaderSync | ReadableStream<Uint8Array>, options?: ParseOptions) {
  if (content instanceof ReadableStream)
    return new Response(content).bytes().then((bytes) => parse_bytes(bytes, options))
  return parse_bytes(content, options)
}

/** Tokenize a XML document with the WASM tokenizer and map the tokens to the same document structure as the std backend. */
function parse_bytes(content: string | ReaderSync | Uint8Array, options?: ParseOptions): XmlDocument {
  const xml = xml_node("~xml") as XmlDocument
  const stack = [xml] as Array<XmlNode>
  const tokens = [] as Array<[number, string, string?]>
  const states = [] as Array<[number, number]>
  const flags = { root: false }
  try {
    const reader = content instanceof Uint8Array ? new JsReader(content) : new JsReader(new TextEncoder().encode(content as string), typeof content === "object" ? content : undefined)
    tokenize(reader, tokens, states, options?.mode === "html")
  } catch (error) {
    if (states.at(-1)?.[0] === Token.StateParseAttribute)
      tokens.push([Token.Error, `Failed to parse attribute around position ${states.at(-1)![1]}`])
    if (!states.length)
      throw new EvalError(`WASM XML parser crashed: ${error}`)
  }
  const errors = tokens.find(([token]) => token === Token.Error)
  if (errors)
    throw new SyntaxError(`Malformed XML document: ${errors[1]}`)
  for (const [token, name, value = name] of tokens) {
    switch (token) {
      // XML declaration
      case Token.XMLDeclaration: {
        // https://www.w3.org/TR/REC-xml/#NT-VersionNum
        const version = value.match(/version=(["'])(?<version>1\.\d+)(\1)/)?.groups?.version
        if (version)
          xml["@version"] = version as typeof xml["@version"]
        // https://www.w3.org/TR/REC-xml/#NT-EncodingDecl
        const encoding = value.match(/encoding=(["'])(?<encoding>[A-Za-z][-\w.]*)(\1)/)?.groups?.encoding
        if (encoding)
          xml["@encoding"] = encoding as typeof xml["@encoding"]
        // https://www.w3.org/TR/REC-xml/#NT-SDDecl
        const standalone = value.match(/standalone=(["'])(?<standalone>yes|no)(\1)/)?.groups?.standalone
        if (standalone)
          xml["@standalone"] = standalone as typeof xml["@standalone"]
        break
      }
      // XML Doctype definition
      case Token.XMLDoctype: {
        xml["#doctype"] = Object.assign(xml_node("~doctype", { parent: xml }), xml_doctype(value))
        break
      }
      // XML processing instruction
      case Token.XMLInstruction: {
        const target = value.match(/^\S+/)?.[0] ?? ""
        xml_instruction(xml, target, value.slice(target.length).trim())
        break
      }
      // XML tag opened
      case Token.TagOpen: {
        if (stack.length === 1) {
          if (flags.root)
            throw new SyntaxError("Multiple root node detected")
          flags.root = true
        }
        stack.push(xml_element(name, stack.at(-1)!))
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
  return finalize(xml, options)
}
