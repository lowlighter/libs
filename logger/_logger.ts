/**
 * Logger class.
 *
 * This class provides a simple and efficient logging framework intended to supersed the native {@link https://developer.mozilla.org/en-US/docs/Web/API/console | console} by providing additional features and metadata.
 *
 * It supports out-of-the-box colored output, a log level mechanism (that honor `LOG_LEVEL` environment variable), a tag system, and a variety of options to customize the output.
 * A neat addition is the ability to display caller information (file, name, line) which can be especially useful for debugging.
 *
 * ```ts
 * import { Logger } from "./mod.ts"
 *
 * // Configure logger
 * const tags = { foo: "bar" }
 * const log = new Logger({ level: "trace", tags, date: true, time: true, delta:true, caller:true })
 *
 * // Print logs
 * log
 *   .error("🍱 bento")
 *   .warn("🍜 ramen")
 *   .ok("🍚 gohan")
 *   .info("🍣 sushi")
 *   .log("🍥 narutomaki")
 *   .debug("🍡 dango")
 *   .wdebug("🍵 matcha")
 *   .trace("🍙 onigiri")
 *   .probe("🥟 gyoza")
 *
 * // Create a new inherited logger with additional tags
 * log.with({ bar: "true" }).log("🍶 sake")
 * ```
 *
 * @author Simon Lecoq (lowlighter)
 * @license MIT
 */
// deno-lint-ignore ban-types
export class Logger<T extends Record<PropertyKey, unknown> = {}> {
  /** Constructor. */
  constructor({ level, format, output, tags, censor, ...options } = {} as LoggerOptions<T>) {
    if (globalThis.Deno?.permissions.querySync?.({ name: "env", variable: "LOG_LEVEL" }).state === "granted") {
      // deno-lint-ignore no-explicit-any
      level ??= (globalThis as any).process?.env.LOG_LEVEL as LoggerOptions<T>["level"]
    }
    this.#output = output || (output === null) ? output : console
    this.#level = Logger.level.log as level
    this.#format = Logger.format.text as formatter
    this.#options = { date: false, time: false, delta: true, caller: { file: false, name: false, line: false, fileformat: null } }
    this.level(level).format(format).options(options)
    this.tags = (tags ?? {}) as Logger<T>["tags"]
    if (censor) {
      ;[censor].flat().forEach((censor) => this.censor(censor))
    }
  }

  /** Logger output streams. */
  readonly #output

  /** Logger options. */
  #options: options

