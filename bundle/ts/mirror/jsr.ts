// Imports
import { Logger } from "@libs/logger"
import { extname, join, parse, resolve } from "@std/path"
import * as JSONC from "@std/jsonc"
import { STATUS_CODE as StatusCode } from "@std/http/status"
import type { record } from "@libs/typing"

/**
 * Mirror a list of packages from a scope from jsr.io.
 *
 * All entrypoints will create a new file containing a single re-export.
 * JSON exports are supported.
 *
 * A dictionnary containing the list of files to write will be returned.
 *
 * If `mod` is set to `true`, then an additional global entrypoint `mod.ts` will be added.
 * Note that this tool is not able to rename conflicting exports if multiple package have a same export name.
 *
 * If `config` is set to a deno configuration file path, it'll be read and update the `exports` fields with all found exports.
 * The `version` field will also be updated to format `YYYY.MM.DD` (without leading zeros).
 * Note that any comments in the configuration file will be lost.
 */
export async function mirror(
  { scope, packages: filter, mod, config, registry = "https://jsr.io", registryApi = "https://api.jsr.io", cwd = resolve(), logger = new Logger() }: {
    scope: string
    packages?: string[]
    mod?: boolean
    config?: string
    registry?: string
    registryApi?: string
    cwd?: string
    logger?: Logger
  },
): Promise<{ files: record<string>; exports: record<string> }> {
  // List packages
  const { items: packages } = await fetch(`${registryApi}/scopes/${scope}/packages`).then((response) => response.json())
  logger.with({ scope }).info(`found ${packages.length} packages`)

  // Mirror packages
  const modts = [] as string[]
  const output = { files: {} as record<string>, exports: {} as record<string> }
  for (const { name, latestVersion: version } of packages) {
    if ((filter?.length) && (!filter.includes(name))) {
      continue
    }
    const log = logger.with({ scope, name, version }).info("processing")

    // Fetch exports
    let exports = null
    for (const file of ["deno.json", "deno.jsonc"] as const) {
      const url = `${registry}/@${scope}/${name}/${version}/${file}`
      const response = await fetch(url)
      if (response.status !== StatusCode.OK) {
        response.body?.cancel()
        continue
      }
      log.log(`found ${url}`)
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
    modts.push(`// ${name}@${version}`)
    for (const [entrypoint, exported] of Object.entries(exports) as [string, string][]) {
      const path = join(cwd, name, exported)
      const exports = {
        a: `.${join("/", name, entrypoint).replaceAll("\\", "/")}`,
        b: `.${join("/", name, exported).replaceAll("\\", "/")}`,
      }
      let jsr = `jsr:@std/${name}@${version}${join("/", entrypoint).replaceAll("\\", "/")}`
      if (jsr.endsWith("/")) {
        jsr = jsr.replace(/\/$/, "")
      }
      log.log(`std${path.replace(cwd, "").replaceAll("\\", "/")} → ${jsr}`)
      if (extname(exported) === ".json") {
        const url = new URL(exported, `${registry}/@${scope}/${name}/${version}/`).href
        output.files[path] = await fetch(url).then((response) => response.text())
        modts.push(...[
          `import * as _${parse(exported).name} from "${exports.b}" with { type: "json" }`,
          `/** Re-exports from ${url} */`,
          `const ${parse(exported).name} = _${parse(exported).name} as typeof _${parse(exported).name}`,
          `export { ${parse(exported).name} }`,
        ])
      } else {
        output.files[path] = `export * from "${jsr}"\n`
        modts.push(`export * from "${exports.b}"`)
      }
      output.exports[exports.a] = exports.b
    }
    modts.push("")
  }
  if (mod) {
    output.exports["."] = "./mod.ts"
    output.files[resolve(cwd, "mod.ts")] = modts.join("\n")
  }
  if (config) {
    config = resolve(cwd, config)
    const content = Object.assign(JSONC.parse(await Deno.readTextFile(config)) as Record<PropertyKey, unknown>, { exports: output.exports })
    content["version"] = `${new Date().getFullYear()}.${new Date().getMonth() + 1}.${new Date().getDate()}`
    logger.info(`set version to ${content["version"]}`)
    output.files[config] = `${JSON.stringify(content, null, 2)}\n`
  }
  return output
}
