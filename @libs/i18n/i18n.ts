// Imports
import { acceptsLanguages } from "@std/http/negotiation"
import * as YAML from "@std/yaml/parse"
import { pluralize } from "@libs/toolbox/pluralize"
import { timezone as tz } from "@libs/toolbox/timezone"
import { evaluate, EvaluationReturn } from "@libs/toolbox/evaluate"
import { markdown } from "@libs/markdown"
import { getLogger, type Logger } from "@logtape/logtape"

/**
 * Internationalization helper.
 *
 * ```ts
 * import { i18n } from "./i18n.ts"
 * i18n.for("en").set("sayhello", "hello ${name}")
 * console.assert(i18n.for("en").get("sayhello", { name: "john" }) === "hello john")
 * ```
 */
export class I18n {
  /** Constructor. */
  constructor({ language, timezone = tz, missing = "key" }: I18nOptions = {}) {
    this.#language = language
    this.timezone = timezone
    this.#missing = missing
    this.#log = getLogger(["i18n", this.language])
  }

  /** Logger. */
  readonly #log: Logger

  /** Registered translations, indexed by language and by normalized key. */
  static readonly #storage = new Map<string, Map<string, string>>()

  /** Memoized resolutions, keyed by their resolution inputs and cleared whenever translations change. */
  static readonly #cache = new Map<string, string>()

  /** Fallback language used when a key is missing in the requested language. */
  static fallback = "en"

  /** Ambient current language, readable and writable at runtime, used by instances that were not scoped to an explicit language. */
  static current: string = globalThis.navigator?.language ?? I18n.fallback

  /** Explicit language this instance was scoped to, if any. */
  readonly #language?: string

  /** Default policy applied when a key resolves to nothing. */
  readonly #missing: I18nMissing

  /** Timezone. */
  readonly timezone: string

  /** Configured language, falling back to {@linkcode I18n.current} when this instance was not scoped to an explicit language. */
  get language(): string {
    return this.#language ?? I18n.current
  }

