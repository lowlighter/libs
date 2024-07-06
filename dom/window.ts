// Imports
import type { callback, Nullable, Optional } from "@libs/typing"
import { type _BarProp, type _Window, illegal, internal, unimplemented } from "./_.ts"
import { Navigator } from "./navigator.ts"

/** https://developer.mozilla.org/en-US/docs/Web/API/Window */
export class Window extends EventTarget implements _Window {
  // Client =============================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator
  get navigator(): Navigator {
    return this.#navigator
  }

  set navigator(_: Navigator) {
    return
  }

  readonly #navigator = new Navigator({ [internal]: true })

  onlanguagechange = null as _Window["onlanguagechange"] // unimplemented

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/clientInformation
  // Note: alias of navigator
  get clientInformation(): Navigator {
    return this.navigator
  }

  set clientInformation(_: Navigator) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/locationbar
  readonly locationbar = new BarProp({ [internal]: true })

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/menubar
  readonly menubar = new BarProp({ [internal]: true })

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/personalbar
  readonly personalbar = new BarProp({ [internal]: true })

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollbars
  readonly scrollbars = new BarProp({ [internal]: true })

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/statusbar
  readonly statusbar = new BarProp({ [internal]: true })

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/toolbar
  readonly toolbar = new BarProp({ [internal]: true })

  // Document ============================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/name
  set name(name: string) {
    this.#name = `${name}`
  }

  get name(): string {
    return this.#name
  }

