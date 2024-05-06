/**
 * Module to check the compatibility of CSS stylesheets with browsers using
 * {@link https://github.com/mdn/browser-compat-data | MDN compatibility browser data}.
 *
 * This parses the CSS stylesheet into an AST and checks against the compatibility data.
 * It will try to check general compatibility for a given feature, and attempt more
 * granular checks for specific values.
 *
 * Note that it may not be entirely accurate as it does not actually check the
 * validity of the CSS, it only try to map back to the compatibility data.
 *
 * Report can be either printed in console or exported as a already styled HTML table.
 *
 * ________________________________________________________________________________
 *
 * Copyright (c) Lecoq Simon <@lowlighter>. (MIT License)
 * https://github.com/lowlighter/libs/blob/main/LICENSE
 *
 * @author Simon Lecoq (lowlighter)
 * @license MIT
 * @module
 */

// Imports
import { generate, parse, walk } from "npm:css-tree@2"
import browserslist from "npm:browserslist@4"
import bcd from "npm:@mdn/browser-compat-data@5" with { type: "json" }
import * as semver from "jsr:@std/semver@0.224.0"
<<<<<<< HEAD
import type { Arg, Arrayable, Nullable, rw } from "jsr:@libs/typing@1"
import { Logger } from "jsr:@libs/logger@1"
=======
import type { Arg, Arrayable, Nullable, rw } from "../../typing/mod.ts"
import { Logger } from "../../logger/mod.ts"
>>>>>>> 95fab0e (feat(bundle/css/compatibility): add library (#1))
import { brightGreen, brightMagenta, gray, green, red, yellow } from "jsr:@std/fmt@0.224.0/colors"
import { Table } from "jsr:@cliffy/table@1.0.0-rc.4"

/** Browsers list */
const browsers = {
  name: [
    ["chrome", "Chrome"],
    ["edge", "Edge"],
    ["safari", "Safari"],
    ["firefox", "Firefox"],
    ["ff", "Firefox"],
    ["opera", "Opera"],
    ["explorer", "Internet Explorer"],
    ["ie", "Internet Explorer"],
    ["chromeandroid", "Android Chrome"],
    ["and_chr", "Android Chrome"],
    ["ios_saf", "iOS Safari"],
    ["samsung", "Samsung Internet"],
    ["operamini", "Opera Mini"],
    ["op_mini", "Opera Mini"],
    ["op_mob", "Opera Mobile"],
    ["ucandroid", "UC Browser"],
    ["and_uc", "UC Browser"],
    ["android", "Android Browser"],
    ["firefoxandroid", "Android Firefox"],
    ["and_ff", "Android Firefox"],
    ["and_qq", "QQ Browser"],
    ["baidu", "Baidu Browser"],
    ["kaios", "KaiOS Browser"],
    ["electron", "Electron"],
    ["node", "Node.js"],
    ["blackberry", "BlackBerry"],
    ["bb", "BlackBerry"],
    ["ie_mob", "Internet Explorer Mobile"],
  ],
  compatibility: {
    chrome: "chrome",
    edge: "edge",
    safari: "safari",
    firefox: "firefox",
    ff: "firefox",
    opera: "opera",
    ie: "ie",
    explorer: "ie",
    chromeandroid: "chrome_android",
    and_chr: "chrome_android",
    ios_saf: "safari_ios",
    samsung: "samsunginternet_android",
    op_mob: "opera_android",
    android: "webview_android",
    firefoxandroid: "firefox_android",
    and_ff: "firefox_android",
  },
} as const

/**
 * Report
 *
 * Create a new compatibility report for a given CSS stylesheet content
 *
 * Select browsers to test using {@link https://github.com/browserslist/browserslist?tab=readme-ov-file#queries | browserslist queries}.
 *
 * ```ts
 * import { Report } from "./compatibility.ts"
 *
 * // Stylesheet content
 * const css = "body { color: salmon; }"
 *
 * // Create a new report, using browserlist queries
 * const report = new Report("defaults, ie > 8")
 * const result = report.for(css)
 *
 * // Print result
 * result.print({ output: "console", view: "browsers" })
 * result.print({ output: "html", view: "browsers" })
 * ```
 */
export class Report {
  /** Constructor */
  constructor(query: string | string[], { loglevel = 10 } = {}) {
    this.#log = new Logger({ level: loglevel })
    browserslist(query).forEach((line) => {
      const [browser, version] = line.split(" ")
      if (!(browser in browsers.compatibility)) {
        this.#log.with({ browser, version }).warn("not supported (no compatibility data in database)")
        return
      }
      this.#browsers[browser] ??= []
      this.#browsers[browser].push(version)
    })
  }

  /** Logger */
  readonly #log: Logger

  /** Browsers list by name and versions */
  readonly #browsers = {} as Record<browser, version[]>

  /** Create a report for given stylesheet */
  for(stylesheet: string): report {
    const data = [] as data
    walk(parse(stylesheet, { positions: true }), (node: ast_node) => {
      switch (node.type) {
        case "Declaration": {
          this.#process(data, "properties", node, node.property, node.value)
          break
        }
        case "PseudoClassSelector": {
          this.#process(data, "selectors", node, node.name)
          break
        }
        case "Atrule": {
          this.#process(data, "at-rules", node, node.name, node.prelude)
          break
        }
        case "Function": {
          this.#process(data, "types", node, node.name)
          break
        }
      }
    })
    return this.#report(data)
  }

  /** Format location from AST */
  #location(location: ast_location) {
    const { source: file, start: { line, column } } = location
    return { file, line, column }
  }

  /** Format version from AST */
  #version(version: string) {
    if (version.includes("-")) {
      version = version.split("-")[1]
    }
    const [[{ major, minor, patch }]] = semver.parseRange(version)
    return { major, minor, patch }
  }

  /** Prepreocess */
  #preprocess(log: Logger, section: bcd_section, node: ast_node, name: string, values: ast_value, realname: Nullable<string>) {
    switch (true) {
      case (section === "properties") && (/^-(webkit|moz|o|ms)-.+/.test(name)): {
        realname = name
        name = name.replace(/^-.*?-/, "")
        log.debug(`renamed "${realname}" to "${name}" to trim vendor prefix`)
        break
      }
      case (section === "properties") && (name.startsWith("--")): {
        realname = name
        name = "custom-property"
        log.debug(`renamed "${realname}" to "${name}"`)
        break
      }
      case (section === "types") && (name === "var"): {
        realname = `${name}()`
        name = "custom-property"
        section = "properties"
        log.debug(`renamed "${realname}" to "${name}" and changed section to "${section}"`)
        break
      }
      case (section === "types") && (name in bcd.css[section]["filter-function"]): {
        realname = name
        name = "filter-function"
        log.debug(`renamed "${realname}" to "${name}"`)
      }
    }
    return { section, node, name, _values: values, realname }
  }

  /** Process a single AST node */
  #process(data: data, section: bcd_section, node: ast_node, name: string, _values?: ast_value) {
    const location = this.#location(node.loc)
    const log = this.#log.with({ location: `${location.line}:${location.column}`, section, name })
    let realname = null as Nullable<string>
    ;({ section, node, name, _values, realname } = this.#preprocess(log, section, node, name, _values!, realname))
    const feature = bcd.css[section][name]?.__compat?.source_file?.replace(/^css\//, "").replace(/\.json$/, "") ?? `${section}/${name}`
    const value = _values ? generate(_values) as string : realname ?? null
    let logger = log
    if (value !== null) {
      logger = log.with({ value })
    }
    for (const browser in this.#browsers) {
      for (const version of this.#browsers[browser]) {
        logger = log.with({ browser, version })
        const { level, status } = this.#support(logger, bcd.css[section][name] as bcd_compatibility, browser, version, value ? this.#tags(log, value, _values) : [])
        data.push({ feature, browser, version, location, value, level, status: { deprecated: status.deprecated, experimental: status.experimental, nonstandard: !status.standard_track } })
        if (!status.deprecated) {
          delete (status as rw).deprecated
        }
        if (!status.experimental) {
          delete (status as rw).experimental
        }
        if (!status.standard_track) {
          Object.assign(status, { nonstandard: true })
        }
        delete (status as rw).standard_track
        logger.with(status).log(level)
      }
    }
  }

  /** Tags value for additional granular checks */
  #tags(log: Logger, value: value, _values?: ast_value) {
    const tags = [value] as tag[]
    if (_values) {
      walk(_values, (value: ast_value) => {
        switch (true) {
          case value.type === "Percentage":
            tags.push("percentages")
            break
          case (value.type === "Number") && (Number.parseFloat(value.value) < 0):
            tags.push("negative_values")
            break
        }
      })
    }
    if (tags.length > 1) {
      log.debug(`added tags: ${tags.slice(1).join(", ")}`)
    }
    return tags
  }

  /** Resolve support from compatibility data against a single browser version */
  #support(log: Logger, compatibility: bcd_compatibility | void, browser: browser, version: version, tags: tag[]): { level: level; status: bcd_status } {
    if (!compatibility) {
      return { level: "unknown", status: { standard_track: true, deprecated: false, experimental: false } }
    }
    const support = compatibility.__compat.support[browsers.compatibility[browser as keyof typeof browsers.compatibility]] ?? compatibility.__compat.support[browser]
    const status = compatibility.__compat.status
    // Granular compatibility checks (if value is provided)
    if (tags?.length) {
      for (const tag of tags) {
        const _compatibility = this.#value_compatibility(log, compatibility, tag)
        if (_compatibility) {
          return this.#support(log, _compatibility, browser, version, [])
        }
      }
    }
    // Multiple compatibility checks
    if (Array.isArray(support)) {
      for (const _support of support) {
        const _result = this.#support(log, { __compat: { support: { [browser]: _support }, status } } as bcd_compatibility, browser, version, [])
        if (_result.level !== "unknown") {
          return _result
        }
      }
      return { level: "unknown", status }
    } // Simple compatibility checks
    else if (typeof support === "object") {
      return { level: this.#test(log, support, version), status }
    } // No compatibility data available
    else if (support === undefined) {
      log.warn(`no compatibility data available (available: ${Object.keys(compatibility.__compat.support)})`)
    } // Unimplemented
    else {
      log.error("unimplemented support type, please open an issue", support)
    }
    return { level: "unknown", status }
  }

  /** Search for granular compatibility based on value (either referenced directly in data or in description between <code/> tags) */
  #value_compatibility(log: Logger, compatibility: bcd_compatibility, tag: tag): bcd_compatibility | false {
    for (const key in compatibility) {
      if (key === "__compat") {
        continue
      }
      const keywords = [key]
      if (compatibility[key].__compat.description) {
        const description = compatibility[key].__compat.description!
        keywords.push(...Array.from(description.matchAll(/<code>([\s\S]+?)<\/code>/g)).map((match) => (match as string[])[1]))
      }
      if (keywords.includes(tag)) {
        log.debug(`matched granular rule "${key}"`)
        return compatibility[key] as bcd_compatibility
      }
    }
    return false
  }

  /** Test browser version against a single matcher */
  #test(log: Logger, support: bcd_support, version: version) {
    let level = "unsupported" as level
    const tested = this.#version(version)
    if (!support.version_added) {
      return level
    }
    const added = this.#version(support.version_added)
    if (!semver.greaterOrEqual(tested, added)) {
      log.debug(`unsupported prior version ${support.version_added}`)
      return level
    }
    if (support.version_removed) {
      const removed = this.#version(support.version_removed)
      if (semver.greaterOrEqual(tested, removed)) {
        log.debug(`support removed in version ${support.version_removed}`)
        return level
      }
    }
    if (support.partial_implementation) {
      level = "partial"
      log.debug(`partially supported since version ${support.version_added}`)
      return level
    }
    if (support.prefix) {
      level = "prefixed"
      log.debug(`supported with ${support.prefix} since version ${support.version_added}`)
    } else {
      level = "supported"
      log.debug(`supported since version ${support.version_added}`)
    }
    return level
  }

  /** Format data into usable one */
  #report(data: data) {
    const features = {
      list: [...new Set<feature>(data.map(({ feature }) => feature))],
      status: {
        deprecated: {} as feature_map,
        experimental: {} as feature_map,
        nonstandard: {} as feature_map,
      },
      support: {
        unknown: {} as feature_map,
        unsupported: {} as feature_map,
        partial: {} as feature_map,
        prefixed: {} as feature_map,
        supported: {} as feature_map,
      },
    } as report["features"]
    const browsers = {} as report["browsers"]
    for (const { feature, browser, version, location, value, level, ...entry } of data) {
      // Sort by status
      for (const status of Object.keys(features.status) as Array<keyof status>) {
        if (entry.status[status as keyof status]) {
          features.status[status][feature] ??= {}
          features.status[status][feature][browser] ??= {}
          features.status[status][feature][browser][version] ??= []
          features.status[status][feature][browser][version].push({ location, value })
        }
      }
      // Sort by support
      features.support[level][feature] ??= {}
      features.support[level][feature][browser] ??= {}
      features.support[level][feature][browser][version] ??= []
      features.support[level][feature][browser][version].push({ location, value })
      // Sort by browser
      browsers[browser] ??= {}
      browsers[browser][version] ??= { support: { unknown: {}, unsupported: {}, partial: {}, prefixed: {}, supported: {} } }
      browsers[browser][version].support[level][feature] ??= []
      browsers[browser][version].support[level][feature].push({ location, value })
    }
    const report = { features, browsers } as report
    report.print = this.print.bind(this, report)
    return report
  }

  /** Generate table data from reported data */
  #view(data: ReturnType<Report["for"]>, type: "browsers" | "features") {
    switch (type) {
      case "features":
        throw new RangeError("Not implemented")
      case "browsers":
        return this.#view_browsers(data)
    }
  }

  /** Generate browsers table */
  #view_browsers(_data: ReturnType<Report["for"]>) {
    // Prepare data (compute number of versions, filter browsers with data and sort data by descending version)
    const columns = Math.max(...Object.entries(this.#browsers).filter(([browser]) => browsers.name.some(([id]) => id === browser)).map(([_, versions]) => versions.length))
    const rows = browsers.name.filter(([id]) => id in this.#browsers)
    const data = Object.fromEntries(
      Object.entries(_data.browsers).map(([browser, versions]) => [
        browser,
        Object.entries(versions).sort(([a], [b]) => {
          if (a.includes("-")) {
            a = a.split("-")[1]
          }
          return Number.parseFloat(b) - Number.parseFloat(a)
        }),
      ]),
    )
    // Generate table
    const table = []
    for (const [id, name] of rows) {
      const row = [] as Nullable<table_entry>[]
      for (let i = 0; i < columns; i++) {
        if (!data[id][i]) {
          row.push(null)
          continue
        }
        const [version, { support }] = data[id][i]
        row.push(this.#view_browsers_cell(id, version, name, support))
      }
      // Prepare summary data
      const support = { unknown: {}, partial: {}, unsupported: {}, prefixed: {}, supported: {} } as Record<level, browser_map>
      for (const version of row.filter(Boolean) as table_entry[]) {
        for (const level of Object.keys(version.features) as level[]) {
          for (const feature in version.features[level]) {
            support[level][feature] ??= []
            for (const occurence of version.features[level][feature]) {
              const { location } = occurence
              if (!support[level][feature].some(({ location: { line, column } }) => line === location.line && column === location.column)) {
                support[level][feature].push(occurence)
              }
            }
          }
        }
      }
      const summary = this.#view_browsers_cell(id, "all", name, support)
      summary.users = row.reduce((total, cell) => total + (cell?.users ?? 0), 0)
      row.unshift(summary)
      table.push(row)
    }
    return table
  }

  /** Generate browsers table cell */
  #view_browsers_cell(id: string, version: version, name: string, support: Record<level, browser_map>) {
    const cell = {
      browser: name,
      version,
      count: {
        flat: { unknown: 0, unsupported: 0, partial: 0, prefixed: 0, supported: 0, total: 0 },
        percentage: { unknown: 0, unsupported: 0, partial: 0, prefixed: 0, supported: 0 },
      },
      features: { unknown: {}, unsupported: {}, partial: {}, prefixed: {}, supported: {} },
      users: NaN,
    }
    for (const level of Object.keys(cell.features) as level[]) {
      cell.count.flat[level] = Object.keys(support[level]).length
      cell.count.flat.total += cell.count.flat[level]
      cell.features[level] = support[level]
    }
    for (const level of Object.keys(cell.features) as level[]) {
      cell.count.percentage[level] = 100 * cell.count.flat[level] / cell.count.flat.total
    }
    try {
      cell.users = browserslist.coverage(browserslist(`${id} ${version}`))
    } catch {
      // Ignore
    }
    return cell
  }

  /** Print table */
  print(data: ReturnType<Report["for"]>, { view = "browsers" as "browsers" | "features", output = "console" as "console" | "html", verbose = false } = {}): string {
    const table = this.#view(data, view)
    const body = new Array(table[0].length).fill(null).map(() => []) as string[][]
    for (let i = 0; i < table.length; i++) {
      for (let j = 0; j < table[0].length; j++) {
        const cell = table[i][j]
        if (!cell) {
          body[j].push("")
          continue
        }
        let text = j === 0 ? cell.browser : cell.version
        text += `\n${Math.floor(cell.count.percentage.supported)}%`
        text = this.#color(text, cell.count.percentage.supported, output)
        if (verbose) {
          for (const level of ["unsupported", "partial", "prefixed", "unknown"] as Exclude<level, "supported">[]) {
            for (const feature in cell.features[level]) {
              const color = { unknown: NaN, partial: 80, unsupported: 0, prefixed: -1 }[level]
              const [type, name] = feature.split("/")
              const messages = new Set<string>()
              for (const { value } of cell.features[level][feature]) {
                let message = ""
                switch (type) {
                  case "at-rules":
                    message = `@${name}`
                    break
                  case "selectors":
                    message = `:${name}${value ?? ""}`
                    break
                  case "properties":
                    message = `${name}: ${value};`
                    break
                  case "types":
                    message = value ? `[${name}] ${value}()` : `${name}()`
                    break
                }
                messages.add(
                  `\n${this.#color(message, color, output)}`,
                )
              }
              text += [...messages].join("")
            }
          }
        }
        body[j].push(text)
      }
    }
    switch (output) {
      case "console":
        return new Table().align("center").border(true).body(body).render().toString()
      case "html":
        return `<table style="border-collapse: collapse">\n${
          body.map((row, i) =>
            `  <tr>${
              row.map((cell) =>
                !cell
                  ? `    \n    <td style="background-color: #000"></td>`
                  : `\n    <t${i ? "d" : "h"} style="padding: .25rem; border: 1px solid black;">\n${cell.replaceAll(/^(<span .*)$/gm, "      $1<br>").replaceAll(/\n([^< ].+<\/span>)/g, "$1<br>")}\n    </t${i ? "d" : "h"}>`
              ).join("")
            }\n  </tr>`
          ).join("\n")
        }\n</table>`
    }
  }

  /** Apply coloring */
  #color(string: string, value: number, output: "console" | "html") {
    switch (true) {
      case Number.isNaN(value):
        return output === "html" ? `<span style="color: #848d97">${string}</span>` : gray(string)
      case value < 0:
        return output === "html" ? `<span style="color: #8250df">${string}</span>` : brightMagenta(string)
      case value >= 100:
        return output === "html" ? `<span style="color: #1a7f37">${string}</span>` : brightGreen(string)
      case value >= 90:
        return output === "html" ? `<span style="color: #3fb950">${string}</span>` : green(string)
      case value >= 80:
        return output === "html" ? `<span style="color: #d29922">${string}</span>` : yellow(string)
      default:
        return output === "html" ? `<span style="color: #f85149">${string}</span>` : red(string)
    }
  }

  /** Inject testing properties for test cases (internal, only for testing purposes) */
  protected static testing() {
    Object.assign(bcd.css.properties, {
      ["-debug-empty-array"]: { __compat: { support: { chrome: [] }, status: { standard_track: false, deprecated: false, experimental: true } } },
      ["-debug-unimplemented"]: { __compat: { support: { chrome: false }, status: { standard_track: false, deprecated: false, experimental: true } } },
      ["-debug-prefixed"]: { __compat: { support: { chrome: { version_added: "0", prefix: "-debug-" } }, status: { standard_track: false, deprecated: false, experimental: true } } },
      ["-debug-removed"]: { __compat: { support: { chrome: { version_added: "0", version_removed: "0" } }, status: { standard_track: false, deprecated: false, experimental: true } } },
    })
    for (let i = 1; i <= 10; i++) {
      Object.assign(bcd.css.properties, {
        [`-debug-pass-${i}`]: { __compat: { support: { chrome: { version_added: "0" } }, status: { standard_track: false, deprecated: false, experimental: true } } },
        [`-debug-fail-${i}`]: { __compat: { support: { chrome: { version_added: false } }, status: { standard_track: false, deprecated: false, experimental: true } } },
      })
    }
  }
}

