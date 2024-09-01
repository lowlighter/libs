// Imports
import { Logger } from "@libs/logger"
import { extname, join, parse, resolve } from "@std/path"
import * as JSONC from "@std/jsonc"
import { STATUS_CODE as StatusCode } from "@std/http/status"
import type { Nullable, record } from "@libs/typing"
import { command } from "@libs/run"
import { stripAnsiCode } from "@std/fmt/colors"
import type { JsDoc, JsDocTagNamed } from "@deno/doc"

/**
 * Mirror a list of packages from a scope from jsr.io.
 *
 * All entrypoints will create a new file containing a single re-export.
 * JSON exports are supported.
 *
 * A dictionnary containing the list of files to write will be returned.
 *
 * If `mod` is set to `true`, then an additional global entrypoint `mod.ts` will be added.
 * Re
 *
 * Note that this tool is not able to rename conflicting exports if multiple package have a same export name.
 *
 * If `config` is set to a deno configuration file path, it'll be read and update the `exports` fields with all found exports.
 * The `version` field will also be updated to format `YYYY.MM.DD` (without leading zeros).
 * Note that any comments in the configuration file will be lost.
 *
 * If `expand` flag is set, the tool will expand the list of exported symbols (i.e. use `export { ... } from` instead of `export * from`).
 */
export async function mirror(
  { scope, packages: filter, exclude, mod: _mod, config, registry = "https://jsr.io", registryApi = "https://api.jsr.io", cwd = resolve(), logger = new Logger(), patches = {} }: {
    scope: string
    packages?: string[]
    exclude?: string[]
    mod?: boolean
    config?: string
    registry?: string
    registryApi?: string
    cwd?: string
    logger?: Logger
    patches?: { inject?: record<string>; aliases?: { [key: string]: { [key: string]: Nullable<string> } } }
  },
): Promise<{ files: record<string>; exports: record<string> }> {
  // List packages
  const { items: packages } = await fetch(`${registryApi}/scopes/${scope}/packages`).then((response) => response.json())
  logger.with({ scope }).info(`found ${packages.length} packages`)

  // Mirror packages
  const mod = [] as string[]
  const output = { files: {} as record<string>, exports: {} as record<string> }
  for (const { name, latestVersion: version } of packages) {
    if (((filter?.length) && (!filter.includes(name))) || (exclude?.includes(name))) {
      logger.wdebug(`skipping ${name}@${version}`)
      continue
    }
    const log = logger.with({ scope, name, version }).log("processing")

    // Fetch exports
    let exports = null
    for (const file of ["deno.json", "deno.jsonc"] as const) {
      const url = `${registry}/@${scope}/${name}/${version}/${file}`
      const response = await fetch(url)
      if (response.status !== StatusCode.OK) {
        response.body?.cancel()
        continue
      }
      log.trace(`found ${url}`)
      ;({ exports } = await response.json())
    }
    if (!exports) {
      log.warn("no exports found, skipping...")
      continue
    }
    if (typeof exports === "string") {
      log.debug(`"exports" field changed from type "string" to "object"`)
      exports = { ".": exports }
    }

    // Mirror all exports back to single files
    for (const [entrypoint, exported] of Object.entries(exports) as [string, string][]) {
      const path = join(cwd, name, exported)
      const paths = {
        a: `.${join("/", name, entrypoint).replaceAll("\\", "/")}`,
        b: `.${join("/", name, exported).replaceAll("\\", "/")}`,
      }
      let jsr = `jsr:@std/${name}@${version}${join("/", entrypoint).replaceAll("\\", "/")}`
      if (jsr.endsWith("/")) {
        jsr = jsr.replace(/\/$/, "")
      }
      log.trace(`std${path.replace(cwd, "").replaceAll("\\", "/")} → ${jsr}`)
      output.exports[paths.a] = paths.b

      // Handle JSON exports
      if (extname(exported) === ".json") {
        const url = new URL(exported, `${registry}/@${scope}/${name}/${version}/`).href
        output.files[path] = await fetch(url).then((response) => response.text())
        const symbol = parse(exported).name
        mod.push(...[
          `import * as _${symbol} from "${paths.b}" with { type: "json" }`,
          `/** Re-exports from ${url} */`,
          `const ${symbol} = _${symbol} as typeof _${symbol}`,
          `export { ${symbol} }`,
        ])
      } // Handle regular exports
      else {
        const symbols = await generate(jsr)
        output.files[path] = [...symbols.values()].map(({ content }) => content).join("\n")
        if (patches?.inject?.[paths.b]) {
          output.files[path] = `${patches.inject[paths.b]}\n${output.files[path]}`
        }
        if ((!exports["."]) || ((exports["."]) && (entrypoint === "."))) {
          // Module documentation
          let doc = ""
          const url = new URL(exported, `${registry}/@${scope}/${name}/${version}/`).href
          const temp = await Deno.makeTempFile()
          try {
            await Deno.writeTextFile(temp, await fetch(url).then((response) => response.text()))
            const ast = await parseDoc(temp)
            doc = jsdoc(ast.find(({ kind }: { kind: string }) => kind === "moduleDoc")?.jsDoc)
          } catch (error) {
            log.warn("failed to fetch documentation", error)
          } finally {
            await Deno.remove(temp)
          }
          output.files[path] = `${doc}\n${output.files[path]}`

          // Symbols re-export
          symbols.forEach(({ type }, symbol) => {
            const id = `${paths.b}#${symbol}`
            if (patches?.aliases?.[id] === null) {
              log.trace(`skipping ${id} due to aliasing rule`)
              return
            }
            const alias = patches?.aliases?.[id]
            mod.push(...[
              `export ${type ? "type " : ""}{ ${symbol}${alias ? ` as ${alias}` : ""} } from "${paths.b}"`,
            ])
          })
        }
      }
    }
  }

  // Handle main entrypoint
  if (_mod) {
    const path = join(cwd, "mod.ts")
    output.exports["."] = "./mod.ts"
    output.files[path] = mod.join("\n")
    if (patches?.inject?.["./mod.ts"]) {
      output.files[path] = `${patches.inject["./mod.ts"]}\n${output.files[path]}`
    }
  }

  // Handle configuration file update
  if (config) {
    config = resolve(cwd, config)
    const content = Object.assign(JSONC.parse(await Deno.readTextFile(config)) as Record<PropertyKey, unknown>, { exports: output.exports })
    content["version"] = `${new Date().getFullYear()}.${new Date().getMonth() + 1}.${new Date().getDate()}`
    logger.info(`set version to ${content["version"]}`)
    output.files[config] = `${JSON.stringify(content, null, 2)}\n`
  }

  return output
}

