// Imports
import doiuse from "npm:doiuse@6/lib/DoIUse.js"
import postcss from "npm:postcss@8"
import browserslist from "npm:browserslist@4"
import features from "https://esm.sh/doiuse@6/data/features"
import type { Arg } from "jsr:@libs/typing@1.0.0"

/** Browsers translations */
const translate = {
  chrome: "Chrome",
  edge: "Edge",
  safari: "Safari",
  firefox: "Firefox",
  ff: "Firefox",
  opera: "Opera",
  explorer: "Internet Explorer",
  ie: "Internet Explorer",
  chromeandroid: "Android Chrome",
  and_chr: "Android Chrome",
  ios_saf: "iOS Safari",
  samsung: "Samsung Internet",
  operamini: "Opera Mini",
  op_mini: "Opera Mini",
  op_mob: "Opera Mobile",
  ucandroid: "UC Browser",
  and_uc: "UC Browser",
  android: "Android Browser",
  firefoxandroid: "Android Firefox",
  and_ff: "Android Firefox",
  and_qq: "QQ Browser",
  baidu: "Baidu Browser",
  kaios: "KaiOS Browser",
  electron: "Electron",
  node: "Node.js",
  blackberry: "BlackBerry",
  bb: "BlackBerry",
  ie_mob: "Internet Explorer Mobile",
} as Record<browser, string>

/** Browsers order */
const order = [
  "chrome",
  "edge",
  "safari",
  "firefox",
  "ff",
  "opera",
  "explorer",
  "ie",
  "chromeandroid",
  "and_chr",
  "ios_saf",
  "samsung",
  "operamini",
  "op_mini",
  "op_mob",
  "ucandroid",
  "and_uc",
  "android",
  "firefoxandroid",
  "and_ff",
  "and_qq",
  "baidu",
  "kaios",
  "electron",
  "node",
  "blackberry",
  "bb",
  "ie_mob",
]

/** Test css compatibility against browsers */
export function caniuse(query: string | string[], css: string, options: { table: Arg<typeof _table, 1> }): string
export function caniuse(query: string | string[], css: string, options?: { table?: false }): result
export function caniuse(query: string | string[], css: string, { table = false as false | Arg<typeof _table, 1> } = {}) {
  // Initialization
  const browsers = browserslist(query).reduce((browsers, browser) => {
    const [name, version] = browser.split(" ")
    browsers[name] ??= {}
    browsers[name][version] = { missing: new Map(), partial: new Map() }
    return browsers
  }, {} as Record<browser, Record<version, compatibility>>)
  // Doiuse
  const parsed = postcss(
    new doiuse({
      browsers: query,
      onFeatureUsage({ feature, featureData: { partialData: partial, missingData: missing }, usage: { prop: property, value } }: caniuse) {
        for (const [section, report] of Object.entries({ partial, missing }) as [keyof compatibility, Record<browser, Record<version, string>>][]) {
          for (const [name, versions] of Object.entries(report ?? {}) as [string, Record<version, string>][]) {
            for (const version of Object.keys(versions)) {
              if (!browsers[name][version][section].has(feature)) {
                browsers[name][version][section].set(feature, new Set())
              }
              browsers[name][version][section].get(feature)!.add(property ? `${property}: ${_strip_urls(value)}` : "")
            }
          }
        }
      },
    }),
  ).process(css) as unknown as { result: { root: node }; messages: unknown[] }
  parsed.messages
  // Convert to JSON
  const result = {
    features: [..._list_features(parsed.result.root)],
    report: JSON.parse(JSON.stringify(browsers, (_key, value) => {
      switch (true) {
        case value instanceof Map:
          return Object.fromEntries(value)
        case value instanceof Set:
          return Array.from(value)
        default:
          return value
      }
    })),
  } as result
  return table ? _table(result, table) : result
}