  /** Get logger options. */
  options(): options
  /**
   * Set logger options.
   * Only provided options will be updated, other options will be left untouched.
   */
  options(options: LoggerOptions<T>): this
  /** Set or get logger options. */
  options(options?: LoggerOptions<T>): this | options {
    if (!options) {
      return structuredClone(this.#options)
    }
    if ("date" in options) {
      this.#options.date = options.date
    }
    if ("time" in options) {
      this.#options.time = options.time
    }
    if ("delta" in options) {
      this.#options.delta = options.delta
    }
    if ("caller" in options) {
      switch (true) {
        case options.caller === true:
          this.#options.caller = { file: true, name: true, line: true, fileformat: this.#options.caller.fileformat }
          break
        case options.caller === false:
          this.#options.caller = { file: false, name: false, line: false, fileformat: this.#options.caller.fileformat }
          break
        case typeof options.caller === "object":
          if ("file" in options.caller) {
            this.#options.caller.file = options.caller.file
          }
          if ("name" in options.caller) {
            this.#options.caller.name = options.caller.name
          }
          if ("line" in options.caller) {
            this.#options.caller.line = options.caller.line
          }
          if (("fileformat" in options.caller) && (typeof options.caller.fileformat !== "undefined")) {
            this.#options.caller.fileformat = options.caller.fileformat
          }
      }
    }
    return this
  }

  /** Logger level (numeric). */
  #level

  /** Get logger level. */
  level(): level
  /**
   * Set logger level.
   * Both numeric and named levels are supported.
   */
  level(level: LoggerOptions<T>["level"]): this
  /** Set or get logger level. */
  level(level?: LoggerOptions<T>["level"]): this | level {
    if (!arguments.length) {
      return this.#level >= 0 ? this.#level : NaN
    }
    if (!Number.isNaN(Number.parseInt(`${level}`))) {
      level = Number.parseInt(`${level}`)
    }
    if ((typeof level === "string") && (level in Logger.level)) {
      level = Logger.level[level]
    }
    if (typeof level === "number") {
      this.#level = (!Number.isNaN(level)) && (level >= 0) ? level : -1
    }
    return this
  }

  /** Censored values. */
  // deno-lint-ignore no-explicit-any
  readonly #censored_values = new Map<string | RegExp, string | ((substring: string, ...args: any[]) => string)>()

  /** Censored keys. */
  // deno-lint-ignore no-explicit-any
  readonly #censored_keys = new Map<string | RegExp, string | ((substring: string, ...args: any[]) => string)>()

  /**
   * Register censored values or keys.
   *
   * Any time a message is logged, any censored content will be replaced.
   * Censorship only applies to tags and values, not to the metadata.
   *
   * Note that not all formatters may support this feature.
   *
   * ```ts
   * import { Logger } from "./mod.ts"
   *
   * const log = new Logger().censor({ values: [/^api_/], keys: ["password"], replace: "****" })
   * log.with({ key: "api_foobar" }).log({ user: "foo", password: "bar" })
   * ```
   */
  // deno-lint-ignore no-explicit-any
  censor({ values = [], keys = [], replace = "[[redacted]]" }: { values?: Array<string | RegExp>; keys?: Array<string | RegExp>; replace?: string | ((substring: string, ...args: any[]) => string) }): this {
    values.forEach((value) => this.#censored_values.set(value, replace))
    keys.forEach((key) => this.#censored_keys.set(key, replace))
    return this
  }

  #censor(value: unknown) {
    if (typeof value === "string") {
      return this.#censor_string(value)
    }
    if ((typeof value === "object") && value) {
      return this.#censor_object(value as Record<PropertyKey, unknown>)
    }
    return value
  }

  /** Censor a string. */
  #censor_string(value: string) {
    for (const [censored, replacement] of this.#censored_values) {
      value = value.replaceAll((censored instanceof RegExp) && (!censored.flags.includes("g")) ? new RegExp(censored.source, "g") : censored, replacement as string)
    }
    return value
  }

  /**
   * Censor an object.
   * A clone of the object will be returned with censored values.
   * This does not use {@link JSON.stringify}, {@link structuredClone} or any serialization method to keep unserializable values such as functions or special values.
   */
  #censor_object(original: Record<PropertyKey, unknown>, clone = {} as Record<PropertyKey, unknown>) {
    for (const [key, value] of Object.entries(original)) {
      clone[key] = value
      if ((typeof value === "object") && value) {
        clone[key] = this.#censor_object(value as Record<PropertyKey, unknown>)
        continue
      }
      if (typeof value === "string") {
        clone[key] = this.#censor_string(value)
        for (const [censored, replacement] of this.#censored_keys) {
          if (key === censored) {
            clone[key] = replacement
          }
          if ((censored as RegExp).test?.(key)) {
            clone[key] = replacement
          }
        }
      }
    }
    return clone
  }

  /** Logger levels. */
  static readonly level = Object.freeze({
    disabled: NaN,
    error: 0,
    warn: 1,
    info: 2,
    ok: 2,
    log: 3,
    debug: 4,
    wdebug: 4,
    trace: 5,
    probe: NaN,
    always: Infinity,
  }) as Readonly<{
    disabled: number
    error: 0
    warn: 1
    info: 2
    ok: 2
    log: 3
    debug: 4
    wdebug: 4
    trace: 5
    probe: number
    always: number
  }>

