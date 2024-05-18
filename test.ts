// Imports
import init, { tokenize } from "./wasm_xml_parser/wasm_xml_parser.js"
import type {Nullable, Arrayable, rw} from "jsr:@libs/typing"

await init()


/*
~ references and internal data
@ attribute
# content
! processing instruction
*/

/** XML text node. */
export type xml_text = {
  /** Tag name (`~text` for text nodes, `~cdata` for CDATA nodes and `~comment` for comment nodes). */
  readonly ["~name"]:string
  /** Text content. */
  ["#text"]:string
}

/** XML node. */
export type xml_node = {
  /** Tag name (`~xml` for XML prolog, other nodes will be given their respective tag name). */
  readonly ["~name"]:string
  /** Child nodes. */
  readonly ["~children"]:Array<xml_node|xml_text>
  /** Text content. */
  readonly ["#text"]:string
  // Signature
  [key:string]:unknown
}

/** XML document. */
export type xml_document = xml_node & {
  /** XML version. */
  ["@version"]?:`1.${number}`
  /** XML character encoding. */
  ["@encoding"]?:string
  /** XML standalone. */
  ["@standalone"]?:"yes"|"no"
  /** XML doctype. */
  ["#doctype"]?:string
  /** XML instructions. */
  ["#instructions"]?:Array<xml_node>
}

/** Create a new text node. */
function xml_text(value:string, {type = "~text" as "~text"|"~cdata"|"~comment", parent = null as Nullable<xml_node>} = {}) {
  const text = Object.defineProperties({}, {
    ["~name"]:{enumerable: false, writable: false, value: type},
  }) as xml_text
  text["#text"] = value
  if (parent) {
    parent["~children"].push(text)
    if (type !== "~comment") {
      Object.defineProperty(parent, "#text", {enumerable:true, configurable:true})
    }
  }
  return text
}

/** Create a new node. */
function xml_node(name:string, {parent = null as Nullable<xml_node>} = {}) {
  const node = Object.defineProperties({}, {
    ["~name"]:{enumerable: false, writable: false, value: name},
    ["~children"]:{enumerable: false, writable:true, value: []},
    ["#text"]: {
      enumerable:false,
      configurable:true,
      get(this:xml_node) {
        return this["~children"].map(node => node["~name"] !== "~comment" ? node["#text"] ?? "" : "").filter(Boolean).join(" ")
      }
    }
  }) as xml_node
  if (parent) {
    parent["~children"].push(node)
  }
  return node 
}

