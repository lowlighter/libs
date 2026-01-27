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
    if (lstat.isFile) {
      return "file"
    }
    if (lstat.isDirectory) {
      return "directory"
    }
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
}

/** Lists all files matching the given glob pattern in the specified root directory. */
export async function list(glob: string, { root = cwd(), relative = true, files = false, directories = false }: ListOptions = {}): Promise<string[]> {
  if (!root.endsWith("/")) {
    root += "/"
  }
  const entries = await Array.fromAsync(expandGlob(glob, { root, canonicalize: true, includeDirs: directories }))
  return entries
    .filter(({ path }) => [files ? "file" : "", directories ? "directory" : ""].filter(Boolean).includes(filetype(path) as string))
    .map(({ path }) => path.replaceAll("\\", "/").replace(root, relative ? "" : root))
}
