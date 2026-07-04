// Imports
import type { Nullable } from "@libs/typing"
import { expandGlob } from "@std/fs"
import { dirname, resolve } from "@std/path"
import * as JSONC from "@std/jsonc/parse"

/**
 * Rewrite the scope of import specifiers in file content.
 *
 * An empty `to` removes the scope entirely.
 *
 * ```ts
 * import { rescope } from "./publish_npm.ts"
 * rescope('import { command } from "@libs/run/command"', { from: "@libs", to: "@lowlighter" })
 * ```
 */
export function rescope(content: string, { from, to }: { from: string; to: string }): string {
  return content.replaceAll(`"${from}/`, to ? `"${to}/` : `"`)
}

/**
 * Resolve all imports from file content against an import map.
 *
 * Bare specifiers matching an import map entry are replaced by their mapped value,
 * and specifiers matching a trailing-slash entry have their prefix substituted.
 *
 * ```ts
 * import { unmap } from "./publish_x.ts"
 * unmap('import { command } from "@libs/run/command"', { "@libs/run/": "jsr:@libs/run@^3.0.0/" })
 * ```
 */
export function unmap(content: string, imports: Record<string, string>): { result: string; resolved: number } {
  let resolved = 0
  const directories = Object.keys(imports).filter((module) => module.endsWith("/"))
  const result = content.replace(/^(?<statement>(?:import|export)\s*(?:(?:\s+type)?\s+(?:[^\n]+?|(?:\{[\s\S]*?\}))\s+from\s+)?(?<quote>["']))(?<module>[^\n]+?)\k<quote>/gm, (match, statement, quote, module) => {
    let mapped = null as Nullable<string>
    if (module in imports)
      mapped = imports[module]
    else if (directories.some((directory) => module.startsWith(directory))) {
      const [directory] = directories.filter((directory) => module.startsWith(directory)).sort((a, b) => b.length - a.length)
      mapped = module.replace(directory, imports[directory])
    }
    if (typeof mapped === "string") {
      resolved++
      return `${statement}${mapped}${quote}`
    }
    return match
  })
  return { result, resolved }
}

/**
 * Compute an import map for workspace members.
 *
 * The workspace root is located by walking up from `cwd` until a `deno.json(c)` manifest with a `workspace` field is found.
 * Each member with a `name` and `version` is mapped to its jsr.io counterpart (e.g. `@libs/run/` → `jsr:@libs/run@^3.0.0/`),
 * so cross-package imports resolved through the workspace keep working once published on deno.land/x.
 */
export async function workspaceImports(cwd: string = Deno.cwd()): Promise<Record<string, string>> {
  const imports = {} as Record<string, string>
  for (let root = resolve(cwd);; root = dirname(root)) {
    const parsed = manifest(root)
    if (parsed?.workspace) {
      for (const member of parsed.workspace) {
        for await (const { path } of expandGlob(`${member}/deno.json?(c)`, { root, includeDirs: false })) {
          const { name, version } = manifest(dirname(path))!
          if ((!name) || (!version))
            continue
          imports[name] = `jsr:${name}@^${version}`
          imports[`${name}/`] = `jsr:${name}@^${version}/`
        }
      }
      return imports
    }
    if (root === dirname(root))
      return imports
  }
}

/** Parsed `deno.json(c)` manifest. */
type Manifest = { name?: string; version?: string; workspace?: string[]; imports?: Record<string, string>; publish?: { exclude?: string[] } }

/** Read and parse the `deno.jsonc` or `deno.json` manifest from a directory (`null` when absent). */
export function manifest(directory: string): Nullable<Manifest> {
  for (const filename of ["deno.jsonc", "deno.json"]) {
    try {
      return JSONC.parse(Deno.readTextFileSync(resolve(directory, filename))) as Manifest
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound))
        throw error
    }
  }
  return null
}
