// Imports
import type { Promisable } from "@libs/typing"
import { type _Clipboard, type _ClipboardEvent, type _ClipboardItem, illegal, type internal, unimplemented } from "./_.ts"
import type { Navigator } from "./navigator.ts"

/** https://developer.mozilla.org/en-US/docs/Web/API/Clipboard */
export class Clipboard extends EventTarget implements _Clipboard {
  constructor({ navigator } = {} as { [internal]?: boolean; navigator?: Navigator }) {
    super()
    illegal(arguments)
    this.#navigator = navigator!
  }

  /** {@link Navigator} */
  readonly #navigator: Navigator

  /** {@link ClipboardItem} */
  readonly #items = [] as ClipboardItem[]

  // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/read
  async read(): Promise<ClipboardItem[]> {
    const permission = await this.#navigator.permissions.query({ name: "clipboard-read" as PermissionName })
    if (permission.state !== "granted") {
      throw new DOMException(`Clipboard read operation is not allowed.`, "NotAllowedError")
    }
    return this.#items.slice()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write
  async write(items: ClipboardItem[]): Promise<void> {
    const permission = await this.#navigator.permissions.query({ name: "clipboard-write" as PermissionName })
    if (permission.state !== "granted") {
      throw new DOMException(`Clipboard write operation is not allowed.`, "NotAllowedError")
    }
    this.#items.length = 0
    this.#items.push(...items)
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText
  async readText(): Promise<string> {
    let text = ""
    for (const item of await this.read()) {
      if (item.types.includes("text/plain")) {
        text += await item.getType("text/plain").then((blob) => blob.text())
      }
    }
    return text
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
  async writeText(text: string): Promise<void> {
    await this.write([new ClipboardItem({ "text/plain": text })])
  }
}

/** {@link ClipboardItem}.presentationStyle allowed values. */
type ClipboardItemPresentationStyle = "unspecified" | "inline" | "attachment"

/** https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem */
export class ClipboardItem implements _ClipboardItem {
  constructor(data: { [mime: string]: Promisable<Blob | string> }, options?: { presentationStyle?: ClipboardItemPresentationStyle }) {
    if (!Object.keys(data).length) {
      throw new TypeError("At least one entry required")
    }
    this.#data = data
    this.#types = Object.keys(data)
    this.#presentationStyle = options?.presentationStyle ?? "unspecified"
  }

  readonly #data

  // https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem/types
  get types(): string[] {
    return this.#types
  }

  set types(_: string[]) {
    return
  }

  readonly #types

  // https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem/getType
  async getType(type: string): Promise<Blob> {
    if (!this.#data[type]) {
      throw new DOMException(`The type '${type}' was not found`, "NotFoundError")
    }
    const data = await this.#data[type]
    return (typeof data === "string") ? new Blob([data], { type }) : data
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem/presentationStyle
  get presentationStyle(): ClipboardItemPresentationStyle {
    return this.#presentationStyle
  }

  set presentationStyle(_: ClipboardItemPresentationStyle) {
    return
  }

  readonly #presentationStyle

  // https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem/supports_static
  // Note: plain text, HTML and PNG files are mandatory
  // SVG and custom types support is optional
  static supports(type: string): boolean {
    return ["text/plain", "text/html", "image/png"].includes(type)
  }
}

/** https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent */
export class ClipboardEvent extends Event implements _ClipboardEvent {
  // https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData
  // Depends: DataTransfer implementation
  get clipboardData(): DataTransfer {
    return unimplemented.getter<"immutable">()
  }
}
