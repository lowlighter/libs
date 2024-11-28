// deno-lint-ignore-file no-console no-explicit-any
// Imports
import { parseArgs } from "@std/cli"
import * as JSONC from "@std/jsonc"

// Parse arguments
const { cwd, boolean, _: [keypath] } = parseArgs(Deno.args, { boolean: ["boolean"], string: ["cwd"] })
if (cwd) {
  Deno.chdir(cwd)
}

// Resolve config path and parse JSONC
let node = JSONC.parse(await Deno.readTextFile("./deno.jsonc")) as any

// Resolve keypath
const keys = `${keypath ?? ""}`.split(/\.(?![^\[]*\])/).filter(Boolean).map((key) => key.replace(/^\[(.*)\]$/, "$1"))
for (const key of keys) {
  node = node?.[key]
}
if (boolean) {
  node = node ? "true" : ""
}
console.log(node ?? "")
