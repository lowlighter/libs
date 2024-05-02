/**
 * Logger library
 *
 * It is intended to supersed {@link https://developer.mozilla.org/en-US/docs/Web/API/console | console} by providing:
 * - Colored output
 * - Log levels
 * - Tags
 * - Timestamps
 * - Delta
 * - Caller information
 * - Log formatters
 *
 * @example
 * ```
 * import { Logger } from "./mod.ts"
 * const logger = new Logger({ level: Logger.level.info, tags: { foo: true} })
 * logger.info("message")
 * ```
 *
 * @author Simon Lecoq (lowlighter)
 * @license MIT
 */
export class Logger {
  /** Constructor */
  constructor({ level, format, output, tags, options }: { level?: level; format?: format; output?: output; tags?: tags; options?: Partial<Omit<options, "caller">> & { caller?: Partial<Exclude<options["caller"], false>> | false } } = {}) {
    if (globalThis.Deno?.permissions.querySync({ name: "env", variable: "LOG_LEVEL" }).state === "granted") {
      const env = globalThis.Deno?.env.get("LOG_LEVEL") ?? ""
      if (env in Logger.level) {
        level ??= Logger.level[env as keyof typeof Logger.level]
      }
      if (!Number.isNaN(Number.parseInt(env))) {
        level ??= Number.parseInt(env)
      }
    }
    this.level = level ?? Logger.level.log
    this.#output = output || (output === null) ? output : console
    this.#format = format ?? Logger.format.text
    this.tags = tags ?? {}
    this.options = { date: false, time: false, delta: true, ...options, caller: { file: true, name: true, line: true, ...options?.caller } } as options
  }

  /** Logger level */
  level

  /** Logger formatter */
  readonly #format

  /** Logger output */
  readonly #output

  /** Logger tags */
  readonly tags

  /** Logger options */
  readonly options

  /** Write content in error stream */
  error(...content: unknown[]) {
    if (this.level >= Logger.level.error) {
      this.#output?.error(...this.#format(this, { level: Logger.level.error, content }))
    }
    return this
  }

  /** Write content in warn stream */
  warn(...content: unknown[]) {
    if (this.level >= Logger.level.warn) {
      this.#output?.warn(...this.#format(this, { level: Logger.level.warn, content }))
    }
    return this
  }

  /** Write content in info stream */
  info(...content: unknown[]) {
    if (this.level >= Logger.level.info) {
      this.#output?.info(...this.#format(this, { level: Logger.level.info, content }))
    }
    return this
  }

  /** Write content in log stream */
  log(...content: unknown[]) {
    if (this.level >= Logger.level.log) {
      this.#output?.log(...this.#format(this, { level: Logger.level.log, content }))
    }
    return this
  }

  /** Write content in debug stream */
  debug(...content: unknown[]) {
    if (this.level >= Logger.level.debug) {
      this.#output?.debug(...this.#format(this, { level: Logger.level.debug, content }))
    }
    return this
  }