/** Browser name */
type browser = string

/** Browser version */
type version = string

/** CSS feature name */
type feature = string

/** CSS value */
type value = string

/** Feature tag (internal) */
type tag = string

/** Feature status */
type status = { nonstandard: boolean; deprecated: boolean; experimental: boolean }

/** Declaration location */
type location = { file: unknown; line: number; column: number }

/** Support level */
type level = "unknown" | "unsupported" | "partial" | "prefixed" | "supported"

/** Browser compat data section */
type bcd_section = "selectors" | "properties" | "types" | "at-rules"

/** Browser compat data feature status */
type bcd_status = { standard_track: boolean; deprecated: boolean; experimental: boolean }

/** Browser compat data support matcher */
type bcd_support = {
  version_added: string | false
  version_removed?: string
  partial_implementation?: boolean
  prefix?: string
  notes?: Arrayable<string>
}

/** Browser compat data compatibility structure (internal) */
type _bcd_compatibility = {
  __compat: {
    description?: string
    support: Record<browser, Arrayable<bcd_support>>
    status: bcd_status
  }
}

/** Browser compat data compatibility structure */
type bcd_compatibility = _bcd_compatibility & { [key: string]: _bcd_compatibility }

/** AST node */
type ast_node = {
  type: string
  name: string
  loc: ast_location
  property: string
  value: ast_value
  prelude: ast_value
}

/** AST location */
type ast_location = { source: string; start: { line: number; column: number; offset: number }; end: { line: number; column: number; offset: number } }

/** AST value */
type ast_value = { type: string; loc: ast_location; name: string; value: string; unit: string }

/** Report data */
type data = Array<{
  feature: feature
  browser: browser
  version: version
  location: location
  value: Nullable<value>
  level: level
  status: status
}>

/** Feature map report */
type feature_map = Record<feature, Record<browser, Record<version, Array<{ location: location; value: Nullable<value> }>>>>

/** Browser map report */
type browser_map = Record<feature, Array<{ location: location; value: Nullable<value> }>>

/** Report */
type report = {
  features: {
    list: feature[]
    status: {
      deprecated: feature_map
      experimental: feature_map
      nonstandard: feature_map
    }
    support: Record<level, feature_map>
  }
  browsers: Record<
    browser,
    Record<version, { support: Record<level, browser_map> }>
  >
  print: (options?: Arg<Report["print"], 1>) => ReturnType<Report["print"]>
}

/** Table entry */
type table_entry = {
  browser: browser
  version: string
  count: {
    flat: Record<level | "total", number>
    percentage: Record<level, number>
  }
  features: Record<level, browser_map>
  users: number
}
