// Imports
import { generate, parse, walk } from "css-tree"
import browserslist from "browserslist"
import bcd from "@mdn/browser-compat-data" with { type: "json" }
import * as semver from "@std/semver"
import type { Arg, Arrayable, Nullable, rw } from "@libs/typing"
import { type level as loglevel, Logger } from "@libs/logger"
import { brightGreen, brightMagenta, gray, green, italic, red, yellow } from "@std/fmt/colors"
import { Table } from "@cliffy/table"

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

/** Vendors regex */
const vendors = /^(?:@|::|:)?(?<prefix>-(?:webkit|moz|o|ms|__debug)-)/

/**
 * Compatibility data generator.
 *
 * Check the compatibility of CSS stylesheets with browsers using {@link https://github.com/mdn/browser-compat-data | MDN compatibility browser data}.
 *
 * This parses the CSS stylesheet into an AST and checks against the compatibility data.
 * It will try to check general compatibility for a given feature, and attempt more granular checks for specific values.
 *
 * Note that it may not be entirely accurate as it does not actually check the * validity of the CSS, it only try to map back to the compatibility data.
 * Report can be either printed in console or exported as a already styled HTML table.
 *
 * This is a helper around {@link Report} which resolves css urls, instantiate a new report and return the printed result.
 *
 * @example
 * ```ts
 * import { compatibility } from "./compatibility.ts"
 *
 * // Print compatibility report in console
 * await compatibility(new URL("testing/test_bundle.css", import.meta.url), { query:"defaults", output:"console" })
 * ```
 * @example
 * ```ts
 * import { compatibility } from "./compatibility.ts"
 *
 * // Format compatibility report as HTML table
 * // Use `style: false` to remove <style> tag from output and use your own styling instead
 * await compatibility(new URL("testing/test_bundle.css", import.meta.url), { query:"defaults", output:"html", style:true })
 * ```
 * ________________________________________________________________________________
 *
 * Copyright (c) Lecoq Simon <@lowlighter>. (MIT License)
 * https://github.com/lowlighter/libs/blob/main/LICENSE
 *
 * @author Simon Lecoq (lowlighter)
 * @license MIT
 */
export async function compatibility(input: URL | string, { query = "defaults", loglevel, ...options }: { query?: Arrayable<string>; loglevel?: loglevel } & Arg<Report["print"], 1> = {}): Promise<string> {
  const code = input instanceof URL ? await fetch(input).then((response) => response.text()) : input
  return new Report(query, { loglevel }).for(code).print(options)
}

/**
 * Report.
 *
 * Create a new compatibility report for a given CSS stylesheet content.
 *
 * Select browsers to test using {@link https://github.com/browserslist/browserslist?tab=readme-ov-file#queries | browserslist queries}.
 *
 * @example
 * ```ts
 * import { Report } from "./compatibility.ts"
 *
 * // Check compatibility
 * const report = new Report("> 1%")
 * const result = report.for("div { backdrop-filter: blur(5px); }")
 * result.features.list.includes("css-backdrop-filter")
 * console.log(result.browsers.ie["9"].support.unsupported)
 *
 * // HTML table reports
 * console.log(report.print(result, { output: "html", verbose: false }))
 *
 * // Console table reports
 * report.print(result, { output: "console", verbose: false })
 * ```
 * ________________________________________________________________________________
 *
 * Copyright (c) Lecoq Simon <@lowlighter>. (MIT License)
 * https://github.com/lowlighter/libs/blob/main/LICENSE
 *
 * @author Simon Lecoq (lowlighter)
 * @license MIT
 */
