// deno-lint-ignore-file no-console
// Imports
import { fromFileUrl, resolve } from "@std/path"
import * as JSONC from "@std/jsonc"
import { parseArgs } from "@std/cli"
import type { record } from "@libs/typing"
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
const raw = await Deno.readTextFile(path)
const config = JSONC.parse(raw) as record<string>
const { version: previous } = config
console.log(`version: ${previous} → ${version}`)
assert(semver.greaterThan(semver.parse(version), semver.parse(previous)), "expected new version to be greater than previous one")
await Deno.writeTextFile(path, raw.replace(`"version": "${previous}"`, `"version": "${version}"`))
