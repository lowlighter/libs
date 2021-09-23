/** XML document */
type Document = {
  string: string;
};

/** XML node */
type Node = {
  $tag: string;
  $doctype?: { [key: string]: unknown };
  $: string;
  [key: string]: unknown;
};

/** XML entities */
const ENTITIES = {
  "&": "&amp;", //Keep first
  '"': "&quot;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&apos;",
};

/** Stringifier options */
type StringifierOptions = {
  includeDeclaration?: boolean;
  includeDoctype?: boolean;
  indentSize?: number;
  nullToEmpty?: boolean;
  replacer?: (key: string, value: string, tag: string) => unknown;
};

/** Stringifier */
export function stringify(xml: Record<PropertyKey, unknown>, options: StringifierOptions = {}) {
  return stringifyXML({ string: "" }, xml as Node, options) as string;
}

/** XML node strigifier */
export function stringifyXML(
  document: Document,
  node: Node,
  {
    indentSize = 2,
    includeDeclaration = false,
    includeDoctype = false,
    nullToEmpty = true,
  }: StringifierOptions,
  { tag = "", depth = -2 } = {},
) {
  // Initialization
  const { attributes = [], children = [], content = null } = extract(node);
  const selfclosed = (!children.length) && (content === null);
  const isArray = Array.isArray(node);
  const indent = " ".repeat(Math.max(0, depth) * indentSize);

  // Handle XML prolog declaration (if enabled)
  if (includeDeclaration) {
    document.string += `${indent}<?xml${
      stringifyAttributes(node, attributes)
    }?>`;
    attributes.splice(0);
  }

  // Handle Doctype declaration (if enabled)
  if ((includeDoctype) && (node.$doctype)) {
    const { attributes = [], children: elements = [] } = extract(
      node.$doctype as Node,
    );
    document.string += `${includeDeclaration ? "\n" : ""}<!DOCTYPE ${
      attributes.map((name) => quoteIfNeeded(`${name.substring(1)}`)).join(" ")
    }`;
    if (elements.length) {
      const indent2 = indent + " ".repeat(indentSize);
      document.string += `\n${indent2}[\n${
        elements.map((name) =>
          `${indent2 + " ".repeat(indentSize)}<!ELEMENT ${name} ${node.$doctype
            ?.[name]}>`
        ).join("\n")
      }\n${indent2}]\n`;
    }
    document.string += ">";
  }

  // Handle tag opening (except for grouped nodes)
  if ((!isArray) && (tag)) {
    document.string += `${indent}<${tag}${
      stringifyAttributes(node, attributes)
    }${selfclosed ? "/" : ""}>`;
  }

  // Handle content-less nodes as self-closed
  if (selfclosed) {
    return;
  }

  // Handle text nodes
  if (content) {
    const lines = replace(content, { nullToEmpty }).split("\n") as string[];
    if (lines.length > 1) {
      document.string += `\n${
        lines.map((line) => `${indent}${line}`).join("\n")
      }\n`;
    } else {
      document.string += `${lines.shift()}</${tag}>\n`;
      return;
    }
  } // Handle grouped nodes
  else if (isArray) {
    for (const childNode of node as unknown as Node[]) {
      stringifyXML(document, childNode, { indentSize }, {
        tag,
        depth: depth + 1,
      });
    }
  } // Handle general nodes
  else {
    document.string += "\n";
    for (const child of children) {
      stringifyXML(document, node[child] as Node, { indentSize }, {
        tag: child,
        depth: depth + 1,
      });
    }
  }

  // Handle tag closing (except for grouped nodes)
  if ((!isArray) && (tag)) {
    document.string += `${indent}</${tag}>\n`;
  }

  return document.string;
}

/** Stringify attributes of a tag */
function stringifyAttributes(node: Node, attributes: string[]) {
  return [
    "",
    ...attributes.map((name) =>
      `${name.substring(1)}="${`${node[name]}`.replace(/"/g, ENTITIES['"'])}"`
    ),
  ].join(" ");
}

/** Quote text if needed */
function quoteIfNeeded(text: string) {
  if (/^[\w_]+$/i.test(text)) {
    return text;
  }
  return `"${text.replace(/"/g, ENTITIES['"'])}"`;
}

/** Extract content (text), attributes and children nodes */
function extract(node: Node | null) {
  switch (typeof node) {
    case "object": {
      const keys = Object.keys(node ?? {});
      return {
        content: node?.$ ?? null,
        attributes: keys.filter((key) => key.charAt(0) === "@"),
        children: keys.filter((key) => !/^[$@]/.test(key)),
      };
    }
    default:
      return { content: `${node}` };
  }
}

/** Default replacer */
function replace(
  value: string,
  { nullToEmpty = true }: StringifierOptions,
) {
  switch (true) {
    // Convert empty values to null
    case nullToEmpty && (value === null):
      return "";
    // Escape XML entities
    default:
      for (const entity in ENTITIES) {
        value = `${value}`.replaceAll(
          entity,
          ENTITIES[entity as keyof typeof ENTITIES],
        );
      }
      return value;
  }
}
