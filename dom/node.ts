// Imports
import type { Nullable } from "@libs/typing"
import { type _Node, type _NodeList, illegal, Indexable, internal, unimplemented } from "./_.ts"
import type { Document } from "./document.ts"

/** https://developer.mozilla.org/en-US/docs/Web/API/Node */
export class Node extends EventTarget implements _Node {
  constructor({ ownerDocument = null, nodeName = "", nodeValue = null, parentNode = null } = {} as { [internal]?: boolean; ownerDocument?: Nullable<Document>; parentNode?: Nullable<ParentNode>; nodeName?: string; nodeValue?: Nullable<string> }) {
    super()
    illegal(arguments)
    this.#ownerDocument = ownerDocument
    this.#parentNode = parentNode
    this.#nodeName = nodeName!.toLocaleUpperCase()
    this.#nodeValue = nodeValue
  }

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/ownerDocument
  get ownerDocument(): Nullable<Document> {
    return this.#ownerDocument
  }

  set ownerDocument(_: Nullable<Document>) {
    return
  }

  #ownerDocument = null as Nullable<Document>

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected
  get isConnected(): boolean {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/baseURI
  get baseURI(): string {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName
  get nodeName(): string {
    return this.#nodeName
  }

  set nodeName(_: string) {
    return
  }

  readonly #nodeName

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue
  get nodeValue(): Nullable<string> {
    return this.#nodeValue
  }

  set nodeValue(_: Nullable<string>) {
    return
  }

  readonly #nodeValue

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
  // Note: to override in child classes
  get textContent(): Nullable<string> {
    return null
  }

  set textContent(_: Nullable<string>) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode
  get parentNode(): Nullable<ParentNode> {
    return this.#parentNode
  }

  set parentNode(_: Nullable<ParentNode>) {
    return
  }

  #parentNode

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/parentElement
  get parentElement(): Nullable<HTMLElement> {
    let node = this.parentNode
    while (node) {
      if (node instanceof Element) {
        return node as HTMLElement
      }
      node = node.parentNode
    }
    return null
  }

  set parentElement(_: Nullable<HTMLElement>) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes
  get childNodes(): NodeListOf<ChildNode> {
    return this.#childNodes
  }

  set childNodes(_: NodeListOf<ChildNode>) {
    return
  }

  readonly #childNodes = new NodeList<ChildNode>({ [internal]: true })

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/firstChild
  get firstChild(): Nullable<ChildNode> {
    return this.#childNodes.item(0)
  }

  set firstChild(_: Nullable<ChildNode>) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/lastChild
  get lastChild(): Nullable<ChildNode> {
    return this.#childNodes.item(this.#childNodes.length - 1)
  }

  set lastChild(_: Nullable<ChildNode>) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/previousSibling
  get previousSibling(): Nullable<ChildNode> {
    return this.parentElement?.childNodes[(this.parentElement!.childNodes as NodeList<ChildNode>)[internal].indexOf(this as unknown as ChildNode) - 1] ?? null
  }

  set previousSibling(_: Nullable<ChildNode>) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling
  get nextSibling(): Nullable<ChildNode> {
    return this.parentElement?.childNodes.item((this.parentElement!.childNodes as NodeList<ChildNode>)[internal].indexOf(this as unknown as ChildNode) + 1) ?? null
  }

  set nextSibling(_: Nullable<ChildNode>) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
  appendChild<T extends _Node>(child: T): T {
    let ancestor = child as unknown as Nullable<HTMLElement | Node>
    while (ancestor) {
      if (ancestor === this) {
        throw new DOMException("The new child is an ancestor of the parent.", "HierarchyRequestError")
      }
      ancestor = ancestor.parentNode as Nullable<HTMLElement | Node>
    }
    if (child.parentNode) {
      child.parentNode.removeChild(child)
    }
    ;(child as unknown as Node).#parentNode = this as unknown as ParentNode
    this.#childNodes[internal].push(child as unknown as ChildNode)

    // TODO(@lowlighter): dispatch mutation, set parent
    return child
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
  removeChild<T extends _Node>(child: T): T {
    ;(child as unknown as Node).#parentNode = null
    this.#childNodes[internal].splice(this.#childNodes[internal].indexOf(child as unknown as ChildNode), 1)
    return child
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild
  replaceChild<T extends _Node>(_newChild: _Node, _oldChild: T): T {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
  insertBefore<T extends _Node>(_newNode: T, _referenceNode: Nullable<_Node>): T {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
  cloneNode(_deep?: boolean): _Node {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/hasChildNodes
  hasChildNodes(): boolean {
    return this.#childNodes.length > 0
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
  contains(_other: Nullable<_Node>): boolean {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/isEqualNode
  isEqualNode(_other: Nullable<_Node>): boolean {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/isSameNode
  isSameNode(_other: Nullable<_Node>): boolean {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/isDefaultNamespace
  isDefaultNamespace(_namespace: string): boolean {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/lookupPrefix
  lookupPrefix(_namespace: Nullable<string>): Nullable<string> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/lookupNamespaceURI
  lookupNamespaceURI(_prefix: Nullable<string>): Nullable<string> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
  // Depends: none
  compareDocumentPosition(_other: _Node): number {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode
  // Depends: none
  getRootNode(_options?: GetRootNodeOptions): _Node {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/normalize
  // Depends: TextNode implementation
  normalize(): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  get nodeType(): number {
    return NaN
  }

  set nodeType(_: number) {
    return
  }

  /** Internal acessor. */
  get [internal](): { parent: (parent: Node["parentNode"]) => void } {
    return {
      parent: (parent: Node["parentNode"]) => this.#parentNode = parent,
    }
  }

  // Enum ========================================================================================

  get ELEMENT_NODE(): 1 {
    return Node.ELEMENT_NODE
  }

  set ELEMENT_NODE(_: 1) {
    return
  }

  static get ELEMENT_NODE(): 1 {
    return 1
  }

  static set ELEMENT_NODE(_: 1) {
    return
  }

  get ATTRIBUTE_NODE(): 2 {
    return Node.ATTRIBUTE_NODE
  }

  set ATTRIBUTE_NODE(_: 2) {
    return
  }

  static get ATTRIBUTE_NODE(): 2 {
    return 2
  }

  static set ATTRIBUTE_NODE(_: 2) {
    return
  }

  get TEXT_NODE(): 3 {
    return Node.TEXT_NODE
  }

  set TEXT_NODE(_: 3) {
    return
  }

  static get TEXT_NODE(): 3 {
    return 3
  }

  static set TEXT_NODE(_: 3) {
    return
  }

  get CDATA_SECTION_NODE(): 4 {
    return Node.CDATA_SECTION_NODE
  }

  set CDATA_SECTION_NODE(_: 4) {
    return
  }

  static get CDATA_SECTION_NODE(): 4 {
    return 4
  }

  static set CDATA_SECTION_NODE(_: 4) {
    return
  }

  get ENTITY_REFERENCE_NODE(): 5 {
    return Node.ENTITY_REFERENCE_NODE
  }

  set ENTITY_REFERENCE_NODE(_: 5) {
    return
  }

  static get ENTITY_REFERENCE_NODE(): 5 {
    return 5
  }

  static set ENTITY_REFERENCE_NODE(_: 5) {
    return
  }

  get ENTITY_NODE(): 6 {
    return Node.ENTITY_NODE
  }

  set ENTITY_NODE(_: 6) {
    return
  }

  static get ENTITY_NODE(): 6 {
    return 6
  }

  static set ENTITY_NODE(_: 6) {
    return
  }

  get PROCESSING_INSTRUCTION_NODE(): 7 {
    return Node.PROCESSING_INSTRUCTION_NODE
  }

  set PROCESSING_INSTRUCTION_NODE(_: 7) {
    return
  }

  static get PROCESSING_INSTRUCTION_NODE(): 7 {
    return 7
  }

  static set PROCESSING_INSTRUCTION_NODE(_: 7) {
    return
  }

  get COMMENT_NODE(): 8 {
    return Node.COMMENT_NODE
  }

  set COMMENT_NODE(_: 8) {
    return
  }

  static get COMMENT_NODE(): 8 {
    return 8
  }

  static set COMMENT_NODE(_: 8) {
    return
  }

  get DOCUMENT_NODE(): 9 {
    return Node.DOCUMENT_NODE
  }

  set DOCUMENT_NODE(_: 9) {
    return
  }

  static get DOCUMENT_NODE(): 9 {
    return 9
  }

  static set DOCUMENT_NODE(_: 9) {
    return
  }

  get DOCUMENT_TYPE_NODE(): 10 {
    return Node.DOCUMENT_TYPE_NODE
  }

  set DOCUMENT_TYPE_NODE(_: 10) {
    return
  }

  static get DOCUMENT_TYPE_NODE(): 10 {
    return 10
  }

  static set DOCUMENT_TYPE_NODE(_: 10) {
    return
  }

  get DOCUMENT_FRAGMENT_NODE(): 11 {
    return Node.DOCUMENT_FRAGMENT_NODE
  }

  set DOCUMENT_FRAGMENT_NODE(_: 11) {
    return
  }

  static get DOCUMENT_FRAGMENT_NODE(): 11 {
    return 11
  }

  static set DOCUMENT_FRAGMENT_NODE(_: 11) {
    return
  }

  get NOTATION_NODE(): 12 {
    return Node.NOTATION_NODE
  }

  set NOTATION_NODE(_: 12) {
    return
  }

  static get NOTATION_NODE(): 12 {
    return 12
  }

  static set NOTATION_NODE(_: 12) {
    return
  }

  get DOCUMENT_POSITION_DISCONNECTED(): 1 {
    return Node.DOCUMENT_POSITION_DISCONNECTED
  }

  set DOCUMENT_POSITION_DISCONNECTED(_: 1) {
    return
  }

  static get DOCUMENT_POSITION_DISCONNECTED(): 1 {
    return 1
  }

  static set DOCUMENT_POSITION_DISCONNECTED(_: 1) {
    return
  }

  get DOCUMENT_POSITION_PRECEDING(): 2 {
    return Node.DOCUMENT_POSITION_PRECEDING
  }

  set DOCUMENT_POSITION_PRECEDING(_: 2) {
    return
  }

  static get DOCUMENT_POSITION_PRECEDING(): 2 {
    return 2
  }

  static set DOCUMENT_POSITION_PRECEDING(_: 2) {
    return
  }

  get DOCUMENT_POSITION_FOLLOWING(): 4 {
    return Node.DOCUMENT_POSITION_FOLLOWING
  }

  set DOCUMENT_POSITION_FOLLOWING(_: 4) {
    return
  }

  static get DOCUMENT_POSITION_FOLLOWING(): 4 {
    return 4
  }

  static set DOCUMENT_POSITION_FOLLOWING(_: 4) {
    return
  }

  get DOCUMENT_POSITION_CONTAINS(): 8 {
    return Node.DOCUMENT_POSITION_CONTAINS
  }

  set DOCUMENT_POSITION_CONTAINS(_: 8) {
    return
  }

  static get DOCUMENT_POSITION_CONTAINS(): 8 {
    return 8
  }

  static set DOCUMENT_POSITION_CONTAINS(_: 8) {
    return
  }

  get DOCUMENT_POSITION_CONTAINED_BY(): 16 {
    return Node.DOCUMENT_POSITION_CONTAINED_BY
  }

  set DOCUMENT_POSITION_CONTAINED_BY(_: 16) {
    return
  }

  static get DOCUMENT_POSITION_CONTAINED_BY(): 16 {
    return 16
  }

  static set DOCUMENT_POSITION_CONTAINED_BY(_: 16) {
    return
  }

  get DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC(): 32 {
    return Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
  }

  set DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC(_: 32) {
    return
  }

  static get DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC(): 32 {
    return 32
  }

  static set DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC(_: 32) {
    return
  }
}

/** https://developer.mozilla.org/en-US/docs/Web/API/NodeList */
export class NodeList<T extends _Node> extends Indexable<T> implements _NodeList, NodeListOf<T> {
  // https://developer.mozilla.org/en-US/docs/Web/API/NodeList/item
  item(index: number): T {
    return this[index] ?? null
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
  // deno-lint-ignore no-explicit-any
  override forEach(callbackfn: (value: T, index: number, array: this) => void, thisArg?: any): void {
    // deno-lint-ignore no-explicit-any
    return super.forEach(callbackfn as any, thisArg)
  }
}
