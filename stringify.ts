/** XML document */
type Document = {
  string:string
};

/** XML entities */
const ENTITIES = {
  '"':"&quot;"
};

/** Stringifier options */
type StringifierOptions = {
  includeDeclaration?: boolean;
  includeDoctype?: boolean;
  indentSize?: number
  replacer?: (key: string, value: string, tag: string) => unknown;
};

/** Stringifier */
export function stringify(xml:any, options:StringifierOptions = {}) {
  return stringifyXML({string:""}, xml, options) as string
}

/** XML node strigifier */
export function stringifyXML(document:Document, node:any, {replacer, indentSize = 2, includeDeclaration = false, includeDoctype = false}:StringifierOptions, {tag = "", depth = -2} = {}) {
  // Initialization
  const {attributes = [], children = [], content = null} = extract(node)
  const selfclosed = (!children.length)&&(content === null)
  const isArray = Array.isArray(node)
  const indent = " ".repeat(Math.max(0, depth)*indentSize)

  // Handle XML prolog declaration (if enabled)
  if (includeDeclaration) {
    document.string += `${indent}<?xml${stringifyAttributes(node, attributes)}?>`
    attributes.splice(0)
  }

  // Handle Doctype declaration (if enabled)
  if (includeDoctype) {
    const {attributes = [], children:elements = []} = extract(node.$doctype)
    document.string += `${includeDeclaration ? "\n" : ""}<!DOCTYPE ${attributes.map(name => quoteIfNeeded(`${name.substring(1)}`)).join(" ")}`
    if (elements.length) {
      const indent2 = indent+" ".repeat(indentSize)
      document.string += `\n${indent2}[\n${elements.map(name => `${indent2+" ".repeat(indentSize)}<!ELEMENT ${name} ${node.$doctype[name]}>`).join("\n")}\n${indent2}]\n`
    }
    document.string += ">"
  }

  // Handle tag opening (except for grouped nodes)
  if ((!isArray)&&(tag))
    document.string += `${indent}<${tag}${stringifyAttributes(node, attributes)}${selfclosed ? "/" : ""}>`

  // Handle content-less nodes as self-closed
  if (selfclosed)
    return

  // Handle text nodes
  if (content) {
    const lines = content.split("\n") as string[]
    if (lines.length > 1)
      document.string += `\n${lines.map(line => `${indent}${line}`).join("\n")}\n`
    else {
      document.string += `${lines.shift()}</${tag}>\n`
      return
    }
  }

  // Handle grouped nodes
  else if (isArray) {
    for (const childNode of node)
      stringifyXML(document, childNode, {indentSize}, {tag, depth:depth+1})
  }

  // Handle general nodes
  else {
    document.string += "\n"
    for (const child of children)
      stringifyXML(document, node[child], {indentSize}, {tag:child, depth:depth+1})
  }

  // Handle tag closing (except for grouped nodes)
  if ((!isArray)&&(tag))
    document.string += `${indent}</${tag}>\n`

  return document.string
}

/** Stringify attributes of a tag */
function stringifyAttributes(node:any, attributes:string[]) {
  return ["", ...attributes.map(name => `${name.substring(1)}="${`${node[name]}`.replace(/"/g, ENTITIES['"'])}"`)].join(" ")
}

/** Quote text if needed */
function quoteIfNeeded(text:string) {
  if (/^[\w_]+$/i.test(text))
    return text
  return `"${text.replace(/"/g, ENTITIES['"'])}"`
}

/** Extract content (text), attributes and children nodes */
function extract(node:any) {
  switch (typeof node) {
    case "object":
      const keys = Object.keys(node ?? {})
      return {
        content:node?.$ ?? null,
        attributes:keys.filter(key => key.charAt(0) === "@"),
        children:keys.filter(key => !/^[$@]/.test(key))
      }
    default:
      return {content:`${node}`}
  }
}
