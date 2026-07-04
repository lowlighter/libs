// deno-lint-ignore-file no-console
/**
 * Publish a package on npm registries.
 *
 * 1. Run `deno pack` to create an npm-compatible tarball
 * 2. Extract it and rewrite the package scope (e.g. `@libs/git` → `@lowlighter/git`), both in `package.json` and in compiled files
 * 3. Add `dependencies` entries for workspace members imported by the package (which `deno pack` leaves as bare specifiers)
 * 4. Run `npm publish` on the extracted package
 *
 * Authentication is expected to be configured beforehand (e.g. through a `~/.npmrc` file).
 *
 * @module
 */

// Imports
import { parseArgs } from "@std/cli"
import { expandGlob } from "@std/fs"
import { command } from "@libs/run/command"
import { rescope, workspaceImports } from "./_utils.ts"
import { cyan, gray, green } from "@std/fmt/colors"

/** Publish a package on npm registries. */
export async function publish({ package: pkg = Deno.cwd(), scope = "@", private: restricted = false, dryrun = false }: Options = {}): Promise<{ name: string; version: string; directory: string }> {
  // Create npm-compatible tarball and extract it
  const directory = await Deno.makeTempDir()
  console.error(`packing ${pkg} to ${directory}`)
  await command("deno", ["pack", "--allow-dirty", "--quiet", "--output", `${directory}/package.tgz`], { cwd: pkg, throw: true })
  await command("tar", ["--extract", "--gzip", `--file=${directory}/package.tgz`, `--directory=${directory}`], { throw: true })

  // Rewrite package scope and register workspace dependencies
  const manifest = JSON.parse(await Deno.readTextFile(`${directory}/package/package.json`)) as { name: string; version: string; dependencies?: Record<string, string> }
  if (!manifest.name.startsWith("@"))
    throw new RangeError(`Package name is not scoped: ${manifest.name}`)
  const from = manifest.name.split("/")[0]
  const to = scope === "@" ? from : scope
  const rename = (name: string) => to ? name.replace(from, to) : name.replace(`${from}/`, "")
  const workspace = await workspaceImports(pkg)
  const members = Object.fromEntries(
    Object.entries(workspace)
      .filter(([member]) => !member.endsWith("/"))
      .map(([member, jsr]) => [member, jsr.match(/@\^(?<version>.*)$/)!.groups!.version]),
  )
  manifest.name = rename(manifest.name)
  console.error(`rewriting scope ${from} → ${to || "(no scope)"} for ${manifest.name}@${manifest.version}`)
  for await (const { path } of expandGlob("package/**/*.{js,mjs,cjs,ts,mts,cts}", { root: directory, includeDirs: false })) {
    const content = await Deno.readTextFile(path)
    for (const [member, version] of Object.entries(members)) {
      if (new RegExp(`["']${member}(?:/[^"']*)?["']`).test(content)) {
        manifest.dependencies ??= {}
        manifest.dependencies[rename(member)] ??= `^${version}`
      }
    }
    await Deno.writeTextFile(path, rescope(content, { from, to }))
  }
  const manifestJson = JSON.stringify(manifest, null, 2)
  console.error(gray(manifestJson))
  await Deno.writeTextFile(`${directory}/package/package.json`, `${manifestJson}\n`)

  // Publish extracted package
  console.error(cyan(`publishing ${manifest.name}@${manifest.version}${dryrun ? " (dryrun)" : ""}`))
  await command("npm", ["publish", `${directory}/package`, "--access", restricted ? "restricted" : "public", ...(dryrun ? ["--dry-run"] : [])], { throw: true })
  console.error(green(`published ${manifest.name}@${manifest.version}`))
  return { name: manifest.name, version: manifest.version, directory }
}

/** Publishing options for {@linkcode publish()}. */
export type Options = {
  /** Path to the package to publish (defaults to the current working directory). */
  package?: string
  /** Scope to publish under: `"@"` keeps the original scope (default), `""` removes the scope, any other value replaces it. */
  scope?: string
  /** Whether to publish with private (restricted) registry access (defaults to `false`). */
  private?: boolean
  /** Do not actually publish (the package is packed and rewritten, but `npm publish` is run with `--dry-run`). */
  dryrun?: boolean
}

// Entry point
if (import.meta.main) {
  const args = parseArgs(Deno.args, { string: ["package", "scope"], boolean: ["private", "dryrun", "help"], default: { scope: "@" } })
  if (args.help) {
    console.error("Usage: deno run --allow-all jsr:@libs/toolbox/scripts/publish/npm [options]")
    console.error("")
    console.error("Options:")
    console.error("  --package [package]  Path to the package to publish (defaults to the current working directory)")
    console.error("  --scope [scope=@]    Scope to publish under (`@` keeps the original scope, an empty value removes it, any other value replaces it)")
    console.error("  --private            Publish with private (restricted) registry access (default: public)")
    console.error("  --dryrun             Do not actually publish")
    Deno.exit(2)
  }
  await publish({ package: args.package, scope: args.scope, private: args.private, dryrun: args.dryrun })
}
