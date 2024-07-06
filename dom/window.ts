// Imports
import type { callback, Nullable, Optional } from "@libs/typing"
import { type _BarProp, type _Window, construct, illegalConstructor, unimplemented } from "./_.ts"
import { Navigator } from "./navigator.ts"

/** https://developer.mozilla.org/en-US/docs/Web/API/Window */
export class Window extends EventTarget implements _Window {
  // Client =============================================================================================================

  readonly #navigator = new Navigator(construct)

  get navigator(): Navigator {
    return this.#navigator
  }

  set navigator(_: Navigator) {
    return
  }

  get clientInformation(): Navigator {
    return this.navigator
  }

  set clientInformation(_: Navigator) {
    return
  }

  readonly locationbar = new BarProp(construct)

  readonly menubar = new BarProp(construct)

  readonly personalbar = new BarProp(construct)

  readonly scrollbars = new BarProp(construct)

  readonly statusbar = new BarProp(construct)

  readonly toolbar = new BarProp(construct)

  onlanguagechange = null as _Window["onlanguagechange"] // unimplemented

  // Document ============================================================================================================

  #name = ""

  set name(name: string) {
    this.#name = `${name}`
  }

  get name(): string {
    return this.#name
  }

  get document(): Document {
    return unimplemented.getter<"immutable">()
  }

  get frameElement(): Nullable<Element> {
    return null
  }

  set frameElement(_: Nullable<Element>) {
    return
  }

  get window(): WindowProxy & typeof globalThis {
    return this as unknown as WindowProxy & typeof globalThis
  }

  set window(_: WindowProxy & typeof globalThis) {
    return
  }

  readonly self = this.window

  readonly frames = this.window

  readonly opener = null as Nullable<WindowProxy>

  readonly length = 0

  get top(): WindowProxy {
    return this as unknown as WindowProxy
  }

  set top(_: WindowProxy) {
    return
  }

  get parent(): WindowProxy {
    return this as unknown as WindowProxy
  }

  set parent(_: WindowProxy) {
    return
  }

  get customElements(): CustomElementRegistry {
    return unimplemented.getter<"immutable">()
  }

  // Focus ==============================================================================================================

  focus(): void {
    return
  }

  blur(): void {
    return
  }

  onfocus = null as _Window["onfocus"] // unimplemented
  onblur = null as _Window["onblur"] // unimplemented

  // Sizing ==============================================================================================================

  readonly innerHeight = 0

  readonly innerWidth = 0

  readonly outerHeight = 0

  readonly outerWidth = 0

  get mozInnerScreenX(): number {
    return 0
  }

  set mozInnerScreenX(_: number) {
    return
  }

  get mozInnerScreenY(): number {
    return 0
  }

  set mozInnerScreenY(_: number) {
    return
  }

  resizeBy(_dx: number, _dy: number): void {
    if (arguments.length < 2) {
      throw new TypeError(`At least 2 arguments required, but only ${arguments.length} passed`)
    }
    return
  }

  resizeTo(_x: number, _y: number): void {
    if (arguments.length < 2) {
      throw new TypeError(`At least 2 arguments required, but only ${arguments.length} passed`)
    }
    return
  }

  setRezizable() {
    return
  }

  onresize = null as _Window["onresize"] // unimplemented

  // Positioning ========================================================================================================

  get screen(): Screen {
    return unimplemented.getter()
  }

  readonly screenX = 0

  readonly screenY = 0

  readonly screenTop = 0

  readonly screenLeft = 0

  moveBy(_dx: number, _dy: number): void {
    if (arguments.length < 2) {
      throw new TypeError(`At least 2 arguments required, but only ${arguments.length} passed`)
    }
    return
  }

  moveTo(_x: number, _y: number): void {
    if (arguments.length < 2) {
      throw new TypeError(`At least 2 arguments required, but only ${arguments.length} passed`)
    }
    return
  }

  // Scrolling ==========================================================================================================