  /** Write content in error stream. */
  error(...content: unknown[]): this {
    if (this.#level >= Logger.level.error) {
      this.#output?.error(...this.#format(this, { level: "error", content, options: this.#options }))
    }
    return this
  }

  /** Write content in warn stream. */
  warn(...content: unknown[]): this {
    if (this.#level >= Logger.level.warn) {
      this.#output?.warn(...this.#format(this, { level: "warn", content, options: this.#options }))
    }
    return this
  }

  /** Write content in info stream. */
  info(...content: unknown[]): this {
    if (this.#level >= Logger.level.info) {
      this.#output?.info(...this.#format(this, { level: "info", content, options: this.#options }))
    }
    return this
  }

  /** Write content in info stream, displayed as a "ok" message. */
  ok(...content: unknown[]): this {
    if (this.#level >= Logger.level.info) {
      this.#output?.info(...this.#format(this, { level: "ok", content, options: this.#options }))
    }
    return this
  }

  /** Write content in log stream. */
  log(...content: unknown[]): this {
    if (this.#level >= Logger.level.log) {
      this.#output?.log(...this.#format(this, { level: "log", content, options: this.#options }))
    }
    return this
  }

  /** Write content in debug stream. */
  debug(...content: unknown[]): this {
    if (this.#level >= Logger.level.debug) {
      this.#output?.debug(...this.#format(this, { level: "debug", content, options: this.#options }))
    }
    return this
  }

  /** Write content in debug stream, displayed as a "warn debug" message. */
  wdebug(...content: unknown[]): this {
    if (this.#level >= Logger.level.debug) {
      this.#output?.debug(...this.#format(this, { level: "wdebug", content, options: this.#options }))
    }
    return this
  }

  /** Write content in debug stream, displayed as a "trace" message and requiring higher log level. */
  trace(...content: unknown[]): this {
    if (this.#level >= Logger.level.trace) {
      this.#output?.debug(...this.#format(this, { level: "trace", content, options: this.#options }))
    }
    return this
  }

  /**
   * Write content in debug stream bypassing current log level.
   * This method is intended to be used for debugging.
   */
  probe(...content: unknown[]): this {
    this.#output?.debug(...this.#format(this, { level: "probe", content, options: this.#options }))
    return this
  }

  /** Logger tags. */
  readonly tags: DeepReadonly<T>

  /** Instantiate a new {@link Logger} that inherits current instance settings but with additional tags. */
  with<U extends Record<PropertyKey, unknown>>(tags = {} as U): Logger<T & U> {
    const logger = new Logger({ level: this.#level, format: this.#format, output: this.#output, ...this.#options, tags: { ...this.tags, ...tags } as T & U })
    this.#censored_values.forEach((value, key) => logger.#censored_values.set(key, value))
    this.#censored_keys.forEach((value, key) => logger.#censored_keys.set(key, value))
    return logger
  }

  /** Compute caller informations. */
  #caller(i = 3 /* [#caller, Logger.format, Logger.{error,warn,info,log,debug,trace}, <caller>] */) {
    const Trace = Error as unknown as { prepareStackTrace: (error: Error, stack: CallSite[]) => unknown }
    const _ = Trace.prepareStackTrace
    Trace.prepareStackTrace = (_, stack) => stack
    const { stack } = new Error()
    Trace.prepareStackTrace = _
    const callers = (stack as unknown as CallSite[]).map((callsite) => ({
      file: callsite.getFileName(),
      name: callsite.getFunctionName(),
      line: callsite.getLineNumber(),
      column: callsite.getColumnNumber(),
    })) as caller[]
    return callers[i]
  }

  /**
   * Inspect a value.
   * When running on Deno, this method will use the `Deno.inspect` method.
   */
  #inspect(value: unknown) {
    value = this.#censor(value)
    return globalThis.Deno?.inspect(value, { colors: true, depth: Infinity, strAbbreviateSize: Infinity }) ?? value
  }

  /** Logger formatter. */
  #format

