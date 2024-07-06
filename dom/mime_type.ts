// Imports
import type { Nullable } from "@libs/typing"
import { type _MimeType, type _MimeTypeArray, construct, illegalConstructor, Indexable, unimplemented } from "./_.ts"

/** https://developer.mozilla.org/en-US/docs/Web/API/MimeTypeArray */
export class MimeTypeArray extends Indexable<MimeType> implements _MimeTypeArray {
  item(index: number): Nullable<MimeType> {
    return this[index] ?? null
  }

  namedItem(name: string): Nullable<MimeType> {
    return (this[construct as keyof typeof this] as MimeType[]).find((mimeType) => mimeType.type === name) ?? null
  }
}

/** https://developer.mozilla.org/en-US/docs/Web/API/MimeType */
export class MimeType implements _MimeType {
  constructor(_?: typeof construct, type?: string) {
    illegalConstructor(arguments)
    this.#type = type!
  }

  readonly #type

  get type(): string {
    return this.#type
  }

  set type(_: string) {
    return
  }

  get description(): string {
    return ""
  }

  set description(_: string) {
    return
  }

  get suffixes(): string {
    return ""
  }

  set suffixes(_: string) {
    return
  }

  get enabledPlugin(): Plugin {
    return unimplemented.getter<"immutable">()
  }
}