  readonly scrollX = 0

  readonly scrollY = 0

  readonly pageXOffset = 0

  readonly pageYOffset = 0

  readonly scrollMaxX = 0

  readonly scrollMaxY = 0

  scroll(_options: ScrollToOptions): void
  scroll(_x: number, _y: number): void
  scroll(_xOrOptions: number | ScrollToOptions, _y?: number): void {
    return unimplemented()
  }

  scrollTo(_options: ScrollToOptions): void
  scrollTo(_x: number, _y: number): void
  scrollTo(_xOrOptions: number | ScrollToOptions, _y?: number): void {
    return unimplemented()
  }

  scrollBy(_options: ScrollToOptions): void
  scrollBy(_x: number, _y: number): void
  scrollBy(_xOrOptions: number | ScrollToOptions, _y?: number): void {
    return unimplemented()
  }

  scrollByLines(_lines: number): void {
    return unimplemented()
  }

  scrollByPages(_pages: number): void {
    return unimplemented()
  }

  onscroll = null as _Window["onscroll"] // unimplemented
  onscrollend = null as _Window["onscrollend"] // unimplemented

  // Orientation ========================================================================================================

  get orientation(): number {
    return 0
  }

  set orientation(_: number) {
    return
  }

  ondevicemotion = null as _Window["ondevicemotion"] // unimplemented
  ondeviceorientation = null as _Window["ondeviceorientation"] // unimplemented
  onorientationchange = null as _Window["onorientationchange"] // unimplemented
  ondeviceorientationabsolute = null as _Window["ondeviceorientationabsolute"] // unimplemented

  // Scheduling =========================================================================================================

  #timeouts = new Set<number>()

  setTimeout(handler: TimerHandler, timeout?: number, ...args: unknown[]): number {
    const id = setTimeout(() => {
      const func = typeof handler === "string" ? new Function(handler) : handler
      this.#timeouts.delete(id)
      func(...args)
    }, timeout)
    this.#timeouts.add(id)
    return id
  }

  clearTimeout(id?: number): void {
    if (id) {
      this.#timeouts.delete(id)
    }
    return clearTimeout(id)
  }

  #intervals = new Set<number>()

  setInterval(handler: TimerHandler, timeout?: number, ...args: unknown[]): number {
    const id = setInterval(() => {
      const func = typeof handler === "string" ? new Function(handler) : handler
      func(...args)
    }, timeout)
    this.#intervals.add(id)
    return id
  }

  clearInterval(id?: number): void {
    if (id) {
      this.#intervals.delete(id)
    }
    return clearInterval(id)
  }

  queueMicrotask(_callback: VoidFunction): void {
    return unimplemented()
  }

  // Rendering ==========================================================================================================

  get visualViewport(): VisualViewport {
    return unimplemented.getter()
  }

  readonly devicePixelRatio = 1

  get fullScreen(): boolean {
    return false
  }

  set fullScreen(_: boolean) {
    return
  }

  requestAnimationFrame(_callback: FrameRequestCallback): number {
    return unimplemented()
  }

  cancelAnimationFrame(_handle: number): void {
    return unimplemented()
  }

  requestIdleCallback(_callback: callback, _options?: IdleRequestOptions): number {
    return unimplemented()
  }

  cancelIdleCallback(_handle: number): void {
    return unimplemented()
  }

  // Styling and animations =============================================================================================

  getComputedStyle(_element: Element, _pseudo?: Nullable<string>): CSSStyleDeclaration {
    return unimplemented()
  }

  getDefaultComputedStyle(_element: Element, _pseudo?: Nullable<string>): CSSStyleDeclaration {
    return unimplemented()
  }

  matchMedia(_query: string): MediaQueryList {
    return unimplemented()
  }

  onanimationstart = null as _Window["onanimationstart"] // unimplemented
  onanimationiteration = null as _Window["onanimationiteration"] // unimplemented
  onanimationend = null as _Window["onanimationend"] // unimplemented
  onanimationcancel = null as _Window["onanimationcancel"] // unimplemented

