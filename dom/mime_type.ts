// Imports
import type { Nullable } from "@libs/typing"
import { type _MimeType, type _MimeTypeArray, illegal, Indexable, internal, unimplemented } from "./_.ts"

/** https://developer.mozilla.org/en-US/docs/Web/API/MimeTypeArray */
export class MimeTypeArray extends Indexable<MimeType> implements _MimeTypeArray {
  // https://developer.mozilla.org/en-US/docs/Web/API/MimeTypeArray/item
  item(index: number): Nullable<MimeType> {
    return this[index] ?? null
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/MimeTypeArray/namedItem
  namedItem(name: string): Nullable<MimeType> {
    return this[internal].find((mimeType) => mimeType.type === name) ?? null
  }
}

/** https://developer.mozilla.org/en-US/docs/Web/API/MimeType */
export class MimeType implements _MimeType {
  constructor({ type, description, suffixes } = {} as { [internal]?: boolean; type?: string; description?: string; suffixes?: string }) {
    illegal(arguments)
    this.#type = type!
    this.#description = description!
    this.#suffixes = suffixes!
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/MimeType/type
  get type(): string {
    return this.#type
  }

  set type(_: string) {
    return
  }

  readonly #type

  // https://developer.mozilla.org/en-US/docs/Web/API/MimeType/description
  get description(): string {
    return this.#description
  }

  set description(_: string) {
    return
  }

  readonly #description

  // https://developer.mozilla.org/en-US/docs/Web/API/MimeType/suffixes
  get suffixes(): string {
    return this.#suffixes
  }

  set suffixes(_: string) {
    return
  }

  readonly #suffixes

  // https://developer.mozilla.org/en-US/docs/Web/API/MimeType/enabledPlugin
  // Depends: Plugin implementation
  get enabledPlugin(): Plugin {
    return unimplemented.getter<"immutable">()
  }
}
