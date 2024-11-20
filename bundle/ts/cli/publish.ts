// deno-lint-ignore-file no-console
/**
 * CLI utility to publish package on npm registries.
 *
 * @module
 */

// Imports
import { parseArgs } from "@std/cli"
import { type levellike as loglevel, Logger } from "@libs/logger"
import { assert } from "@std/assert"
import type { Arg } from "@libs/typing"
import * as JSONC from "@std/jsonc"

const { help, loglevel, npm, x, _: [project] } = parseArgs(Deno.args, {
  boolean: ["help", "npm.dryrun", "npm.provenance", "x.reactive", "x.remove"],
  alias: { help: "h", loglevel: "l" },
  string: ["loglevel", "npm.scope", "npm.name", "npm.registry", "npm.token", "npm.access", "x.token", "x.repository", "x.name", "x.version", "x.directory", "x.map"],
})
if (help) {
  console.log("Publish a TypeScript package on registries.")
  console.log("https://github.com/lowlighter/libs - MIT License - (c) 2024 Simon Lecoq")
  console.log("")
  console.log("Passing a token for a given target will automatically attempt to publish on it.")
  console.log("")
  console.log("Publishing on npm registries:")
  console.log("  Pass a deno.jsonc path as argument.")
  console.log("  It will be converted to a package.json and transpile all exported entrypoints into JavaScript and publish it.")
  console.log("")
  console.log("Publishing on deno.land/x:")
  console.log("  Note: you need to configure hooks on deno.land.x first.")
  console.log("  Optionally pass a deno.jsonc path as argument to autofill some metadata such as package name and version.")
  console.log("  It will create a git tag and push it to the repository specified to trigger a release on deno.land/x.")
  console.log("")
  console.log("")
  console.log("Usage:")
  console.log("  deno --allow-all [options] [project]")
  console.log("")
  console.log("Options:")
  console.log("  -h, --help                                         Show this help")
  console.log("  -l, --loglevel [level=log]                         Log level (disabled, debug, log, info, warn, error)")
  console.log("")
  console.log("  npm options:")
  console.log("    --npm.token <token>                              Registry publishing token")
  console.log("    --npm.registry [url=https://registry.npmjs.org]  Target registry")
  console.log("    --npm.scope [scope=INHERITED_FROM_DENO_JSON]     Force package scope (default to the one defined in deno.jsonc)")
  console.log("    --npm.name [name=INHERITED_FROM_DENO_JSON]       Force package name (default to the one defined in deno.jsonc)")
  console.log("    --npm.access [access=public|private]             Registry publishing access")
  console.log("    --npm.provenance                                 Attach provenance information")
  console.log("    --npm.dryrun                                     Dry run (do not publish)")
  console.log("")
  console.log("  deno.land/x options:")
  console.log("    --x.token <token>                                GitHub token")
  console.log("    --x.repository <repository>                      GitHub repository")
  console.log("    --x.name [name=INHERITED_FROM_DENO_JSON]         Package name (optional if defined in deno.jsonc, scope will automatically be removed if present)")
  console.log("    --x.version [version=INHERITED_FROM_DENO_JSON]   Package version (optional if defined in deno.jsonc)")
  console.log("    --x.directory [directory]                        Package subdirectory (optional)")
  console.log("    --x.map [map]                                    When specified, a temporary git branch will be created and all imports from map will be resolved to break free from it (optional, usually set to deno.jsonc)")
  console.log("    --x.reactive                                     Activate hook before publishing and restore its state after publishing")
  console.log("    --x.remove                                       Remove tag after publishing")
  console.log("    --x.attempts                                     Maximum number of attempts to performs for publishing operations to complete")
  console.log("    --x.delay                                        Delay between each attempt")
  console.log("    --x.dryrun                                       Dry run (do not publish, no remote call will also be made)")
  Deno.exit(0)
}

const logger = new Logger({ level: loglevel as loglevel })

// NPM publishing
if (npm.token) {
  assert(project, "No project specified")
  const { publish } = await import("../publish/npm.ts")
  const log = logger.with({ type: "npm" })
  const registries = [{ url: npm.registry ?? "https://registry.npmjs.org", token: npm.token, access: npm.access ?? "private" }] as Arg<typeof publish, 1>["registries"]
  delete npm.registry
  delete npm.token
  delete npm.access
  await publish(`${project}`, { logger: log, ...npm, registries })
}

// deno.land/x publishing
if (x.token) {
  assert(x.repository, "A GitHub repository is required to publish on deno.land/x")
  const { publish } = await import("../publish/x.ts")
  const log = logger.with({ type: "deno.land/x" })
  if (project) {
    log.trace(`loading project metadata from ${project}`)
    const { name, version } = JSONC.parse(await Deno.readTextFile(`${project}`)) as { name: string; version: string }
    x.name ??= name
    x.version ??= version
  }
  if (x.name?.includes("/")) {
    log.trace("removing scope from package name for publishing")
    x.name = x.name.split("/")[1]
  }
  assert(x.name, "No package name specified")
  assert(x.version, "No package version specified")
  await publish({ logger: log, ...x, token: x.token!, repository: x.repository!, name: x.name!, version: x.version! })
}
