// deno-lint-ignore-file no-console
// Imports
import { parseArgs } from "jsr:@std/cli@^1.0.22"
import { flags } from "@libs/testing/permissions"
import * as JSONC from "jsr:@std/jsonc@^1.0.2"

// Parse arguments
const { cwd } = parseArgs(Deno.args, { string: ["cwd"] })
if (cwd) {
  Deno.chdir(cwd)
}

// Resolve config path and parse JSONC
const config = JSONC.parse(await Deno.readTextFile("./deno.jsonc")) as Record<PropertyKey, unknown>

console.log(flags(config["test:permissions"] ?? null))