  ontransitionstart = null as _Window["ontransitionstart"] // unimplemented
  ontransitionrun = null as _Window["ontransitionrun"] // unimplemented
  ontransitionend = null as _Window["ontransitionend"] // unimplemented
  ontransitioncancel = null as _Window["ontransitioncancel"] // unimplemented

  onwebkitanimationstart = null as _Window["onwebkitanimationstart"] // unimplemented
  onwebkitanimationiteration = null as _Window["onwebkitanimationiteration"] // unimplemented
  onwebkitanimationend = null as _Window["onwebkitanimationend"] // unimplemented
  onwebkittransitionend = null as _Window["onwebkittransitionend"] // unimplemented

  // Messaging ==========================================================================================================

  // deno-lint-ignore no-explicit-any
  structuredClone<T = any>(value: T, options?: StructuredSerializeOptions): T {
    return structuredClone(value, options)
  }

  // deno-lint-ignore no-explicit-any
  postMessage(message: any, targetOrigin: string, transfer?: Transferable[]): void
  // deno-lint-ignore no-explicit-any
  postMessage(message: any, options?: WindowPostMessageOptions): void
  // deno-lint-ignore no-explicit-any
  postMessage(_message: any, _optionsOrTargetOrigin?: string | WindowPostMessageOptions, _transfer?: Transferable[]): void {
    return unimplemented()
  }

  onmessage = null as _Window["onmessage"] // unimplemented
  onmessageerror = null as _Window["onmessageerror"] // unimplemented

  // deno-lint-ignore no-explicit-any
  reportError(_throwable: any): void {
    return unimplemented()
  }

  // Printing ==========================================================================================================

  readonly console = console

  print(): void {
    return
  }

  dump(_message?: unknown): void {
    return
  }

  onbeforeprint = null as _Window["onbeforeprint"] // unimplemented
  onafterprint = null as _Window["onafterprint"] // unimplemented

  // Crypto utilities =================================================================================================

  get isSecureContext(): boolean {
    return true
  }

  set isSecureContext(_: boolean) {
    return
  }

  get crypto(): Crypto {
    return crypto
  }

  set crypto(_: Crypto) {
    return
  }

  atob(base64: string): string {
    return atob(base64)
  }

  btoa(string: string): string {
    return btoa(string)
  }

  // Navigation =========================================================================================================

  get location(): Location {
    return unimplemented.getter()
  }

  get origin(): string {
    return unimplemented.getter()
  }

  get history(): History {
    return unimplemented.getter<"immutable">()
  }

  open(_url?: string | URL, _target?: string, _windowFeatures?: string): Nullable<WindowProxy> {
    return unimplemented()
  }

  close(): void {
    this.#timeouts.forEach(clearTimeout)
    this.#intervals.forEach(clearInterval)
    this.#timeouts.clear()
    this.#intervals.clear()
    this.#closed = true
    return
  }

  [Symbol.dispose]() {
    this.close()
  }

  #closed = false

  get closed(): boolean {
    return this.#closed
  }

  set closed(_: boolean) {
    return
  }

  stop(): void {
    return
  }

  get crossOriginIsolated(): boolean {
    return false
  }

  set crossOriginIsolated(_: boolean) {
    return
  }

  // deno-lint-ignore no-explicit-any
  onload = null as Nullable<((event: Event) => any)> // unimplemented
  onbeforeunload = null as _Window["onbeforeunload"] // unimplemented
  onunload = null as _Window["onunload"] // unimplemented

  onpageshow = null as _Window["onpageshow"] // unimplemented
  onpagehide = null as _Window["onpagehide"] // unimplemented
  onpopstate = null as _Window["onpopstate"] // unimplemented
  onhashchange = null as _Window["onhashchange"] // unimplemented

  onclose = null as _Window["onclose"] // unimplemented

