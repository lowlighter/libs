/**
 * CLI utility to publish package on npm registries.
 *
 * @module
 */

// Imports
import { publish as publish_npm } from "../publish/npm.ts"
import { parseArgs } from "@std/cli"
import { Logger, type loglevel } from "@libs/logger"
import { assert } from "@std/assert"
import type { Arg } from "@libs/typing"

const { help, loglevel, scope, name, "dry-run": dryrun, registry: url = "https://registry.npmjs.org", token = "", access = "public", provenance, _: [project] } = parseArgs(Deno.args, {
  boolean: ["help", "dry-run", "provenance"],
  alias: { help: "h", loglevel: "l", scope: "s", name: "n", "dry-run": "d", registry: "r", token: "t", access: "a", provenance: "p" },
  string: ["loglevel", "scope", "name", "token", "access"],
})
if (help) {
  console.log("Publish a TypeScript package on npm registries.")
  console.log("https://github.com/lowlighter/libs - MIT License - (c) 2024 Simon Lecoq")
  console.log("")
  console.log("This tool is intended to be run on deno.jsonc path.")
  console.log("It will convert it to a package.json and transpile exported entrypoints to make package publishable on npm.")
  console.log("")
  console.log("Usage:")
  console.log("  deno --allow-all [options] <project>")
  console.log("")
  console.log("Options:")
  console.log("  -h, --help                                   Show this help")
  console.log("  -l, --loglevel=[log]                         Log level (disabled, debug, log, info, warn, error)")
  console.log("  -s, --scope                                  Force package scope (default to the one defined in deno.jsonc)")
  console.log("  -n, --name                                   Force package name (default to the one defined in deno.jsonc)")
  console.log("  -d, --dry-run                                Dry run (do not publish)")
  console.log("  -r, --registry=[https://registry.npmjs.org]  Target registry")
  console.log("  -t, --token                                  Registry publishing token")
  console.log("  -a, --access=public|private                  Registry publishing access")
  console.log("")
  Deno.exit(0)
}

const logger = new Logger({ level: Logger.level[loglevel as loglevel] })
const registries = [{ url, token, access }] as Arg<typeof publish_npm, 1>["registries"]
assert(project, "No project specified")
assert(url, "No registry specified")
assert(["public", "private"].includes(`${access}`), `Invalid access type: ${access}`)
await publish_npm(`${project}`, { log: logger, scope, name, dryrun, registries, provenance })
