/**
 * CLI utility to mirror a JSR scope and its packages.
 *
 * @module
 */

// Imports
import { ensureDir } from "@std/fs"
import { dirname } from "@std/path"
import { type levellike as loglevel, Logger } from "@libs/logger"
import { mirror } from "../mirror/jsr.ts"
import { parseArgs } from "@std/cli"
import { assert } from "@std/assert"
import * as YAML from "@std/yaml"

const { help, loglevel, scope, packages = [], "packages-exclude": exclude = [], mod, config, registry, registryApi, patches: _patches } = parseArgs(Deno.args, {
  boolean: ["help", "mod"],
  alias: { help: "h", loglevel: "l", scope: "s", packages: "p", registry: "r", registryApi: "R", "packages-exclude": "P", config: "c", patches: "x" },
  string: ["loglevel", "scope", "packages", "registry", "registryApi", "packages-exclude", "config", "patches"],
  collect: ["packages", "packages-exclude"],
})
if (help) {
  console.log("Mirror a JSR scope and its packages.")
  console.log("https://github.com/lowlighter/libs - MIT License - (c) 2024 Simon Lecoq")
  console.log("")
  console.log("This tool is intended to mirror a JSR scope and its packages to a local directory.")
  console.log("It will create a new file for each export found with a re-export.")
  console.log("If the `mod` flag is set, it will also create a main `mod.ts` entry point.")
  console.log("")
  console.log("Usage:")
  console.log("  deno --allow-read --allow-net --allow-write=. mirror.ts [options]")
  console.log("")
  console.log("Options:")
  console.log("  -h, --help                                   Show this help")
  console.log("  -l, --loglevel=[log]                         Log level (disabled, debug, log, info, warn, error)")
  console.log("  -s, --scope                                  Scope name to mirror")
  console.log("  -p, --packages                               List of package within the scope to mirror (can be used multiple times)")
  console.log("  -P, --packages-exclude                       List of package within the scope to exclude from the mirror (can be used multiple times)")
  console.log("  -m, --mod                                    Whether to create a main `mod.ts` entry point")
  console.log("  -x, --patches                                File containing patching rules for exports")
  console.log("  [-r, --registry=https://jsr.io]              JSR registry URL")
  console.log("  [-R, --registry-api=https://api.jsr.io]      JSR API registry URL")
  console.log("  -c, --config                                 Path to deno configuration file. If specified it'll be updated with all found exports and versioned with the current date")
  console.log("")
  Deno.exit(0)
}
assert(scope, "scope is required")
const logger = new Logger({ level: loglevel as loglevel })
const patches = {}
if (_patches) {
  Object.assign(patches, YAML.parse(await Deno.readTextFile(_patches)))
}

const { files } = await mirror({ scope: scope!, packages, exclude, mod, config, registry, registryApi, logger, patches })
for (const [path, content] of Object.entries(files) as [string, string][]) {
  logger.log(`writing ${path}`)
  await ensureDir(dirname(path))
  await Deno.writeTextFile(path, content)
}
