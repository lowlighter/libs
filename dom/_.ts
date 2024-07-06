/// <reference lib="dom" />
// Imports
import type { record } from "@libs/typing"

/** Implementation version */
export const version = "0.0"

/** Pass as argument to allow instantiation of illegal constructors. */
export const construct: unique symbol = Symbol.for("@@constructor")

/** Throws if {@link construct} symbol is not present in arguments. */
export function illegalConstructor(args: IArguments): void {
  if (!Array.from(args).includes(construct)) {
    throw new TypeError("Illegal constructor")
  }
}

/** Throws a "NotSupportedError" DOMException when something is not implemented. */
export const unimplemented = Object.assign(function (): never {
  throw new DOMException("While this feature is supposed to be supported, it has not been implemented yet in @libs/dom", "NotSupportedError")
}, {
  getter<T>() {
    return unimplemented()
  },
})

/** Indexable is an array-like class that makes the object indexable without implementing Array.prototype. */
export class Indexable<T> extends Array<T> implements ArrayLike<T> {
  // deno-lint-ignore no-explicit-any
  constructor(..._: any[]) {
    super()
    if (!Array.from(arguments).includes(construct)) {
      throw new TypeError("Illegal constructor")
    }
  }

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get [construct](): Pick<Array<T>, "push" | "pop" | "find" | "shift" | "unshift" | "splice" | "indexOf" | "forEach" | "map" | "filter"> {
    return {
      push: super.push.bind(this),
      pop: super.pop.bind(this),
      find: super.find.bind(this),
      shift: super.shift.bind(this),
      unshift: super.unshift.bind(this),
      splice: super.splice.bind(this),
      indexOf: super.indexOf.bind(this),
      forEach: super.forEach.bind(this),
      map: super.map.bind(this),
      filter: super.filter.bind(this),
    }
  }
}
new Set(Object.getOwnPropertyNames(Array)).difference(
  new Set([
    "prototype",
    "name",
    "length",
  ]),
).forEach((property) => (Indexable as unknown as record)[property] = undefined)
new Set(Object.getOwnPropertyNames(Array.prototype)).difference(
  new Set([
    "constructor",
    "item",
    "keys",
    "values",
    "entries",
    "forEach",
    "length",
    "toString",
  ]),
).forEach((property) => (Indexable.prototype as unknown as record)[property] = undefined)

// DOM re-exports

export type _Permissions = Permissions
export type _PermissionsStatus = PermissionStatus
export type _UserActivation = UserActivation
export type _Navigator = Navigator
export type _MimeTypeArray = MimeTypeArray
export type _MimeType = MimeType
export type _Clipboard = Clipboard
export type _ClipboardItem = ClipboardItem
export type _ClipboardEvent = ClipboardEvent

export type _Node = Node
export type _NodeList = NodeList
export type _NodeListOf<T extends _Node> = NodeListOf<T>
export type _Document = Document
export type _DocumentFragment = DocumentFragment
export type _Element = Element
export type _Window = Window
export type _BarProp = BarProp
