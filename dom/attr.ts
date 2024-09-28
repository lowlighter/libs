// Imports
import type { Nullable } from "@libs/typing"
import type { _Attr, internal } from "./_.ts"
import { Node } from "./node.ts"
import type { Document } from "./document.ts"
import type { Element } from "./element.ts"

/** https://developer.mozilla.org/en-US/docs/Web/API/Attr */
export class Attr extends Node implements _Attr {
  constructor(
    { ownerElement = null, namespaceURI = null, prefix = null, localName = "", value = "" } = {} as {
      [internal]?: boolean
      ownerDocument?: Nullable<Document>
      ownerElement?: Nullable<Element>
      namespaceURI?: Nullable<string>
      prefix?: Nullable<string>
      localName?: string
      value?: string
    },
  ) {
    super(...arguments)
    this.#ownerElement = ownerElement
    this.#namespaceURI = namespaceURI
    this.#prefix = prefix?.toLocaleLowerCase() ?? null
    this.#localName = localName!.toLocaleLowerCase()
    this.#value = value
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Attr/ownerElement
  override get ownerDocument(): Document {
    return super.ownerDocument!
  }

  override set ownerDocument(_: Document) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Attr/ownerElement
  get ownerElement(): Nullable<Element> {
    return this.#ownerElement
  }

  set ownerElement(_: Nullable<Element>) {
    return
  }

  #ownerElement

  // https://developer.mozilla.org/en-US/docs/Web/API/Attr/name
  get name(): string {
    return `${this.prefix ? `${this.prefix}:` : ""}${this.localName}`
  }

  set name(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Attr/value
  // Note: string-only
  get value(): string {
    return this.#value
  }

  set value(value: string) {
    this.#value = `${value}`
  }

  #value

  // https://developer.mozilla.org/en-US/docs/Web/API/Attr/prefix
  //Note: hardcoded to null in HTML namespace
  get prefix(): Nullable<string> {
    return this.#prefix
  }

  set prefix(_: Nullable<string>) {
    return
  }

  #prefix

  // https://developer.mozilla.org/en-US/docs/Web/API/Attr/localName
  get localName(): string {
    return this.#localName
  }

  set localName(_: string) {
    return
  }

  #localName

  // https://developer.mozilla.org/en-US/docs/Web/API/Attr/namespaceURI
  get namespaceURI(): Nullable<string> {
    return this.#namespaceURI
  }

  set namespaceURI(_: Nullable<string>) {
    return
  }

  #namespaceURI

  // https://developer.mozilla.org/en-US/docs/Web/API/Attr/specified
  // Note: hardcoded
  get specified(): boolean {
    return true
  }

  set specified(_: boolean) {
    return
  }
}