export class Report {
  /** Constructor */
  constructor(query: Arrayable<string>, { loglevel = Logger.level.error as loglevel } = {}) {
    this.#log = new Logger({ level: loglevel })
    browserslist(query).forEach((line: string) => {
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

  /** Search feature in compatibility data recursively */
  #search(section: string, name: feature, compatibility = bcd.css[section] as bcd_compatibility, _feature = null as Nullable<string>): Nullable<string> {
    for (const feature of Object.keys(compatibility)) {
      if (feature === "__compat") {
        continue
      }
      if (name in compatibility[feature]) {
        return _feature ?? feature
      }
      const _search = this.#search(section, name, compatibility[feature] as bcd_compatibility, feature)
      if (_search) {
        return _search
      }
    }
    return null
  }

  /** Prepreocess */
  #preprocess(log: Logger, section: bcd_section, _node: ast_node, name: string, values: ast_value, realname: Nullable<string>, prefix: Nullable<string>, skipped: boolean) {
    const original = [...arguments]
    if (vendors.test(name)) {
      prefix = name.match(vendors)!.groups!.prefix
      if (!bcd.css[section][name]) {
        realname = name
        name = name.replace(vendors, "")
      }
    }
    if ((section === "properties") && (name.startsWith("--"))) {
      realname = name
      name = "custom-property"
    }
    if ((section === "types") && /^rgba?$/.test(name)) {
      realname = name
      name = "color"
    }
    if ((section === "types") && (name === "var")) {
      realname = `${name}()`
      name = "custom-property"
      section = "properties"
    }
    if ((section === "types") && (name === "minmax")) {
      realname = `${name}()`
      name = "grid-template-columns"
      section = "properties"
    }
    const feature = this.#search(section, name)
    if (feature) {
      log.debug(`found ${name} in [${feature}]`)
      realname = name
      name = feature
    }
    if (["src", "format"].includes(name)) {
      skipped = true
    }
    if (original[1] !== section) {
      log.debug(`changed section from "${original[1]}" to "${section}"`)
    }
    if (realname !== null) {
      log.debug(`changed name from "${original[3]}" to "${name}"`)
    }
    return { section, name, _values: values, realname, prefix, skipped }
  }

  /** Process a single AST node */
  #process(data: data, section: bcd_section, node: ast_node, name: string, _values?: ast_value) {
    const location = this.#location(node.loc)
    const log = this.#log.with({ location: `${location.line}:${location.column}`, section, name })
    let realname = null as Nullable<string>, prefix = null as Nullable<string>, skipped = false
    ;({ section, name, _values, realname, prefix, skipped } = this.#preprocess(log, section, node, name, _values!, realname, prefix, skipped))
    const feature = bcd.css[section][name]?.__compat?.source_file?.replace(/^css\//, "").replace(/\.json$/, "") ?? `${section}/${name}`
    const value = _values ? this.#clean(generate(_values) as string) : realname ?? null
    let logger = log
    if (value !== null) {
      logger = log.with({ value })
    }
    if (skipped) {
      logger.debug("skipped")
      return
    }
    for (const browser in this.#browsers) {
      for (const version of this.#browsers[browser]) {
        logger = logger.with({ browser, version })
        const { level, status } = this.#support(logger, bcd.css[section][name] as bcd_compatibility, browser, version, value ? this.#tags(log, value, _values) : [], prefix)
        data.push({ feature, browser, version, location, value, level, status: { deprecated: status.deprecated, experimental: status.experimental, nonstandard: !status.standard_track } })
        if (!status.deprecated) {
          delete (status as rw).deprecated
        }
        if (!status.experimental) {
          delete (status as rw).experimental
        }
        if (status.standard_track === false) {
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
  #support(log: Logger, compatibility: bcd_compatibility | void, browser: browser, version: version, tags: tag[], prefix: Nullable<string>): { level: level; status: bcd_status } {
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
          return this.#support(log, _compatibility, browser, version, [], prefix)
        }
      }
    }
    // Multiple compatibility checks
    if (Array.isArray(support)) {
      for (const _support of support) {
        const _result = this.#support(log, { __compat: { support: { [browser]: _support }, status } } as bcd_compatibility, browser, version, [], prefix)
        if (_result.level !== "unknown") {
          return _result
        }
      }
      return { level: "unknown", status }
    } // Simple compatibility checks
    else if (typeof support === "object") {
      return { level: this.#test(log, support, version, prefix), status }
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
        keywords.push(...Array.from(description.matchAll(/^<code>([\s\S]+?)<\/code>$/g)).map((match) => (match as string[])[1]))
      }
      if (keywords.includes(tag)) {
        log.debug(`matched granular rule "${key}"`)
        return compatibility[key] as bcd_compatibility
      }
      const _compatibility = this.#value_compatibility(log, compatibility[key] as bcd_compatibility, tag)
      if (_compatibility) {
        return _compatibility
      }
    }
    return false
  }

  /** Test browser version against a single matcher */
  #test(log: Logger, support: bcd_support, version: version, prefix: Nullable<string>) {
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
      log.debug(`partially supported since version ${support.version_added}`)
      level = "partial"
      return level
    }
    if (support.prefix) {
      log.debug(`supported with ${support.prefix} since version ${support.version_added}`)
      if (prefix !== support.prefix) {
        log.debug(`"${prefix}" does not match required "${support.prefix}"`)
        return "prefixed"
      }
      level = "supported"
    } else {
      log.debug(`supported since version ${support.version_added}`)
      level = "supported"
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
  #view(data: ReturnType<Report["for"]>, type: "browsers") {
    switch (type) {
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
  print(data: ReturnType<Report["for"]>, { view = "browsers" as const, output = "console" as "console" | "html", verbose = false, style = true } = {}): string {
    const table = this.#view(data, view)
    const body = new Array(table[0]?.length).fill(null).map(() => []) as string[][]
    for (let i = 0; i < table.length; i++) {
      for (let j = 0; j < table[0].length; j++) {
        const cell = table[i][j]
        if (!cell) {
          body[j].push("")
          continue
        }
        let text = j === 0 ? cell.browser : cell.version
        text += `\n${this.#color(`${Math.floor(cell.count.percentage.supported)}%`, -2, output)}`
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
                    message = `:${value ?? name}`
                    break
                  case "properties":
                    message = `${name}: ${value};`
                    break
                  case "types":
                    message = `${name}()`
                    if (value) {
                      message = `[${name}] ${value}()`
                    }
                    break
                }
                messages.add(
                  `\n${this.#color(message, color, output)}`,
                )
              }
              text += [...messages].sort((a, b) => a.localeCompare(b)).join("")
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
        return `<table class="css-compatibility-table">\n${
          body.map((row, i) => `  <tr>${row.map((cell) => !cell ? `    \n    <td data-empty></td>` : `\n    <t${i ? "d" : "h"}>\n${cell.replaceAll(/^(<span .*)$/gm, "      $1<br>").replaceAll(/\n([^< ].+<\/span>)/g, "$1<br>")}\n    </t${i ? "d" : "h"}>`).join("")}\n  </tr>`)
            .join("\n")
        }\n</table>${style ? `\n${Report.styling}` : ""}`
    }
  }

  /** Apply coloring */
  #color(string: string, value: number, output: "console" | "html") {
    switch (true) {
      case Number.isNaN(value):
        return output === "html" ? `<span data-unknown>${string}</span>` : gray(string)
      case value === -2:
        return output === "html" ? `<span data-version>${string}</span>` : italic(string)
      case value === -1:
        return output === "html" ? `<span data-prefix>${string}</span>` : brightMagenta(string)
      case value >= 100:
        return output === "html" ? `<span data-perfect>${string}</span>` : brightGreen(string)
      case value >= 90:
        return output === "html" ? `<span data-good>${string}</span>` : green(string)
      case value >= 80:
        return output === "html" ? `<span data-ok>${string}</span>` : yellow(string)
      default:
        return output === "html" ? `<span data-bad>${string}</span>` : red(string)
    }
  }

  /** Clean value */
  #clean(string: string) {
    return string
      .trim()
      // Format functions
      .replaceAll(/(url|format|attr|var)\(.*?\)/g, "$1()")
      // Clean colors
      .replaceAll(/#[0-9a-fA-F]{3,8}/g, "")
      .replaceAll(/rgba?\(.*?\)/g, "")
      // Clean numbers and units
      .replaceAll(/-?(?:(?:\d+(\.d*)?|(?:\d*\.\d+)))([cm]m|p[ctx]|Q|in|%|r?em|v[hw]|[r]lh|m?s|turn)?/g, "")
      // Clean strings
      .replaceAll(/"[^"]*?"/g, "")
      // Clean vars
      .replaceAll(/var\(\)/g, "")
      .replaceAll(/\s+/g, " ")
      .replaceAll(/,+/g, "")
      .trim() || "*"
  }

  /** Inject testing properties for test cases (internal, only for testing purposes) */
  protected static testing() {
    Object.assign(bcd.css.properties, {
      ["-debug-empty-array"]: { __compat: { support: { chrome: [] }, status: { standard_track: false, deprecated: false, experimental: true } } },
      ["-debug-unimplemented"]: { __compat: { support: { chrome: false }, status: { standard_track: false, deprecated: false, experimental: true } } },
      ["-debug-prefixed"]: { __compat: { support: { chrome: { version_added: "0", prefix: "-__debug-" } }, status: { standard_track: false, deprecated: false, experimental: true } } },
      ["-debug-prefixed-invalid"]: { __compat: { support: { chrome: { version_added: "0", prefix: "-invalid-" } }, status: { standard_track: false, deprecated: false, experimental: true } } },
      ["-debug-removed"]: { __compat: { support: { chrome: { version_added: "0", version_removed: "0" } }, status: { standard_track: false, deprecated: false, experimental: true } } },
    })
    for (let i = 1; i <= 10; i++) {
      Object.assign(bcd.css.properties, {
        [`-debug-pass-${i}`]: { __compat: { support: { chrome: { version_added: "0" } }, status: { standard_track: false, deprecated: false, experimental: true } } },
        [`-debug-fail-${i}`]: { __compat: { support: { chrome: { version_added: false } }, status: { standard_track: false, deprecated: false, experimental: true } } },
      })
    }
  }

  /** HTML styling for tables */
  protected static styling = `
  <style>
    .css-compatibility-table {
      border-collapse: collapse;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    }
    .css-compatibility-table th {
      background-color: #d0d7de;
    }
    .css-compatibility-table th, .css-compatibility-table td {
      border: 1px solid black;
      padding: 1em;
      white-space: nowrap;
      vertical-align: top;
      text-align: left;
    }
    .css-compatibility-table :is(td, th) :nth-child(1) {
      display: block;
      text-align: center;
      font-weight: bold;
      font-size: 1.15em;
      border-bottom: 1px solid currentColor;
    }
    .css-compatibility-table [data-empty] {background-color: #000;}
    .css-compatibility-table [data-unknown] {color: #848d97;}
    .css-compatibility-table [data-prefix] {color: #8250df;}
    .css-compatibility-table [data-perfect] {color: #1a7f37;}
    .css-compatibility-table [data-good] {color: #3fb950;}
    .css-compatibility-table [data-ok] {color: #d29922;}
    .css-compatibility-table [data-bad] {color: #f85149;}
  </style>`.split("\n").map((line) => line.trim()).join("").replaceAll(/([:\],]) /g, "$1").replaceAll(/ \{/g, "{") as string
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