/**
 * Generate the re-export code for a given jsr module.
 *
 * This is computed by extracting `deno doc` information and re-attaching documentation and type information.
 * This is to ensure that it is properly documented once published back on the registry.
 */
async function generate(jsr: string) {
  const temp = await Deno.makeTempFile()
  const symbols = new Map<string, { type: boolean; content: string }>()
  try {
    await Deno.writeTextFile(temp, `export * from "${jsr}"\n`)
    const ast = await parseDoc(temp)
    for (const { kind, name, jsDoc, ..._ } of ast) {
      const { stdout } = await command("deno", ["doc", "--filter", name, temp])
      const signature = stripAnsiCode(stdout).split("\n")[2]
      const type = ["interface", "typeAlias"].includes(kind)
      const lines = [
        `import ${type ? "type " : ""}{ ${name} as _${kind}_${name} } from "${jsr}"`,
        jsdoc(jsDoc),
      ]
      switch (kind) {
        case "class": {
          const generic = capture(signature, kind, _)
          lines.push(`${_.classDef?.isAbstract ? "abstract " : ""}class ${name}${generic[0]} extends _${kind}_${name}${generic[1]} {}`)
          break
        }
        case "namespace":
        case "variable":
        case "function":
          lines.push(`const ${name} = _${kind}_${name} as typeof _${kind}_${name}`)
          break
        case "interface": {
          const generic = capture(signature, kind, _)
          lines.push(`interface ${name}${generic[0]} extends _${kind}_${name}${generic[1]} {}`)
          break
        }
        case "typeAlias": {
          const generic = capture(signature, kind, _)
          lines.push(`type ${name}${generic[0]} = _${kind}_${name}${generic[1]}`)
          break
        }
      }
      if ((!type) || (type && (!ast.some((node: { name: string; kind: string }) => node.name === name && node.kind !== kind)))) {
        lines.push(`export ${type ? "type " : ""}{ ${name} }`, "")
      }
      symbols.set(name, { type, content: lines.join("\n") })
    }
  } finally {
    await Deno.remove(temp)
  }
  return symbols
}

/** Generate back JSDOC. */
function jsdoc({ doc = "", tags = [] } = {} as JsDoc) {
  if (!doc.length && !tags.length) {
    return "/** UNDOCUMENTED */"
  }
  return [
    "/**",
    ...doc.split("\n").map((line: string) => ` * ${line}`),
    ...(tags as JsDocTagNamed[]).map((tag) => ` * @${tag.kind} ${tag.name ? `${tag.name} ` : ""}${tag.doc?.split("\n").join("\n * ") ?? ""}`),
    " */",
  ].join("\n")
}

/**
 * Capture generic parameters (content between `<` and `>`).
 * First value returned is the generic parameters, including constraints and default values.
 * Second value returned is the generic parameters names only.
 */
// deno-lint-ignore no-explicit-any
function capture(params: string, kind: string, _?: any) {
  let depth = 0
  let start = NaN
  for (let i = 0; i < params.length; i++) {
    if (((params[i] === "=") || (params.substring(i).startsWith(" extends ")) || (params.substring(i).startsWith(" implements "))) && (Number.isNaN(start))) {
      // Encountering an equal sign or "extends" before a generic declaration means it's not a generic declaration
      break
    }
    if (params[i] === "<") {
      depth++
      if (Number.isNaN(start)) {
        start = i
      }
    }
    if ((params[i] === ">") && (params[i - 1] !== "=")) {
      depth--
      if (depth === 0) {
        return [fixKeyOf(params.slice(start, i + 1)), `<${_?.[`${kind}Def`]?.typeParams?.map((param: { name: string }) => param.name).join(", ")}>`]
      }
    }
  }
  return ["", ""]
}

/** Fix missing brackets (`{` and `}`) around some `keyof` generated by `deno doc`. */
function fixKeyOf(params: string) {
  const regex = /[<=]\s*(\[.+? in keyof .+?\]: .*)/g
  let match
  while ((match = regex.exec(params)) !== null) {
    const substring = match[1]
    let depth = 0
    for (let i = 0; i < substring.length; i++) {
      if (substring[i] === "<") {
        depth++
      }
      if (substring[i] === ">") {
        depth--
      }
      if (depth < 0) {
        const fixable = substring.substring(0, i)
        params = params.replace(fixable, `{ ${fixable} }`)
        regex.lastIndex = 0
        continue
      }
    }
  }
  return params
}

/** Parse module documentation. */
async function parseDoc(file: string) {
  const { stdout } = await command("deno", ["doc", "--quiet", "--json", file], { stdout: "trace" })
  return JSON.parse(stdout)
}
