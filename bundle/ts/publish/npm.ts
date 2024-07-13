/**
 * Publish a TypeScript package on npm registries.
 * @module
 */

// Imports
import * as JSONC from "@std/jsonc"
import type { Arg, Optional, record } from "@libs/typing"
import { assertMatch } from "@std/assert"
import { Logger } from "@libs/logger"
import { bundle } from "../bundle.ts"
import { dirname, resolve, toFileUrl } from "@std/path"
import { command } from "@libs/run/command"
export type { Arg, Logger, record }

/** Transform a `deno.jsonc` file into a `package.json` and bundle exported entrypoints to make package publishable on json. */
export async function packaged(path = "deno.jsonc", { logger: log = new Logger(), scope = undefined as Optional<string>, name = undefined as Optional<string> } = {}): Promise<package_output> {
  path = resolve(path)
  log.debug(`processing: ${path}`)
  const mod = JSONC.parse(await Deno.readTextFile(path)) as record<string> & { exports?: record<string> }
  // Validate package name
  assertMatch(mod.name, /^@[a-z0-9-]+\/[a-z0-9-]+$/)
  const [_scope, _name] = mod.name.split("/")
  scope ??= _scope
  name ??= _name
  log = log.with({ scope, name }).debug()

  // Setup package.json
  const json = {
    name: `${scope}/${name}`,
    version: mod.version,
    type: "module",
    scripts: {},
    dependencies: {},
    devDependencies: {},
  } as package_output["json"]
  log.trace(`set version: ${json.version}`)

  // Copy optional fields
  for (const key of ["description", "keywords", "license", "author", "homepage", "repository", "funding"] as const) {
    if (mod[key]) {
      json[key] = mod[key]
      log.trace(`set ${key}: ${json[key]}`)
    } else {
      log.trace(`skipped ${key}`)
    }
  }

  // Copy exports
  const exports = {} as record<string>
  if (mod.exports) {
    json.exports = {}
    for (const [key, value] of Object.entries(mod.exports) as [string, string][]) {
      const url = toFileUrl(resolve(dirname(path), value))
      const file = value.replace(/\.ts$/, ".mjs")
      log.trace(`bundling: ${file}`)
      const code = await bundle(url, { config: toFileUrl(path) })
      json.exports[key] = file
      exports[file] = code
    }
  }

  return { directory: dirname(path), scope, name, json, exports } as package_output
}

/** Publish a TypeScript package on npm registries. */
export async function publish(
  path: Arg<typeof packaged>,
  { logger: log = new Logger(), registries = [], dryrun, provenance, ...options }: Arg<typeof packaged, 1> & { logger?: Logger; registries?: registry[]; dryrun?: boolean; provenance?: boolean },
): Promise<Pick<package_output, "scope" | "name" | "json">> {
  const { directory, scope, name, json, exports } = await packaged(path, options)
  log = log.with({ scope, name })
  log.debug("creating: package.json")
  await Deno.writeTextFile(resolve(directory, "package.json"), JSON.stringify(json, null, 2))
  for (const [key, value] of Object.entries(exports)) {
    log.debug(`creating export: ${key}`)
    await Deno.writeTextFile(resolve(directory, key), value)
  }
  const cwd = Deno.cwd()
  try {
    for (const { url, token, access } of registries) {
      Deno.chdir(directory)
      await command("npm", ["set", "--location", "project", "registry", url], { logger: log, winext: ".cmd", throw: true })
      await command("npm", ["set", "--location", "project", `//${new URL(url).host}/:_authToken`, token], { logger: log, winext: ".cmd", throw: true })
      const args = ["publish", "--access", { public: "public", private: "restricted" }[access]]
      if (dryrun) {
        args.push("--dry-run")
      }
      if (provenance) {
        args.push("--provenance")
      }
      log.debug(`publishing to: ${url} (${access})`)
      const { success, stdout, stderr } = await command("npm", args, { logger: log, env: { NPM_TOKEN: token }, winext: ".cmd" })
      if ((!success) && (!`${stdout}\n${stderr}`.includes("You cannot publish over the previously published versions"))) {
        throw new Error(`npm publish failed: ${stdout}\n${stderr}`)
      }
    }
  } finally {
    Deno.chdir(cwd)
  }
  return { scope, name, json }
}

/** Package output. */
export type package_output = {
  /** Package directory. */
  directory: string
  /** Package scope. */
  scope: string
  /** Package name. */
  name: string
  /** Content of translated package.json. */
  json: {
    name: string
    version: string
    type: "module"
    scripts: record<string>
    exports?: record<string>
    description?: string
    keywords?: string | string[]
    license?: string
    author?: string
    homepage?: string
    repository?: string
    funding?: string
    dependencies: record<string>
    devDependencies?: record<string>
  }
  /** Exported entrypoints. */
  exports: record<string>
}

/** Registry configuration. */
export type registry = {
  /** Registry URL. */
  url: string
  /** Registry publishing token. */
  token: string
  /** Registry publishing access level. */
  access: "public" | "private"
}
