/**
 * CLI utility to resolve imports from import map on a TypeScript project so it can be used without it.
 *
 * @module
 */

// Imports
import { parseArgs } from "@std/cli"
import { Logger, type loglevel } from "@libs/logger"
import { assert } from "@std/assert"
import * as JSONC from "@std/jsonc"
import { expandGlob } from "@std/fs"
import { resolve } from "@std/path"
import type { record } from "@libs/typing"
import { unmap } from "../unmap.ts"

const { help, loglevel, "import-map": map = "deno.jsonc", exclude = [], dryrun, _: [project] } = parseArgs(Deno.args, {
  boolean: ["help", "dryrun"],
  alias: { help: "h", loglevel: "l" },
  string: ["loglevel", "import-map", "exclude"],
  collect: ["exclude"],
})
if (help) {
  console.log("Resolve imports from import map on a TypeScript project.")
  console.log("https://github.com/lowlighter/libs - MIT License - (c) 2024 Simon Lecoq")
  console.log("")
  console.log("This tool will resolve all imports against an import map so a project can be used without it.")
  console.log("This is useful when you want to publish a package on a HTTP registry, where import maps are not resolved locally.")
  console.log("")
  console.log("Usage:")
  console.log("  deno --allow-read --allow-write [options] [project]")
  console.log("")
  console.log("Options:")
  console.log("  -h, --help                        Show this help")
  console.log("  -l, --loglevel [level=log]        Log level (disabled, debug, log, info, warn, error)")
  console.log("  --import-map [map=deno.jsonc]     Import map file")
  console.log("  --exclude <pattern>               Exclude files matching glob pattern (can be used multiple times)")
  console.log("  --dryrun                          Dry run (do not update files)")
  Deno.exit(0)
}

// Setup
assert(project, "project is required")
const logger = new Logger({ level: Logger.level[loglevel as loglevel] })
const root = resolve(`${project}`).replaceAll("\\", "/")
const { imports } = JSONC.parse(await Deno.readTextFile(resolve(root, map))) as record<record<string>>
exclude.push("node_modules")

// Process files
logger.info(`processing files in ${root}`)
for await (const { path } of expandGlob("**/*.ts", { root, exclude })) {
  const log = logger.with({ path: path.replaceAll("\\", "/").replace(`${root}/`, "") }).debug("found")
  const content = await Deno.readTextFile(path)
  const { result, resolved } = unmap(content, imports, { log })
  if (resolved) {
    log.info(`resolved ${resolved} imports`)
  } else {
    log.info("no imports to resolve")
  }
  if (!dryrun) {
    await Deno.writeTextFile(path, result)
    log.info("file updated")
  }
}
