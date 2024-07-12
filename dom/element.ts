// Imports
import { Node } from "./node.ts"
import { type _Element, type _Node, unimplemented } from "./_.ts"
import type { Nullable } from "../typing/types.ts"
import type { Document } from "./document.ts"

/** https://developer.mozilla.org/en-US/docs/Web/API/Element */
export class Element extends Node implements _Element {
  get ownerDocument(): Document {
    return unimplemented.getter<"immutable">()
  }

  #assignedSlot = null as Nullable<HTMLSlotElement>

  get assignedSlot(): Nullable<HTMLSlotElement> {
    return this.#assignedSlot
  }

  set assignedSlot(value: Nullable<HTMLSlotElement>) {
    this.#assignedSlot = value
  }

  get attributes(): NamedNodeMap {
    return unimplemented.getter<"immutable">()
  }

  get childElementCount(): number {
    return unimplemented.getter<"immutable">()
  }

  get children(): HTMLCollection {
    return unimplemented.getter<"immutable">()
  }

  get classList(): DOMTokenList {
    return unimplemented.getter<"immutable">()
  }

  get className(): string {
    return unimplemented.getter<"immutable">()
  }

  get clientHeight(): number {
    return 0
  }

  set clientHeight(_: number) {
    return
  }

  get clientLeft(): number {
    return 0
  }

  set clientLeft(_: number) {
    return
  }

  get clientTop(): number {
    return 0
  }

  set clientTop(_: number) {
    return
  }

  get clientWidth(): number {
    return 0
  }

  set clientWidth(_: number) {
    return
  }

  get currentCSSZoom(): number {
    return unimplemented.getter<"immutable">()
  }

  get firstElementChild(): Nullable<_Element> {
    return unimplemented.getter<"immutable">()
  }

  id = "" as string

  get innerHTML(): string {
    return unimplemented.getter<"settable">()
  }

  get lastElementChild(): Nullable<_Element> {
    return unimplemented.getter<"immutable">()
  }

  get localName(): string {
    return unimplemented.getter<"immutable">()
  }

  get namespaceURI(): Nullable<string> {
    return unimplemented.getter<"immutable">()
  }

  get nextElementSibling(): Nullable<_Element> {
    return unimplemented.getter<"immutable">()
  }

  get outerHTML(): string {
    return unimplemented.getter<"settable">()
  }

  get part(): DOMTokenList {
    return unimplemented.getter<"immutable">()
  }

  get prefix(): Nullable<string> {
    return unimplemented.getter<"immutable">()
  }

  get previousElementSibling(): Nullable<_Element> {
    return unimplemented.getter<"immutable">()
  }

  get scrollHeight(): number {
    return 0
  }

  set scrollHeight(_: number) {
    return
  }

  get scrollLeft(): number {
    return 0
  }

  set scrollLeft(_: number) {
    return
  }

  get scrollLeftMax(): number {
    return 0
  }

  set scrollLeftMax(_: number) {
    return
  }

  get scrollTop(): number {
    return 0
  }

  set scrollTop(_: number) {
    return
  }

  get scrollTopMax(): number {
    return 0
  }

  set scrollTopMax(_: number) {
    return
  }

  get scrollWidth(): number {
    return 0
  }

  set scrollWidth(_: number) {
    return
  }

  get shadowRoot(): Nullable<ShadowRoot> {
    return unimplemented.getter<"immutable">()
  }

  get slot(): string {
    return unimplemented.getter<"immutable">()
  }

  get tagName(): string {
    return unimplemented.getter<"immutable">()
  }

  after(..._nodes: (string | globalThis.Node)[]): void {
    return unimplemented()
  }

  animate(_keyframes: Keyframe[] | PropertyIndexedKeyframes | null, _options?: number | KeyframeAnimationOptions): Animation {
    return unimplemented()
  }

  append(..._nodes: (string | globalThis.Node)[]): void {
    return unimplemented()
  }

  attachShadow(_init: ShadowRootInit): ShadowRoot {
    return unimplemented()
  }

  before(..._nodes: (string | globalThis.Node)[]): void {
    return unimplemented()
  }

  checkVisibility(_options?: CheckVisibilityOptions | undefined): boolean {
    return unimplemented()
  }

  closest(_selectors: string): Nullable<_Element> {
    return unimplemented()
  }

  computedStyleMap(): StylePropertyMapReadOnly {
    return unimplemented()
  }

  getAnimations(_options?: GetAnimationsOptions | undefined): Animation[] {
    return unimplemented()
  }

  getAttribute(_qualifiedName: string): Nullable<string> {
    return unimplemented()
  }

  getAttributeNS(_namespace: Nullable<string>, _localName: string): Nullable<string> {
    return unimplemented()
  }

  getAttributeNames(): string[] {
    return unimplemented()
  }

  getAttributeNode(_name: string): Attr {
    return unimplemented()
  }

  getAttributeNodeNS(_namespace: Nullable<string>, _localName: string): Attr {
    return unimplemented()
  }

  getBoundingClientRect(): DOMRect {
    return unimplemented()
  }

  getClientRects(): DOMRectList {
    return unimplemented()
  }

  getElementsByClassName(_classNames: string): HTMLCollectionOf<_Element> {
    return unimplemented()
  }

  getElementsByTagName(_qualifiedName: string): HTMLCollectionOf<_Element> {
    return unimplemented()
  }

  getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>
  getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>
  getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1998/Math/MathML", localName: string): HTMLCollectionOf<MathMLElement>
  getElementsByTagNameNS(_namespace: string | null, _localName: string): HTMLCollectionOf<_Element> {
    return unimplemented()
  }