/** Convert a {@link caniuse} result to html table */
function _table(result: result, level: "summary" | "details" | "verbose" | "verbose-plus") {
  const { features, report } = result
  // Sort data
  const data = Object.entries(report).map(([browser, record]) => [
    browser,
    Object.entries(record).sort(([a], [b]) => {
      if (a.includes("-")) {
        a = a.split("-")[1]
      }
      if (b.includes("-")) {
        b = b.split("-")[1]
      }
      return Number.parseFloat(b) - Number.parseFloat(a)
    }),
  ]).sort(([a], [b]) => order.indexOf(a as string) - order.indexOf(b as string)) as [browser, [version, result["report"][browser][version]]][]
  let table = `<table class="caniuse">\n`
  table += `  <tr>\n${data.map(([browser]) => `    <th>${translate[browser]}</th>`).join("\n")}</tr>\n`
  // Iterate over sorted data
  const rows = Math.max(...Object.values(report).map((record) => Object.keys(record).length))
  for (let i = 0; i < rows; i++) {
    table += "  <tr>\n"
    //console.log(data)
    for (const [version, compatibility] of data.map(([_, record]) => record[i] ?? [null, null]) as unknown as [version, compatibility][]) {
      // Skip empty cells
      if (!compatibility) {
        table += "    <td></td>\n"
        continue
      }
      // Check compatibility
      if (compatibility) {
        let support = "complete"
        const notices = []
        for (const key of ["missing", "partial"] as const) {
          notices.push(
            ...Object.entries(compatibility[key]).map(([feature, properties]) =>
              `        <li class="${key}">\n          ${feature}\n${level === "verbose-plus" ? `          <ul>\n${(properties as string[]).filter((property) => property).map((property) => `            <li>${property}</li>`).join("\n")}\n          </ul>\n` : ""}        </li>\n`
            ),
          )
          if ((notices.length) && (support === "complete")) {
            support = key
          }
        }
        const score = 100 * (1 - Object.keys({ ...compatibility.partial, ...compatibility.missing }).length / features.length)
        table += `    <td class="${support}">\n      <span class="version">${version.replace(/^[\d.]+-/, "")}</span>${
          level !== "summary" ? `\n      <div class="score ${score === 100 ? "perfect" : score > 90 ? "excellent" : score > 80 ? "good" : "bad"}">${Math.floor(score)}%</div>` : ""
        }${(level.includes("verbose")) && (notices.length) ? `\n      <ul>\n${notices.join("")}      </ul>` : ""}\n    </td>\n`
      }
    }
    table += "  </tr>\n"
  }
  table += "</table>"
  return table
}

/** List features */
function _list_features(node: node, list = new Set<string>()) {
  node.each((child: node) => {
    if (child.type === "comment") {
      return
    }
    for (
      const [feature] of Object.entries(features).filter(([_, matcher]) => {
        switch (true) {
          case !matcher:
            return false
          case typeof matcher === "function":
            return matcher(child)
          case Array.isArray(matcher):
            return matcher.some((test) => test(child))
          default:
            if (child.type !== "decl") {
              return false
            }
            return Object.entries(matcher).some(([property, value]) => {
              if ((property !== "") && (property !== child.prop)) {
                return false
              }
              if (typeof value === "boolean") {
                return value
              }
              return _feature_check(value, _strip_urls(child.value))
            })
        }
      })
    ) {
      list.add(feature)
    }
    if (child.type !== "decl") {
      _list_features(child, list)
    }
  })
  return list
}

/** Strip the contents of url literals so they aren't matched */
function _strip_urls(input?: string) {
  return input?.replaceAll(/url\([^)]*\)/g, "url()") ?? ""
}

/** Perform a feature check */
function _feature_check(check: unknown, candidate: string): boolean {
  switch (true) {
    case check instanceof RegExp:
      return check.test(candidate)
    case typeof check === "string":
      return candidate.includes(check)
    case typeof check === "function":
      return check(candidate)
    case typeof check === "boolean":
      return check
    case Array.isArray(check):
      return check.some((check) => _feature_check(check, candidate))
    default:
      return false
  }
}

/** Browser */
type browser = string

/** Version */
type version = string

/** Compatibility */
type compatibility = { missing: Map<string, Set<string>>; partial: Map<string, Set<string>> }

/** Caniuse data */
type caniuse = {
  message: string
  feature: string
  featureData: {
    partialData: Record<browser, Record<version, string>>
    missingData: Record<browser, Record<version, string>>
  }
  usage: {
    prop: string
    value: string
  }
}

/** Result */
type result = {
  features: string[]
  report: Record<browser, Record<version, { missing: Record<string, string[]>; partial: Record<string, string[]> }>>
}

/** Postcss node */
type node = {
  prop: string
  value: string
  type: string
  each: (callback: (node: node) => void) => void
}
