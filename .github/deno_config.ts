// Imports
import { expandGlob } from "@std/fs"
import { basename, dirname, fromFileUrl, resolve } from "@std/path"
import { Logger } from "@libs/logger"
import * as JSONC from "@std/jsonc"
import type { record } from "@libs/typing"
import * as semver from "jsr:@std/semver"

// Load global configuration
const upgrade = Deno.env.get("UPGRADE_PACKAGES") === "true"
const root = fromFileUrl(import.meta.resolve("../"))
const global = JSONC.parse(await Deno.readTextFile(resolve(root, "deno.jsonc"))) as Record<string, unknown>
const log = new Logger()
const order = ["icon", "name", "version", "description", "keywords", "license", "author", "funding", "homepage", "playground", "supported", "repository", "npm", "deno.land/x", "exports", "unstable", "types", "lock", "imports", "test:permissions", "tasks", "lint", "fmt"]

// Load local configurations
const packages = []
for await (const { path } of expandGlob(`*/deno.jsonc`, { root })) {
  const local = JSONC.parse(await Deno.readTextFile(path)) as Record<string, unknown>
  const name = basename(dirname(path))
  packages.push(name)
  // Sync local configuration with global configuration
  let slow = false
  local.author = global.author
  local.repository = global.repository
  local.homepage = global.homepage
  local.funding = global.funding
  local.license = global.license
  local.lint = structuredClone(global.lint)
  local.fmt = structuredClone(global.fmt)
  if (local.types === "slow") {
    ;(local.lint as { rules: { exclude: string[] } }).rules.exclude = ["no-slow-types"]
    slow = true
  }
  // Sync tasks
  local.tasks ??= {}
  const tasks = local.tasks as record<string>
  const test = (local["test:permissions"] ?? {}) as record<Array<string> | true>
  test.run ??= []
  if (Array.isArray(test.run)) {
    test.run = [...new Set(["deno", "node", "bun", "npx", ...test.run])]
  }
  const permissions = Object.entries(test).map(([key, value]) => `--allow-${key}${value === true ? "" : `=${value.join(",")}`}`).join(" ")
  tasks["test"] = `deno test ${permissions} --no-prompt --coverage --clean --trace-leaks --doc`
  tasks["test:deno"] = `deno fmt && deno task test --filter='/^\\[deno\\]/' && deno coverage --exclude=.js --detailed && deno lint && deno publish ${slow ? "--allow-slow-types " : ""}--dry-run --quiet --allow-dirty`
  tasks["test:deno-future"] = "DENO_FUTURE=1 && deno task dev"
  tasks["test:others"] = "deno fmt --check && deno task test --filter='/^\\[node|bun \\]/' --quiet && deno coverage --exclude=.js && deno lint"
  tasks["coverage"] = "deno task test --filter='/^\\[deno\\]/' --quiet && deno coverage --exclude=.js"
  tasks["coverage:html"] = "deno fmt --check && deno task test --filter='/^\\[node|bun \\]/' --quiet && deno coverage --exclude=.js && deno lint"
  // Sync imports
  if (local.imports) {
    for (const [key, value] of Object.entries(global.imports ?? {})) {
      const imports = local.imports as record<string>
      if (!(key in imports)) {
        continue
      }
      const regex = /@(?<version>\d+(?:\.\d+)?(?:\.\d+)?(?:-[a-zA-Z0-9.]+)?)(?:\/|$)/
      const { version: project = "" } = value.match(regex)?.groups ?? {}
      const { version: scope = "" } = imports[key].match(regex)?.groups ?? {}
      const logger = log.with({ package: packages.at(-1), dependency: key, project, version: scope }).debug()
      if (!project) {
        if (project !== scope) {
          if (upgrade) {
            continue
          }
          logger.warn(`mismatching paths: ${project} != ${scope}`)
        }
        continue
      }
      const semproject = semver.parseRange(project).at(0)!.filter(({ operator }) => (operator === ">=") || (!operator)).map(({ major, minor, patch }) => ({ major, minor, patch })).at(0)!
      const semscope = semver.parseRange(scope).at(0)!.filter(({ operator }) => (operator === ">=") || (!operator)).map(({ major, minor, patch }) => ({ major, minor, patch })).at(0)!
      if (semver.greaterThan(semproject, semscope)) {
        logger.warn(`upgrade available`)
        if (upgrade) {
          imports[key] = value
          log.info(`upgraded: ${key} → ${project}`)
        }
        continue
      }
      if (!semver.equals(semproject, semscope)) {
        logger.warn(`mismatching versions: ${project} ≠ ${scope}`)
      }
    }
  }
  // Save local configuration
  await Deno.writeTextFile(path, JSON.stringify(Object.fromEntries(order.map((key) => [key, local[key]]).filter(([_, value]) => value !== undefined)), null, 2))
  log.with({ package: packages.at(-1) }).info("written config")
}