  /** Instantiate a new {@link Logger} that inherits current instance settings but with additional tags */
  with(tags = {} as tags) {
    return new Logger({ level: this.level, format: this.#format, output: this.#output, options: { ...this.options }, tags: { ...this.tags, ...tags } })
  }

  /** Compute caller informations */
  #caller(i = 3 /* [#caller, Logger.format, Logger.{error,warn,info,log,debug}] */) {
    const Trace = Error as unknown as { prepareStackTrace: (error: Error, stack: CallSite[]) => unknown }
    const _ = Trace.prepareStackTrace
    Trace.prepareStackTrace = (_, stack) => stack
    const { stack } = new Error()
    Trace.prepareStackTrace = _
    const caller = (stack as unknown as CallSite[])[i]
    return {
      file: caller.getFileName(),
      name: caller.getFunctionName(),
      line: caller.getLineNumber(),
      column: caller.getColumnNumber(),
    } as caller
  }

  /** Logger levels */
  static readonly level = Object.freeze({
    disabled: NaN,
    error: 0,
    warn: 1,
    info: 2,
    log: 3,
    debug: 4,
  })

  /** Logger format */
  static readonly format = {
    /** Text formatter */
    text(logger: Logger, { level = 0, content }) {
      const color = ["red", "orange", "cyan", "white", "gray"][level as number]
      const text = [`%c ${Object.keys(Logger.level).find((key) => Logger.level[key as keyof typeof Logger.level] === level)!.toLocaleUpperCase().padEnd(5)} │%c`]
      const styles = [`color: black; background-color: ${color}`, ""]
      if ((logger.options.date) || (logger.options.time) || (logger.options.delta)) {
        const date = new Date().toISOString()
        const tag = []
        if (logger.options.delta) {
          const d = performance.now() / 1000
          let dt = d.toPrecision(4)
          if (d < 1) {
            dt = d.toPrecision(2)
          }
          tag.push(`+${dt}`)
        }
        if ((logger.options.date) && (logger.options.time)) {
          tag.push(date)
        } else if (logger.options.date) {
          tag.push(date.slice(0, date.indexOf("T")))
        } else if (logger.options.time) {
          tag.push(date.slice(date.indexOf("T") + 1, -1))
        }
        text.push(`%c ${tag.join(" ¦ ").trim()} %c`)
        styles.push(`color: black; background-color: ${color}`, "")
      }
      if (logger.options.caller) {
        const caller = logger.#caller()
        if (caller) {
          const tag = []
          if (logger.options.caller.file) {
            tag.push(`${caller.file.replace(logger.options.caller.fileformat, "$<file>")}`)
          }
          if ((logger.options.caller.name) && (caller.name)) {
            tag.push(caller.name)
          }
          if (logger.options.caller.line) {
            tag.push(caller.line, caller.column)
          }

          text.push(`%c ${tag.join(":").trim()} %c`)
          styles.push(`color: black; background-color: gray`, "")
        }
      }
      {
        const tags = []
        for (const [key, value] of Object.entries(logger.tags)) {
          tags.push(`${key}:${Logger.inspect(value)}`)
        }
        text.push(`%c ${tags.join(" ").trim()} %c`)
        styles.push(`background-color: black`, "")
      }
      return [text.join(""), ...styles, ...content.map(Logger.inspect)]
    },
    json(logger: Logger, { level = 0, content }) {
      const data = {
        level: Object.keys(Logger.level).find((key) => Logger.level[key as keyof typeof Logger.level] === level),
        timestamp: Date.now(),
        tags: logger.tags,
        content,
      }
      const extra = {} as { date?: string; time?: string; delta?: number; caller?: { file?: string; name?: string; line?: [number, number] } }
      if ((logger.options.date) || (logger.options.time)) {
        const date = new Date(data.timestamp).toISOString()
        if ((logger.options.date)) {
          extra.date = date.slice(0, date.indexOf("T"))
        }
        if ((logger.options.time)) {
          extra.time = date.slice(date.indexOf("T") + 1, -1)
        }
      }
      if (logger.options.delta) {
        extra.delta = performance.now() / 1000
      }
      if (logger.options.caller) {
        const caller = logger.#caller()
        if (caller) {
          extra.caller = {}
          if (logger.options.caller.file) {
            extra.caller.file = `${caller.file.replace(logger.options.caller.fileformat, "$<file>")}`
          }
          if ((logger.options.caller.name) && (caller.name)) {
            extra.caller.name = caller.name
          }
          if (logger.options.caller.line) {
            extra.caller.line = [caller.line, caller.column]
          }
        }
      }
      return [JSON.stringify({ ...data, ...extra })]
    },
  } as Record<PropertyKey, format>

  /** Attempt to inspect value */
  static inspect(value: unknown) {
    return globalThis.Deno?.inspect(value, { colors: true, depth: Infinity }) ?? value
  }
}

/** Logger level */
export type level = number

/** Logger format */
type format = (logger: Logger, options: { level: level; content: unknown[] }) => string[]

/** Logger output */
//deno-lint-ignore ban-types
type output = Record<Exclude<keyof typeof Logger.level, "disabled">, Function> | null

/** Logger tags */
type tags = Record<PropertyKey, unknown>

/** Logger options */
export type options = {
  /** Display caller informations */
  caller: {
    /** Display caller file path */
    file: boolean
    /** Caller file path formatter (use a named group `(?<path>)` to format the caller file path) */
    fileformat: RegExp
    /** Display caller name */
    name: boolean
    /** Display caller file line and column */
    line: boolean
  } | false
  /** Display date */
  date: boolean
  /** Display time */
  time: boolean
  /** Display delta (time elapsed since start) */
  delta: boolean
}

/** Caller */
type caller = {
  file: string
  name: string | null
  line: number
  column: number
}

/** CallSite (subset) */
type CallSite = {
  getFileName: () => string
  getFunctionName: () => string | null
  getLineNumber: () => number
  getColumnNumber: () => number
}