  /** Set logger formatter. */
  format(format: LoggerOptions<T>["format"]): this {
    this.#format = (typeof format === "string" ? Logger.format[format] : format) ?? Logger.format.text
    return this
  }

  /** Logger formatters. */
  static readonly format = {
    /**
     * Text formatter.
     * To keep compatibility with web browsers, this formatter will output colored text using CSS rather than ANSI escape codes.
     * Note that ANSI escape code generated by {@link Logger.#inspect} will still be left untouched.
     */
    text(logger: Logger, { level, content, options }) {
      const color = { error: "red", warn: "orange", info: "cyan", ok: "green", log: "white", debug: "gray", wdebug: "yellow", trace: "gray", probe: "magenta" }[level]
      const text = [`%c ${level.replace("wdebug", "debug").toLocaleUpperCase().padEnd(5)} │%c`]
      const styles = [`color: black; background-color: ${color}`, ""]
      if ((options.date) || (options.time) || (options.delta)) {
        const date = new Date().toISOString()
        const tag = []
        if (options.delta) {
          const d = performance.now() / 1000
          let dt = d.toPrecision(4)
          if (d < 1) {
            dt = d.toPrecision(2)
          }
          tag.push(`+${dt}`)
        }
        if ((options.date) && (options.time)) {
          tag.push(date)
        } else if (options.date) {
          tag.push(date.slice(0, date.indexOf("T")))
        } else if (options.time) {
          tag.push(date.slice(date.indexOf("T") + 1, -1))
        }
        text.push(`%c ${tag.join(" ¦ ").trim()} %c`)
        styles.push(`color: black; background-color: ${color}`, "")
      }
      if (options.caller.file || options.caller.name || options.caller.line) {
        const caller = logger.#caller()
        if (caller) {
          const tag = []
          if (options.caller.file) {
            let file = `${caller.file}`
            if (Array.isArray(options.caller.fileformat)) {
              file = file.replace(options.caller.fileformat[0], options.caller.fileformat[1])
            }
            tag.push(file)
          }
          if ((options.caller.name) && (caller.name)) {
            tag.push(caller.name)
          }
          if (options.caller.line) {
            tag.push(caller.line, caller.column)
          }
          text.push(`%c ${tag.join(":").trim()} %c`)
          styles.push(`color: black; background-color: gray`, "")
        }
      }
      const tags = []
      for (const [key, value] of Object.entries(logger.tags)) {
        tags.push(`${key}:${logger.#inspect(value)}`)
      }
      text.push(`%c ${tags.join(" ").trim()} %c`)
      styles.push(`background-color: black`, "")
      return [text.join(""), ...styles, ...content.map((value) => logger.#inspect(value))]
    },
    /** JSON formatter. */
    json(logger: Logger, { level, content, options }) {
      const data = {
        level,
        timestamp: Date.now(),
        tags: Object.fromEntries(Object.entries(logger.tags).map(([key, value]) => [key, logger.#censor(value)])),
        content: content.map((value) => logger.#censor(value)),
      }
      const extra = {} as { date?: string; time?: string; delta?: number; caller?: { file?: string; name?: string; line?: [number, number] } }
      if ((options.date) || (options.time)) {
        const date = new Date(data.timestamp).toISOString()
        if ((options.date)) {
          extra.date = date.slice(0, date.indexOf("T"))
        }
        if ((options.time)) {
          extra.time = date.slice(date.indexOf("T") + 1, -1)
        }
      }
      if (options.delta) {
        extra.delta = performance.now() / 1000
      }
      if (options.caller.file || options.caller.name || options.caller.line) {
        const caller = logger.#caller()
        if (caller) {
          extra.caller = {}
          if (options.caller.file) {
            let file = `${caller.file}`
            if (Array.isArray(options.caller.fileformat)) {
              file = file.replace(options.caller.fileformat[0], options.caller.fileformat[1])
            }
            extra.caller.file = file
          }
          if ((options.caller.name) && (caller.name)) {
            extra.caller.name = caller.name
          }
          if (options.caller.line) {
            extra.caller.line = [caller.line, caller.column]
          }
        }
      }
      return [JSON.stringify({ ...data, ...extra })]
    },
  } as Record<PropertyKey, formatter>
}

/** Logger constructor options. */
// deno-lint-ignore ban-types
export type LoggerOptions<T extends Record<PropertyKey, unknown> = {}> = {
  /** Logger level initial value. */
  level?: levellike
  /** Logger formatter. */
  format?: formatter | "text" | "json"
  /**
   * Logger output streams (defaults to {@link https://developer.mozilla.org/en-US/docs/Web/API/console | console}).
   * If set to `null`, the logger will not output anything whatever the log level is.
   */
  //deno-lint-ignore ban-types
  output?: Record<"error" | "warn" | "info" | "log" | "debug", Function> | null
  /** Logger tags. */
  tags?: T
  /**
   * Register censored values or keys.
   *
   * See {@link Logger.censor} for more information.
   */
  censor?: Parameters<Logger["censor"]>[0] | Array<Parameters<Logger["censor"]>[0]>
  /** Display caller informations (requires to be run on a V8 runtime). */
  caller?: {
    /** Display caller file path (e.g. `file://shadow/libs/logger/mod.ts`). */
    file?: boolean
    /** Display caller name (e.g. `myfunction`). */
    name?: boolean
    /** Display caller file line and column (e.g. `420:69`). */
    line?: boolean
    /**
     * A `RegExp` to custom the format of caller file path.
     * The captured named group `(?<file>)` will be used instead.
     * This is useful to trim long paths or rename them.
     *
     * ```ts
     * import { Logger } from "./mod.ts"
     *
     * new Logger({ caller: { file: true } }).log("hello")
     * // file://shadow/libs/logger/mod.ts
     * new Logger({ caller: { file: true, fileformat: [ /^.*?\/libs\/(?<file>.*)$/, "$<file>"] } }).log("hello")
     * // logger/mod.ts
     * ```
     */
    fileformat?: [RegExp, string] | null
  } | boolean
  /**
   * Display date (e.g. `2024-07-13`).
   * If `time` is also set, both fields will be combined into a single ISO string.
   */
  date?: boolean
  /**
   * Display time (e.g. `15:23:05.574`).
   * If `date` is also set, both fields will be combined into a single ISO string.
   */
  time?: boolean
  /** Display time elapsed since execution start (e.g. `+0.888`). */
  delta?: boolean
}

/** Logger options */
export type options = DeepNonNullable<Pick<LoggerOptions, "date" | "time" | "delta">> & {
  caller: DeepNonNullable<Omit<NonNullable<Exclude<LoggerOptions["caller"], boolean>>, "fileformat">> & { fileformat: [RegExp, string] | null }
}

/** Logger level (numeric). */
export type level = number

/** Logger level (named). */
export type loglevel = Exclude<keyof typeof Logger.level, "disabled" | "always">

/** Logger level like. */
export type levellike = level | loglevel | "disabled" | "always"

/** Logger formatter. */
export type formatter = (logger: Logger, options: { level: loglevel; content: unknown[]; options: options }) => unknown[]

/** Caller. */
type caller = {
  file: string
  name: string | null
  line: number
  column: number
}

/** V8 CallSite (subset). */
type CallSite = {
  getFileName: () => string
  getFunctionName: () => string | null
  getLineNumber: () => number
  getColumnNumber: () => number
}

// Note: The following types below should not use `@libs/typing` to avoid external dependencies.

/** Deep readonly type. */
export type DeepReadonly<T> = T extends object ? { readonly [P in keyof T]: DeepReadonly<T[P]> } : T

/** Deep non nullable type. */
export type DeepNonNullable<T> = { [P in keyof T]: T[P] extends object ? DeepNonNullable<NonNullable<T[P]>> : NonNullable<T[P]> }
