// Imports
import { expandGlob } from "@std/fs"
import { basename, dirname, fromFileUrl, resolve } from "@std/path"
import { Logger } from "@libs/logger"
import * as JSONC from "@std/jsonc"
import type { record } from "@libs/typing"

// Load global configuration
const root = fromFileUrl(import.meta.resolve("../"))
const global = JSONC.parse(await Deno.readTextFile(resolve(root, "deno.jsonc"))) as Record<string, unknown>
const imports = { "@std/jsonc": "jsr:@std/jsonc@0.224.0", "@std/yaml": "jsr:@std/yaml@0.224.0" } as record<string>
const log = new Logger()
const order = ["icon", "name", "version", "description", "license", "author", "funding", "homepage", "playground", "supported", "repository", "exports", "unstable", "lock", "imports", "test:permissions", "tasks", "lint", "fmt"]

// Load local configurations
const packages = []
for await (const { path } of expandGlob(`*/deno.jsonc`, { root })) {
  const local = JSONC.parse(await Deno.readTextFile(path)) as Record<string, unknown>
  const name = basename(dirname(path))
  packages.push(name)
  // Sync local configuration with global configuration
  local.author = global.author
  local.repository = global.repository
  local.homepage = global.homepage
  local.funding = global.funding
  local.license = global.license
  local.lint = global.lint
  local.fmt = global.fmt
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
  tasks["dev"] = "deno fmt && deno task test --filter='/^\\[deno\\]/' && deno coverage --exclude=.js --detailed && deno lint && deno publish --dry-run --quiet --allow-dirty"
  tasks["dev:future"] = "DENO_FUTURE=1 && deno task dev"
  tasks["coverage"] = "deno task test --filter='/^\\[deno\\]/' --quiet && deno coverage --exclude=.js"
  tasks["ci"] = "deno fmt --check && deno task test --filter='/^\\[node|bun \\]/' --quiet && deno coverage --exclude=.js && deno lint"
  tasks["ci:coverage"] = `deno task coverage --html && sleep 1 && mkdir -p ../coverage && rm -rf ../coverage/${name} && mv coverage/html ../coverage/${name}`
  // Save local configuration
  await Deno.writeTextFile(path, JSON.stringify(Object.fromEntries(order.map((key) => [key, local[key]]).filter(([_, value]) => value !== undefined)), null, 2))
  log.with({ package: packages.at(-1) }).info("updated")
  // Register local imports
  for (const [key, value] of Object.entries(local.imports ?? {})) {
    if ((key in imports) && (imports[key] !== value)) {
      log.warn({ package: packages.at(-1), dependency: key }).warn("previous registered with a different version")
    }
    imports[key] = value
  }
}

// Save global configuration
global.imports = imports
await Deno.writeTextFile(resolve(root, "deno.jsonc"), JSON.stringify(Object.fromEntries(order.map((key) => [key, global[key]]).filter(([_, value]) => value !== undefined)), null, 2))
