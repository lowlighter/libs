/** Comments */
const COMMENTS = /<!--[\s\S]*?-->/g

/** XML declaration tags (<?xml ?>) */
const DECLARATION_OPEN = /^<[?]xml /
const DECLARATION_CLOSE = /^[?]>/

/** CDATA (<![CDATA[ ]]) */
const CDATA = /^<!\[CDATA\[(?<content>[\s\S]*)\]\]>/m

/** Tags (<name attr="value">content</name>) */
const TAG_OPEN = /^<(?<name>[\w-:.]+)/
const TAG_SELFCLOSE = /^(?<selfclosed>\/?)>/
const TAG_CLOSE = (name:string) => new RegExp(`^<\/\\s*${name}\\s*>`, "i")
const TAG_ATTRIBUTES = /^(?<name>[\w:-]+)\s*=\s*(?<quote>["']?)(?<value>[\s\S]+?)\k<quote>/
const TAG_CONTENT = /^(?<content>[^<]*?)(?=<)/

/** Tag name (using a symbol to avoid collision with user data) */
const $NAME = Symbol.for("name")

/** XML document */
type Document = {xml:string}

/** XML node */
type Node = {[$NAME]:string, $:unknown, [key:string]:unknown}

/** Parser */
export function parse(xml:string) {
  return format(parseXML({xml}), defaultReviver)
}

/** SHITTY : TO IMPROVE */
function format(result:{[key:string]:unknown}, reviver:(value:string) => unknown = defaultReviver) {
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === "object") {
      const keys = Object.keys(value as any)
      //console.log(keys)
      if (!keys.length) {
        result[key] = null
        continue
      }
      if ((keys.length === 1)&&(keys[0] === "$")) {
        result[key] = reviver((value as any).$)
        continue
      }
      if (keys.filter(key => key.charAt(0) !== "@").length > 1) {
        delete (value as any).$
      }
      result[key] = format(value as {[key:string]:unknown}, reviver)
    }
    else {
      result[key] = reviver(value as any)
    }
  }
  return result
}

/** Parse a XML document */
function parseXML(document:Document, {includeDeclaration = false} = {}) {
  const parsed = {} as {[key:string]:unknown}

  // Trim and remove comments
  document.xml = document.xml.trim().replace(COMMENTS, "")

  // Handle XML declaration
  if (peek(document, DECLARATION_OPEN)) {

    // Handle XML opening declaration
    consume(document, DECLARATION_OPEN)

    // Extract tag attributes
    while (peek(document, TAG_ATTRIBUTES)) {
      const {name, value} = consume(document, TAG_ATTRIBUTES)
      if ((name)&&(includeDeclaration))
        parsed[`@${name.toLocaleLowerCase()}`] = value
    }

    // Handle XML closing declaration
    consume(document, DECLARATION_CLOSE)
  }

  // Parse root node
  const {[$NAME]:name, ...properties} = parseNode(document) as Node
  parsed[name] = properties

  return parsed
}

/** Parse a single node */
function parseNode(document:Document) {

  if (!peek(document, TAG_OPEN))
    return null
  const node = {} as Node

  // Handle opening tag
  const {name} = consume(document, TAG_OPEN)
  node[$NAME] = name

  // Extract tag attributes
  while (peek(document, TAG_ATTRIBUTES)) {
    const {name, value} = consume(document, TAG_ATTRIBUTES)
    if (name)
      node[`@${name.toLocaleLowerCase()}`] = value
  }

  // Handle self-closing tag
  const {selfclosed} = consume(document, TAG_SELFCLOSE)
  if (selfclosed)
    return node

  // Extract content
  let content = ""
  while (true) {
    content += consume(document, TAG_CONTENT).content ?? ""
    if (peek(document, CDATA)) {
      content += consume(document, CDATA).content ?? ""
      continue
    }
    break
  }
  node.$ = content

  // Extract child nodes
  if (!peek(document, TAG_CLOSE(name))) {
    while (true) {
      // Extract next child node
      const child = parseNode(document)
      if (!child)
        break
      const {[$NAME]:name, ...properties} = child
      // Group children of same name in array
      if (name in node) {
        if (!Array.isArray(node[name]))
          node[name] = [node[name]]
        ;(node[name] as unknown[]).push(properties)
      }
      else
        node[name] = properties
    }
  }

  // Handle closing tag
  consume(document, TAG_CLOSE(name))

  return node
}

/** Check next token */
function peek(document:Document, regex:RegExp) {
  return regex.test(document.xml)
}

/** Consume next token and extract matching groups */
function consume(document:Document, regex:RegExp) {
  //console.log(`at: ${document.xml.split("\n")?.[0]?.substring(0, 20) ?? ""}, expect: ${regex.source}`)
  const matched = document.xml.match(regex)
  if (!matched)
    throw new Error(`Failed to parse XML, expected: ${regex.source}`)
  document.xml = document.xml.replace(regex, "").trimStart()
  return matched.groups ?? {}
}

/** Default reviver */
function defaultReviver(value:string) {
  switch (true) {
    case /^\s*$/.test(value):
      return null
    case /^(?:true|false)$/i.test(value):
      return value.toLocaleLowerCase() === "true"
    case Number.isFinite(Number(value)):
      return Number.parseFloat(value)
    default:
      return value
  }
}