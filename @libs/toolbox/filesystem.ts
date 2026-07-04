// Imports
import type { Nullable } from "@libs/typing"
import { expandGlob } from "@std/fs"
export type { Nullable }

/** Gets the current working directory. */
export function cwd(): string {
  return Deno.cwd().replaceAll("\\", "/")
}

/** Changes the current working directory. */
export function chdir(path: string | URL): string {
  Deno.chdir(path)
  return cwd()
}

/** Gets the file type of a file path. */
export function filetype(path: string): Nullable<"file" | "directory"> {
  try {
    const lstat = Deno.lstatSync(path)
    if (lstat.isFile)
      return "file"
    if (lstat.isDirectory)
      return "directory"
  } catch {
    // Ignore errors
  }
  return null
}

/** Options for {@linkcode list()}. */
export type ListOptions = {
  /** Root directory to search in. Defaults to the current working directory. */
  root?: string
  /** Whether to return relative paths. */
  relative?: boolean
  /** Whether to include files in the results. */
  files?: boolean
  /** Whether to include directories in the results. */
  directories?: boolean
  /** List of glob patterns to be excluded from the expansion. */
  exclude?: string[]
  /** Whether globstar should be case-insensitive. */
  caseInsensitive?: boolean
  /** Whether to follow symbolic links. */
  followSymlinks?: boolean
}

/**
 * Lists all entries matching the given glob pattern in the specified root directory.
 *
 * Note that `files` and `directories` both default to `false`, at least one of them must be enabled to get any result.
 */
export async function list(glob: string, { root = cwd(), relative = true, files = false, directories = false, exclude, caseInsensitive, followSymlinks }: ListOptions = {}): Promise<string[]> {
  root = root.replaceAll("\\", "/")
  if (!root.endsWith("/"))
    root += "/"
  const entries = await Array.fromAsync(expandGlob(glob, { root, canonicalize: true, includeDirs: directories, exclude, caseInsensitive, followSymlinks }))
  return entries
    .filter((entry) => (files && entry.isFile) || (directories && entry.isDirectory))
    .map(({ path }) => {
      path = path.replaceAll("\\", "/")
      return (relative && path.startsWith(root)) ? path.slice(root.length) : path
    })
}
