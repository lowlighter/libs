// Imports
import type { callback, Nullable } from "@libs/typing"
import { type _Navigator, illegal, internal, unimplemented } from "./_.ts"
import { Permissions } from "./permissions.ts"
import { UserActivation } from "./user_activation.ts"
import { MimeTypeArray } from "./mime_type.ts"
import { Clipboard } from "./clipboard.ts"

/** https://developer.mozilla.org/en-US/docs/Web/API/Navigator */
export class Navigator implements _Navigator {
  constructor(_ = {} as { [internal]?: boolean }) {
    illegal(arguments)
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/appCodeName
  // Note: hardcoded
  get appCodeName(): "Mozilla" {
    return "Mozilla"
  }

  set appCodeName(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/appName
  // Note: hardcoded
  get appName(): "Netscape" {
    return "Netscape"
  }

  set appName(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/appVersion
  // Note: arbitrary set to "4.0"
  get appVersion(): string {
    return "4.0"
  }

  set appVersion(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/buildID
  // Note: hardcoded (Firefox 64+)
  get buildID(): "20181001000000" {
    return "20181001000000"
  }

  set buildID(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/product
  // Note: hardcoded
  get product(): "Gecko" {
    return "Gecko"
  }

  set product(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/productSub
  // Note: arbitrary set to "20100101"
  get productSub(): "20100101" | "20030107" {
    return "20100101"
  }

  set productSub(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vendor
  // Note: harcoded (Firefox)
  get vendor(): string {
    return ""
  }

  set vendor(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vendorSub
  // Note: hardcoded
  get vendorSub(): string {
    return ""
  }

  set vendorSub(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent
  // Note: inherited from Deno
  get userAgent(): string {
    return navigator.userAgent
  }

  set userAgent(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/platform
  // Note: arbitrary set
  get platform(): string {
    return "Deno"
  }

  set platform(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/oscpu
  // Note: arbitrary set
  get oscpu(): string {
    return `Deno ${Deno.version.deno}; ${Deno.build.arch}`
  }

  set oscpu(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/hardwareConcurrency
  // Note: inherited from Deno
  get hardwareConcurrency(): number {
    return navigator.hardwareConcurrency
  }

  set hardwareConcurrency(_: number) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language
  // Note: inherited from Deno
  get language(): string {
    return navigator.language
  }

  set language(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages
  // Note: inherited from Deno
  get languages(): string[] {
    return this.#languages
  }

  set languages(_: string[]) {
    return
  }

  readonly #languages = structuredClone(navigator.languages)

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/doNotTrack
  // Note: arbitrary set to "1" by default
  get doNotTrack(): Nullable<"1" | "0"> {
    return "1"
  }

  set doNotTrack(_: string) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/cookieEnabled
  // Note: forced as cookies are not currently not supported
  get cookieEnabled(): boolean {
    return false
  }

  set cookieEnabled(_: boolean) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/globalPrivacyControl
  // Note: arbitrary set to "true" by default
  globalPrivacyControl(): "true" | "false" {
    return "true"
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/webdriver
  // Note: forced as environment is automated
  get webdriver(): boolean {
    return true
  }

  set webdriver(_: boolean) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userActivation
  get userActivation(): UserActivation {
    return this.#userActivation
  }

  set userActivation(_: UserActivation) {
    return
  }
  readonly #userActivation = new UserActivation({ [internal]: true })

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/permissions
  get permissions(): Permissions {
    return this.#permissions
  }

  set permissions(_: Permissions) {
    return
  }

  readonly #permissions = new Permissions({ [internal]: true })

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
  get clipboard(): Clipboard {
    return this.#clipboard
  }

  set clipboard(_: Clipboard) {
    return
  }

  readonly #clipboard = new Clipboard({ [internal]: true, navigator: this })

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/credentials
  // Depends: CredentialsContainer implementation
  get credentials(): CredentialsContainer {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/geolocation
  // Depends: Geolocation implementation
  get geolocation(): Geolocation {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/gpu
  // Depends: GPU implementation
  get gpu(): GPU {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/locks
  // Depends: LockManager implementation
  get locks(): LockManager {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/wakeLock
  // Depends: WakeLock implementation
  get wakeLock(): WakeLock {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/storage
  // Depends: StorageManager implementation
  get storage(): StorageManager {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/serviceWorker
  // Depends: ServiceWorkerContainer implementation
  get serviceWorker(): ServiceWorkerContainer {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/plugins
  // Depends: PluginArray implementation
  get plugins(): PluginArray {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mimeTypes
  get mimeTypes(): MimeTypeArray {
    return this.#mimeTypes
  }

  set mimeTypes(_: MimeTypeArray) {
    return
  }

  readonly #mimeTypes = new MimeTypeArray({ [internal]: true })

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/setAppBadge
  // Note: N/A in this context
  setAppBadge(_contents?: number): Promise<void> {
    return Promise.resolve()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clearAppBadge
  // Note: N/A in this context
  clearAppBadge(): Promise<void> {
    return Promise.resolve()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
  // Note: N/A in this context
  vibrate(_pattern: VibratePattern): boolean {
    return true
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare
  // Note: N/A in this context
  canShare(_data?: ShareData): boolean {
    return false
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
  // Note: N/A in this context
  share(_data?: ShareData): Promise<void> {
    return Promise.reject(new DOMException("User activation was already consumed or share() was not activated by a user gesture."))
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/maxTouchPoints
  // Note: forced as no touch input is available
  get maxTouchPoints(): number {
    return 0
  }

  set maxTouchPoints(_: number) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getGamepads
  // Note: forced as no gamepads are available
  getGamepads(): Array<Nullable<Gamepad>> {
    return []
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getAutoplayPolicy
  getAutoplayPolicy(type: "mediaelement" | "audiocontext" | HTMLMediaElement | AudioContext): string {
    if (!["mediaelement", "audiocontext"].includes(type as string)) {
      throw new TypeError(`Navigator.getAutoplayPolicy: '${type}' (value of argument 1) is not a valid value for enumeration AutoplayPolicyMediaType.`)
    }
    return "disallowed"
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia
  // Note: undefined on Firefox
  getUserMedia(_constraints: MediaStreamConstraints, _onsuccess: callback, _onerror: callback): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia
  // Note: alias for getUserMedia
  mozGetUserMedia(_constraints: MediaStreamConstraints, _onsuccess: callback, _onerror: callback): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/requestMIDIAccess
  requestMIDIAccess(_options?: MIDIOptions): Promise<MIDIAccess> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/requestMediaKeySystemAccess
  requestMediaKeySystemAccess(_key: string, _configuration: MediaKeySystemConfiguration[]): Promise<MediaKeySystemAccess> {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mediaCapabilities
  // Depends: MediaCapabilities implementation
  get mediaCapabilities(): MediaCapabilities {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mediaDevices
  // Depends: MediaDevices implementation
  get mediaDevices(): MediaDevices {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mediaSession
  // Depends: MediaSession implementation
  get mediaSession(): MediaSession {
    return unimplemented.getter<"immutable">()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler
  registerProtocolHandler(_scheme: string, _url: string | URL): void {
    return unimplemented()
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/pdfViewerEnabled
  // Note: forced as PDF viewer is not currently supported
  get pdfViewerEnabled(): boolean {
    return false
  }

  set pdfViewerEnabled(_: boolean) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
  // Note: forced for consistency
  get onLine(): boolean {
    return true
  }

  set onLine(_: boolean) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
  sendBeacon(url: string, body?: BodyInit): boolean {
    this.#beacons.push(fetch(url, { method: "POST", body }).then((response) => response.body?.cancel()).catch(() => null))
    return true
  }

  readonly #beacons = [] as Promise<unknown>[]

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/javaEnabled
  // Note: hardcoded
  javaEnabled(): boolean {
    return false
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/taintEnabled
  // Note: hardcoded
  taintEnabled(): boolean {
    return false
  }

  /** Internal acessor. */
  get [internal](): { beacons: Promise<unknown>[] } {
    return {
      beacons: this.#beacons,
    }
  }
}