  #name = ""

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/document
  get document(): Document {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/frameElement
  // Note: forced as multiple windows are not supported
  get frameElement(): Nullable<Element> {
    return null
  }

  set frameElement(_: Nullable<Element>) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/window
  get window(): WindowProxy & typeof globalThis {
    return this as unknown as WindowProxy & typeof globalThis
  }

  set window(_: WindowProxy & typeof globalThis) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/self
  // Note: alias of window
  readonly self = this.window

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/frames
  // Note: alias of window
  readonly frames = this.window

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/parent
  // Note: forced as multiple windows are not supported
  readonly opener = null as Nullable<WindowProxy>

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/length
  // Note: forced as multiple windows are not supported
  readonly length = 0

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/top
  // Note: forced as multiple windows are not supported
  get top(): WindowProxy {
    return this as unknown as WindowProxy
  }

  set top(_: WindowProxy) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/parent
  // Note: forced as multiple windows are not supported
  get parent(): WindowProxy {
    return this as unknown as WindowProxy
  }

  set parent(_: WindowProxy) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements
  // Depends: CustomElementRegistry implementation
  get customElements(): CustomElementRegistry {
    return unimplemented.getter<"immutable">()
  }

  // Focus ==============================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/focus
  // Note: N/A as no UI
  focus(): void {
    return
  }

  onfocus = null as _Window["onfocus"] // unimplemented

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/blur
  // Note: noop
  blur(): void {
    return
  }

  onblur = null as _Window["onblur"] // unimplemented

  // Sizing ==============================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight
  // Note: forced as no UI
  readonly innerHeight = 0

  // Note: forced as no UI
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
  // Note: forced as no UI
  readonly innerWidth = 0

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/outerHeight
  // Note: forced as no UI
  readonly outerHeight = 0

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/outerWidth
  // Note: forced as no UI
  readonly outerWidth = 0

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/mozInnerScreenX
  // Note: forced as no UI
  get mozInnerScreenX(): number {
    return 0
  }

  set mozInnerScreenX(_: number) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/mozInnerScreenY
  // Note: forced as no UI
  get mozInnerScreenY(): number {
    return 0
  }

  set mozInnerScreenY(_: number) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/setResizable
  // Note: noop
  setRezizable() {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/resizeBy
  // Note: N/A as no UI
  resizeBy(_dx: number, _dy: number): void {
    if (arguments.length < 2) {
      throw new TypeError(`At least 2 arguments required, but only ${arguments.length} passed`)
    }
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/resizeTo
  // Note: N/A as no UI
  resizeTo(_x: number, _y: number): void {
    if (arguments.length < 2) {
      throw new TypeError(`At least 2 arguments required, but only ${arguments.length} passed`)
    }
    return
  }

  onresize = null as _Window["onresize"] // unimplemented

  // Positioning ========================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/screen
  // Depends: Screen implementation
  get screen(): Screen {
    return unimplemented.getter()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/screenX
  readonly screenX = 0

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/screenY
  readonly screenY = 0

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/screenLeft
  readonly screenLeft = 0

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/screenTop
  readonly screenTop = 0

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/moveBy
  // Note: N/A as no UI
  moveBy(_dx: number, _dy: number): void {
    if (arguments.length < 2) {
      throw new TypeError(`At least 2 arguments required, but only ${arguments.length} passed`)
    }
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/moveTo
  // Note: N/A as no UI
  moveTo(_x: number, _y: number): void {
    if (arguments.length < 2) {
      throw new TypeError(`At least 2 arguments required, but only ${arguments.length} passed`)
    }
    return
  }

  // Scrolling ==========================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollX
  readonly scrollX = 0

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
  readonly scrollY = 0

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/pageXOffset
  readonly pageXOffset = 0

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/pageYOffset
  readonly pageYOffset = 0

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollMaxX
  readonly scrollMaxX = 0

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollMaxY
  readonly scrollMaxY = 0

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/scroll
  // Depends: none
  scroll(_options: ScrollToOptions): void
  scroll(_x: number, _y: number): void
  scroll(_xOrOptions: number | ScrollToOptions, _y?: number): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
  // Depends: none
  scrollTo(_options: ScrollToOptions): void
  scrollTo(_x: number, _y: number): void
  scrollTo(_xOrOptions: number | ScrollToOptions, _y?: number): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollBy
  // Depends: none
  scrollBy(_options: ScrollToOptions): void
  scrollBy(_x: number, _y: number): void
  scrollBy(_xOrOptions: number | ScrollToOptions, _y?: number): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollByLines
  // Depends: none
  scrollByLines(_lines: number): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollByPages
  // Depends: none
  scrollByPages(_pages: number): void {
    return unimplemented()
  }

  onscroll = null as _Window["onscroll"] // unimplemented
  onscrollend = null as _Window["onscrollend"] // unimplemented

  // Orientation ========================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/orientation
  // Note: forced as no UI
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

  /** Internal `setTimeout` handle used to keep track on spawned timeouts. */
  #timeouts = new Set<number>()

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
  setTimeout(handler: TimerHandler, timeout?: number, ...args: unknown[]): number {
    const id = setTimeout(() => {
      const func = typeof handler === "string" ? new Function(handler) : handler
      this.#timeouts.delete(id)
      func(...args)
    }, timeout)
    this.#timeouts.add(id)
    return id
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/clearTimeout
  clearTimeout(id?: number): void {
    if (id) {
      this.#timeouts.delete(id)
    }
    return clearTimeout(id)
  }

  /** Internal `setInterval` handle used to keep track on spawned intervals. */
  #intervals = new Set<number>()

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
  setInterval(handler: TimerHandler, timeout?: number, ...args: unknown[]): number {
    const id = setInterval(() => {
      const func = typeof handler === "string" ? new Function(handler) : handler
      func(...args)
    }, timeout)
    this.#intervals.add(id)
    return id
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/clearInterval
  clearInterval(id?: number): void {
    if (id) {
      this.#intervals.delete(id)
    }
    return clearInterval(id)
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask
  // Depends: none
  queueMicrotask(_callback: VoidFunction): void {
    return unimplemented()
  }

  // Rendering ==========================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/visualViewport
  // Depends: VisualViewport implementation
  get visualViewport(): VisualViewport {
    return unimplemented.getter()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
  // Note: arbitrary set
  readonly devicePixelRatio = 1

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/fullScreen
  // Note: arbitrary set
  get fullScreen(): boolean {
    return false
  }

  set fullScreen(_: boolean) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/fullscreen
  // Depends: none
  requestAnimationFrame(_callback: FrameRequestCallback): number {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame
  // Depends: none
  cancelAnimationFrame(_handle: number): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
  // Depends: none
  requestIdleCallback(_callback: callback, _options?: IdleRequestOptions): number {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelIdleCallback
  // Depends: none
  cancelIdleCallback(_handle: number): void {
    return unimplemented()
  }

  // Styling and animations =============================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
  // Depends: CSSStyleDeclaration implementation
  getComputedStyle(_element: Element, _pseudo?: Nullable<string>): CSSStyleDeclaration {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/getMatchedCSSRules
  // Depends: CSSStyleDeclaration implementation
  getDefaultComputedStyle(_element: Element, _pseudo?: Nullable<string>): CSSStyleDeclaration {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
  // Depends: MediaQueryList implementation
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

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone
  // deno-lint-ignore no-explicit-any
  structuredClone<T = any>(value: T, options?: StructuredSerializeOptions): T {
    return structuredClone(value, options)
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
  // Depends: none
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

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/reportError
  // deno-lint-ignore no-explicit-any
  reportError(_throwable: any): void {
    return unimplemented()
  }

  onerror = null as _Window["onerror"] // unimplemented
  onrejectionhandled = null as _Window["onrejectionhandled"] // unimplemented
  onunhandledrejection = null as _Window["onunhandledrejection"] // unimplemented

  // Printing ==========================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/console
  readonly console = console

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/print
  // Note: N/A as no printer
  print(): void {
    return
  }

  onbeforeprint = null as _Window["onbeforeprint"] // unimplemented
  onafterprint = null as _Window["onafterprint"] // unimplemented

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/dump
  // Depends: none, should be designed to send data to stdout
  dump(_message?: unknown): void {
    return unimplemented()
  }

  // Crypto utilities =================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/isSecureContext
  // Note: arbitrary set
  get isSecureContext(): boolean {
    return true
  }

  set isSecureContext(_: boolean) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto
  get crypto(): Crypto {
    return crypto
  }

  set crypto(_: Crypto) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/atob
  atob(base64: string): string {
    return atob(base64)
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa
  btoa(string: string): string {
    return btoa(string)
  }

  // Navigation =========================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/location
  // Depends: Location implementation (deno implementation cannot be used, and globalThis.location may be undefined)
  get location(): Location {
    return unimplemented.getter()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/origin
  get origin(): string {
    return unimplemented.getter()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/history
  // Depends: History implementation
  get history(): History {
    return unimplemented.getter<"immutable">()
  }

  onpageshow = null as _Window["onpageshow"] // unimplemented
  onpagehide = null as _Window["onpagehide"] // unimplemented
  onpopstate = null as _Window["onpopstate"] // unimplemented
  onhashchange = null as _Window["onhashchange"] // unimplemented

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/open
  // Depends: none
  open(_url?: string | URL, _target?: string, _windowFeatures?: string): Nullable<WindowProxy> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/close
  // Note: this is also used for cleanup
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

  onclose = null as _Window["onclose"] // unimplemented

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/closed
  get closed(): boolean {
    return this.#closed
  }

  set closed(_: boolean) {
    return
  }

  #closed = false

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/stop
  // Depends: none
  stop(): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/crossOriginIsolated
  // Note: arbitrary set
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

  // Storage ============================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/caches
  // Depends: CacheStorage implementation
  get caches(): CacheStorage {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/indexedDB
  // Depends: IDBFactory implementation
  get indexedDB(): IDBFactory {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
  // Note: inherited from Deno
  get localStorage(): Storage {
    return localStorage
  }

  set localStorage(_: Storage) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
  // Note: inherited from Deno
  get sessionStorage(): Storage {
    return sessionStorage
  }

  set sessionStorage(_: Storage) {
    return
  }

  onstorage = null as _Window["onstorage"] // unimplemented

  // Diagogs ============================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/alert
  // Note: N/A as no UI
  // deno-lint-ignore no-explicit-any
  alert(_message?: any): void {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
  // Note: N/A as no UI
  confirm(_message?: string): boolean {
    return false
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt
  // Note: N/A as no UI, always returns defaults value
  prompt(_message?: string, defaults?: string): Nullable<string> {
    return defaults ?? null
  }

  // Clipboard ==========================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/clipboard
  // Depends: Selection implementation
  getSelection(): Nullable<Selection> {
    return unimplemented()
  }

  oncopy = null as _Window["oncopy"] // unimplemented
  onpaste = null as _Window["onpaste"] // unimplemented
  oncut = null as _Window["oncut"] // unimplemented

  onselect = null as _Window["onselect"] // unimplemented
  onselectionchange = null as _Window["onselectionchange"] // unimplemented
  onselectstart = null as _Window["onselectstart"] // unimplemented

  // Events =============================================================================================================

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

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/status
  // Note: string-only
  get status(): string {
    return this.#status
  }

  set status(status: string) {
    this.#status = `${status}`
  }

  #status = ""

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/speechSynthesis
  // Depends: SpeechSynthesis implementation
  get speechSynthesis(): SpeechSynthesis {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/performance
  readonly performance = performance

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/external
  // Depends: External implementation
  get external(): External {
    return unimplemented.getter()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/event
  // Note: forced as undefined as not executed in event context
  readonly event = undefined as Optional<Event>

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/captureEvents
  // Note: noop
  captureEvents(): void {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/releaseEvents
  // Depends: none
  releaseEvents(_events?: number): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/find
  // Depends: none
  find(_string?: string, _caseSensitive?: boolean, _backwards?: boolean, _wrapAround?: boolean, _wholeWord?: boolean, _searchInFrames?: boolean, _showDialog?: boolean): boolean {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/updateCommands
  // Note: N/A in Deno
  updateCommands() {
    return
  }

  ononline = null as _Window["ononline"] // unimplemented
  onoffline = null as _Window["onoffline"]; // unimplemented

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
  constructor(_ = {} as { [internal]?: boolean }) {
    illegal(arguments)
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/BarProp/visible
  // Note: forced as no ui
  get visible(): boolean {
    return false
  }

  set visible(_: boolean) {
    return
  }
}