  // Storage ============================================================================================================

  get caches(): CacheStorage {
    return unimplemented.getter<"immutable">()
  }

  get indexedDB(): IDBFactory {
    return unimplemented.getter<"immutable">()
  }

  get localStorage(): Storage {
    return localStorage
  }

  set localStorage(_: Storage) {
    return
  }

  get sessionStorage(): Storage {
    return sessionStorage
  }

  set sessionStorage(_: Storage) {
    return
  }

  onstorage = null as _Window["onstorage"] // unimplemented

  // Diagogs ============================================================================================================

  // deno-lint-ignore no-explicit-any
  alert(_message?: any): void {
    return
  }

  confirm(_message?: string): boolean {
    return false
  }

  prompt(_message?: string, defaults?: string): Nullable<string> {
    return defaults ?? null
  }

  // Clipboard ==========================================================================================================

  getSelection(): Nullable<Selection> {
    return unimplemented()
  }

  oncopy = null as _Window["oncopy"] // unimplemented
  onpaste = null as _Window["onpaste"] // unimplemented
  oncut = null as _Window["oncut"] // unimplemented

  onselect = null as _Window["onselect"] // unimplemented
  onselectionchange = null as _Window["onselectionchange"] // unimplemented
  onselectstart = null as _Window["onselectstart"] // unimplemented

  // Inputs =============================================================================================================

  onmousedown = null as _Window["onmousedown"] // unimplemented
  onmouseup = null as _Window["onmouseup"] // unimplemented
  onmousemove = null as _Window["onmousemove"] // unimplemented
  onmouseenter = null as _Window["onmouseenter"] // unimplemented
  onmouseleave = null as _Window["onmouseleave"] // unimplemented
  onmouseover = null as _Window["onmouseover"] // unimplemented
  onmouseout = null as _Window["onmouseout"] // unimplemented

  onpointerdown = null as _Window["onpointerdown"] // unimplemented
  onpointerup = null as _Window["onpointerup"] // unimplemented
  onpointermove = null as _Window["onpointermove"] // unimplemented
  onpointerenter = null as _Window["onpointerenter"] // unimplemented
  onpointerleave = null as _Window["onpointerleave"] // unimplemented
  onpointerover = null as _Window["onpointerover"] // unimplemented
  onpointerout = null as _Window["onpointerout"] // unimplemented
  onpointercancel = null as _Window["onpointercancel"] // unimplemented
  ongotpointercapture = null as _Window["ongotpointercapture"] // unimplemented
  onlostpointercapture = null as _Window["onlostpointercapture"] // unimplemented

  onclick = null as _Window["onclick"] // unimplemented
  ondblclick = null as _Window["ondblclick"] // unimplemented
  onauxclick = null as _Window["onauxclick"] // unimplemented
  oncontextmenu = null as _Window["oncontextmenu"] // unimplemented
  onwheel = null as _Window["onwheel"] // unimplemented

  onkeydown = null as _Window["onkeydown"] // unimplemented
  onkeyup = null as _Window["onkeyup"] // unimplemented
  onkeypress = null as _Window["onkeypress"] // unimplemented

  ondrag = null as _Window["ondrag"] // unimplemented
  ondragstart = null as _Window["ondragstart"] // unimplemented
  ondragend = null as _Window["ondragend"] // unimplemented
  ondragenter = null as _Window["ondragenter"] // unimplemented
  ondragleave = null as _Window["ondragleave"] // unimplemented
  ondragover = null as _Window["ondragover"] // unimplemented
  ondrop = null as _Window["ondrop"] // unimplemented

  onbeforeinput = null as _Window["onbeforeinput"] // unimplemented
  oninput = null as _Window["oninput"] // unimplemented
  onchange = null as _Window["onchange"] // unimplemented
  oninvalid = null as _Window["oninvalid"] // unimplemented
  oncancel = null as _Window["oncancel"] // unimplemented
  onreset = null as _Window["onreset"] // unimplemented
  onsubmit = null as _Window["onsubmit"] // unimplemented
  onformdata = null as _Window["onformdata"] // unimplemented

