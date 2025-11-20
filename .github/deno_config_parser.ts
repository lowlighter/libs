// deno-lint-ignore-file no-console no-explicit-any
// Imports
import { parseArgs } from "jsr:@std/cli@^1.0.22"
import * as JSONC from "jsr:@std/jsonc@^1.0.2"

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
