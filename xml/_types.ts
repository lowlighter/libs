/** Nullable type. */
export type Nullable<T> = T | null

/** XML text node. */
export type xml_text = {
  /** Parent node. */
  readonly ["~parent"]: xml_node
  /** Tag name (`~text` for text nodes, `~cdata` for CDATA nodes and `~comment` for comment nodes). */
  readonly ["~name"]: string
  /** Text content. */
  ["#text"]: string
}

/** XML node. */
export type xml_node = {
  /** Tag name (`~xml` for XML prolog, other nodes will be given their respective tag name). */
  readonly ["~name"]: string
  /** Child nodes. */
  readonly ["~children"]: Array<xml_node | xml_text>
  /** Comments. */
  readonly ["#comments"]?: Array<string>
  /** Text content. */
  readonly ["#text"]: string
  // Signature
  [key: string]: unknown
}

/** XML document. */
export type xml_document = xml_node & {
  /** XML version. */
  ["@version"]?: `1.${number}`
  /** XML character encoding. */
  ["@encoding"]?: string
  /** XML standalone. */
  ["@standalone"]?: "yes" | "no"
  /** XML doctype. */
  ["#doctype"]?: xml_node
  /** XML instructions. */
  ["#instructions"]?: { [key: string]: xml_node | Array<xml_node> }
}

/** Synchronous reader. */
export type ReaderSync = {
  /** Read synchronously some data into a buffer and returns the number of bytes read. */
  readSync(buffer: Uint8Array): Nullable<number>
}

/** A laxer type for what can be stringified. We won’t ever create this, but we’ll accept it. */
export type stringifyable = Partial<Omit<xml_document, "@version" | "@standalone"> & { "@version": string; "@standalone": string }>