  getHTML(): string {
    return unimplemented()
  }

  hasAttribute(_qualifiedName: string): boolean {
    return unimplemented()
  }

  hasAttributeNS(_namespace: Nullable<string>, _localName: string): boolean {
    return unimplemented()
  }

  hasAttributes(): boolean {
    return unimplemented()
  }

  hasPointerCapture(_pointerId: number): boolean {
    return unimplemented()
  }

  insertAdjacentElement(_where: InsertPosition, _element: _Element): Nullable<_Element> {
    return unimplemented()
  }

  insertAdjacentHTML(_where: InsertPosition, _html: string): void {
    return unimplemented()
  }

  insertAdjacentText(_where: InsertPosition, _text: string): void {
    return unimplemented()
  }

  matches(_selectors: string): boolean {
    return unimplemented()
  }

  webkitMatchesSelector(selectors: string): boolean {
    return this.matches(selectors)
  }

  prepend(..._nodes: (string | globalThis.Node)[]): void {
    return unimplemented()
  }

  querySelector(_selectors: string): Nullable<_Element> {
    return unimplemented()
  }

  querySelectorAll(_selectors: string): NodeListOf<_Element> {
    return unimplemented()
  }

  releasePointerCapture(_pointerId: number): void {
    return unimplemented()
  }

  remove(): void {
    return unimplemented()
  }

  removeAttribute(_qualifiedName: string): void {
    return unimplemented()
  }

  removeAttributeNode(_attr: Attr): Attr {
    return unimplemented()
  }

  removeAttributeNS(_namespace: Nullable<string>, _localName: string): void {
    return unimplemented()
  }

  replaceChildren(..._nodes: (string | globalThis.Node)[]): void {
    return unimplemented()
  }

  replaceWith(..._nodes: (string | globalThis.Node)[]): void {
    return unimplemented()
  }

  removeChild<T extends _Node>(_child: T): T {
    return unimplemented()
  }

  requestFullscreen(_options?: FullscreenOptions | undefined): Promise<void> {
    return unimplemented()
  }

  requestPointerLock(): void {
    return unimplemented()
  }

  scroll(_options?: ScrollToOptions | number | undefined): void {
    return unimplemented()
  }

  scrollBy(_options?: ScrollToOptions | number | undefined): void {
    return unimplemented()
  }

  scrollIntoView(_arg?: boolean | ScrollIntoViewOptions | undefined): void {
    return unimplemented()
  }

  scrollTo(_options?: ScrollToOptions | number | undefined): void {
    return unimplemented()
  }

  setAttribute(_qualifiedName: string, _value: string): void {
    return unimplemented()
  }

  setAttributeNS(_namespace: Nullable<string>, _qualifiedName: string, _value: string): void {
    return unimplemented()
  }

  setAttributeNode(_attr: Attr): Attr {
    return unimplemented()
  }

  setAttributeNodeNS(_attr: Attr): Attr {
    return unimplemented()
  }

  setCapture(_capture?: boolean | undefined): void {
    return unimplemented()
  }

  setHTML(_html: string): void {
    return unimplemented()
  }

  setHTMLUnsafe(_html: string): void {
    return unimplemented()
  }

  setPointerCapture(_pointerId: number): void {
    return unimplemented()
  }

  toggleAttribute(_qualifiedName: string, _force?: boolean | undefined): boolean {
    return unimplemented()
  }

  onfullscreenchange = null as _Element["onfullscreenchange"]
  onfullscreenerror = null as _Element["onfullscreenerror"]

  ariaAtomic = null as Nullable<string>
  ariaAutoComplete = null as Nullable<string>
  ariaBusy = null as Nullable<string>
  ariaBrailleLabel = null as Nullable<string>
  ariaBrailleRoleDescription = null as Nullable<string>
  ariaChecked = null as Nullable<string>
  ariaColCount = null as Nullable<string>
  ariaColIndex = null as Nullable<string>
  ariaColSpan = null as Nullable<string>
  ariaCurrent = null as Nullable<string>
  ariaDescription = null as Nullable<string>
  ariaDisabled = null as Nullable<string>
  ariaExpanded = null as Nullable<string>
  ariaHasPopup = null as Nullable<string>
  ariaHidden = null as Nullable<string>
  ariaKeyShortcuts = null as Nullable<string>
  ariaLabel = null as Nullable<string>
  ariaLevel = null as Nullable<string>
  ariaLive = null as Nullable<string>
  ariaModal = null as Nullable<string>
  ariaMultiLine = null as Nullable<string>
  ariaMultiSelectable = null as Nullable<string>
  ariaOrientation = null as Nullable<string>
  ariaPlaceholder = null as Nullable<string>
  ariaPosInSet = null as Nullable<string>
  ariaPressed = null as Nullable<string>
  ariaReadOnly = null as Nullable<string>
  ariaRelevant = null as Nullable<string>
  ariaRequired = null as Nullable<string>
  ariaRoleDescription = null as Nullable<string>
  ariaRowCount = null as Nullable<string>
  ariaRowIndex = null as Nullable<string>
  ariaRowSpan = null as Nullable<string>
  ariaSelected = null as Nullable<string>
  ariaSetSize = null as Nullable<string>
  ariaSort = null as Nullable<string>
  ariaValueMax = null as Nullable<string>
  ariaValueMin = null as Nullable<string>
  ariaValueNow = null as Nullable<string>
  ariaValueText = null as Nullable<string>
  role = null as Nullable<string>
  ariaInvalid = null as Nullable<string>
}