  /** Returns the translation for a given key, interpolating `${placeholders}` from the context. */
  get(key: string, context?: Record<string, unknown>, { language = this.language, missing }: I18nGetOptions = {}): string {
    const id = I18n.#normalize(key)
    const value = this.#lookup(id, language)
    if (value === undefined)
      return this.#miss(key, language, missing)
    const cached = this.#key("get", language, id, false, context)
    if (cached && I18n.#cache.has(cached))
      return I18n.#cache.get(cached)!
    const result = this.#interpolate(value, context)
    if (cached)
      this.#memoize(cached, result)
    return result
  }

  /** Returns the translation for a given key, rendered as markdown (inline by default, or as block-level content when `inline` is set to `false`). */
  md(key: string, context?: Record<string, unknown>, { language = this.language, missing, inline = true }: I18nMarkdownOptions = {}): string {
    const id = I18n.#normalize(key)
    const value = this.#lookup(id, language)
    if (value === undefined)
      return this.#render(this.#miss(key, language, missing), inline)
    const cached = this.#key("md", language, id, inline, context)
    if (cached && I18n.#cache.has(cached))
      return I18n.#cache.get(cached)!
    const result = this.#render(this.#interpolate(value, context), inline)
    if (cached)
      this.#memoize(cached, result)
    return result
  }

  /** Register a single translation for the configured language. */
  set(key: string, value: string): this
  /** Register a whole record of translations at once for the configured language, merging with (and overwriting) any already registered. */
  set(translations: Record<string, string>): this
  set(key: string | Record<string, string>, value?: string): this {
    const translations = this.#translations()
    const entries = typeof key === "string" ? [[key, value] as [string, string]] : Object.entries(key)
    for (const [id, text] of entries)
      translations.set(I18n.#normalize(id), `${text}`)
    I18n.#cache.clear()
    this.#log.trace(`registered ${entries.length} translation(s) for "${this.language}"`)
    return this
  }

  /** Loads translations from a YAML (or JSON) source and registers them for the configured language. */
  async load(source: string | URL): Promise<this> {
    this.#log.debug(`loading translations from: ${source}`)
    const response = await fetch(source)
    if (!response.ok)
      throw new Error(`Failed to load translations from "${source}" (HTTP ${response.status})`)
    const parsed = YAML.parse(await response.text())
    if ((!parsed) || (typeof parsed !== "object") || (Array.isArray(parsed)))
      throw new Error(`Failed to parse translations from "${source}" (not a valid YAML object)`)
    this.set(parsed as Record<string, string>)
    this.#log.info(`loaded ${Object.keys(parsed).length} translations from: ${source}`)
    return this
  }

  /** Returns whether any translations are registered for a language (defaults to the configured language). */
  loaded(language: string = this.language): boolean {
    return (I18n.#storage.get(language)?.size ?? 0) > 0
  }

  /**
   * Formats a time.
   *
   * ```ts
   * import { i18n } from "./i18n.ts"
   * const format = i18n.for("en", { timezone: "UTC" })
   * console.assert(format.time("2020-01-01T00:00:00Z") === "00:00:00")
   * ```
   */
  time(time: string): string {
    const intl = new Intl.DateTimeFormat(this.language, { timeZone: this.timezone, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" })
    return intl.format(new Date(time))
  }

  /**
   * Formats a date.
   *
   * ```ts
   * import { i18n } from "./i18n.ts"
   * const format = i18n.for("en", { timezone: "UTC" })
   * console.assert(format.date("2020-01-01T00:00:00Z") === "Jan 1, 2020")
   * console.assert(format.date("2020-01-01T00:00:00Z", { year: undefined }) === "Jan 1")
   * console.assert(format.date("2020-01-01T00:00:00Z", { day: undefined, month: undefined }) === "2020")
   * ```
   */
  date(date: string, options: Intl.DateTimeFormatOptions = {}): string {
    const intl = new Intl.DateTimeFormat(this.language, {
      timeZone: this.timezone,
      day: "day" in options ? options.day : "numeric",
      month: "month" in options ? options.month : "short",
      year: "year" in options ? options.year : "numeric",
    })
    return intl.format(new Date(date))
  }

  /**
   * Formats a number and pluralizes the text if necessary.
   *
   * ```ts
   * import { i18n } from "./i18n.ts"
   * const format = i18n.for("en")
   * console.assert(format.number("cat", 1) === "1 cat")
   * console.assert(format.number("cat", 1000) === "1K cats")
   * ```
   */
  number(text: string, number: number, options?: Intl.NumberFormatOptions & { format?: "bytes" }): string
  /**
   * Formats a number.
   *
   * ```ts
   * import { i18n } from "./i18n.ts"
   * const format = i18n.for("en")
   * console.assert(format.number(1) === "1")
   * console.assert(format.number(1000) === "1K")
   * console.assert(format.number(1500000, { format: "bytes" }) === "1.5MB")
   * ```
   */
  number(number: number, options?: Intl.NumberFormatOptions & { format?: "bytes" }): string
  number(): string {
    let [text, number, options] = arguments as unknown as [string, number, (Intl.NumberFormatOptions & { format?: "bytes" })?]
    if (typeof text === "number") {
      ;[text, number, options] = ["", text, number as unknown as typeof options]
    }
    const { format, ...overrides } = options ?? {}
    let value = number
    let defaults: Intl.NumberFormatOptions = { notation: "compact", compactDisplay: "short", maximumFractionDigits: 1 }
    if (format === "bytes") {
      const units = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte", "petabyte"] as const
      const scale = Math.max(0, Math.min(units.length - 1, Math.floor(Math.log10(Math.abs(value) || 1) / 3)))
      value /= 1000 ** scale
      defaults = { style: "unit", unit: units[scale], unitDisplay: "narrow", maximumFractionDigits: 1 }
    }
    const intl = new Intl.NumberFormat(this.language, { ...defaults, ...overrides })
    return `${intl.format(value).replace(/(\d)\s/, "$1")} ${number === 1 ? text : pluralize(text)}`.trim()
  }

  /**
   * Formats a percentage.
   *
   * ```ts
   * import { i18n } from "./i18n.ts"
   * const format = i18n.for("en")
   * console.assert(format.percentage(0.1234) === "12.34%")
   * ```
   */
  percentage(value: number, digits = 2): string {
    const intl = Intl.NumberFormat(this.language, { style: "percent", minimumFractionDigits: 0, maximumFractionDigits: digits })
    return intl.format(value).replaceAll(/\s/g, "")
  }

  /**
   * Returns a new {@linkcode I18n} instance scoped to the specified language.
   * When passing a {@linkcode Request}, the language is negotiated from its `Accept-Language` header against registered languages.
   */
  for(language: string | Request, { timezone }: { timezone?: string } = {}): I18n {
    if (language instanceof Request)
      language = acceptsLanguages(language, ...I18n.#storage.keys()) ?? I18n.fallback
    return new I18n({ language: language as string, timezone: timezone ?? this.timezone, missing: this.#missing })
  }

  /** Returns the translations map for the configured language, creating it if necessary. */
  #translations(): Map<string, string> {
    let translations = I18n.#storage.get(this.language)
    if (!translations)
      I18n.#storage.set(this.language, translations = new Map())
    return translations
  }

  /** Resolves a normalized key against the requested language, then the configured language, then the fallback. */
  #lookup(id: string, language: string): string | undefined {
    for (const lang of new Set([language, this.language, I18n.fallback].filter(Boolean))) {
      const value = I18n.#storage.get(lang)?.get(id)
      if (value !== undefined)
        return value
    }
    return undefined
  }

  /** Interpolates a translation value against a context, degrading to the raw value when evaluation fails. */
  #interpolate(value: string, context: Record<string, unknown> = {}): string {
    try {
      return evaluate(value, context, { sync: true, return: EvaluationReturn.String })
    } catch (error) {
      this.#log.warn(`failed to interpolate translation, returning it verbatim:\n${value}\n${error}`)
      return value
    }
  }

  /** Renders a string as markdown, degrading to the raw string when rendering fails. */
  #render(value: string, inline: boolean): string {
    try {
      return markdown(value, { inline })
    } catch (error) {
      this.#log.warn(`failed to render markdown, returning it verbatim:\n${value}\n${error}`)
      return value
    }
  }

  /** Applies the miss policy for an unresolved key. */
  #miss(key: string, language: string, missing?: I18nMissing): string {
    const policy = missing ?? this.#missing
    this.#log.debug(`missing translation for key "${key}" (${language})`)
    if (typeof policy === "function")
      return policy(key, language)
    return policy === "empty" ? "" : key
  }

  /** Builds a memo key for a resolution, or `null` when the context cannot be serialized. */
  #key(mode: string, language: string, id: string, inline: boolean, context?: Record<string, unknown>): string | null {
    try {
      return `${mode} ${language} ${this.language} ${I18n.fallback} ${inline} ${id} ${JSON.stringify(context ?? {})}`
    } catch {
      return null
    }
  }

  /** Stores a resolved value in the memo, clearing it first when it has grown too large. */
  #memoize(key: string, value: string): void {
    if (I18n.#cache.size > 1024)
      I18n.#cache.clear()
    I18n.#cache.set(key, value)
  }

  /** Normalizes a key so that lookups are case-insensitive. */
  static #normalize(key: string): string {
    return `${key}`.toLowerCase()
  }
}

/** Default {@linkcode I18n} instance. */
export const i18n = new I18n() as I18n

/** Policy applied when a translation key resolves to nothing: return the key as-is (`"key"`, the default), return an empty string (`"empty"`), or compute a replacement from the key and language. */
export type I18nMissing = "key" | "empty" | ((key: string, language: string) => string)

/** Options for {@linkcode I18n}. */
export type I18nOptions = {
  /** Language to scope the instance to. Defaults to {@linkcode I18n.current}. */
  language?: string
  /** Timezone used by date and time formatting. */
  timezone?: string
  /** Default policy applied when a key resolves to nothing. */
  missing?: I18nMissing
}

/** Options for {@linkcode I18n.get}. */
export type I18nGetOptions = {
  /** Resolve the key in this language instead of the configured one. */
  language?: string
  /** Override the miss policy for this lookup. */
  missing?: I18nMissing
}

/** Options for {@linkcode I18n.md}. */
export type I18nMarkdownOptions = I18nGetOptions & {
  /** Render inline-level markdown only (the default), omitting the surrounding block-level wrapper (e.g. `<p>`); set to `false` for block-level content. */
  inline?: boolean
}
