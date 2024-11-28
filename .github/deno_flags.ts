// deno-lint-ignore-file no-console
// Imports
import type { record } from "@libs/typing"
import { parseArgs } from "@std/cli"
import { flags } from "@libs/testing/permissions"
import * as JSONC from "@std/jsonc"

// Parse arguments
const { cwd } = parseArgs(Deno.args, { string: ["cwd"] })
if (cwd) {
  Deno.chdir(cwd)
}

// Resolve config path and parse JSONC
const config = JSONC.parse(await Deno.readTextFile("./deno.jsonc")) as record

console.log(flags(config["test:permissions"] ?? null))
