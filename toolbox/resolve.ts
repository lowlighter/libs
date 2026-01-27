// Imports
import { dirname, fromFileUrl, isAbsolute, join, toFileUrl } from "@std/path"
import { normalize } from "@std/path/posix/normalize"
import { cwd } from "./filesystem.ts"

/** Options for {@linkcode resolve} */
export type ResolveOptions = {
  /** Base URL (defaults to current working directory). */
  base?: string | ImportMeta
  /** Entrypoint (defaults to "mod.ts"). */
  entrypoint?: string
}

/** Resolve a module specifier in a similar way to `import.meta.resolve`. */
export function resolve(specifier: string, { base, entrypoint = "mod.ts" }: ResolveOptions = {}): string {
  if (["./", "../", "/"].some((prefix) => specifier.startsWith(prefix))) {
    if (specifier.endsWith("/")) {
      specifier += entrypoint
    }
    if (typeof base === "object") {
      base = (new URL(base.url).protocol === "file:") ? dirname(fromFileUrl(base.url)) : undefined
    }
    base ??= cwd()
    return toFileUrl(normalize(isAbsolute(specifier) ? specifier : join(base, specifier))).href
  }
  return import.meta.resolve(specifier)
}
