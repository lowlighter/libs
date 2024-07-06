// Imports
import type { Promisable } from "@libs/typing"
import { type _Clipboard, type _ClipboardEvent, type _ClipboardItem, type construct, illegalConstructor, unimplemented } from "./_.ts"
import type { Navigator } from "./navigator.ts"

/** https://developer.mozilla.org/en-US/docs/Web/API/Clipboard */
export class Clipboard extends EventTarget implements _Clipboard {
  constructor(_?: typeof construct, navigator?: Navigator) {
    super()
    illegalConstructor(arguments)
    this.#navigator = navigator!
  }

  readonly #navigator: Navigator

  readonly #items = [] as ClipboardItem[]

  async read(): Promise<ClipboardItem[]> {
    const permission = await this.#navigator.permissions.query({ name: "clipboard-read" as PermissionName })
    if (permission.state !== "granted") {
      throw new DOMException(`Clipboard read operation is not allowed.`, "NotAllowedError")
    }
    return this.#items.slice()
  }

  async readText(): Promise<string> {
    let text = ""
    for (const item of await this.read()) {
      if (item.types.includes("text/plain")) {
        text += await item.getType("text/plain").then((blob) => blob.text())
      }
    }
    return text
  }

  async write(items: ClipboardItem[]): Promise<void> {
    const permission = await this.#navigator.permissions.query({ name: "clipboard-write" as PermissionName })
    if (permission.state !== "granted") {
      throw new DOMException(`Clipboard write operation is not allowed.`, "NotAllowedError")
    }
    this.#items.length = 0
    this.#items.push(...items)
  }

  async writeText(text: string): Promise<void> {
    await this.write([new ClipboardItem({ "text/plain": text })])
  }
}

type ClipboardItemPresentationStyle = "unspecified" | "inline" | "attachment"

/** https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem */
export class ClipboardItem implements _ClipboardItem {
  constructor(data: { [mime: string]: Promisable<Blob | string> }, options?: { presentationStyle?: ClipboardItemPresentationStyle }) {
    if (!Object.keys(data).length) {
      throw new TypeError("At least one entry required")
    }
    this.#data = data
    this.#presentationStyle = options?.presentationStyle ?? "unspecified"
  }

  readonly #data

  get types(): string[] {
    return Object.keys(this.#data)
  }

  set types(_: string[]) {
    return
  }

  async getType(type: string): Promise<Blob> {
    if (!this.#data[type]) {
      throw new DOMException(`The type '${type}' was not found`, "NotFoundError")
    }
    const data = await this.#data[type]
    return (typeof data === "string") ? new Blob([data], { type }) : data
  }

  readonly #presentationStyle = "unspecified" as ClipboardItemPresentationStyle

  get presentationStyle(): ClipboardItemPresentationStyle {
    return this.#presentationStyle
  }

  set presentationStyle(_: ClipboardItemPresentationStyle) {
    return
  }

  static supports(type: string): boolean {
    return ["text/plain", "text/html", "image/png"].includes(type)
  }
}

/** https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent */
export class ClipboardEvent extends Event implements _ClipboardEvent {
  get clipboardData(): DataTransfer {
    return unimplemented()
  }

  set clipboardData(_: DataTransfer) {
    return
  }
}
