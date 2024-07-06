// Imports
import type { callback, Nullable } from "@libs/typing"
import { type _Navigator, construct, illegalConstructor, unimplemented, version } from "./_.ts"
import { Permissions } from "./permissions.ts"
import { UserActivation } from "./user_activation.ts"
import { MimeTypeArray } from "./mime_type.ts"
import { Clipboard } from "./clipboard.ts"

export class Navigator implements _Navigator {
  constructor(_?: typeof construct) {
    illegalConstructor(arguments)
  }

  get appCodeName(): "Mozilla" {
    return "Mozilla"
  }

  set appCodeName(_: string) {
    return
  }

  get appName(): "Netscape" {
    return "Netscape"
  }

  set appName(_: string) {
    return
  }

  get appVersion(): string {
    return `${version} (@libs/dom)`
  }

  set appVersion(_: string) {
    return
  }

  get buildID(): "20181001000000" {
    return "20181001000000"
  }

  set buildID(_: string) {
    return
  }

  canShare(_data?: ShareData): boolean {
    return false
  }

  clearAppBadge(): Promise<void> {
    return Promise.resolve()
  }

  readonly #clipboard = new Clipboard(construct, this)

  get clipboard(): Clipboard {
    return this.#clipboard
  }

  set clipboard(_: Clipboard) {
    return
  }

  get cookieEnabled(): boolean {
    return false
  }

  set cookieEnabled(_: boolean) {
    return
  }

  get credentials(): CredentialsContainer {
    return unimplemented.getter<"immutable">()
  }

  get doNotTrack(): string {
    return "1"
  }

  set doNotTrack(_: string) {
    return
  }

  get geolocation(): Geolocation {
    return unimplemented.getter<"immutable">()
  }

  getAutoplayPolicy(type: "mediaelement" | "audiocontext" | HTMLMediaElement | AudioContext): string {
    // TODO(@lowlighter): use correct typings and convert back to enum value
    if (!["mediaelement", "audiocontext"].includes(type as string)) {
      throw new TypeError(`Navigator.getAutoplayPolicy: '${type}' (value of argument 1) is not a valid value for enumeration AutoplayPolicyMediaType.`)
    }
    return "disallowed"
  }

  getGamepads(): Array<Nullable<Gamepad>> {
    return []
  }

  mozGetUserMedia(_constraints: MediaStreamConstraints, _onsuccess: callback, _onerror: callback): void {
    return
  }

  globalPrivacyControl(): "true" | "false" {
    return "true"
  }

  get gpu(): GPU {
    return unimplemented.getter<"immutable">()
  }

  get hardwareConcurrency(): number {
    return globalThis.navigator.hardwareConcurrency
  }

  set hardwareConcurrency(_: number) {
    return
  }

  javaEnabled(): boolean {
    return false
  }

  get language(): string {
    return globalThis.navigator.language
  }

  set language(_: string) {
    return
  }

  readonly #languages = structuredClone(globalThis.navigator.languages)

  get languages(): string[] {
    return this.#languages
  }

  set languages(_: string[]) {
    return
  }

  get locks(): LockManager {
    return unimplemented.getter<"immutable">()
  }

  get maxTouchPoints(): number {
    return 0
  }

  set maxTouchPoints(_: number) {
    return
  }

  get mediaCapabilities(): MediaCapabilities {
    return unimplemented.getter<"immutable">()
  }

  get mediaDevices(): MediaDevices {
    return unimplemented.getter<"immutable">()
  }

  get mediaSession(): MediaSession {
    return unimplemented.getter<"immutable">()
  }

  readonly #mimeTypes = new MimeTypeArray(construct)

  get mimeTypes(): MimeTypeArray {
    return this.#mimeTypes
  }

  set mimeTypes(_: MimeTypeArray) {
    return
  }

  get onLine(): boolean {
    return true
  }

  set onLine(_: boolean) {
    return
  }

  get oscpu(): string {
    return `Deno ${Deno.version.deno}; ${Deno.build.arch}`
  }

  set oscpu(_: string) {
    return
  }

  get pdfViewerEnabled(): boolean {
    return false
  }

  set pdfViewerEnabled(_: boolean) {
    return
  }

  readonly #permissions = new Permissions(construct)

  get permissions(): Permissions {
    return this.#permissions
  }

  set permissions(_: Permissions) {
    return
  }

  get platform(): string {
    return "Deno"
  }

  set platform(_: string) {
    return
  }

  get plugins(): PluginArray {
    return unimplemented()
  }

  set plugins(_: PluginArray) {
    return
  }

  get product(): "Gecko" {
    return "Gecko"
  }

  set product(_: string) {
    return
  }

  get productSub(): "20100101" {
    return "20100101"
  }

  set productSub(_: string) {
    return
  }

  registerProtocolHandler(_scheme: string, _url: string | URL): void {
    return unimplemented()
  }

  requestMIDIAccess(_options?: MIDIOptions): Promise<MIDIAccess> {
    return unimplemented()
  }

  requestMediaKeySystemAccess(_key: string, _configuration: MediaKeySystemConfiguration[]): Promise<MediaKeySystemAccess> {
    return unimplemented()
  }

  sendBeacon(url: string, body?: BodyInit): boolean {
    fetch(url, { method: "POST", body }).then((response) => response.body?.cancel()).catch(() => null)
    return true
  }

  get serviceWorker(): ServiceWorkerContainer {
    return unimplemented.getter<"immutable">()
  }

  setAppBadge(_contents?: number): Promise<void> {
    return Promise.resolve()
  }

  share(_data?: ShareData): Promise<void> {
    return unimplemented()
  }

  get storage(): StorageManager {
    return unimplemented.getter<"immutable">()
  }

  taintEnabled(): boolean {
    return false
  }

  readonly #userActivation = new UserActivation(construct)

  get userActivation(): UserActivation {
    return this.#userActivation
  }

  set userActivation(_: UserActivation) {
    return
  }

  get userAgent(): string {
    return globalThis.navigator.userAgent
  }

  set userAgent(_: string) {
    return
  }

  get vendor(): string {
    return ""
  }

  set vendor(_: string) {
    return
  }

  get vendorSub(): string {
    return ""
  }

  set vendorSub(_: string) {
    return
  }

  get wakeLock(): WakeLock {
    return unimplemented.getter<"immutable">()
  }

  get webdriver(): boolean {
    return true
  }

  set webdriver(_: boolean) {
    return
  }

  vibrate(_pattern: VibratePattern): boolean {
    return unimplemented()
  }
}
