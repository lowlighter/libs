// Imports
import { acceptsLanguages } from "@std/http/negotiation"
import * as YAML from "@std/yaml/parse"
import { pluralize } from "@libs/toolbox/pluralize"
import { timezone as tz } from "@libs/toolbox/timezone"
import { evaluate, EvaluationReturn } from "@libs/toolbox/evaluate"
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
  constructor({ language = globalThis.navigator?.language, timezone = tz }: { language?: string; timezone?: string } = {}) {
    this.language = language ?? I18n.fallback
    this.timezone = timezone
    this.#log = getLogger(["i18n", this.language])
  }

  /** Logger. */
  readonly #log: Logger

  /** Registered translations, indexed by language and by key. */
  static readonly #storage = new Map<string, Map<string, string>>()

  /** Fallback language used when a key is missing in the requested language. */
  static fallback = "en"

  /** Configured language. */
  readonly language: string

  /** Timezone. */
  readonly timezone: string

  /** Returns the translation for a given key. */
  get(key: string, context?: Record<string, unknown>): string {
    return this.#translate(key, context)
  }

  /** Register a new translation. */
  set(key: string, value: string): this {
    const translations = I18n.#storage.getOrInsert(this.language, new Map())
    translations.set(key, value)
    this.#log.trace(`registered translation "${key}":\n${value}`)
    return this
  }

  /** Loads translations from a YAML file. */
  async load(source: string | URL): Promise<this> {
    this.#log.debug(`loading translations from: ${source}`)
    const response = await fetch(source)
    if (!response.ok)
      throw new Error(`Failed to load translations from "${source}" (HTTP ${response.status})`)
    const content = await response.text()
    const parsed = YAML.parse(content) as Record<string, unknown>
    if ((!parsed) || (typeof parsed !== "object") || (Array.isArray(parsed)))
      throw new Error(`Failed to parse translations from "${source}" (not a valid YAML object)`)
    for (const [key, value] of Object.entries(parsed))
      this.set(key, `${value}`)
    this.#log.info(`loaded ${Object.keys(parsed).length} translations from: ${source}`)
    return this
  }

  /** Resolve a key against a language. */
  #translate(key: string, context: Record<string, unknown> = {}, { language = this.language } = {}): string {
    for (const lang of new Set([language, this.language, I18n.fallback].filter(Boolean))) {
      const value = I18n.#storage.get(lang)?.get(key)
      if (value !== undefined)
        return evaluate(value, context, { sync: true, return: EvaluationReturn.String })
    }
    this.#log.warn(`missing translation for key "${key}" (${language})`)
    return key
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
    return new I18n({ language: language as string, timezone: timezone ?? this.timezone })
  }
}

/** Default {@linkcode I18n} instance. */
export const i18n = new I18n() as I18n
