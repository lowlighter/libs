// Imports
import { fromFileUrl } from "jsr:@std/path/from-file-url"
import { resolve } from "jsr:@std/path/resolve"
import * as JSONC from "jsr:@std/jsonc"
import { parseArgs } from "@std/cli"
import type { record } from "jsr:@libs/typing"
import * as semver from "@std/semver"
import { assert } from "@std/assert"

// Parse arguments
const { version, _: [name] } = parseArgs(Deno.args, { string: ["version"] })
assert(version, "missing --version argument")
assert(name, "missing package name argument")

// Resolve config path
const path = resolve(fromFileUrl(import.meta.resolve("../")), `${name}`, "deno.jsonc")
console.log(`patching: ${path}`)

// Patch config version
const config = JSONC.parse(await Deno.readTextFile(path)) as record<string>
const { version: previous } = config
config.version = version
console.log(`version: ${previous} → ${version}`)
await Deno.writeTextFile(path, JSON.stringify(config, null, 2))
assert(semver.greaterThan(semver.parse(version), semver.parse(previous)), "expected new version to be grater than previous one")
