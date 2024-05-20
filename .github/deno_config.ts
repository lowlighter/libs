// Imports
import { expandGlob } from "@std/fs"
import { basename, dirname, fromFileUrl, resolve } from "jsr:@std/path"
import * as JSONC from "@std/jsonc"
import type { record } from "@libs/typing"

// Load global configuration
const root = fromFileUrl(import.meta.resolve("../"))
const global = JSONC.parse(await Deno.readTextFile(resolve(root, "deno.jsonc"))) as Record<string, unknown>
const imports = { "@std/jsonc": "jsr:@std/jsonc@0.224.0" }

// Load local configurations
const packages = []
for await (const { path } of expandGlob(`*/deno.jsonc`, { root })) {
  const local = JSONC.parse(await Deno.readTextFile(path)) as Record<string, unknown>
  packages.push(basename(dirname(path)))
  // Sync local configuration with global configuration
  local.author = global.author
  local.repository = global.repository
  local.license = global.license
  local.lint = global.lint
  local.fmt = global.fmt
  await Deno.writeTextFile(path, JSON.stringify(local, null, 2))
  // Register local imports
  Object.assign(imports, local.imports ?? {})
}

// Generate tasks
const tasks = global.tasks as record
for (const name of packages) {
  for (const task of ["ci", "coverage", "publish"]) {
    delete tasks[`${name}:${task}`]
  }
}
for (const name of packages) {
  tasks[`${name}:ci`] = `cd ${name} && deno task ci`
  tasks[`${name}:coverage`] = `cd ${name} && deno task coverage --html && sleep 1 && rm -rf ../coverage/${name} && mv coverage/html ../coverage/${name}`
  tasks[`${name}:publish`] = `cd ${name} && deno publish`
}
for (const task of ["ci", "coverage"]) {
  tasks[task] = packages.map((name) => `deno task ${name}:${task}`).join(" && ")
}
tasks.coverage = `rm coverage -rf && mkdir -p coverage && ${tasks.coverage} && deno task coverage:pretty`

// Save global configuration
global.imports = imports
await Deno.writeTextFile(resolve(root, "deno.jsonc"), JSON.stringify(global, null, 2))