  onloadeddata = null as _Window["onloadeddata"] // unimplemented
  onloadedmetadata = null as _Window["onloadedmetadata"] // unimplemented
  onloadstart = null as _Window["onloadstart"] // unimplemented
  oncanplay = null as _Window["oncanplay"] // unimplemented
  oncanplaythrough = null as _Window["oncanplaythrough"] // unimplemented
  onplay = null as _Window["onplay"] // unimplemented
  onplaying = null as _Window["onplaying"] // unimplemented
  onseeked = null as _Window["onseeked"] // unimplemented
  onseeking = null as _Window["onseeking"] // unimplemented
  onstalled = null as _Window["onstalled"] // unimplemented
  onwaiting = null as _Window["onwaiting"] // unimplemented
  onsuspend = null as _Window["onsuspend"] // unimplemented
  onpause = null as _Window["onpause"] // unimplemented
  ontimeupdate = null as _Window["ontimeupdate"] // unimplemented
  ondurationchange = null as _Window["ondurationchange"] // unimplemented
  onratechange = null as _Window["onratechange"] // unimplemented
  onvolumechange = null as _Window["onvolumechange"] // unimplemented
  onemptied = null as _Window["onemptied"] // unimplemented
  onended = null as _Window["onended"] // unimplemented

  onprogress = null as _Window["onprogress"] // unimplemented
  onabort = null as _Window["onabort"] // unimplemented
  onbeforetoggle = null as _Window["onbeforetoggle"] // unimplemented
  ontoggle = null as _Window["ontoggle"] // unimplemented
  onslotchange = null as _Window["onslotchange"] // unimplemented
  oncuechange = null as _Window["oncuechange"] // unimplemented
  onsecuritypolicyviolation = null as _Window["onsecuritypolicyviolation"] // unimplemented

  ongamepadconnected = null as _Window["ongamepadconnected"] // unimplemented
  ongamepaddisconnected = null as _Window["ongamepaddisconnected"] // unimplemented

  // Other ==============================================================================================================

  #status = ""

  get status(): string {
    return this.#status
  }

  set status(status: string) {
    this.#status = `${status}`
  }

  get speechSynthesis(): SpeechSynthesis {
    return unimplemented()
  }

  readonly performance = performance

  get external(): External {
    return unimplemented.getter()
  }

  readonly event = undefined as Optional<Event>

  captureEvents(): void {
    return
  }

  releaseEvents(_events?: number): void {
    return unimplemented()
  }

  find(_string?: string, _caseSensitive?: boolean, _backwards?: boolean, _wrapAround?: boolean, _wholeWord?: boolean, _searchInFrames?: boolean, _showDialog?: boolean): boolean {
    return unimplemented()
  }

  updateCommands() {
    return
  }

  ononline = null as _Window["ononline"] // unimplemented
  onoffline = null as _Window["onoffline"] // unimplemented

  onerror = null as _Window["onerror"] // unimplemented
  onrejectionhandled = null as _Window["onrejectionhandled"] // unimplemented
  onunhandledrejection = null as _Window["onunhandledrejection"]; // unimplemented

  // Globals ============================================================================================================

  [index: number]: WindowProxy

  readonly fetch = fetch

  readonly createImageBitmap = createImageBitmap

  readonly Deno = Deno

  readonly Location = Location

  readonly Navigator = Navigator
}

/** https://developer.mozilla.org/en-US/docs/Web/API/BarProp */
export class BarProp implements _BarProp {
  constructor(_?: typeof construct) {
    illegalConstructor(arguments)
  }

  get visible(): boolean {
    return false
  }

  set visible(_: boolean) {
    return
  }

  get enabled(): boolean {
    return false
  }

  set enabled(_: boolean) {
    return
  }
}
