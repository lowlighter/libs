// deno-lint-ignore-file no-console
// Imports
import * as JSONC from "@std/jsonc"
import { parseArgs } from "@std/cli"
import type { record } from "@libs/typing"

// Parse arguments
const { cwd, _: [keypath] } = parseArgs(Deno.args, { string: ["cwd"] })
if (cwd) {
  Deno.chdir(cwd)
}

// Resolve config path and parse JSONC
let node = JSONC.parse(await Deno.readTextFile("./deno.jsonc")) as record

// Resolve keypath
const keys = `${keypath ?? ""}`.split(/\.(?![^\[]*\])/).filter(Boolean).map((key) => key.replace(/^\[(.*)\]$/, "$1"))
for (const key of keys) {
  node = node?.[key] as record
}
console.log(node ?? "")