/** Parse a string into  */
export function parse(string: string, options?:options) {
  const xml = xml_node("~xml") as xml_document
  const stack = [xml] as Array<xml_node>
  const capture = {text:false}
  for (const [token, name, value = name] of tokenize(new TextEncoder().encode(string))) {
    switch (token) {
      // XML declaration
      case "xml:declaration":{
        // https://www.w3.org/TR/REC-xml/#NT-VersionNum
        const {version} = value.match(/version=(["'])(?<version>1\.\d+)(\1)/)?.groups ?? {}
        if (version)
        xml["@version"] = version as typeof xml["@version"]
        // https://www.w3.org/TR/REC-xml/#NT-EncodingDecl
        const {encoding} = value.match(/encoding=(["'])(?<encoding>[A-Za-z][-\w.]*)(\1)/)?.groups ?? {}
        if (encoding)
        xml["@encoding"] = encoding as typeof xml["@encoding"]
        // https://www.w3.org/TR/REC-xml/#NT-SDDecl
        const {standalone} = value.match(/standalone=(["'])(?<standalone>yes|no)(\1)/)?.groups ?? {}
        if (standalone)
        xml["@standalone"] = standalone as typeof xml["@standalone"]
        break
      }
      // XML Doctype definition
      case "xml:doctype":{
        xml["#doctype"] = value
        break
      }
      // XML processing instruction
      case "xml:instruction":{
        const instruction = xml_node(name, {parent:xml})
        xml["#instructions"] ??= []
        xml["#instructions"].push(instruction)
        //TODO parse value into href
        instruction.value = value
        break
      }
      // XML tag opened
      case "tag:open":{
        const parent = stack.at(-1)!
        const node = xml_node(name, {parent})
        switch (true) {
          case Array.isArray(parent[node["~name"]]):
            (parent[node["~name"]] as Array<xml_node>).push(node)
            break
          case node["~name"] in parent:
            parent[node["~name"]] = [parent[node["~name"]], node]
            break
          default:
            parent[node["~name"]] = node
        }
        stack.push(node)
        capture.text = true
        break
      }
      // XML tag closed
      case "tag:close":{
        if (stack.pop()!["~name"] !== name)
          throw new SyntaxError(`Expected closing tag for: <${name}>`)  
        capture.text = false          
        break
      }
      // XML attribute
      case "tag:attribute":{
        stack.at(-1)![`@${name}`] = value
        break
      }
      // Text
      case "text":{
        if (capture.text)
          xml_text(value, {type:"~text", parent:stack.at(-1)!})
        break
      }
      // CDATA
      case "cdata":{
        xml_text(value, {type:"~cdata", parent:stack.at(-1)!})
        break
      }
      // Comment
      case "comment":{
        xml_text(value, {type:"~comment", parent:stack.at(-1)!})
        break
      }
    }
  }
  //console.log(Deno.inspect(structuredClone(postprocess(xml, options)), {colors:true}))
  return xml
}

/** Post-process xml node. */
function postprocess(node:xml_node, options?:options) {
  // Clean XML document if required
  if (node["~name"] === "~xml") {
    if (options?.clean?.doctype) {
      delete node["#doctype"]
    }
    if (options?.clean?.instructions) {
      (node as rw)["~children"] = node["~children"].filter(child => !(node["#instructions"] as Array<xml_node|xml_text>)?.includes(child))
      delete node["#instructions"]
    }
  }
  // Clean comments if required
  if (options?.clean?.comments) {
    (node as rw)["~children"] = node["~children"].filter(child => child["~name"] !== "~comment")
  }
  // Trim text nodes if required
  if (options?.revive?.trim) {
    node["~children"].forEach(child => /^~(?:text|cdata|comment)$/.test(child["~name"]) ? (child as rw)["#text"] = revive(child, "#text", {revive:{trim:node["@xml:space"] !== "preserve"}}) : null)
  }
  // Process child nodes
  for (const [key, value] of Object.entries(node)) {
    // Clean attributes if required
    if ((options?.clean?.attributes)&&(key.startsWith("@")))
      delete node[key]
    // Revive attribute value if required
    if (key.startsWith("@")) {
      node[key] = revive(node, key, options)
      continue
    }
    // Handle other nodes
    if (Array.isArray(value)) {
      node[key] = value.map(child => postprocess(child, options))
      continue
    }
    if ((typeof value === "object")&&(value)) {
      node[key] = postprocess(value as xml_node, options)
      continue
    }
  }
  // Revive text if required
  const keys = Object.keys(node)
  if (keys.includes("#text")) {
    Object.defineProperty(node, "#text", {enumerable:true, configurable:true, value:revive(node, "#text", options)})
  }
  // Flatten object if required
  if ((options?.flatten?.text)&&(keys.length === 1)&&(keys.includes("#text"))) {
    return node["#text"]
  }
  if ((options?.flatten?.attributes)&&(keys.length)&&(keys.every(key => key.startsWith("@")))) {
    return Object.fromEntries(Object.entries(node).map(([key, value]) => [key.slice(1), value]))
  }
  if ((options?.flatten?.empty)&&(!keys.length)) {
    return null
  }

  return node
}

/** Revive value. */
function revive(node:xml_node|xml_text, key:string, options?:options) {
  let value = (node as xml_node)[key] as string
  if (options?.revive?.trim)
    value = value.trim()
  if (options?.revive?.custom) {
    const revived = options.revive.custom({name:node["~name"], key, value, node:node as xml_node})
    if (revived !== undefined)
      return revived
  }
  if ((options?.revive?.booleans)&&(/^(?:[Tt]rue|[Ff]alse)$/.test(value)))
    return /^[Tt]rue$/.test(value)
  if ((options?.revive?.numbers)&&(Number.isFinite(Number(value)))&&(!((node["~name"] === "xml")&&(key === "version"))))
    return Number(value)
  return value
}

/** XML parser options. */
export type options = {
  /** Remove elements from result. */
  clean?:{
    /** Remove attributes from result. */
    attributes?:boolean
    /** Remove comments from result. */
    comments?:boolean
    /** Remove XML doctype from result. */
    doctype?:boolean
    /** Remove XML processing instructions from result. */
    instructions?:boolean
  },
  /** Flatten result depending on node content. */
  flatten?:{
    /** If node only contains attributes values (i.e. with key starting with `@`), it'll be flattened as a regular object without `@` prefixes. */
    attributes?:boolean
    /** If node only contains a `#text` value, it'll be flattened as a string. */
    text?:boolean
    /** If node does not contains any attribute or text, it'll be flatted to `null`. */
    empty?:boolean
  },
  /** Revive result. */
  revive?:{
    /** 
     * Trim texts (this is applied before other revivals).
     * It honors `xml:space="preserve"` attribute.
     */
    trim?:boolean
    /** Revive booleans (matching `/^(?:[Tt]rue|[Ff]alse)$/`).*/
    booleans?:boolean
    /** Revive finite numbers. */
    numbers?:boolean
    /** Custom reviver. */
    custom?:(args:{name:string, key:string, value:string, node:Readonly<xml_node>}) => unknown 
  }
}

function stringify() {

}


parse(`  <?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="styles.xsl" type="text/xsl"?>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<!DOCTYPE note SYSTEM "Note.dtd">
<root>
  <child attr="value">HELLO</child>
  <child>WORLD</child>
  <!-- Comment -->
  <child-self/>
  <space xml:space="preserve">   </space>
  <a>1</a>
  <b>true</b>
  <c lang="fr"></c>
  <![CDATA[some stuff]]>
  <price currency="usd">10.5</price>
</root>
`, {clean:{instructions:true, doctype:true, attributes:false}, flatten:{text:true, attributes:true, empty:true}, revive:{
  custom({name, key, value, node}) {
    if (name === "price") {
      console.log(arguments)
    }
    if ((name === "price")&&(key === "#text")) {
      return `${value}${name}`
    }
  },
  trim:true, booleans:true, numbers:true}})

