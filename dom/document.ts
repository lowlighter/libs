// Imports
import type { Nullable } from "@libs/typing"
import { type _Document, type _Node, type _Window, internal, unimplemented } from "./_.ts"
import { Node } from "./node.ts"
import type { Window } from "./window.ts"
import { Attr } from "./attr.ts"

/** https://developer.mozilla.org/en-US/docs/Web/API/Document */
export class Document extends Node implements _Document {
  constructor({ [internal]: _, defaultView = null } = {} as { [internal]?: boolean; defaultView?: Nullable<Window> }) {
    super({ [internal]: true })
    if (!_) {
      defaultView = null
    }
    this.#defaultView = defaultView as unknown as (_Window & typeof globalThis)
  }

  // Document ======================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/ownerDocument
  // Note: always null for Document
  get ownerDocument(): null {
    return null
  }

  set ownerDocument(_: null) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/title
  // Note: string-only
  get title(): string {
    return this.#title
  }

  set title(title: string) {
    this.#title = `${title}`
  }

  #title = "" as string

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/location
  get location(): Location {
    return unimplemented.getter<"settable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/domain
  get domain(): string {
    return unimplemented.getter<"settable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/documentURI
  get documentURI(): string {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/URL
  get URL(): string {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/characterSet
  // Note: arbitrary set
  get characterSet(): "UTF-8" {
    return "UTF-8"
  }

  set characterSet(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/charset
  // Note: alias of characterSet
  get charset(): "UTF-8" {
    return this.characterSet
  }

  set charset(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/inputEncoding
  // Note: alias of characterSet
  get inputEncoding(): "UTF-8" {
    return this.characterSet
  }

  set inputEncoding(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/compatMode
  // Note: arbitrary set in non-quirks mode
  get compatMode(): "BackCompat" | "CSS1Compat" {
    return "CSS1Compat"
  }

  set compatMode(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/contentType
  get contentType(): string {
    return "text/html"
  }

  set contentType(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
  // Note: forced as no cookie support currently
  get cookie(): string {
    return ""
  }

  set cookie(_: string) {
    unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/designMode
  // Note: "on" is N/A in this context
  get designMode(): "off" | "on" {
    return this.#designMode
  }

  set designMode(mode: "off" | "on") {
    if (["off", "on"].includes(mode)) {
      this.#designMode = mode
    }
  }

  #designMode = "off" as "off" | "on"

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/hidden
  // Note: arbitrary set
  get hidden(): boolean {
    return false
  }

  set hidden(_: boolean) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState
  // Note: arbitrary set
  get visibilityState(): "hidden" | "visible" {
    return "visible"
  }

  set visibilityState(_: "hidden" | "visible") {
    return
  }

  onvisibilitychange = null as _Document["onvisibilitychange"]

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreen
  // Note: always false as no fullscreen support
  get fullscreen(): boolean {
    return false
  }

  set fullscreen(_: boolean) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenEnabled
  // Note: always false as no fullscreen support
  get fullscreenEnabled(): boolean {
    return false
  }

  set fullscreenEnabled(_: boolean) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/pictureInPictureEnabled
  // Note: always false as no picture-in-picture support
  get pictureInPictureEnabled(): boolean {
    return false
  }

  set pictureInPictureEnabled(_: boolean) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer
  // Note: always empty string as no referrer support
  get referrer(): string {
    return ""
  }

  set referrer(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/hasFocus
  // Note: always false as no focus support
  hasFocus(): boolean {
    return unimplemented()
  }

  // CSS ===========================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/styleSheets
  // Depends: StyleSheetList implementation
  get styleSheets(): StyleSheetList {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/styleSheetSets
  // Depends: DOMStringList implementation
  get styleSheetSets(): DOMStringList {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptedStyleSheets
  // Depends: CSSStyleSheet implementation
  get adoptedStyleSheets() {
    return this.#adoptedStyleSheets
  }

  set adoptedStyleSheets(_: CSSStyleSheet[]) {
    return
  }

  readonly #adoptedStyleSheets = [] as CSSStyleSheet[]

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/selectedStyleSheetSet
  // Note: always null as no style sheet support
  get selectedStyleSheetSet(): Nullable<string> {
    return null
  }

  set selectedStyleSheetSet(_: Nullable<string>) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/lastStyleSheetSet
  // Note: always null as no style sheet support
  get lastStyleSheetSet(): Nullable<CSSStyleSheet> {
    return null
  }

  set lastStyleSheetSet(_: Nullable<CSSStyleSheet>) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/enableStyleSheetsForSet
  // Depends: CSSStyleSheet implementation
  enableStyleSheetsForSet(_name: string): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/preferredStyleSheetSet
  // Note: always empty string as no style sheet support
  get preferredStyleSheetSet(): string {
    return ""
  }

  set preferredStyleSheetSet(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/mozSetImageElement
  // Depends: none
  mozSetImageElement(_element: HTMLImageElement): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/getAnimations
  // Depends: Animation implementation
  getAnimations(): Animation[] {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition
  // Depends: ViewTransition implementation
  startViewTransition(): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/timeline
  // Depends: DocumentTimeline implementation
  get timeline(): DocumentTimeline {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/fonts
  // Depends: FontFaceSet implementation
  get fonts(): FontFaceSet {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/alinkColor
  alinkColor = "" as string

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/linkColor
  linkColor = "" as string

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/vlinkColor
  vlinkColor = "" as string

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/bgColor
  bgColor = "" as string

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/fgColor
  fgColor = "" as string

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/dir
  get dir(): "ltr" | "rtl" | "" {
    return this.#dir
  }

  set dir(dir: "ltr" | "rtl" | "") {
    if (["ltr", "rtl", ""].includes(dir)) {
      this.#dir = dir
    }
  }

  #dir = "" as "ltr" | "rtl" | ""

  onanimationstart = null as _Document["onanimationstart"] // unimplemented
  onanimationiteration = null as _Document["onanimationiteration"] // unimplemented
  onanimationend = null as _Document["onanimationend"] // unimplemented
  onanimationcancel = null as _Document["onanimationcancel"] // unimplemented

  ontransitionstart = null as _Document["ontransitionstart"] // unimplemented
  ontransitionrun = null as _Document["ontransitionrun"] // unimplemented
  ontransitionend = null as _Document["ontransitionend"] // unimplemented
  ontransitioncancel = null as _Document["ontransitioncancel"] // unimplemented

  onwebkitanimationstart = null as _Document["onwebkitanimationstart"] // unimplemented
  onwebkitanimationiteration = null as _Document["onwebkitanimationiteration"] // unimplemented
  onwebkitanimationend = null as _Document["onwebkitanimationend"] // unimplemented
  onwebkittransitionend = null as _Document["onwebkittransitionend"] // unimplemented

  // Document lifecycle ============================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState
  get readyState(): "loading" | "interactive" | "complete" {
    return unimplemented.getter<"immutable">()
  }

  onreadystatechange = null as _Document["onreadystatechange"]

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/open
  // Depends: none
  open(unused1?: string, unused2?: string): _Document
  open(url: string | URL, name: string, features: string): Nullable<WindowProxy>
  open(_unused1?: string | URL, _unused2?: string, _unused3?: string): Nullable<_Document | WindowProxy> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/close
  // Depends: none
  close(): void {
    return unimplemented()
  }

  [Symbol.dispose](): void {
    return this.close()
  }

  onclose = null as _Document["onclose"]

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/clear
  // Note: noop
  clear(): void {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/write
  // Depends: none
  write(..._text: string[]): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/writeln
  // Depends: none
  writeln(..._text: string[]): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/laseModified
  // Depends: none
  get lastModified(): string {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/parseHTMLUnsafe_static
  // Depends: xml parsing
  static parseHTMLUnsafe(_html: string): Document {
    return unimplemented()
  }

  onload = null as _Document["onload"]

  // Collections and reference to elements ========================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView
  get defaultView(): Nullable<_Window & typeof globalThis> {
    return this.#defaultView
  }

  set defaultView(_: Nullable<_Window & typeof globalThis>) {
    return
  }

  readonly #defaultView

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/doctype
  // Depends: DocumentType implementation
  get doctype(): DocumentType {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/head
  get head(): HTMLHeadElement {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/body
  get body(): HTMLBodyElement | HTMLFrameSetElement {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/all
  get all(): HTMLAllCollection {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/anchors
  get anchors(): HTMLCollectionOf<HTMLAnchorElement> {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/links
  get links(): HTMLCollectionOf<HTMLAnchorElement> {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/images
  get images(): HTMLCollectionOf<HTMLImageElement> {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/forms
  get forms(): HTMLCollectionOf<HTMLFormElement> {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/scripts
  get scripts(): HTMLCollectionOf<HTMLScriptElement> {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/embeds
  get embeds(): HTMLCollectionOf<HTMLEmbedElement> {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/applets
  get applets(): HTMLCollection {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/plugins
  get plugins(): HTMLCollectionOf<HTMLEmbedElement> {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/rootElement
  // Note: always null for Document (non SVG)
  get rootElement(): Nullable<SVGSVGElement> {
    return null
  }

  set rootElement(_: Nullable<SVGSVGElement>) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement
  get documentElement(): HTMLElement {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
  // Note: always null because no active element
  get activeElement(): Nullable<Element> {
    return null
  }

  set activeElement(_: Element) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/scrollingElement
  // Note: always document as no scrolling support
  get scrollingElement(): Element {
    return this.documentElement
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenElement
  // Note: always null as no fullscreen support
  get fullscreenElement(): Nullable<Element> {
    return null
  }

  set fullscreenElement(_: Nullable<Element>) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/pictureInPictureElement
  // Note: always null as no picture-in-picture support
  get pictureInPictureElement(): Nullable<Element> {
    return null
  }

  set pictureInPictureElement(_: Nullable<Element>) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/pointerLockElement
  // Note: always null as no pointer lock support
  get pointerLockElement(): Nullable<Element> {
    return null
  }

  set pointerLockElement(_: Nullable<Element>) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript
  // Note: always null as no script context
  get currentScript(): Nullable<HTMLScriptElement> {
    return null
  }

  set currentScript(_: Nullable<HTMLScriptElement>) {
    return
  }

  // DOM implementation ===========================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/implementation
  // Depends: DOMImplementation implementation
  get implementation(): DOMImplementation {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/children
  // Depends: HTMLCollection implementation
  get children(): HTMLCollection {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/childElementCount
  // Note: always 1 for document element
  get childElementCount(): number {
    return 1
  }

  set childElementCount(_: number) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/firstElementChild
  get firstElementChild(): Nullable<Element> {
    return this.documentElement
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/lastElementChild
  get lastElementChild(): Nullable<Element> {
    return this.documentElement
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptNode
  // Depends: none
  adoptNode<T extends _Node>(_node: T): T {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/importNode
  // Depends: none
  importNode<T extends _Node>(_node: T, _deep: boolean): T {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/append
  // Depends: none
  append(..._nodes: Array<string | _Node>): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/prepend
  // Depends: none
  prepend(..._nodes: Array<string | _Node>): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/replaceChildren
  // Depends: none
  replaceChildren(..._nodes: (string | _Node)[]): void {
    return unimplemented()
  }

  // DOM construction ==============================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/createRange
  // Depends: Range implementation
  createRange(): Range {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/caretRangeFromPoint
  // Depends: Range implementation
  caretRangeFromPoint(_x: number, _y: number): Nullable<Range> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/caretPositionFromPoint
  // Depends: CaretPosition implementation
  caretPositionFromPoint(_x: number, _y: number): null /* CaretPosition */ {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/createAttribute
  createAttribute(localName: string): Attr {
    return new Attr({ [internal]: true, localName, ownerDocument: this, ownerElement: null })
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/createAttributeNS
  createAttributeNS(namespaceURI: string, qualifiedName: string): Attr {
    return new Attr({ [internal]: true, localName: qualifiedName, namespaceURI, ownerDocument: this, ownerElement: null })
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment
  // Depends: DocumentFragment implementation
  createDocumentFragment(): DocumentFragment {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/createProcessingInstruction
  // Depends: ProcessingInstruction implementation
  createProcessingInstruction(_target: string, _data: string): ProcessingInstruction {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/createComment
  // Depends: Comment implementation
  createComment(_data: string): Comment {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/createCDATASection
  // Depends: CDATASection implementation
  createCDATASection(_data: string): CDATASection {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
  // Depends: Text implementation
  createTextNode(_data: string): Text {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/createTreeWalker
  // Depends: TreeWalker implementation
  createTreeWalker(_root: _Node, _whatToShow?: number, _filter?: Nullable<NodeFilter>): TreeWalker {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/createNodeIterator
  // Depends: NodeIterator implementation
  createNodeIterator(_root: _Node, _whatToShow?: number, _filter?: Nullable<NodeFilter>): NodeIterator {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
  // Depends: HTMLElement implementation
  createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K]
  createElement(_localName: string): HTMLElement {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS
  // Depends: SVGElement, MathMLElement, Element implementation
  createElementNS(namespaceURI: "http://www.w3.org/1999/xhtml", qualifiedName: string): HTMLElement
  createElementNS<K extends keyof SVGElementTagNameMap>(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: K): SVGElementTagNameMap[K]
  createElementNS(namespaceURI: "http://www.w3.org/2000/svg", qualifiedName: string): SVGElement
  createElementNS<K extends keyof MathMLElementTagNameMap>(namespaceURI: "http://www.w3.org/1998/Math/MathML", qualifiedName: K): MathMLElementTagNameMap[K]
  createElementNS(namespaceURI: "http://www.w3.org/1998/Math/MathML", qualifiedName: string): MathMLElement
  createElementNS(namespaceURI: Nullable<string>, qualifiedName: string, options?: ElementCreationOptions): Element
  createElementNS(_namespace: Nullable<string>, _qualifiedName: string, _options?: string | ElementCreationOptions): Element {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/createEvent
  // Depends: Event implementation
  createEvent(eventInterface: "AnimationEvent"): AnimationEvent
  createEvent(eventInterface: "AnimationPlaybackEvent"): AnimationPlaybackEvent
  createEvent(eventInterface: "AudioProcessingEvent"): AudioProcessingEvent
  createEvent(eventInterface: "BeforeUnloadEvent"): BeforeUnloadEvent
  createEvent(eventInterface: "BlobEvent"): BlobEvent
  createEvent(eventInterface: "ClipboardEvent"): ClipboardEvent
  createEvent(eventInterface: "CloseEvent"): CloseEvent
  createEvent(eventInterface: "CompositionEvent"): CompositionEvent
  createEvent(eventInterface: "CustomEvent"): CustomEvent
  createEvent(eventInterface: "DeviceMotionEvent"): DeviceMotionEvent
  createEvent(eventInterface: "DeviceOrientationEvent"): DeviceOrientationEvent
  createEvent(eventInterface: "DragEvent"): DragEvent
  createEvent(eventInterface: "ErrorEvent"): ErrorEvent
  createEvent(eventInterface: "Event"): Event
  createEvent(eventInterface: "Events"): Event
  createEvent(eventInterface: "FocusEvent"): FocusEvent
  createEvent(eventInterface: "FontFaceSetLoadEvent"): FontFaceSetLoadEvent
  createEvent(eventInterface: "FormDataEvent"): FormDataEvent
  createEvent(eventInterface: "GamepadEvent"): GamepadEvent
  createEvent(eventInterface: "HashChangeEvent"): HashChangeEvent
  createEvent(eventInterface: "IDBVersionChangeEvent"): IDBVersionChangeEvent
  createEvent(eventInterface: "InputEvent"): InputEvent
  createEvent(eventInterface: "KeyboardEvent"): KeyboardEvent
  createEvent(eventInterface: "MIDIConnectionEvent"): MIDIConnectionEvent
  createEvent(eventInterface: "MIDIMessageEvent"): MIDIMessageEvent
  createEvent(eventInterface: "MediaEncryptedEvent"): MediaEncryptedEvent
  createEvent(eventInterface: "MediaKeyMessageEvent"): MediaKeyMessageEvent
  createEvent(eventInterface: "MediaQueryListEvent"): MediaQueryListEvent
  createEvent(eventInterface: "MediaStreamTrackEvent"): MediaStreamTrackEvent
  createEvent(eventInterface: "MessageEvent"): MessageEvent
  createEvent(eventInterface: "MouseEvent"): MouseEvent
  createEvent(eventInterface: "MouseEvents"): MouseEvent
  createEvent(eventInterface: "MutationEvent"): MutationEvent
  createEvent(eventInterface: "MutationEvents"): MutationEvent
  createEvent(eventInterface: "OfflineAudioCompletionEvent"): OfflineAudioCompletionEvent
  createEvent(eventInterface: "PageTransitionEvent"): PageTransitionEvent
  createEvent(eventInterface: "PaymentMethodChangeEvent"): PaymentMethodChangeEvent
  createEvent(eventInterface: "PaymentRequestUpdateEvent"): PaymentRequestUpdateEvent
  createEvent(eventInterface: "PictureInPictureEvent"): PictureInPictureEvent
  createEvent(eventInterface: "PointerEvent"): PointerEvent
  createEvent(eventInterface: "PopStateEvent"): PopStateEvent
  createEvent(eventInterface: "ProgressEvent"): ProgressEvent
  createEvent(eventInterface: "PromiseRejectionEvent"): PromiseRejectionEvent
  createEvent(eventInterface: "RTCDTMFToneChangeEvent"): RTCDTMFToneChangeEvent
  createEvent(eventInterface: "RTCDataChannelEvent"): RTCDataChannelEvent
  createEvent(eventInterface: "RTCErrorEvent"): RTCErrorEvent
  createEvent(eventInterface: "RTCPeerConnectionIceErrorEvent"): RTCPeerConnectionIceErrorEvent
  createEvent(eventInterface: "RTCPeerConnectionIceEvent"): RTCPeerConnectionIceEvent
  createEvent(eventInterface: "RTCTrackEvent"): RTCTrackEvent
  createEvent(eventInterface: "SecurityPolicyViolationEvent"): SecurityPolicyViolationEvent
  createEvent(eventInterface: "SpeechSynthesisErrorEvent"): SpeechSynthesisErrorEvent
  createEvent(eventInterface: "SpeechSynthesisEvent"): SpeechSynthesisEvent
  createEvent(eventInterface: "StorageEvent"): StorageEvent
  createEvent(eventInterface: "SubmitEvent"): SubmitEvent
  createEvent(eventInterface: "ToggleEvent"): ToggleEvent
  createEvent(eventInterface: "TouchEvent"): TouchEvent
  createEvent(eventInterface: "TrackEvent"): TrackEvent
  createEvent(eventInterface: "TransitionEvent"): TransitionEvent
  createEvent(eventInterface: "UIEvent"): UIEvent
  createEvent(eventInterface: "UIEvents"): UIEvent
  createEvent(eventInterface: "WebGLContextEvent"): WebGLContextEvent
  createEvent(eventInterface: "WheelEvent"): WheelEvent
  createEvent(_eventInterface: string): Event {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/createExpression
  // Depends: XPathExpression implementation
  createExpression(_expression: string, _resolver?: Nullable<XPathNSResolver>): XPathExpression {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/createNSResolver
  // Depends: XPathNSResolver implementation
  createNSResolver(_nodeResolver: _Node): _Node {
    return unimplemented()
  }

  // DOM traversal ================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate
  // Depends: XPathResult implementation
  evaluate(_expression: string, _contextNode: _Node, _resolver?: Nullable<XPathNSResolver>, _type?: number, _result?: Nullable<XPathResult>): XPathResult {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
  // Depends: query selection implementation
  querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): Nullable<HTMLElementTagNameMap[K]>
  querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): Nullable<SVGElementTagNameMap[K]>
  querySelector<K extends keyof MathMLElementTagNameMap>(selectors: K): Nullable<MathMLElementTagNameMap[K]>
  querySelector<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): Nullable<HTMLElementDeprecatedTagNameMap[K]>
  querySelector<E extends Element = Element>(selectors: string): Nullable<E>
  querySelector<A extends keyof HTMLElementTagNameMap, B extends keyof SVGElementTagNameMap, C extends keyof MathMLElementTagNameMap, D extends keyof HTMLElementDeprecatedTagNameMap, E extends Element = Element>(
    _selectors: unknown,
  ): Nullable<E | HTMLElementTagNameMap[A] | SVGElementTagNameMap[B] | MathMLElementTagNameMap[C] | HTMLElementDeprecatedTagNameMap[D]> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
  // Depends: query selection implementation
  querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>
  querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>
  querySelectorAll<K extends keyof MathMLElementTagNameMap>(selectors: K): NodeListOf<MathMLElementTagNameMap[K]>
  querySelectorAll<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>
  querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>
  querySelectorAll<A extends keyof HTMLElementTagNameMap, B extends keyof SVGElementTagNameMap, C extends keyof MathMLElementTagNameMap, D extends keyof HTMLElementDeprecatedTagNameMap>(
    _selectors: unknown,
  ): NodeListOf<HTMLElementTagNameMap[A]> | NodeListOf<SVGElementTagNameMap[B]> | NodeListOf<MathMLElementTagNameMap[C]> | NodeListOf<HTMLElementDeprecatedTagNameMap[D]> | NodeListOf<Element> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
  // Depends: query selection implementation
  getElementById(_elementId: string): Nullable<HTMLElement> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
  // Depends: query selection implementation
  getElementsByClassName(_classNames: string): HTMLCollectionOf<Element> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByName
  // Depends: query selection implementation
  getElementsByName(_elementName: string): NodeListOf<HTMLElement> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagName
  // Depends: query selection implementation
  getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>
  getElementsByTagName<K extends keyof SVGElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<SVGElementTagNameMap[K]>
  getElementsByTagName<K extends keyof MathMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<MathMLElementTagNameMap[K]>
  getElementsByTagName<K extends keyof HTMLElementDeprecatedTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>
  getElementsByTagName<A extends keyof HTMLElementTagNameMap, B extends keyof SVGElementTagNameMap, C extends keyof MathMLElementTagNameMap, D extends keyof HTMLElementDeprecatedTagNameMap>(
    _qualifiedName: unknown,
  ): HTMLCollectionOf<HTMLElementTagNameMap[A]> | HTMLCollectionOf<SVGElementTagNameMap[B]> | HTMLCollectionOf<MathMLElementTagNameMap[C]> | HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[D]> | HTMLCollectionOf<Element> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagNameNS
  // Depends: query selection implementation
  getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>
  getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>
  getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1998/Math/MathML", localName: string): HTMLCollectionOf<MathMLElement>
  getElementsByTagNameNS(_namespace: Nullable<string>, _localName: string): HTMLCollectionOf<Element> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/getSelection
  // Depends: selection implementation
  getSelection(): Nullable<Selection> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/elementFromPoint
  // Depends: none
  elementFromPoint(_x: number, _y: number): Nullable<Element> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/elementsFromPoint
  // Depends: none
  elementsFromPoint(_x: number, _y: number): Element[] {
    return unimplemented()
  }

  // Commands and permissions ======================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/queryCommandSupported
  // Depends: none
  queryCommandSupported(_commandId: string): boolean {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/queryCommandEnabled
  // Depends: none
  queryCommandEnabled(_commandId: string): boolean {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/queryCommandState
  // Depends: none
  queryCommandState(_commandId: string): boolean {
    return unimplemented()
  }

  // https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa752630(v=vs.85)
  // Depends: none
  queryCommandIndeterm(_commandId: string): boolean {
    return unimplemented()
  }

  // https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa752634(v=vs.85)
  // Depends: none
  queryCommandValue(_commandId: string): string {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
  // Depends: none
  execCommand(_commandId: string, _showUI?: boolean, _value?: string): boolean {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/requestStorageAccess
  // Depends: none
  requestStorageAccess(): Promise<void> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/hasStorageAccess
  // Note: alias for hasUnpartitionedCookieAccess
  hasStorageAccess(): Promise<boolean> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/hasUnpartitionedCookieAccess
  // Depends: none
  hasUnpartitionedCookieAccess(): Promise<boolean> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/exitFullscreen
  // Depends: none
  exitFullscreen(): Promise<void> {
    return unimplemented()
  }

  onfullscreenchange = null as _Document["onfullscreenchange"]
  onfullscreenerror = null as _Document["onfullscreenerror"]

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/exitPictureInPicture
  // Depends: none
  exitPictureInPicture(): Promise<void> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/exitPointerLock
  // Depends: none
  exitPointerLock(): void {
    return unimplemented()
  }

  onpointerlockchange = null as _Document["onpointerlockchange"]
  onpointerlockerror = null as _Document["onpointerlockerror"]

  // Events ======================================================================================================

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/captureEvents
  // Depends: none
  captureEvents(): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/releaseEvents
  // Depends: none
  releaseEvents(): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/releaseCapture
  // Depends: none
  releaseCapture(): void {
    return unimplemented()
  }

  onmousedown = null as _Document["onmousedown"] // unimplemented
  onmouseup = null as _Document["onmouseup"] // unimplemented
  onmousemove = null as _Document["onmousemove"] // unimplemented
  onmouseenter = null as _Document["onmouseenter"] // unimplemented
  onmouseleave = null as _Document["onmouseleave"] // unimplemented
  onmouseover = null as _Document["onmouseover"] // unimplemented
  onmouseout = null as _Document["onmouseout"] // unimplemented

  onpointerdown = null as _Document["onpointerdown"] // unimplemented
  onpointerup = null as _Document["onpointerup"] // unimplemented
  onpointermove = null as _Document["onpointermove"] // unimplemented
  onpointerenter = null as _Document["onpointerenter"] // unimplemented
  onpointerleave = null as _Document["onpointerleave"] // unimplemented
  onpointerover = null as _Document["onpointerover"] // unimplemented
  onpointerout = null as _Document["onpointerout"] // unimplemented
  onpointercancel = null as _Document["onpointercancel"] // unimplemented
  ongotpointercapture = null as _Document["ongotpointercapture"] // unimplemented
  onlostpointercapture = null as _Document["onlostpointercapture"] // unimplemented

  onclick = null as _Document["onclick"] // unimplemented
  ondblclick = null as _Document["ondblclick"] // unimplemented
  onauxclick = null as _Document["onauxclick"] // unimplemented
  oncontextmenu = null as _Document["oncontextmenu"] // unimplemented
  onwheel = null as _Document["onwheel"] // unimplemented

  onkeydown = null as _Document["onkeydown"] // unimplemented
  onkeyup = null as _Document["onkeyup"] // unimplemented
  onkeypress = null as _Document["onkeypress"] // unimplemented

  ondrag = null as _Document["ondrag"] // unimplemented
  ondragstart = null as _Document["ondragstart"] // unimplemented
  ondragend = null as _Document["ondragend"] // unimplemented
  ondragenter = null as _Document["ondragenter"] // unimplemented
  ondragleave = null as _Document["ondragleave"] // unimplemented
  ondragover = null as _Document["ondragover"] // unimplemented
  ondrop = null as _Document["ondrop"] // unimplemented

  onbeforeinput = null as _Document["onbeforeinput"] // unimplemented
  oninput = null as _Document["oninput"] // unimplemented
  onchange = null as _Document["onchange"] // unimplemented
  oninvalid = null as _Document["oninvalid"] // unimplemented
  oncancel = null as _Document["oncancel"] // unimplemented
  onreset = null as _Document["onreset"] // unimplemented
  onsubmit = null as _Document["onsubmit"] // unimplemented
  onformdata = null as _Document["onformdata"] // unimplemented

  onloadeddata = null as _Document["onloadeddata"] // unimplemented
  onloadedmetadata = null as _Document["onloadedmetadata"] // unimplemented
  onloadstart = null as _Document["onloadstart"] // unimplemented
  oncanplay = null as _Document["oncanplay"] // unimplemented
  oncanplaythrough = null as _Document["oncanplaythrough"] // unimplemented
  onplay = null as _Document["onplay"] // unimplemented
  onplaying = null as _Document["onplaying"] // unimplemented
  onseeked = null as _Document["onseeked"] // unimplemented
  onseeking = null as _Document["onseeking"] // unimplemented
  onstalled = null as _Document["onstalled"] // unimplemented
  onwaiting = null as _Document["onwaiting"] // unimplemented
  onsuspend = null as _Document["onsuspend"] // unimplemented
  onpause = null as _Document["onpause"] // unimplemented
  ontimeupdate = null as _Document["ontimeupdate"] // unimplemented
  ondurationchange = null as _Document["ondurationchange"] // unimplemented
  onratechange = null as _Document["onratechange"] // unimplemented
  onvolumechange = null as _Document["onvolumechange"] // unimplemented
  onemptied = null as _Document["onemptied"] // unimplemented
  onended = null as _Document["onended"] // unimplemented

  onprogress = null as _Document["onprogress"] // unimplemented
  onabort = null as _Document["onabort"] // unimplemented
  onbeforetoggle = null as _Document["onbeforetoggle"] // unimplemented
  ontoggle = null as _Document["ontoggle"] // unimplemented
  onslotchange = null as _Document["onslotchange"] // unimplemented
  oncuechange = null as _Document["oncuechange"] // unimplemented
  onsecuritypolicyviolation = null as _Document["onsecuritypolicyviolation"] // unimplemented

  onscroll = null as _Document["onscroll"] // unimplemented
  onscrollend = null as _Document["onscrollend"] // unimplemented

  oncopy = null as _Document["oncopy"] // unimplemented
  onpaste = null as _Document["onpaste"] // unimplemented
  oncut = null as _Document["oncut"] // unimplemented

  onselect = null as _Document["onselect"] // unimplemented
  onselectionchange = null as _Document["onselectionchange"] // unimplemented
  onselectstart = null as _Document["onselectstart"] // unimplemented

  onfocus = null as _Document["onfocus"]
  onblur = null as _Document["onblur"]
  onresize = null as _Document["onresize"]

  onerror = null as _Document["onerror"]
}
