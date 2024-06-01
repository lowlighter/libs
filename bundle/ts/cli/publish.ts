/**
 * CLI utility to publish package on npm registries.
 *
 * @module
 */

// Imports
import { parseArgs } from "@std/cli"
import { Logger, type loglevel } from "@libs/logger"
import { assert } from "@std/assert"
import type { Arg } from "@libs/typing"
import * as JSONC from "@std/jsonc"

const { help, loglevel, npm, x, _: [project] } = parseArgs(Deno.args, {
  boolean: ["help", "npm.dryrun", "npm.provenance", "x.reactive", "x.remove"],
  alias: { help: "h", loglevel: "l" },
  string: ["loglevel", "npm.scope", "npm.name", "npm.registry", "npm.token", "npm.access", "x.token", "x.repository", "x.name", "x.version", "x.directory"],
})
if (help) {
  console.log("Publish a TypeScript package on registries.")
  console.log("https://github.com/lowlighter/libs - MIT License - (c) 2024 Simon Lecoq")
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
  console.log("  deno --allow-all [options] <project>")
  console.log("")
  console.log("Options:")
  console.log("  -h, --help                                     Show this help")
  console.log("  -l, --loglevel=[log]                           Log level (disabled, debug, log, info, warn, error)")
  console.log("")
  console.log("  npm options:")
  console.log("    --npm.scope                                  Force package scope (default to the one defined in deno.jsonc)")
  console.log("    --npm.name                                   Force package name (default to the one defined in deno.jsonc)")
  console.log("    --npm.provenance                             Attach provenance information")
  console.log("    --npm.dryrun                                 Dry run (do not publish)")
  console.log("    --npm.registry=[https://registry.npmjs.org]  Target registry")
  console.log("    --npm.token                                  Registry publishing token")
  console.log("    --npm.access=public|private                  Registry publishing access")
  console.log("")
  console.log("  deno.land/x options:")
  console.log("    --x.token                                    GitHub token")
  console.log("    --x.repository                               GitHub repository")
  console.log("    --x.name                                     Package name (optional if defined in deno.jsonc, scope will automatically be removed if present)")
  console.log("    --x.version                                  Package version (optional if defined in deno.jsonc)")
  console.log("    --x.directory                                Package subdirectory (optional)")
  console.log("    --x.reactive                                 Activate hook before publishing and restore its state after publishing")
  console.log("    --x.remove                                   Remove tag after publishing")
  Deno.exit(0)
}

const logger = new Logger({ level: Logger.level[loglevel as loglevel] })

// NPM publishing
if (npm) {
  const { publish } = await import("../publish/npm.ts")
  const log = logger.with({ type: "npm" })
  const registries = [{ url: npm.registry ?? "https://registry.npmjs.org", token: npm.token, access: npm.access ?? "private" }] as Arg<typeof publish_npm, 1>["registries"]
  assert(project, "No project specified")
  delete npm.registry
  delete npm.token
  delete npm.access
  await publish(`${project}`, { log, ...npm, registries })
}

// deno.land/x publishing
if (x) {
  const { publish } = await import("../publish/x.ts")
  const log = logger.with({ type: "deno.land/x" })
  assert(x.token, "A GitHub token is required to create git tags")
  assert(x.repository, "A GitHub repository is required to publish on deno.land/x")
  if (project) {
    log.debug(`loading project metadata from ${project}`)
    const { name, version } = JSONC.parse(await Deno.readTextFile(`${project}`)) as { name: string; version: string }
    x.name ??= name
    x.version ??= version
  }
  assert(x.name, "No package name specified")
  if (x.name.includes("/")) {
    log.debug("removing scope from package name for publishing")
    x.name = x.name.split("/")[1]
  }
  assert(x.version, "No package version specified")
  await publish({ log, ...x, token: x.token!, repository: x.repository!, name: x.name!, version: x.version! })
}
