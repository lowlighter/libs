// Imports
import { expandGlob } from "jsr:@std/fs"
import { fromFileUrl } from "jsr:@std/path/from-file-url"
import { resolve } from "jsr:@std/path/resolve"
import * as JSONC from "jsr:@std/jsonc"

// Load global configuration
const root = fromFileUrl(import.meta.resolve("../"))
const global = JSONC.parse(await Deno.readTextFile(resolve(root, "deno.jsonc"))) as Record<string, unknown>
const imports = {}

// Load local configurations
for await (const { path } of expandGlob(`*/deno.jsonc`, { root })) {
  const local = JSONC.parse(await Deno.readTextFile(path)) as Record<string, unknown>
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

// Save global configuration
global.imports = imports
await Deno.writeTextFile(resolve(root, "deno.jsonc"), JSON.stringify(global, null, 2))
