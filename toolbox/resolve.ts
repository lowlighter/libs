// Imports
import { isAbsolute, join, toFileUrl } from "@std/path"
import { normalize } from "@std/path/posix/normalize"
import { cwd } from "./filesystem.ts"

/** Options for {@linkcode resolve} */
export type ResolveOptions = {
  /** Base URL (defaults to current working directory). */
  base?: string
  /** Entrypoint (defaults to "mod.ts"). */
  entrypoint?: string
}

/** Resolve a module specifier in a similar way to `import.meta.resolve`. */
export function resolve(specifier: string, { base, entrypoint = "mod.ts" }: ResolveOptions = {}) {
  if (["./", "../", "/"].some((prefix) => specifier.startsWith(prefix))) {
    if (specifier.endsWith("/")) {
      specifier += entrypoint
    }
    return toFileUrl(normalize(isAbsolute(specifier) ? specifier : join(base ?? cwd(), specifier))).href
  }
  return import.meta.resolve(specifier)
}
