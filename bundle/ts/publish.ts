// Imports
import * as JSONC from "@std/jsonc"
import type { Arg, Optional, record } from "@libs/typing"
import { assertMatch } from "@std/assert"
import { Logger, type loglevel } from "@libs/logger"
import { bundle } from "./bundle.ts"
import { dirname, resolve, toFileUrl } from "@std/path"
import { mergeReadableStreams, TextLineStream } from "@std/streams"

/** Transform a `deno.jsonc` file into a `package.json` and bundle exported entrypoints to make package publishable on json. */
export async function packaged(path = "deno.jsonc", { log = new Logger(), scope = undefined as Optional<string>, name = undefined as Optional<string> } = {}): Promise<package_output> {
  path = resolve(path)
  log.debug(`processing: ${path}`)
  const mod = JSONC.parse(await Deno.readTextFile(path)) as record<string> & { exports?: record<string> }
  // Validate package name
  assertMatch(mod.name, /^@[a-z0-9-]+\/[a-z0-9-]+$/)
  const [_scope, _name] = mod.name.split("/")
  scope ??= _scope
  name ??= _name
  log = log.with({ scope, name })
  log.debug()

  // Setup package.json
  const json = {
    name: `${scope}/${name}`,
    version: mod.version,
    type: "module",
    scripts: {},
  } as package_output["json"]
  log.debug(`set version: ${json.version}`)

  // Copy optional fields
  for (const key of ["description", "keywords", "license", "author", "homepage", "repository", "funding"] as const) {
    if (mod[key]) {
      json[key] = mod[key]
      log.debug(`set ${key}: ${json[key]}`)
    } else {
      log.debug(`skipped ${key}`)
    }
  }

  // Copy exports
  const exports = {} as record<string>
  if (mod.exports) {
    json.exports = {}
    for (const [key, value] of Object.entries(mod.exports) as [string, string][]) {
      const url = toFileUrl(resolve(dirname(path), value))
      const file = value.replace(/\.ts$/, ".mjs")
      log.debug(`bundling: ${file}`)
      const code = await bundle(url, { config: toFileUrl(path) })
      json.exports[key] = file
      exports[file] = code
    }
  }

  return { directory: dirname(path), scope, name, json, exports } as package_output
}

/** Publish a TypeScript package on npm registries. */
export async function publish(path: Arg<typeof packaged>, { log = new Logger(), registries = [], dryrun, ...options }: Arg<typeof packaged, 1> & { log?: Logger; registries?: registry[]; dryrun?: boolean }): Promise<Pick<package_output, "scope" | "name" | "json">> {
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
      await npm(["logout"], { log })
      await npm(["set", "registry", url], { log })
      await npm(["set", `//${new URL(url).host}/:_authToken=$NPM_TOKEN`], { log })
      const args = ["publish", "--access", { public: "public", private: "restricted" }[access]]
      if (dryrun) {
        args.push("--dry-run")
      }
      log.debug(`publishing to: ${url} (${access})`)
      const { success, stderr } = await npm(args, { log, env: { NPM_TOKEN: token } })
      if ((!success) && (!stderr.includes("You cannot publish over the previously published versions"))) {
        throw new Error(`npm publish failed: ${stderr}`)
      }
    }
  } finally {
    Deno.chdir(cwd)
  }
  return { scope, name, json }
}

/** Run npm command. */
async function npm(args: string[], { log, env }: { log: Logger; env?: record<string> }) {
  let extension = ""
  if (Deno.build.os === "windows") {
    extension = ".cmd"
  }
  log = log.with({ npm: true })
  const command = new Deno.Command(`npm${extension}`, { args, stdout: "piped", stderr: "piped", env })
  const process = command.spawn()
  const stream = mergeReadableStreams(process.stdout, process.stderr).pipeThrough(new TextDecoderStream()).pipeThrough(new TextLineStream())
  let stdout = ""
  let stderr = ""
  for await (const line of stream) {
    const { level, content } = line.match(/^npm (?<level>[a-zA-Z!]+) (?<content>.*)$/)?.groups ?? {}
    if (level) {
      log[({ "ERR!": "error", "WARN": "warn" }[level] ?? "debug") as loglevel](content)
      if (level === "ERR!") {
        stderr += content
      } else {
        stdout += content
      }
    }
  }
  const { success, code } = await process.status
  return { success, code, stdout, stderr }
}

/** Package output. */
type package_output = {
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
  }
  /** Exported entrypoints. */
  exports: record<string>
}

/** Registry configuration. */
type registry = {
  /** Registry URL. */
  url: string
  /** Registry publishing token. */
  token: string
  /** Registry publishing access level. */
  access: "public" | "private"
}
